// TEWGO web full unlock. The web twin of the iOS proThemes IAP: one
// non-consumable purchase that bypasses the play-earned theme gates.
//
// Why a server exists at all for a static site: the browser must never be
// the authority on whether someone paid. localStorage is editable in
// devtools, so the ONLY thing that grants an unlock is Stripe confirming a
// session is paid, checked here.
//
// Three actions, one function:
//   POST {action:"checkout"}            -> {url}   Stripe Checkout page
//   POST {action:"verify", sessionId}   -> {ok, code}
//   POST {action:"restore", code}       -> {ok}
//
// Secrets required (set by Rick, never by the assistant):
//   STRIPE_SECRET_KEY   sk_test_... to rehearse, sk_live_... to sell
// Supplied automatically by the platform:
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { createClient } from 'jsr:@supabase/supabase-js@2';

const PRICE_CENTS = 499; // $4.99, matching the iOS Unlock All price
const CURRENCY = 'usd';
const PRODUCT_NAME = 'TEWGO: Unlock All Worlds';
const PRODUCT_BLURB = 'Skip the grind. Every world, every figure, instantly.';

// Only these origins may call the function, so the checkout cannot be
// driven from someone else's page.
const ALLOWED_ORIGINS = [
  'https://playtewgo.com',
  'https://www.playtewgo.com',
  'http://localhost:8741',
  'http://127.0.0.1:8741',
];

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

/** Readable, unambiguous alphabet: no O/0, I/1, so codes survive retyping. */
function makeUnlockCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const body = [...bytes].map((b) => alphabet[b % alphabet.length]).join('');
  return `TEWGO-${body.slice(0, 4)}-${body.slice(4, 8)}`;
}

/** Stripe's REST API, form-encoded. No SDK, so nothing to keep updated. */
async function stripe(path: string, key: string, form?: Record<string, string>) {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: form ? 'POST' : 'GET',
    headers: {
      Authorization: `Bearer ${key}`,
      ...(form ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
    },
    body: form ? new URLSearchParams(form).toString() : undefined,
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body?.error?.message ?? `Stripe ${path} failed (${res.status})`);
  }
  return body;
}

function db() {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { db: { schema: 'tewgo' } },
  );
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(origin) });
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405, origin);

  const key = Deno.env.get('STRIPE_SECRET_KEY');
  if (!key) {
    // The honest failure while the key is unset: the button says the store
    // is not open rather than pretending to charge.
    return json({ error: 'not_configured' }, 503, origin);
  }

  let payload: { action?: string; sessionId?: string; code?: string; returnTo?: string };
  try {
    payload = await req.json();
  } catch {
    return json({ error: 'bad_request' }, 400, origin);
  }

  try {
    if (payload.action === 'checkout') {
      // Only ever return to our own site, whatever the caller asks for.
      const base = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
      const session = await stripe('checkout/sessions', key, {
        mode: 'payment',
        'line_items[0][quantity]': '1',
        'line_items[0][price_data][currency]': CURRENCY,
        'line_items[0][price_data][unit_amount]': String(PRICE_CENTS),
        'line_items[0][price_data][product_data][name]': PRODUCT_NAME,
        'line_items[0][price_data][product_data][description]': PRODUCT_BLURB,
        success_url: `${base}/play/?unlock={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/play/?unlock=cancelled`,
      });
      return json({ url: session.url }, 200, origin);
    }

    if (payload.action === 'verify') {
      const sessionId = String(payload.sessionId ?? '');
      if (!sessionId.startsWith('cs_')) return json({ error: 'bad_session' }, 400, origin);

      const session = await stripe(`checkout/sessions/${encodeURIComponent(sessionId)}`, key);
      if (session.payment_status !== 'paid') {
        return json({ ok: false, error: 'not_paid' }, 402, origin);
      }

      const supabase = db();
      // Re-verifying the same session (a refresh, a shared link) must return
      // the SAME code rather than minting a second row.
      const { data: existing } = await supabase
        .from('unlocks').select('unlock_code').eq('stripe_session_id', sessionId).maybeSingle();
      if (existing) return json({ ok: true, code: existing.unlock_code }, 200, origin);

      const code = makeUnlockCode();
      const { error } = await supabase.from('unlocks').insert({
        unlock_code: code,
        stripe_session_id: sessionId,
        stripe_payment_intent: session.payment_intent ?? null,
        email: session.customer_details?.email ?? null,
        amount_total: session.amount_total ?? null,
        currency: session.currency ?? null,
        livemode: !!session.livemode,
      });
      if (error) throw new Error(error.message);
      return json({ ok: true, code }, 200, origin);
    }

    if (payload.action === 'restore') {
      const code = String(payload.code ?? '').trim().toUpperCase();
      if (!/^TEWGO-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) {
        return json({ ok: false, error: 'bad_code' }, 400, origin);
      }
      const { data } = await db()
        .from('unlocks').select('id').eq('unlock_code', code).maybeSingle();
      return data
        ? json({ ok: true }, 200, origin)
        : json({ ok: false, error: 'unknown_code' }, 404, origin);
    }

    return json({ error: 'unknown_action' }, 400, origin);
  } catch (e) {
    console.error('tewgo-unlock', payload.action, e instanceof Error ? e.message : e);
    return json({ error: 'server_error' }, 500, origin);
  }
});
