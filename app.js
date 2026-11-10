/* SIN FILTRO — lógica de los dos juegos (sin dependencias, funciona abriendo index.html) */
(function () {
  'use strict';

  const D = window.DATA, I = window.ICON, A = window.ART;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = n => (n < 10 ? '0' + n : '' + n);
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const baseUrl = () => location.href.split('#')[0];

  const W = D.WEIGHTS;
  const byId = {};
  D.QUESTIONS.forEach(q => { byId[q.id] = q; });
  const TYPE_LABEL = { mc: 'Opción múltiple', bool: 'Verdad o mentira', rank: 'Ranking', open: 'Respuesta escrita' };

  /* ---------- utilidades ---------- */
  let toastT;
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2600);
  }
  async function copyText(s) {
    try { await navigator.clipboard.writeText(s); return true; }
    catch (e) {
      const ta = document.createElement('textarea'); ta.value = s; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select(); let ok = false;
      try { ok = document.execCommand('copy'); } catch (_) { }
      ta.remove(); return ok;
    }
  }
  function confetti() {
    if (reduce) return;
    const box = document.createElement('div'); box.className = 'confetti';
    const cols = ['var(--acid)', 'var(--hot)', 'var(--volt)', 'var(--paper)', 'var(--sun)'];
    for (let i = 0; i < 80; i++) {
      const s = document.createElement('i');
      s.style.cssText = 'left:' + (Math.random() * 100) + '%;background:' + cols[i % 5] + ';--dx:' + ((Math.random() - .5) * 260) + 'px;--r:' + (Math.random() * 720) + 'deg;animation-delay:' + (Math.random() * .5) + 's;animation-duration:' + (1.8 + Math.random() * 1.6) + 's;width:' + (6 + Math.random() * 7) + 'px;height:' + (10 + Math.random() * 10) + 'px';
      box.appendChild(s);
    }
    document.body.appendChild(box); setTimeout(() => box.remove(), 4200);
  }

  /* ---------- link del reto: codificar / decodificar ---------- */
  const KEY = 'sinfiltro-crush-2026';
  function enc(name, items) {
    const bytes = new TextEncoder().encode(JSON.stringify([name, items]));
    let bin = '';
    bytes.forEach((b, i) => { bin += String.fromCharCode(b ^ KEY.charCodeAt(i % KEY.length)); });
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function dec(p) {
    try {
      p = p.replace(/-/g, '+').replace(/_/g, '/'); while (p.length % 4) p += '=';
      const bin = atob(p), bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i) ^ KEY.charCodeAt(i % KEY.length);
      const parsed = JSON.parse(new TextDecoder().decode(bytes));
      const n = parsed[0], items = parsed[1];
      if (typeof n !== 'string' || !Array.isArray(items) || !items.length || items.length > 20) return null;
      const qs = [], truth = [];
      for (const it of items) {
        const q = byId[it[0]], a = it[1];
        if (!q) return null;
        if (q.t === 'mc') { if (!(Number.isInteger(a) && a >= 0 && a < 4)) return null; }
        else if (q.t === 'bool') { if (a !== 0 && a !== 1) return null; }
        else if (q.t === 'rank') { if (!Array.isArray(a) || a.length !== 4 || [0, 1, 2, 3].some(k => a.indexOf(k) < 0)) return null; }
        else if (q.t === 'open') { if (typeof a !== 'string' || !a.trim()) return null; }
        qs.push(q); truth.push(a);
      }
      return { n: n.slice(0, 24), qs, truth };
    } catch (e) { return null; }
  }

  /* ---------- comparar respuestas escritas ---------- */
  const STOP = new Set('el la los las un una unos unas de del y o a en con por que mi me lo al es se su para no si e'.split(' '));
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ñ\s]/g, ' ').replace(/\s+/g, ' ').trim();
  function lev(a, b) {
    const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[n];
  }
  function similar(x, y) {
    const a = norm(x), b = norm(y);
    if (!a || !b) return false;
    if (a === b) return true;
    if (Math.min(a.length, b.length) >= 4 && (a.includes(b) || b.includes(a))) return true;
    const ta = a.split(' ').filter(t => t.length >= 4 && !STOP.has(t)), tb = b.split(' ').filter(t => t.length >= 4 && !STOP.has(t));
    if (ta.some(t => tb.some(u => { const m = Math.min(5, t.length, u.length); return t.slice(0, m) === u.slice(0, m); }))) return true;
    return lev(a, b) / Math.max(a.length, b.length) <= .25;
  }

  /* =====================================================
     JUEGO 1 — CRUSH OR CRASH
     ===================================================== */
  const g1 = $('#g1');
  const S = { mode: '', name: '', qs: [], mine: [], truth: [], inv: null, i: 0, res: [], rank: [], lock: false, cur: null };

  function put(html, anim) {
    g1.innerHTML = '<div class="step' + (anim === false ? ' still' : '') + '">' + html + '</div>';
    if (anim !== false) window.scrollTo(0, 0);
  }
  function pickSet() {
    const by = t => shuffle(D.QUESTIONS.filter(q => q.t === t));
    const pool = { mc: by('mc'), bool: by('bool'), rank: by('rank'), open: by('open') };
    const mid = shuffle(['mc', 'mc', 'mc', 'bool', 'bool', 'rank', 'rank', 'open']);
    return ['mc'].concat(mid, ['open']).map(t => pool[t].pop());
  }
  const maxPts = qs => qs.reduce((a, q) => a + W[q.t], 0);

  function g1Intro() {
    S.mode = '';
    put(`
      <a class="back" href="#/">${I.back} Inicio</a>
      <p class="kicker">Juego 01 · Por link</p>
      <h1 class="h-xl">CRUSH<br><b>OR CRASH</b></h1>
      <p class="lead">Responde 10 preguntas sobre ti. Te damos un link y tu pareja o tus amigos intentan adivinar lo que contestaste. Al final se revela qué tan bien te conocen: de <b>“love of my life”</b> a <b>“we need to talk”</b>.</p>
      <ol class="steps">
        <li><b>1</b><span>Tú respondes sobre ti (nadie ve nada todavía).</span></li>
        <li><b>2</b><span>Mandas el link por WhatsApp.</span></li>
        <li><b>3</b><span>Quien lo abra intenta adivinar. Sale su nivel: crush o crash.</span></li>
      </ol>
      <div class="types">
        <span>${I.list} Opción múltiple</span><span>${I.check} Verdad o mentira</span><span>${I.sparkle} Ranking</span><span>${I.pen} Respuesta escrita</span>
      </div>
      <div class="row"><button class="btn" data-act="start">Crear mi reto ${I.arrow}</button></div>`);
  }

  function g1Name() {
    S.mode = '';
    put(`
      <a class="back" href="#/crush">${I.back} Atrás</a>
      <p class="kicker">Paso 1 de 3</p>
      <h1 class="h-xl">¿CÓMO TE<br><b>LLAMAN?</b></h1>
      <p class="lead">Este nombre aparecerá en las preguntas que verá la otra persona.</p>
      <form class="field" data-submit="name" autocomplete="off">
        <input name="n" maxlength="18" placeholder="Tu nombre o apodo" required>
        <button class="btn" type="submit">Empezar ${I.arrow}</button>
      </form>`);
    const inp = $('input[name=n]', g1); if (inp) inp.focus({ preventScroll: true });
  }

  function frame(q, body) {
    const create = S.mode === 'create', n = S.qs.length;
    const segs = S.qs.map((_, i) => '<i class="' + (i < S.i ? 'done' : i === S.i ? 'now' : '') + '"></i>').join('');
    const text = create ? esc(q.me) : esc(q.you).replace(/\{n\}/g, '<b>' + esc(S.inv.n) + '</b>');
    return `<div class="q-head"><span>${create ? 'Tu reto' : 'Adivina'} · ${pad(S.i + 1)}/${pad(n)}</span><span class="qtype">${TYPE_LABEL[q.t]} · ${W[q.t]} pt</span></div>
      <div class="prog">${segs}</div>
      <p class="q-cat mono">${q.cat}</p>
      <h2 class="q-text">${text}</h2>${body}`;
  }

  function boolBtns(st) {
    const mk = (v, label, icon) => {
      let c = 'bopt', a = 'data-act="bool" data-k="' + v + '"';
      if (st) { a = 'disabled'; c += v === st.truth ? ' ok' : v === st.guess ? ' bad' : ' dim'; }
      return `<button class="${c}" ${a}>${icon}<span>${label}</span></button>`;
    };
    return '<div class="bools">' + mk(1, 'VERDAD', I.check) + mk(0, 'MENTIRA', I.x) + '</div>';
  }
  function rankBody() {
    const q = S.qs[S.i], r = S.rank;
    const items = q.opts.map((o, k) => {
      const pos = r.indexOf(k);
      return `<button class="rk${pos >= 0 ? ' set' : ''}" data-act="rk" data-k="${k}"><i>${pos >= 0 ? pos + 1 : ''}</i><span>${esc(o)}</span></button>`;
    }).join('');
    return `<p class="hint mono" style="margin:-.4rem 0 .9rem">Toca en orden: 1.º lo que MÁS · 4.º lo que MENOS</p>
      <div class="rks">${items}</div>
      <div class="row"><button class="btn ghost sm" data-act="rkundo" ${r.length ? '' : 'disabled'}>${I.undo} Deshacer</button>
      <button class="btn" data-act="rkok" ${r.length === 4 ? '' : 'disabled'}>Confirmar ${I.check}</button></div>`;
  }

  function viewAsk(anim) {
    const q = S.qs[S.i]; let body = '';
    if (q.t === 'mc') body = '<div class="opts">' + q.opts.map((o, k) => `<button class="opt" data-act="mc" data-k="${k}"><i>${'ABCD'[k]}</i><span>${esc(o)}</span></button>`).join('') + '</div>';
    else if (q.t === 'bool') body = boolBtns();
    else if (q.t === 'rank') body = rankBody();
    else body = `<form class="open" data-submit="open" autocomplete="off"><input name="a" maxlength="40" placeholder="${esc(q.hint || '')}" required><button class="btn" type="submit">${S.mode === 'create' ? 'Guardar' : 'Responder'} ${I.arrow}</button></form>`;
    put(frame(q, body), anim);
    const inp = $('input[name=a]', g1); if (inp) inp.focus({ preventScroll: true });
  }

  function lockThen(fn) { S.lock = true; setTimeout(() => { S.lock = false; fn(); }, 280); }

  function commitCreate(v) {
    S.mine[S.i] = v; S.i++; S.rank = [];
    if (S.i >= S.qs.length) return viewShare();
    viewAsk();
  }

  function reveal(guess) {
    const q = S.qs[S.i], truth = S.truth[S.i], max = W[q.t];
    let pts = 0, pending = false;
    if (q.t === 'mc' || q.t === 'bool') pts = guess === truth ? max : 0;
    else if (q.t === 'rank') {
      const m = guess.filter((v, i) => v === truth[i]).length;
      pts = m === 4 ? 2 : (guess[0] === truth[0] || m >= 2) ? 1 : 0;
    } else { if (similar(guess, truth)) pts = max; else pending = true; }
    S.cur = { guess, truth };
    S.res[S.i] = { pts, max, pending };
    viewReveal();
    if (pts >= max && !pending && !reduce) { /* mini celebración */ }
  }

  function viewReveal() {
    const q = S.qs[S.i], r = S.res[S.i], { guess, truth } = S.cur, nm = esc(S.inv.n);
    let body = '';
    if (q.t === 'mc') {
      body = '<div class="opts">' + q.opts.map((o, k) => {
        const c = k === truth ? 'ok' : k === guess ? 'bad' : 'dim';
        return `<button class="opt ${c}" disabled><i>${'ABCD'[k]}</i><span>${esc(o)}</span></button>`;
      }).join('') + '</div>';
    } else if (q.t === 'bool') {
      body = boolBtns({ guess, truth });
    } else if (q.t === 'rank') {
      const list = (order, ref) => order.map((k, i) => `<div class="ri ${ref ? (k === ref[i] ? 'ok' : 'bad') : ''}"><i>${i + 1}</i><span>${esc(q.opts[k])}</span></div>`).join('');
      body = `<div class="cmp"><div><h4 class="mono">Tu orden</h4>${list(guess, truth)}</div><div><h4 class="mono">El de ${nm}</h4>${list(truth, null)}</div></div>`;
    } else {
      body = `<div class="say"><div class="bub"><h4 class="mono">Tú dijiste</h4><p>${esc(guess)}</p></div><div class="bub real"><h4 class="mono">${nm} respondió</h4><p>${esc(truth)}</p></div></div>`;
    }
    let tail;
    if (r.pending) {
      tail = `<div class="judge"><p>¿Cuenta como acierto? Compárenlas y decidan con honestidad.</p>
        <div class="row" style="margin-top:0"><button class="btn" data-act="judge" data-v="1">${I.check} Es lo mismo</button><button class="btn ghost" data-act="judge" data-v="0">${I.x} Ni cerca</button></div></div>`;
    } else {
      const st = r.pts >= r.max ? 'ok' : r.pts > 0 ? 'half' : 'bad';
      const last = S.i === S.qs.length - 1;
      tail = `<div class="fb ${st}"><b>${pick(D.QUIPS[st])}</b><span>+${r.pts} / ${r.max} PT</span></div>
        <div class="row"><button class="btn" data-act="next">${last ? 'Ver resultado' : 'Siguiente'} ${I.arrow}</button></div>`;
    }
    put(frame(q, body) + tail, false);
  }

  function viewShare() {
    const items = S.qs.map((q, i) => [q.id, S.mine[i]]);
    const url = baseUrl() + '#/r/' + enc(S.name, items);
    S.shareUrl = url;
    const msg = 'Te lancé un reto: ¿cuánto me conoces? Soy ' + S.name + '. ¿Eres crush o crash? 👀 ' + url;
    put(`
      <p class="kicker">Reto listo · ${S.qs.length} preguntas · ${maxPts(S.qs)} puntos</p>
      <h1 class="h-xl">LISTO,<br><b>${esc(S.name)}.</b></h1>
      <p class="lead">Manda este link. Tus respuestas viajan dentro del link (en clave) y no se guardan en ningún servidor.</p>
      <div class="linkbox"><input id="lnk" readonly value="${esc(url)}" aria-label="Link del reto"><button class="btn sm" data-act="copy">${I.copy} Copiar</button></div>
      <div class="row">
        <a class="btn wa" href="https://wa.me/?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">${I.whatsapp} Enviar por WhatsApp</a>
        <button class="btn ghost" data-act="share">${I.share} Compartir</button>
      </div>
      <div class="row" style="margin-top:2rem"><a class="btn ghost sm" href="${esc(url)}">${I.eye} Ver cómo lo ve la otra persona</a><button class="btn ghost sm" data-act="again">${I.refresh || ''} Crear otro</button></div>`);
  }

  function viewInvite(p) {
    const d = p ? dec(p) : null;
    if (!d) {
      put(`<a class="back" href="#/">${I.back} Inicio</a><p class="kicker">Ups</p><h1 class="h-xl">ESTE LINK<br><b>NO FUNCIONA</b></h1>
        <p class="lead">Parece incompleto o dañado. Pídele que lo copie de nuevo, o crea tu propio reto.</p>
        <div class="row"><a class="btn" href="#/crush/crear">Crear mi reto ${I.arrow}</a></div>`);
      return;
    }
    S.mode = 'play'; S.inv = d; S.qs = d.qs; S.truth = d.truth; S.i = 0; S.res = []; S.rank = []; S.cur = null;
    put(`
      <p class="kicker">Te lanzaron un reto</p>
      <h1 class="h-xl"><b>${esc(d.n)}</b><br>QUIERE SABER SI ERES CRUSH O CRASH</h1>
      <p class="lead">${d.qs.length} preguntas sobre ${esc(d.n)}. Cada acierto suma. Al final te toca un nivel, desde <b>LOVE OF MY LIFE</b> hasta <b>TOTAL CRASH</b>.</p>
      <div class="types">
        <span>${I.list} Opción múltiple</span><span>${I.check} Verdad o mentira</span><span>${I.sparkle} Ranking</span><span>${I.pen} Respuesta escrita</span>
      </div>
      <div class="row"><button class="btn" data-act="go">Jugar ${I.arrow}</button></div>`);
  }

  function viewResult() {
    const pts = S.res.reduce((a, r) => a + r.pts, 0), max = S.res.reduce((a, r) => a + r.max, 0);
    const pct = Math.round(pts / max * 100);
    const tier = D.TIERS.find(t => pct >= t.min);
    const nm = esc(S.inv.n);
    S.last = { pts, max, tier, name: S.inv.n };
    const ladder = D.TIERS.map(t => `<li class="${t === tier ? 'on ' + t.side : ''}"><span>${t.name}</span><span>≥${t.min}%</span></li>`).join('');
    const recap = S.res.map((r, i) => `<i class="${r.pts >= r.max ? 'f' : r.pts > 0 ? 'h' : 'z'}" title="${TYPE_LABEL[S.qs[i].t]}"></i>`).join('');
    put(`
      <p class="kicker">Resultado · tú y ${nm}</p>
      <div class="res">
        <div class="res-heart">${A.heartMeter(pct / 100, tier.side === 'crush' ? 'var(--acid)' : 'var(--hot)')}</div>
        <div>
          <div class="score">${pts}<span>/${max}</span></div>
          <div class="sticker ${tier.side}">${tier.name}</div>
          <p class="lead">${tier.line}</p>
        </div>
      </div>
      <div class="recap" aria-label="Resumen por pregunta">${recap}</div>
      <ul class="ladder">${ladder}</ul>
      <div class="row">
        <a class="btn wa" href="https://wa.me/?text=${encodeURIComponent(shareResultText())}" target="_blank" rel="noopener">${I.whatsapp} Contar mi resultado</a>
        <a class="btn ghost" href="#/crush/crear">Crear mi reto ${I.arrow}</a>
      </div>`);
    if (tier.side === 'crush' && pct >= 80) confetti();
  }
  function shareResultText() {
    const l = S.last;
    return 'Saqué "' + l.tier.name + '" (' + l.pts + '/' + l.max + ') conociendo a ' + l.name + ' en CRUSH OR CRASH. ¿Y tú, crush o crash? ' + baseUrl() + '#/crush';
  }

  const A1 = {
    start() { location.hash = '#/crush/crear'; },
    name(form) {
      const v = form.n.value.replace(/[|<>]/g, '').trim().slice(0, 18);
      if (!v) return;
      S.mode = 'create'; S.name = v; S.qs = pickSet(); S.mine = []; S.i = 0; S.rank = []; S.inv = { n: v };
      viewAsk();
    },
    mc(b) { if (S.lock) return; const k = +b.dataset.k; if (S.mode === 'create') { b.classList.add('sel'); S.lock = true; lockThen(() => commitCreate(k)); } else reveal(k); },
    bool(b) { if (S.lock) return; const k = +b.dataset.k; if (S.mode === 'create') { b.classList.add('ok'); lockThen(() => commitCreate(k)); } else reveal(k); },
    rk(b) { const k = +b.dataset.k; if (S.rank.indexOf(k) < 0 && S.rank.length < 4) { S.rank.push(k); viewAsk(false); } },
    rkundo() { S.rank.pop(); viewAsk(false); },
    rkok() { if (S.rank.length !== 4) return; const r = S.rank.slice(); S.rank = []; if (S.mode === 'create') commitCreate(r); else reveal(r); },
    open(form) {
      const v = form.a.value.trim(); if (!v) return;
      if (S.mode === 'create') commitCreate(v); else reveal(v);
    },
    judge(b) { const r = S.res[S.i]; r.pending = false; r.pts = b.dataset.v === '1' ? r.max : 0; viewReveal(); },
    next() { S.i++; S.rank = []; if (S.i >= S.qs.length) viewResult(); else viewAsk(); },
    go() { viewAsk(); },
    async copy(b) { const ok = await copyText(S.shareUrl); toast(ok ? 'Link copiado' : 'No se pudo copiar: selecciónalo a mano'); },
    async share() {
      const msg = 'Te lancé un reto: ¿cuánto me conoces? ¿Eres crush o crash?';
      if (navigator.share) { try { await navigator.share({ title: 'CRUSH OR CRASH', text: msg, url: S.shareUrl }); } catch (e) { } }
      else { const ok = await copyText(S.shareUrl); toast(ok ? 'Link copiado' : 'No se pudo copiar'); }
    },
    again() { location.hash = '#/crush/crear'; g1Name(); }
  };
  g1.addEventListener('click', e => { const b = e.target.closest('[data-act]'); if (!b || b.disabled) return; const f = A1[b.dataset.act]; if (f) f(b, e); });
  g1.addEventListener('submit', e => { e.preventDefault(); const f = A1[e.target.dataset.submit]; if (f) f(e.target, e); });

  /* =====================================================
     JUEGO 2 — EL MAZO
     ===================================================== */
  const g2 = $('#g2'), deal = $('#deal');
  const M = { players: [], level: 2, turn: 0, drawn: 0, piles: {}, screen: 'setup' };
  const LEVELS = { 1: 'SUAVE', 2: 'PICANTE', 3: 'PROFUNDO' };
  const DECKS = ['verdad', 'reto', 'confesion'];
  const flames = n => Array.from({ length: n }, () => I.flame).join('');

  function putG2(html, cls) { g2.innerHTML = '<div class="step' + (cls ? ' ' + cls : '') + '">' + html + '</div>'; window.scrollTo(0, 0); }

  function seg() {
    const L = [[1, 'Suave', flames(1)], [2, 'Picante', flames(2)], [3, 'Profundo', flames(3)], [0, 'Caos', I.shuffle]];
    return '<div class="seg" role="group" aria-label="Intensidad">' + L.map(l =>
      `<button class="${M.level === l[0] ? 'on' : ''}" data-act="lvl" data-v="${l[0]}"><span class="fl">${l[2]}</span><span>${l[1]}</span></button>`).join('') + '</div>';
  }
  function chips() {
    return M.players.map((p, i) => `<span class="chip">${esc(p)}<button data-act="delp" data-i="${i}" aria-label="Quitar a ${esc(p)}">${I.x}</button></span>`).join('');
  }

  function mazoSetup() {
    M.screen = 'setup'; closeDeal();
    putG2(`
      <a class="back" href="#/">${I.back} Inicio</a>
      <p class="kicker">Juego 02 · En persona</p>
      <h1 class="h-xl">EL<br><b>MAZO</b></h1>
      <p class="lead">Tres mazos: <b>Verdad</b>, <b>Reto</b> y <b>Confesión</b>. Elige la intensidad, saca una carta y cumple. Pasar tiene penitencia, la decide la mesa.</p>
      <p class="label mono">Jugadores (opcional)</p>
      <form class="field" style="margin-top:0" data-submit="addp" autocomplete="off"><input name="p" maxlength="14" placeholder="Nombre del jugador"><button class="btn sm" type="submit">${I.plus} Agregar</button></form>
      <div class="chips" id="chips">${chips()}</div>
      <p class="label mono">Intensidad</p>${seg()}
      <div class="row"><button class="btn" data-act="start">Repartir ${I.arrow}</button></div>`);
  }

  const remaining = k => {
    if (M.level === 0) return 'Al azar';
    const p = M.piles[k + M.level]; const n = p ? p.length : D.CARDS[k][M.level].length;
    return n + (n === 1 ? ' carta' : ' cartas');
  };

  function mazoTable() {
    M.screen = 'table';
    const who = M.players.length ? M.players[M.turn % M.players.length] : '';
    putG2(`
      <div class="t-top">
        <div class="turn"><span class="mono">${who ? 'Turno de' : 'Mesa abierta'}</span><strong>${who ? esc(who) : 'Quien se atreva'}</strong></div>
        <span class="count mono">${M.drawn} jugadas</span>
      </div>
      <div style="margin-top:1.1rem">${seg()}</div>
      <div class="decks">${DECKS.map(k => `
        <button class="deck deck-${k}" data-act="draw" data-k="${k}" aria-label="Sacar carta de ${A.DECK_NAME[k]}">
          <span class="stack"><i></i><i></i><b>${A.back(k)}</b></span>
          <span class="deck-label">${A.DECK_NAME[k]}</span><span class="deck-count mono">${remaining(k)}</span>
        </button>`).join('')}</div>
      <p class="hint mono hint-c">Toca un mazo para sacar carta</p>
      <div class="row" style="justify-content:center"><button class="btn ghost sm" data-act="random">${I.shuffle} Mazo al azar</button><button class="btn ghost sm" data-act="players">${I.users} Jugadores</button></div>`, 'tbl');
  }

  function cardFront(c) {
    return `<div class="cf"><div class="cf-art">${A.deckArt(c.deck, c.lvl)}<div class="cf-top"><span class="pill">${A.DECK_NAME[c.deck]}</span><span class="fl" title="Nivel ${LEVELS[c.lvl]}">${flames(c.lvl)}</span></div></div>
      <div class="cf-body"><p class="cf-text">${esc(c.text)}</p><div class="cf-foot"><span>Nº ${pad(c.idx + 1)} · ${LEVELS[c.lvl]}</span><span>Sin Filtro</span></div></div></div>`;
  }

  function drawCard(deck) {
    const lvl = M.level || 1 + Math.floor(Math.random() * 3);
    const key = deck + lvl; let pile = M.piles[key];
    if (!pile || !pile.length) {
      if (pile) toast('Mazo barajado de nuevo');
      pile = M.piles[key] = shuffle(D.CARDS[deck][lvl].map((_, i) => i));
    }
    const idx = pile.pop(); M.drawn++;
    showDeal({ deck, lvl, idx, text: D.CARDS[deck][lvl][idx] });
  }

  function showDeal(c) {
    const who = M.players.length ? M.players[M.turn % M.players.length] : '';
    deal.hidden = false; document.body.classList.add('noscroll');
    deal.innerHTML = `<div class="deal-in">${who ? `<p class="deal-who mono">Turno de <b>${esc(who)}</b></p>` : ''}
      <div class="flip"><div class="tilt"><div class="inner">
        <div class="face back deck-${c.deck}">${A.back(c.deck)}</div>
        <div class="face front deck-${c.deck}">${cardFront(c)}</div>
      </div></div></div>
      <div class="deal-actions"><button class="btn" data-act="done">${I.check} Hecho</button><button class="btn ghost" data-act="skip">${I.x} Paso</button></div></div>`;
    const fl = $('.flip', deal), tl = $('.tilt', deal);
    setTimeout(() => fl.classList.add('flipped'), reduce ? 0 : 480);
    fl.addEventListener('pointermove', e => {
      if (reduce || e.pointerType === 'touch') return;
      const r = fl.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      tl.style.setProperty('--ry', (x * 14) + 'deg'); tl.style.setProperty('--rx', (-y * 14) + 'deg');
    });
    fl.addEventListener('pointerleave', () => { tl.style.setProperty('--rx', '0deg'); tl.style.setProperty('--ry', '0deg'); });
  }
  function closeDeal() { deal.hidden = true; deal.innerHTML = ''; document.body.classList.remove('noscroll'); }

  const A2 = {
    lvl(b) { M.level = +b.dataset.v; M.screen === 'table' ? mazoTable() : mazoSetup(); },
    addp(form) {
      const v = form.p.value.replace(/[<>]/g, '').trim().slice(0, 14);
      if (v && M.players.length < 8) { M.players.push(v); }
      else if (M.players.length >= 8) toast('Máximo 8 jugadores');
      form.p.value = ''; $('#chips').innerHTML = chips(); form.p.focus({ preventScroll: true });
    },
    delp(b) { M.players.splice(+b.dataset.i, 1); const c = $('#chips'); if (c) c.innerHTML = chips(); else mazoTable(); },
    start() { M.turn = 0; M.drawn = 0; mazoTable(); },
    draw(b) { drawCard(b.dataset.k); },
    random() { drawCard(pick(DECKS)); },
    players() { mazoSetup(); }
  };
  g2.addEventListener('click', e => { const b = e.target.closest('[data-act]'); if (!b || b.disabled) return; const f = A2[b.dataset.act]; if (f) f(b, e); });
  g2.addEventListener('submit', e => { e.preventDefault(); const f = A2[e.target.dataset.submit]; if (f) f(e.target, e); });
  deal.addEventListener('click', e => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    if (b.dataset.act === 'done') { closeDeal(); M.turn++; mazoTable(); }
    if (b.dataset.act === 'skip') { closeDeal(); M.turn++; mazoTable(); toast('Paso = penitencia a elección de la mesa'); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !deal.hidden) { closeDeal(); mazoTable(); } });

  /* ---------- inicio + router ---------- */
  function initHome() {
    $$('[data-art="crush"]').forEach(el => { el.innerHTML = A.tileCrush(); });
    $$('[data-art="mazo"]').forEach(el => { el.innerHTML = A.tileMazo(); });
    $$('[data-i]').forEach(el => { el.insertAdjacentHTML('beforeend', I[el.dataset.i]); });
    const words = ['SIN FILTRO', 'CRUSH OR CRASH', 'EL MAZO', '+18', 'NADIE SE LIBRA', 'LOVE OF MY LIFE', 'WE NEED TO TALK', 'SOLO ENTRE CONFIANZA'];
    const grp = '<div class="grp">' + words.map(w => `<span>${w}${I.sparkle}</span>`).join('') + '</div>';
    $('#track').innerHTML = grp + grp;
  }

  function route() {
    const parts = (location.hash.replace(/^#/, '') || '/').split('/').filter(Boolean);
    const view = (parts[0] === 'crush' || parts[0] === 'r') ? 'crush' : parts[0] === 'mazo' ? 'mazo' : 'home';
    $$('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + view));
    document.body.dataset.view = view;
    closeDeal(); window.scrollTo(0, 0);
    if (view === 'crush') {
      if (parts[0] === 'r') viewInvite(parts[1]);
      else if (parts[1] === 'crear') g1Name();
      else g1Intro();
    } else if (view === 'mazo') mazoSetup();
  }

  initHome();
  window.addEventListener('hashchange', route);
  route();
})();
