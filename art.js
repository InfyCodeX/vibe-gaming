'use strict';

const lineIcons = {
  cast: '<path d="m3 6 4 2 4-2v5a4 4 0 0 1-8 0Zm11 4 3-2 4 2v3a3.5 3.5 0 0 1-7 0ZM2 20c0-5 9-6 11-1m1 1c1-3 6-4 8-1"/><path d="M6 11h2m8 2h2" stroke-width="1"/>',
  extras: '<path d="M3 10h18v4H3zm2 4v7h14v-7m-7-4v11m0-11c-9 1-8-8-3-6 2 1 3 4 3 6Zm0 0c8 0 9-6 5-6-3 0-4 4-5 6Z"/><path d="M7 17h2m6 0h2" stroke-width="1"/>',
  tools: '<path d="M3 7h7m5 0h6M3 17h2m5 0h11M20 5v4M3 15v4"/><circle cx="12.5" cy="7" r="2.5"/><circle cx="7.5" cy="17" r="2.5"/>',
  genre: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M5.5 7.5h2v-2m8.8 12H19" stroke-width="1"/>',
  idea: '<path d="M9 18h6m-5 3h4m-5-6c0-2-3-3-3-6a6 6 0 1 1 12 0c0 3-3 4-3 6Z"/><path d="M9 9c0-1.6 1-2.6 2.5-3m-.5 8v-2l-1-1" stroke-width="1"/>',
  world: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Zm6-3v15m6-12v15"/><path d="m5.4 15 2-2m3-1 2.4 1.5m4.2-2 1.7-2" stroke-width="1"/>',
  moves: '<path d="M7.5 7h9c2.5 0 4 2 4.5 4l1 5c.5 3-2 4-4 2l-2-2H8l-2 2c-2 2-4.5 1-4-2l1-5c.5-2 2-4 4.5-4Z"/><path d="M8 10v5m-2.5-2.5h5m5 0h.01m3-2h.01"/><path d="M10 9h4" stroke-width="1"/>',
  challenge: '<path d="M12 2 3 6v5c0 6 4 9 9 11 5-2 9-5 9-11V6Z"/><path d="M12 7v5m0 4h.01"/><path d="M6 8v3c0 2 1 4 2 5m10-8v2" stroke-width="1"/>',
  progress: '<path d="M3 21h18M5 17v-5h4v5m1 0V8h4v9m1 0V3h4v14"/><path d="M6.5 15h1m4-4h1m4-4h1" stroke-width="1"/>',
  ending: '<path d="M5 22V3m0 1c5-5 9 5 15 0v12c-6 5-10-5-15 0"/><path d="m8 6 2 .3m3 1 2 .6m0 5-2-.5m-3-1-2-.4" stroke-width="1"/>',
  visual: '<path d="M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1.5-3.3 1.7 1.7 0 0 1 1.3-2.7H18a3 3 0 0 0 3-3 9 9 0 0 0-9-9Z"/><path d="M7.5 11h.01M10 7.5h.01m4.5 0h.01M17.5 11h.01"/><path d="M6 15c.4 1.5 1.5 2.6 3 3" stroke-width="1"/>',
  check: '<path d="m5 12 4 4L19 6"/><path d="m7 17 2 2 4-4" stroke-width="1" opacity=".58"/>',
  spark: '<path d="M11 3c0 5-3 8-8 8 5 0 8 3 8 8 0-5 3-8 8-8-5 0-8-3-8-8Zm7 14v5m-2.5-2.5h5M19 3v4m-2-2h4"/><path d="m8.5 11 2.5-2.5" stroke-width="1"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>',
  copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2"/><path d="M11 13h6m-6 3h4" stroke-width="1"/>',
  edit: '<path d="m14 5 5 5M4 20l5-1 11-11a2 2 0 0 0-4-4L5 15Z"/>',
  puzzle: '<path d="M3 11h6c-2-3 0-5 3-5s5 2 3 5h6v5c-3-2-5 0-5 2s2 4 5 2v1H3v-6c3 2 5 0 5-2s-2-4-5-2Z"/>',
  sound: '<path d="M10 18V5l10-2v13M10 18a3 3 0 1 1-3-3h3Zm10-2a3 3 0 1 1-3-3h3ZM10 8l10-2"/>'
};

function icon(name, className = '') {
  return '<svg class="' + className + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + lineIcons[name] + '</svg>';
}

