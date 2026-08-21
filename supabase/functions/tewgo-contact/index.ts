// TEWGO contact form. The server half of "The Letter Slot": the site shows a
// form, this holds the address.
//
// Why a server exists at all for a static site: the whole point of the form
// is that the destination address appears NOWHERE the browser can read it.
// Publishing tewgo@ricktew.com as a click-to-mail link (which playtewgo.com
// did in four places until 2026-08-21) hands it to every harvester that
// crawls the page. The address now lives in a function secret and only here.
//
// One action, one function:
//   POST {name, email, subject, message, website, elapsedMs} -> {ok:true}
//
// It ALWAYS answers {ok:true}. A dropped submission looks exactly like an
// accepted one, because telling a bot which check tripped is telling its
// operator how to fix it by morning. Every drop is written to the log
// instead, so a real person eaten by the spam heuristics is recoverable
// rather than invisible. Read the drops with:
//
//   select timestamp, event_message from function_logs
//   where event_message like '%tewgo-contact drop%'
//
// (Supabase dashboard -> Edge Functions -> tewgo-contact -> Logs, or the
// project's Logs Explorer. Read it monthly for the first quarter.)
//
// Secrets required (set by Rick, never by the assistant):
//   RESEND_API_KEY   re_...            the sending key
//   CONTACT_TO       where mail lands  e.g. tewgo@ricktew.com
//   CONTACT_FROM     verified sender   e.g. TEWGO <tewgo@ricktew.com>
// With any of them unset the form STILL confirms to the visitor and the
// whole message is written to the log, because a contact form that shows a
// red error to a player is worse than one that quietly queues.

// Only these origins may call the function. This is the same allowlist the
// tewgo-unlock function uses. It is a courtesy boundary, not authentication:
// it stops the form being driven from someone else's page, and stops nothing
// that can set a header. Abuse controls, if ever needed, go on volume.
const ALLOWED_ORIGINS = [
  'https://playtewgo.com',
  'https://www.playtewgo.com',
  'http://localhost:8741',
  'http://127.0.0.1:8741',
];

/** The subject list the form offers. Anything else is coerced to Other, so
 *  the mail subject line can never carry attacker-chosen text. */
const SUBJECTS: Record<string, string> = {
  bug: 'Bug report',
  idea: 'Idea or feature request',
  question: 'Question about the game',
  unlock: 'Trouble with an unlock',
  other: 'Something else',
};

const MAX = { name: 100, email: 200, message: 5000 };

/** How soon after the form appears a submission is assumed to be a machine.
 *  Nobody reads four fields and types a message in under three seconds. */
const MIN_FILL_MS = 3000;

function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}

function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
  });
}

/** The visitor's text is a stranger's document going into a mail Rick opens.
 *  Raw, it lets anyone on the internet write markup, links and hidden text
 *  into a message that arrives looking like it came from the business.
 *  Every visitor-supplied character passes through here at the point of use. */
