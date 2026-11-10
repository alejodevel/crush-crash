/* SIN FILTRO — ilustraciones e iconos (SVG original, sin dependencias) */
(function () {
  'use strict';
  var INK = 'var(--ink)', PAPER = 'var(--paper)';
  var uid = 0;

  function wrap(inner, vb, cls) {
    return '<svg class="' + (cls || 'art-svg') + '" viewBox="' + (vb || '0 0 200 200') +
      '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' + inner + '</svg>';
  }
  function S(w) {
    return 'stroke="' + INK + '" stroke-width="' + (w || 5) + '" stroke-linejoin="round" stroke-linecap="round"';
  }
  function sparkle(x, y, s, fill) {
    return '<path transform="translate(' + x + ' ' + y + ') scale(' + s + ')" d="M0-12C1.5-5 5-1.5 12 0 5 1.5 1.5 5 0 12-1.5 5-5 1.5-12 0-5-1.5-1.5-5 0-12Z" fill="' +
      (fill || 'var(--c2)') + '" ' + S(2.4 / s) + '/>';
  }
  function heart(x, y, s, fill) {
    return '<path transform="translate(' + (x - 12 * s) + ' ' + (y - 12 * s) + ') scale(' + s +
      ')" d="M12 21C4 15 2 11 2 8c0-3 2-5 4.5-5C9 3 11 4.5 12 6.5 13 4.5 15 3 17.5 3 20 3 22 5 22 8c0 3-2 7-10 13Z" fill="' +
      (fill || 'var(--c1)') + '" ' + S(2.6 / s) + '/>';
  }
  function key(x, y, r, s) {
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + r + ') scale(' + s + ')">' +
      '<rect x="8" y="-4.5" width="46" height="9" rx="4" fill="' + PAPER + '" ' + S(3.5) + '/>' +
      '<rect x="38" y="4" width="6" height="11" fill="' + PAPER + '" ' + S(3.5) + '/>' +
      '<rect x="48" y="4" width="6" height="8" fill="' + PAPER + '" ' + S(3.5) + '/>' +
      '<circle cx="0" cy="0" r="14" fill="' + PAPER + '" ' + S(3.5) + '/>' +
      '<circle cx="0" cy="0" r="5" fill="' + INK + '"/></g>';
  }

  /* ---------- MAZO VERDAD: ojo ---------- */
  function eye(l) {
    l = l || 1;
    var rays = '';
    for (var i = 0; i < 18; i++) {
      var a = i / 18 * Math.PI * 2, r1 = 74, r2 = i % 2 ? 88 : 97;
      rays += '<line x1="' + (100 + Math.cos(a) * r1).toFixed(1) + '" y1="' + (100 + Math.sin(a) * r1).toFixed(1) +
        '" x2="' + (100 + Math.cos(a) * r2).toFixed(1) + '" y2="' + (100 + Math.sin(a) * r2).toFixed(1) + '"/>';
    }
    var almond = 'M10 100Q100 18 190 100Q100 182 10 100Z';
    var pup = [
      '<circle cx="100" cy="100" r="15" fill="' + INK + '"/>',
      '<path d="M100 120C78 104 80 86 93 86c4 0 7 3 7 7 0-4 3-7 7-7 13 0 15 18-7 34Z" fill="' + INK + '"/>',
      '<path d="M100 76L107 93 124 100 107 107 100 124 93 107 76 100 93 93Z" fill="' + INK + '"/>'
    ][Math.min(l, 3) - 1];
    return '<g stroke="' + PAPER + '" stroke-width="4.5" stroke-linecap="round">' + rays + '</g>' +
      '<path d="' + almond + '" transform="translate(6 7)" fill="' + INK + '"/>' +
      '<path d="' + almond + '" fill="' + PAPER + '" ' + S() + '/>' +
      '<circle cx="100" cy="100" r="39" fill="var(--c2)" ' + S() + '/>' +
      '<circle cx="100" cy="100" r="25" fill="none" stroke="' + INK + '" stroke-width="2" stroke-dasharray="3 5"/>' +
      pup +
      '<circle cx="113" cy="87" r="6" fill="' + PAPER + '"/>' +
      (l >= 2 ? sparkle(30, 34, 1.2) + sparkle(172, 38, .9) : '') +
      (l >= 3 ? sparkle(170, 164, 1.1) + sparkle(28, 166, .8) : '');
  }

  /* ---------- MAZO RETO: rayo ---------- */
  function bolt(l) {
    l = l || 1;
    var pts = [];
    for (var i = 0; i < 24; i++) {
      var a = i / 24 * Math.PI * 2 - Math.PI / 2, r = i % 2 ? 64 : 94;
      pts.push((100 + Math.cos(a) * r).toFixed(1) + ',' + (100 + Math.sin(a) * r).toFixed(1));
    }
    var P = '112,8 40,112 90,112 74,192 160,80 108,80';
    function b(tx, ty, sc, fill, sw) {
      return '<g transform="translate(' + tx + ' ' + ty + ') scale(' + sc + ')">' +
        '<polygon points="' + P + '" transform="translate(8 9)" fill="' + INK + '"/>' +
        '<polygon points="' + P + '" fill="' + fill + '" stroke="' + INK + '" stroke-width="' + (sw / sc) +
        '" stroke-linejoin="round"/></g>';
    }
    return '<polygon points="' + pts.join(' ') + '" fill="' + PAPER + '" ' + S() + '/>' +
      b(15, 14, .86, 'var(--c2)', 5) +
      (l >= 2 ? b(22, 48, .26, 'var(--c1)', 3) : '') +
      (l >= 3 ? b(142, 40, .26, 'var(--c1)', 3) + sparkle(28, 168, 1, PAPER) : '');
  }

  /* ---------- MAZO CONFESIÓN: labios ---------- */
  function lips(l) {
    l = l || 1;
    var U = 'M28 104C48 72 80 70 100 88C120 70 152 72 172 104C150 112 120 110 100 104C80 110 50 112 28 104Z';
    var L = 'M28 104C50 112 80 110 100 104C120 110 150 112 172 104C162 142 132 160 100 160C68 160 38 142 28 104Z';
    return '<g transform="translate(6 7)" fill="' + INK + '"><path d="' + U + '"/><path d="' + L + '"/></g>' +
      '<path d="' + L + '" fill="var(--c2)" ' + S() + '/><path d="' + U + '" fill="var(--c2)" ' + S() + '/>' +
      '<path d="M60 128C70 141 86 148 100 148" fill="none" stroke="' + PAPER + '" stroke-width="6" stroke-linecap="round" opacity=".85"/>' +
      '<path d="M112 96C124 92 134 92 144 96" fill="none" stroke="' + PAPER + '" stroke-width="5" stroke-linecap="round" opacity=".7"/>' +
      sparkle(32, 48, 1.3, PAPER) + sparkle(170, 54, .9, PAPER) +
      (l >= 2 ? key(124, 30, 28, .8) : '') +
      (l >= 3 ? heart(40, 170, 1.5, 'var(--c1)') + heart(166, 168, 1.1, 'var(--c1)') : '');
  }

  function deckArt(deck, l) {
    var inner = deck === 'verdad' ? eye(l) : deck === 'reto' ? bolt(l) : lips(l);
    return wrap(inner, '0 0 200 200', 'art-svg');
  }

  var DECK_NAME = { verdad: 'VERDAD', reto: 'RETO', confesion: 'CONFESIÓN' };

  /* ---------- reverso de carta ---------- */
  function back(deck) {
    var em = deck === 'verdad' ? eye(1) : deck === 'reto' ? bolt(1) : lips(1);
    var lines = '';
    for (var i = -6; i < 12; i++) lines += '<line x1="' + (i * 30) + '" y1="0" x2="' + (i * 30 + 280) + '" y2="280"/>';
    return wrap(
      '<rect width="200" height="280" fill="var(--c1)"/>' +
      '<g stroke="' + INK + '" stroke-opacity=".16" stroke-width="6">' + lines + '</g>' +
      '<rect x="9" y="9" width="182" height="262" rx="12" fill="none" stroke="' + PAPER + '" stroke-width="2.5"/>' +
      '<rect x="17" y="17" width="166" height="246" rx="8" fill="none" stroke="' + INK + '" stroke-width="2.5"/>' +
      '<circle cx="100" cy="140" r="68" fill="' + INK + '"/>' +
      '<circle cx="100" cy="140" r="62" fill="none" stroke="var(--c2)" stroke-width="3" stroke-dasharray="1 9" stroke-linecap="round"/>' +
      '<svg x="44" y="84" width="112" height="112" viewBox="0 0 200 200">' + em + '</svg>' +
      '<text x="100" y="42" text-anchor="middle" font-family="Jost,sans-serif" font-weight="600" font-size="10.5" letter-spacing="5" fill="' + INK + '">SIN FILTRO</text>' +
      '<text x="100" y="250" text-anchor="middle" font-family="Jost,sans-serif" font-weight="600" font-size="10.5" letter-spacing="5" fill="' + INK + '">' + DECK_NAME[deck] + '</text>' +
      sparkle(36, 62, 1.1) + sparkle(164, 62, 1.1) + sparkle(36, 218, 1.1) + sparkle(164, 218, 1.1),
      '0 0 200 280', 'back-svg');
  }

  /* ---------- corazón medidor (resultado) ---------- */
  function heartMeter(p, color) {
    var id = 'hm' + (uid++);
    var y = (176 - 152 * p).toFixed(1);
    var H = 'M100 176C40 132 22 96 22 66C22 40 42 24 64 24C82 24 94 34 100 46C106 34 118 24 136 24C158 24 178 40 178 66C178 96 160 132 100 176Z';
    var crack = p < .4 ? '<path d="M104 28L90 66 114 88 92 122 108 148 100 176" fill="none" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>' : '';
    return wrap(
      '<defs><clipPath id="' + id + '"><rect x="0" y="' + y + '" width="200" height="200"/></clipPath></defs>' +
      '<path d="' + H + '" fill="rgba(244,239,230,.07)"/>' +
      '<g clip-path="url(#' + id + ')"><path d="' + H + '" fill="' + color + '"/></g>' +
      '<path d="' + H + '" fill="none" stroke="' + PAPER + '" stroke-width="5" stroke-linejoin="round"/>' + crack,
      '0 0 200 200', 'art-svg');
  }

  /* ---------- arte de las tarjetas del hub ---------- */
  function tileCrush() {
    var id1 = 'tc' + (uid++), id2 = 'tc' + (uid++);
    var H = 'M100 176C40 132 22 96 22 66C22 40 42 24 64 24C82 24 94 34 100 46C106 34 118 24 136 24C158 24 178 40 178 66C178 96 160 132 100 176Z';
    var cr = '104,26 90,62 114,84 92,118 110,142 100,178';
    var left = '104,0 ' + cr + ' 100,200 0,200 0,0';
    var right = '104,0 ' + cr + ' 100,200 200,200 200,0';
    return wrap(
      '<defs><clipPath id="' + id1 + '"><polygon points="' + left + '"/></clipPath><clipPath id="' + id2 + '"><polygon points="' + right + '"/></clipPath></defs>' +
      '<g transform="translate(-10 4) rotate(-7 100 176)"><g clip-path="url(#' + id1 + ')"><path d="' + H + '" fill="var(--acid)" ' + S(6) + '/></g>' +
      '<polyline points="' + cr + '" fill="none" ' + S(6) + '/></g>' +
      '<g transform="translate(11 -2) rotate(7 100 176)"><g clip-path="url(#' + id2 + ')"><path d="' + H + '" fill="var(--paper)" ' + S(6) + '/></g>' +
      '<polyline points="' + cr + '" fill="none" ' + S(6) + '/></g>' +
      '<g stroke="' + INK + '" stroke-width="5" stroke-linecap="round"><line x1="100" y1="6" x2="100" y2="-4"/><line x1="70" y1="12" x2="62" y2="3"/><line x1="130" y1="12" x2="138" y2="3"/></g>' +
      '<g style="--c2:var(--acid)">' + sparkle(168, 150, 1.6, 'var(--acid)') + sparkle(26, 150, 1.2, 'var(--paper)') + sparkle(176, 30, 1, 'var(--paper)') + '</g>',
      '-10 -14 220 220', 'art-svg');
  }

  function tileMazo() {
    function card(rot, deck, c1, c2) {
      var em = deck === 'verdad' ? eye(1) : deck === 'reto' ? bolt(1) : lips(1);
      return '<g transform="rotate(' + rot + ' 150 290)" style="--c1:' + c1 + ';--c2:' + c2 + '">' +
        '<rect x="92" y="96" width="116" height="162" rx="12" fill="' + c1 + '" stroke="' + INK + '" stroke-width="5"/>' +
        '<rect x="100" y="104" width="100" height="146" rx="8" fill="none" stroke="' + PAPER + '" stroke-width="2.5"/>' +
        '<circle cx="150" cy="178" r="42" fill="' + INK + '"/>' +
        '<svg x="112" y="140" width="76" height="76" viewBox="0 0 200 200">' + em + '</svg></g>';
    }
    return wrap(
      card(-26, 'verdad', 'var(--volt)', 'var(--acid)') +
      card(26, 'confesion', 'var(--acid)', 'var(--hot)') +
      card(0, 'reto', 'var(--hot)', 'var(--acid)') +
      sparkle(40, 70, 1.6, 'var(--acid)') + sparkle(262, 96, 1.2, 'var(--paper)') + sparkle(250, 30, .9, 'var(--acid)'),
      '0 0 300 300', 'art-svg');
  }

  /* ---------- iconos (24px, trazo) ---------- */
  function ic(d, fill) {
    return '<svg class="i' + (fill ? ' fill' : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  }
  var ICON = {
    arrow: ic('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    back: ic('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
    check: ic('<path d="M4 12.5l5 5L20 6.5"/>'),
    x: ic('<path d="M6 6l12 12M18 6L6 18"/>'),
    plus: ic('<path d="M12 5v14M5 12h14"/>'),
    undo: ic('<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>'),
    copy: ic('<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>'),
    share: ic('<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6"/>'),
    flame: ic('<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>', true),
    heart: ic('<path d="M12 21C4 15 2 11 2 8c0-3 2-5 4.5-5C9 3 11 4.5 12 6.5 13 4.5 15 3 17.5 3 20 3 22 5 22 8c0 3-2 7-10 13z"/>'),
    eye: ic('<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
    bolt: ic('<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>'),
    lock: ic('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
    shuffle: ic('<path d="M3 7h3.5c5 0 6 10 11 10H21M3 17h3.5c1.6 0 2.7-.9 3.6-2M14 8.5c.9-1 2-1.5 3.5-1.5H21"/><path d="M18 4l3 3-3 3M18 14l3 3-3 3"/>'),
    users: ic('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.4-3.6 3-5.5 6.5-5.5s6.1 1.9 6.5 5.5"/><path d="M16 4.7a3.5 3.5 0 0 1 0 6.6M18.5 14.8c1.7.7 2.8 2.3 3 4.7"/>'),
    sparkle: ic('<path d="M12 3c.8 4.5 2.5 6.2 7 7-4.5.8-6.2 2.5-7 7-.8-4.5-2.5-6.2-7-7 4.5-.8 6.2-2.5 7-7z"/>'),
    home: ic('<path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/>'),
    whatsapp: ic('<path d="M4 20l1.4-4.3A8.5 8.5 0 1 1 8.3 18.7L4 20z"/><path d="M9.3 8.9c.2-.6.8-.7 1.2-.2l.7 1c.2.3.1.6-.1.9l-.4.5c.6 1.2 1.6 2.1 2.8 2.7l.5-.5c.3-.2.6-.2.9 0l1 .7c.5.3.4 1-.2 1.3-1.3.7-3 .3-4.5-1.1-1.5-1.4-2.3-3.2-1.9-4.6z" fill="currentColor" stroke="none"/>'),
    question: ic('<path d="M9 9a3 3 0 1 1 4.2 2.7c-.8.4-1.2 1-1.2 1.8"/><circle cx="12" cy="17.5" r=".6" fill="currentColor"/>'),
    list: ic('<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>'),
    pen: ic('<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/>'),
    refresh: ic('<path d="M20 11a8 8 0 1 0-2.3 6.3"/><path d="M20 4v7h-7"/>'),
    split: ic('<path d="M12 21C4 15 2 11 2 8c0-3 2-5 4.5-5C9 3 11 4.5 12 6.5"/><path d="M12 6.5L10 10l3 2-2 3 1 6"/>')
  };

  window.ICON = ICON;
  window.ART = {
    eye: eye, bolt: bolt, lips: lips, deckArt: deckArt, back: back,
    heartMeter: heartMeter, tileCrush: tileCrush, tileMazo: tileMazo, DECK_NAME: DECK_NAME
  };
})();
