// The paid full unlock, web twin of the iOS proThemes IAP.
//
// The browser is NEVER the authority here. Every path below ends in the
// tewgo-unlock edge function asking Stripe whether a session was actually
// paid; this file only carries messages and remembers the answer. A player
// who edits localStorage gets the cosmetics they faked and nothing else,
// which is the same trade the iOS build makes with its local hasPro cache.

const ENDPOINT = 'https://guwquufbifuzmphcdsdt.supabase.co/functions/v1/tewgo-unlock';

/** Where the restore code is kept so the profile can show it again. */
export const CODE_KEY = 'tewgo.web.unlockCode';
export const PRICE_LABEL = '$4.99';

/** The query parameter Stripe sends players back with. */
export const RETURN_PARAM = 'unlock';

async function call(action, body = {}) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...body }),
  });
  let data = {};
  try { data = await res.json(); } catch { /* non-JSON error page */ }
  return { status: res.status, ...data };
}

/**
 * Sends the player to Stripe's own hosted checkout. Card details are typed
 * on Stripe's page and never touch this site.
 * Returns an error string on failure; on success the browser navigates away.
 */
export async function startCheckout() {
  try {
    const r = await call('checkout');
    if (r.url) {
      window.location.assign(r.url);
      return null;
    }
    if (r.status === 503) return 'The store is not open yet. Try again soon.';
    return 'Could not reach the store. Please try again.';
  } catch {
    return 'Could not reach the store. Check your connection.';
  }
}

/**
 * Reads the ?unlock= parameter Stripe appended on the way back and, when it
 * is a real paid session, returns the restore code. Always strips the
 * parameter so a refresh cannot replay it.
 * Returns {state:'none'|'cancelled'|'unlocked'|'failed', code?, message?}
 */
export async function handleReturn(storage) {
  const params = new URLSearchParams(window.location.search);
  const value = params.get(RETURN_PARAM);
  if (!value) return { state: 'none' };

  const clean = () => {
    params.delete(RETURN_PARAM);
    const qs = params.toString();
    window.history.replaceState({}, '',
      window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash);
  };

  if (value === 'cancelled') {
    clean();
    return { state: 'cancelled', message: 'Checkout cancelled. Nothing was charged.' };
  }

  const r = await call('verify', { sessionId: value });
  clean();
  if (r.ok && r.code) {
    try { storage.setItem(CODE_KEY, r.code); } catch { /* ignore */ }
    return { state: 'unlocked', code: r.code };
  }
  return {
    state: 'failed',
    message: r.status === 402
      ? 'That payment has not completed. If you were charged, use your unlock code.'
      : 'Could not confirm that purchase. Please contact support.',
  };
}

/**
 * Restores a purchase on another device from the code shown after buying.
 * Returns {ok:true} or {ok:false, message}.
 */
export async function restoreWithCode(storage, rawCode) {
  const code = String(rawCode || '').trim().toUpperCase();
  if (!code) return { ok: false, message: 'Enter your unlock code.' };
  try {
    const r = await call('restore', { code });
    if (r.ok) {
      try { storage.setItem(CODE_KEY, code); } catch { /* ignore */ }
      return { ok: true };
    }
    if (r.status === 400) {
      return { ok: false, message: 'That does not look like a TEWGO code. It looks like TEWGO-ABCD-2345.' };
    }
    if (r.status === 404) return { ok: false, message: 'No purchase found for that code.' };
    if (r.status === 503) return { ok: false, message: 'The store is not open yet.' };
    return { ok: false, message: 'Could not check that code. Please try again.' };
  } catch {
    return { ok: false, message: 'Could not reach the store. Check your connection.' };
  }
}

export function savedCode(storage) {
  try { return storage.getItem(CODE_KEY); } catch { return null; }
}
