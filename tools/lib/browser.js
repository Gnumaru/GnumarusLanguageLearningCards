/**
 * A real page, driven over the DevTools protocol.
 *
 * There is no build step and no framework, so the browser tests have nothing to
 * import. They open the page in headless Chrome, wait for it to be ready, and
 * then ask it questions with Runtime.evaluate.
 *
 * Two things about this are load-bearing and both were learned the hard way.
 *
 * The cache is disabled before navigating. Without that a second run tests the
 * previous run's JavaScript, and a fix reads as still broken — which cost an
 * afternoon on a change that had in fact worked.
 *
 * `/json/new` refuses GET; it has to be a PUT. The error is a plain-text body
 * that does not parse as JSON, so it looks like a network failure rather than a
 * bad verb.
 *
 * A browser already listening on DEBUG_PORT is reused rather than restarted, so
 * running three suites does not pay three browser start-ups.
 */
'use strict';
const { spawn } = require('node:child_process');
const path = require('node:path');
const { OUT } = require('./paths');

const DEBUG_PORT = Number(process.env.CDP_PORT || 9333);
const PROFILE = path.join(OUT, 'chrome-profile');

async function browser() {
  for (let i = 0; i < 6; i++) {
    try {
      return (await (await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/version`)).json()).webSocketDebuggerUrl;
    } catch (e) { /* not listening yet */ }
    if (i === 0) {
      spawn('google-chrome', [
        '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
        '--disable-dev-shm-usage', '--remote-debugging-port=' + DEBUG_PORT,
        '--user-data-dir=' + PROFILE, 'about:blank'
      ], { stdio: 'ignore', detached: true }).unref();
    }
    await new Promise((r) => setTimeout(r, 800));
  }
  throw new Error('no headless Chrome on port ' + DEBUG_PORT +
    ' — install google-chrome or set CDP_PORT to a free port');
}

/** Open a page and return an `evaluate` for it. */
async function open(url) {
  const target = await (await fetch(
    `http://127.0.0.1:${DEBUG_PORT}/json/new?${encodeURIComponent(url)}`, { method: 'PUT' })).json();

  const sock = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { sock.onopen = res; sock.onerror = rej; });

  let id = 0;
  const waiting = new Map();
  sock.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && waiting.has(m.id)) { waiting.get(m.id)(m); waiting.delete(m.id); }
  };
  const send = (method, params) => new Promise((res, rej) => {
    const i = ++id;
    waiting.set(i, (m) => (m.error ? rej(new Error(method + ': ' + m.error.message)) : res(m.result)));
    sock.send(JSON.stringify({ id: i, method, params: params || {} }));
  });

  const evaluate = async (expr) => {
    const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception.description);
    return r.result.value;
  };

  await send('Runtime.enable');
  await send('Page.enable');
  await send('Network.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });
  await send('Page.navigate', { url });

  for (let i = 0; i < 120; i++) {
    if (await evaluate('document.readyState').catch(() => 'x') === 'complete') break;
    await new Promise((r) => setTimeout(r, 150));
  }
  await new Promise((r) => setTimeout(r, 500));
  return evaluate;
}

/** Run one suite against both origins, because both matter. */
async function bothOrigins(run) {
  const { ROOT } = require('./paths');
  await run('http://127.0.0.1:8080/index.html', 'served');
  await run('file://' + path.join(ROOT, 'index.html'), 'file://');
}

module.exports = { browser, open, bothOrigins, DEBUG_PORT };