// Keep the drawn contours and motion layers while giving each fill a lit edge.
function paintedArt(art, prefix) {
  const paints = new Map();
  const shapes = art.replace(/\bfill="#([\da-f]{6})"/gi, (original, hex) => {
    hex = hex.toLowerCase();
    const color = hex.match(/../g).map(channel => parseInt(channel, 16));
    if (Math.max(...color) < 105) return original;
    if (!paints.has(hex)) {
      const tint = color.map(channel => Math.round(channel + (255 - channel) * 0.29));
      const shade = color.map((channel, index) => Math.round(channel * 0.86 + [44, 37, 49][index] * 0.14));
      const rgb = channels => 'rgb(' + channels.join(' ') + ')';
      paints.set(hex, `<linearGradient id="${prefix}-${hex}" x1="0%" y1="0%" x2="75%" y2="100%"><stop stop-color="${rgb(tint)}"/><stop offset=".46" stop-color="#${hex}"/><stop offset="1" stop-color="${rgb(shade)}"/></linearGradient>`);
    }
    return 'fill="url(#' + prefix + '-' + hex + ')"';
  });
  return '<defs>' + [...paints.values()].join('') + '</defs>' + shapes;
}

function cardIllustration(option, fieldId, id) {
  const [detail, light] = illustrationDetails[fieldId][option.title];
  return `<svg class="example-art" viewBox="0 0 120 78" aria-hidden="true">
    <g fill="none" stroke="#34353b" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">
      ${paintedArt(option.art, id)}
      <path class="scene-detail" d="${detail}"/>
      <path class="scene-light" d="${light}"/>
    </g>
  </svg>`;
}

const toolArt = {
  graphics: '<path d="m7 31 14-22 15 23-15 9Z" fill="#e5b961"/><path d="m13 28 8-13 8 13-7-3-3 5Z" fill="#fff1cc"/><path d="m10 33 11 5m-6-4 4-2m-5-13 2-3" stroke="#9d683f"/><path d="m24 34 11-18 5 3-12 18-5 3Z" fill="#87aaa8"/><path d="m34 18 4 3m-12 13 5-8"/><path d="m8 14 2 3m1-5 1 1m23 24 2 2m4-8h2" stroke="#c28c49"/>',
  repair: '<path d="M12 9h17l5 5v22H12Z" fill="#dae6db"/><path d="M29 9v5h5m-17 2h8m-8 5h10m-10 5h6m-6 5h4" stroke="#647b6f"/><path d="m24 37 5-11c-2-6 2-10 7-9l-2 5 3 2 3-4c2 5-2 11-7 10l-5 9Z" fill="#dbac73"/><path d="m27 36 4-7m0-7 2-3m-17-7h4" stroke="#fff4d8"/>',
  variety: '<path d="m7 19 10-6 11 6v14l-11 6-10-6Z" fill="#eeb39b"/><path d="m7 19 10 6 11-6m-11 6v14"/><path d="m26 10 9-4 8 4-1 11-9 4-8-6Z" fill="#b7b3d1"/><path d="m26 10 8 5 9-5m-9 5-1 10"/><circle cx="13" cy="28" r="1"/><circle cx="22" cy="29" r="1"/><path d="m10 18 6-3m20-7 4 2m-19 27 4-3m6-4 2 4m4-7 3 2" stroke="#fff3db"/>',
  feedback: '<path d="M8 33h6V18H8Zm10 0h6V10h-6Zm10 0h6V21h-6Z" fill="#a7c6c9"/><path d="m30 13 2-5 2 5 5 2-5 2-2 5-2-5-5-2Z" fill="#efbf63"/><path d="M7 38q9-4 16 0t16 0"/><path d="M10 23v6m10-15v10m10 1v5" stroke="#f1fbff"/><path d="m40 9 2-2m-1 13 3 1M9 36h5" stroke="#bf8d4a"/>',
  cycle: '<path d="M9 26A15 15 0 0 1 34 12l4-4v13H25l5-5A9 9 0 0 0 16 26Z" fill="#bcacd4"/><path d="M39 25a15 15 0 0 1-25 12l-4 4V28h13l-5 5a9 9 0 0 0 14-8Z" fill="#f6d697"/><path d="M12 23q2-7 7-9m14 18q-3 5-8 5m11-25v5m-23 13h5" stroke="#fff2d6"/><circle cx="24" cy="25" r="2" fill="#d2a763"/>',
  balance: '<path d="M12 38h25m-15-4 2-22 3 22Z" fill="#c39768"/><path d="m5 18 34-7M10 18l-5 12h12l-7-12Zm25-5-6 12h13l-7-12Z" fill="#b7cedc"/><circle cx="24" cy="13" r="3" fill="#e5b86c"/><path d="M7 28h7m18-5h7m-17 14h7" stroke="#fff3d8"/><path d="m12 34 2 1m20-6 3-1" stroke="#8c764e"/>'
};

function toolIllustration(id) {
  return '<svg viewBox="0 0 48 48" aria-hidden="true"><g fill="none" stroke="#3d3c40" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + paintedArt(toolArt[id], 'tool-' + id) + '</g></svg>';
}