function esc(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Mail headers are line-based, so a newline in a header value is an
 *  injection point. Nothing interpolated into From/Reply-To/Subject keeps
 *  its line breaks. */
function oneLine(s: string, limit: number) {
  return s.replace(/[\r\n]+/g, ' ').trim().slice(0, limit);
}

function looksLikeEmail(s: string) {
  return /^[^\s@,;:<>"']+@[^\s@,;:<>"']+\.[^\s@,;:<>"']{2,}$/.test(s);
}

/**
 * The shy one. Machine-written short messages tend to be long, space-free,
 * case-scrambled and link-heavy; real ones are not. Scored rather than
 * matched, applied to SHORT messages only, and deliberately tuned to let
 * marginal cases through, because eating one real customer message is a
 * worse failure than passing one spam. Every drop is logged so the tuning
 * can be done against reality instead of imagination.
 */
function nonsenseScore(name: string, message: string) {
  const m = message.trim();
  if (m.length >= 120) return 0; // a long message is somebody's actual problem

  let score = 0;
  const longestWord = m.split(/\s+/).reduce((max, w) => Math.max(max, w.length), 0);
  if (longestWord >= 25) score += 1;
  if (longestWord >= 40) score += 1;

  const scrambles =
    (m.match(/[a-z][A-Z]/g) || []).length + (name.match(/[a-z][A-Z]/g) || []).length;
  if (scrambles >= 3) score += 1;
  if (scrambles >= 6) score += 1;

  const links = (m.match(/https?:\/\/|\[url|<a\s/gi) || []).length;
  if (links >= 1) score += 1;
  if (links >= 3) score += 1;

  const digits = (m.match(/\d/g) || []).length;
  if (m.length > 0 && digits / m.length > 0.4) score += 1;

  return score;
}

const NONSENSE_DROP_AT = 3;

/** One line per dropped or unsent message, holding the whole thing, so a
 *  real person the gauntlet ate can still be answered. */
function logDrop(reason: string, fields: Record<string, unknown>) {
  console.log('tewgo-contact drop', JSON.stringify({ reason, ...fields }));
}

async function sendMail(f: {
  name: string; email: string; subjectLabel: string; message: string;
}) {
  const key = Deno.env.get('RESEND_API_KEY');
  const to = Deno.env.get('CONTACT_TO');
  const from = Deno.env.get('CONTACT_FROM');
  if (!key || !to || !from) throw new Error('mail_not_configured');

  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top">${label}</td>` +
    `<td style="padding:4px 0">${value}</td></tr>`;

  // esc() on every visitor-supplied value, at the point of use.
  const html =
    `<table style="font-family:system-ui,sans-serif;font-size:14px">` +
    row('From', esc(f.name)) +
    row('Email', esc(f.email)) +
    row('Subject', esc(f.subjectLabel)) +
    `</table>` +
    `<hr style="border:none;border-top:1px solid #ddd;margin:16px 0">` +
    `<div style="font-family:system-ui,sans-serif;font-size:15px;white-space:pre-wrap">` +
    esc(f.message) +
    `</div>`;

  const text =
    `From: ${f.name}\nEmail: ${f.email}\nSubject: ${f.subjectLabel}\n\n${f.message}\n`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      // Reply-to is the visitor, so hitting reply in a normal mail client
      // just works and the thread lands in their inbox.
      reply_to: oneLine(f.email, MAX.email),
      subject: oneLine(`TEWGO ${f.subjectLabel}: ${f.name}`, 180),
      html,
      text,
    }),
  });
  if (!res.ok) {
    throw new Error(`resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(origin) });
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405, origin);
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return json({ error: 'forbidden_origin' }, 403, origin);
  }

  let p: Record<string, unknown>;
  try {
    p = await req.json();
  } catch {
    return json({ error: 'bad_request' }, 400, origin);
  }

  const str = (v: unknown) => (typeof v === 'string' ? v : '');
  const name = str(p.name).trim();
  const email = str(p.email).trim();
  const subjectKey = SUBJECTS[str(p.subject)] ? str(p.subject) : 'other';
  const subjectLabel = SUBJECTS[subjectKey];
  const message = str(p.message).trim();
  const trap = str(p.website).trim();
  const elapsedMs = typeof p.elapsedMs === 'number' ? p.elapsedMs : -1;

  const seen = { name, email, subject: subjectKey, message };

  // Browser validation is a courtesy to humans; the endpoint is what is
  // actually exposed, so required is re-checked here.
  if (!name || !email || !message) {
    logDrop('missing_required', seen);
    return json({ ok: true }, 200, origin);
  }
  if (!looksLikeEmail(email)) {
    logDrop('bad_email', seen);
    return json({ ok: true }, 200, origin);
  }
  if (name.length > MAX.name || email.length > MAX.email || message.length > MAX.message) {
    logDrop('too_long', seen);
    return json({ ok: true }, 200, origin);
  }

  // The gauntlet, three cheap checks, no puzzle for a real visitor to solve.
  if (trap) {
    logDrop('trap_field', { ...seen, trap });
    return json({ ok: true }, 200, origin);
  }
  // elapsedMs is measured entirely in the visitor's browser (now minus when
  // the form appeared), so a wrong device clock cannot fail an honest
  // person. A missing or negative value means we simply do not know, and
  // "do not know" never drops anyone.
  if (elapsedMs >= 0 && elapsedMs < MIN_FILL_MS) {
    logDrop('too_fast', { ...seen, elapsedMs });
    return json({ ok: true }, 200, origin);
  }
  const score = nonsenseScore(name, message);
  if (score >= NONSENSE_DROP_AT) {
    logDrop('nonsense', { ...seen, score });
    return json({ ok: true }, 200, origin);
  }

  try {
    await sendMail({ name, email, subjectLabel, message });
  } catch (e) {
    // The mail pipe being down must never reach the visitor. They get the
    // same confirmation and the message survives in the log.
    logDrop('unsent', { ...seen, error: e instanceof Error ? e.message : String(e) });
  }

  return json({ ok: true }, 200, origin);
});
