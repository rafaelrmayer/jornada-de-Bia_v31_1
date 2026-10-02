/* Jornada de Bia — camada adicional de proteção local (V30.1-Segurança Avançada) */
(() => {
  'use strict';
  const SESSION_KEY = 'jornadaBia:guardianSessionAt';
  const TIMEOUT_MS = 10 * 60 * 1000;
  let timer = null;
  const now = () => Date.now();
  const touch = () => {
    if (sessionStorage.getItem('guardianUnlocked') === 'true') {
      sessionStorage.setItem(SESSION_KEY, String(now()));
      schedule();
    }
  };
  const lock = () => {
    sessionStorage.removeItem('guardianUnlocked');
    sessionStorage.removeItem(SESSION_KEY);
    if (typeof window.setGuardianMode === 'function') window.setGuardianMode(false);
    document.dispatchEvent(new CustomEvent('jornadaBia:sessionExpired'));
  };
  const schedule = () => {
    if (timer) clearTimeout(timer);
    const stamp = Number(sessionStorage.getItem(SESSION_KEY) || 0);
    if (!stamp) return;
    timer = setTimeout(() => {
      if (now() - Number(sessionStorage.getItem(SESSION_KEY) || 0) >= TIMEOUT_MS) lock();
      else schedule();
    }, TIMEOUT_MS + 250);
  };
  ['click','keydown','touchstart','pointerdown'].forEach(evt =>
    document.addEventListener(evt, touch, { passive: true, capture: true })
  );
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      const stamp = Number(sessionStorage.getItem(SESSION_KEY) || 0);
      if (stamp && now() - stamp >= TIMEOUT_MS) lock(); else schedule();
    }
  });
  window.JornadaBiaSecurity = Object.freeze({ touch, lock, timeoutMs: TIMEOUT_MS });
  if (sessionStorage.getItem('guardianUnlocked') === 'true') { touch(); }
})();
