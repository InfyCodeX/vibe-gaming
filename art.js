'use strict';

const lineIcons = {
  cast: '<path d="m3 6 4 2 4-2v5a4 4 0 0 1-8 0Zm11 4 3-2 4 2v3a3.5 3.5 0 0 1-7 0ZM2 20c0-5 9-6 11-1m1 1c1-3 6-4 8-1"/>',
  extras: '<path d="M3 10h18v4H3zm2 4v7h14v-7m-7-4v11m0-11c-9 1-8-8-3-6 2 1 3 4 3 6Zm0 0c8 0 9-6 5-6-3 0-4 4-5 6Z"/>',
  tools: '<path d="M3 7h7m5 0h6M3 17h2m5 0h11"/><circle cx="12.5" cy="7" r="2.5"/><circle cx="7.5" cy="17" r="2.5"/>',
  genre: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>',
  idea: '<path d="M9 18h6m-5 3h4m-5-6c0-2-3-3-3-6a6 6 0 1 1 12 0c0 3-3 4-3 6Z"/>',
  world: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Zm6-3v15m6-12v15"/>',
  moves: '<path d="M7.5 7h9c2.5 0 4 2 4.5 4l1 5c.5 3-2 4-4 2l-2-2H8l-2 2c-2 2-4.5 1-4-2l1-5c.5-2 2-4 4.5-4Z"/><path d="M8 10v5m-2.5-2.5h5m5 0h.01m3-2h.01"/>',
  challenge: '<path d="M12 2 3 6v5c0 6 4 9 9 11 5-2 9-5 9-11V6Z"/><path d="M12 7v5m0 4h.01"/>',
  progress: '<path d="M3 21h18M5 17v-5h4v5m1 0V8h4v9m1 0V3h4v14"/>',
  ending: '<path d="M5 22V3m0 1c5-5 9 5 15 0v12c-6 5-10-5-15 0"/>',
  visual: '<path d="M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1.5-3.3 1.7 1.7 0 0 1 1.3-2.7H18a3 3 0 0 0 3-3 9 9 0 0 0-9-9Z"/><path d="M7.5 11h.01M10 7.5h.01m4.5 0h.01M17.5 11h.01"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  spark: '<path d="M11 3c0 5-3 8-8 8 5 0 8 3 8 8 0-5 3-8 8-8-5 0-8-3-8-8Zm7 14v5m-2.5-2.5h5M19 3v4m-2-2h4"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>',
  copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2"/>',
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

function cardIllustration(art, id) {
  return '<svg class="example-art" viewBox="0 0 120 78" aria-hidden="true"><g fill="none" stroke="#34353b" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">' + paintedArt(art, id) + '</g></svg>';
}

const toolArt = {
  graphics: '<path d="m7 31 14-22 15 23-15 9Z" fill="#e5b961"/><path d="m13 28 8-13 8 13-7-3-3 5Z" fill="#fff1cc"/><path d="m24 34 11-18 5 3-12 18-5 3Z" fill="#87aaa8"/><path d="m34 18 4 3"/>',
  repair: '<path d="M12 9h17l5 5v22H12Z" fill="#dae6db"/><path d="M17 16h8m-8 5h10m-10 5h6"/><path d="m24 37 5-11c-2-6 2-10 7-9l-2 5 3 2 3-4c2 5-2 11-7 10l-5 9Z" fill="#dbac73"/>',
  variety: '<path d="m7 19 10-6 11 6v14l-11 6-10-6Z" fill="#eeb39b"/><path d="m7 19 10 6 11-6m-11 6v14"/><path d="m26 10 9-4 8 4-1 11-9 4-8-6Z" fill="#b7b3d1"/><path d="m26 10 8 5 9-5m-9 5-1 10"/><circle cx="13" cy="28" r="1"/><circle cx="22" cy="29" r="1"/>',
  feedback: '<path d="M8 33h6V18H8Zm10 0h6V10h-6Zm10 0h6V21h-6Z" fill="#a7c6c9"/><path d="m30 13 2-5 2 5 5 2-5 2-2 5-2-5-5-2Z" fill="#efbf63"/><path d="M7 38q9-4 16 0t16 0"/>',
  cycle: '<path d="M9 26A15 15 0 0 1 34 12l4-4v13H25l5-5A9 9 0 0 0 16 26Z" fill="#bcacd4"/><path d="M39 25a15 15 0 0 1-25 12l-4 4V28h13l-5 5a9 9 0 0 0 14-8Z" fill="#f6d697"/>',
  balance: '<path d="M12 38h25m-15-4 2-22 3 22Z" fill="#c39768"/><path d="m5 18 34-7M10 18l-5 12h12l-7-12Zm25-5-6 12h13l-7-12Z" fill="#b7cedc"/><circle cx="24" cy="13" r="3" fill="#e5b86c"/>'
};

function toolIllustration(id) {
  return '<svg viewBox="0 0 48 48" aria-hidden="true"><g fill="none" stroke="#3d3c40" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + paintedArt(toolArt[id], 'tool-' + id) + '</g></svg>';
}
