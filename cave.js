'use strict';

(() => {
  const frame = document.querySelector('.cave-frame');
  if (!frame) return;

  function paints(side) {
    return `<defs>
      <linearGradient id="${side}-stone" x2="95%" y2="30%">
        <stop stop-color="#45504b"/><stop offset=".55" stop-color="#676e65"/><stop offset="1" stop-color="#8f9180"/>
      </linearGradient>
      <linearGradient id="${side}-face" x2="75%" y2="100%">
        <stop stop-color="#a1a48e"/><stop offset="1" stop-color="#606b62"/>
      </linearGradient>
      <linearGradient id="${side}-moss" x2="75%" y2="100%">
        <stop stop-color="#aeb578"/><stop offset=".55" stop-color="#7c9059"/><stop offset="1" stop-color="#556b49"/>
      </linearGradient>
      <linearGradient id="${side}-gem" x2="70%" y2="100%">
        <stop stop-color="#e0c3f5"/><stop offset=".56" stop-color="#ad81cf"/><stop offset="1" stop-color="#6f548c"/>
      </linearGradient>
      <radialGradient id="${side}-berry">
        <stop stop-color="#fff3ac"/><stop offset=".67" stop-color="#ffd275"/><stop offset="1" stop-color="#dc984e"/>
      </radialGradient>
      <radialGradient id="${side}-amber">
        <stop stop-color="#ffe4a3" stop-opacity=".85"/><stop offset=".54" stop-color="#f8c763" stop-opacity=".30"/><stop offset="1" stop-color="#f8c763" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="${side}-violet">
        <stop stop-color="#c59fdf" stop-opacity=".6"/><stop offset="1" stop-color="#c59fdf" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="${side}-glass" x2="80%" y2="100%">
        <stop stop-color="#fff1a7"/><stop offset=".66" stop-color="#ffc369"/><stop offset="1" stop-color="#d98347"/>
      </linearGradient>
      <pattern id="${side}-flecks" width="38" height="43" patternUnits="userSpaceOnUse">
        <path d="m3 9 2-2 2 1m19 4 2-1m-13 12 3 2m10 11 2-3m-24 4 2 1" fill="none" stroke="#e4d8ac" stroke-width="1" opacity=".22"/>
        <path d="m9 12 2 2 3-1m7 17 2 2m11-12 2 1m-29 3 1 1" fill="none" stroke="#262f2b" stroke-width="1.1" opacity=".25"/>
      </pattern>
    </defs>`;
  }

  function leaf(x, y, angle, scale = 1) {
    return `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})">
      <path d="M0 0C3-9 12-15 25-13 22-4 12 3 0 0Z" fill="currentColor" stroke="#4d6243" stroke-width=".8"/>
      <path d="M3-1 19-10m-9 4 1-4m3 2 4 .3" fill="none" stroke="#d4d7a4" stroke-opacity=".62" stroke-width=".85"/>
    </g>`;
  }

  function berry(side, x, y, scale = 1) {
    return `<g transform="translate(${x} ${y}) scale(${scale})">
      <circle r="13" fill="url(#${side}-amber)" opacity=".38"/>
      <path d="M-1-5q1-4 4-5" fill="none" stroke="#61764d" stroke-width="1.5"/>
      <path d="M-2-5C4-8 8-2 6 3 4 9-5 8-6 3-7-1-6-4-2-5Z" fill="url(#${side}-berry)" stroke="#aa7d48" stroke-width=".8"/>
      <path d="m-4-1 2-2 2 .2" fill="none" stroke="#fff5c8" stroke-linecap="round" stroke-width="1.4"/>
      <circle class="cave-glint" r="13" fill="url(#${side}-amber)" opacity="0"/>
    </g>`;
  }

  function vine(side, stem, leaves, fruit = []) {
    return `<g class="cave-vine" data-cave-sway="vine">
      <path d="${stem}" fill="none" stroke="#586b48" stroke-width="3.2" stroke-linecap="round"/>
      ${leaves.map((coords, index) => `<g color="${['#a8b470', '#829a63', '#b6bb7c', '#738d58'][index % 4]}">${leaf(...coords)}</g>`).join('')}
      ${fruit.map(coords => berry(side, ...coords)).join('')}
    </g>`;
  }

  function cluster(side, x, y, scale) {
    return `<g transform="translate(${x} ${y}) scale(${scale})">
      <ellipse cx="0" cy="-23" rx="56" ry="51" fill="url(#${side}-violet)" opacity=".48"/>
      <g stroke="#6b577f" stroke-width="1.25" stroke-linejoin="round">
        <path d="m-13 4-9-24 3-15 13 10L0 2Z" fill="url(#${side}-gem)"/>
        <path d="m-22-20 8 .8 8-5.8m-8 5.8L-5 3" fill="none" stroke="#c3a2de"/>
        <path d="M-6 3-8-35l13-27 13 24L12 3Z" fill="url(#${side}-gem)"/>
        <path d="m5-62 3 29 10-5L12 3H3L8-33" fill="#795da0" fill-opacity=".72"/>
        <path d="m-8-35 16 2-3-29M-3-38l5-12M1-30l1 20" fill="none" stroke="#ebccfa" stroke-opacity=".86"/>
        <path d="m10 5 10-28 15-12 5 17L27 6Z" fill="url(#${side}-gem)"/>
        <path d="m20-23 9 4 6-16m-6 16L20 3" fill="none" stroke="#ead1f4"/>
        <path d="m-18 8 6-8 11 5 10-4 9 3 7-2 8 8-20 6-24-2Z" fill="#737e66" stroke="#596552"/>
      </g>
      <g class="cave-glint" opacity="0" fill="#fff5ff">
        <path d="M7-55q1.5 9 8 10-6.5 1-8 10-1.5-9-8-10 6.5-1 8-10Z"/>
        <circle cx="26" cy="-26" r="1.9"/><circle cx="-15" cy="-24" r="1.4"/>
      </g>
    </g>`;
  }

  function lantern(side, x, y, scale) {
    return `<g transform="translate(${x} ${y}) scale(${scale})">
      <path d="M-12 0 9-2 13 6 5 11-11 7Z" fill="#6a6b60" stroke="#4a514b" stroke-width="1.8"/>
      <g class="cave-lantern" data-cave-sway="lantern">
        <circle cx="0" cy="93" r="61" fill="url(#${side}-amber)" opacity=".78" pointer-events="none"/>
        <path d="M0 2v14m0 4v13m0 4v13m0 4v12" fill="none" stroke="#a57f51" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M-3 9q0-5 3-5t3 5v8q0 5-3 5t-3-5Zm0 17q0-5 3-5t3 5v8q0 5-3 5t-3-5Zm0 17q0-5 3-5t3 5v8q0 5-3 5t-3-5Z" fill="none" stroke="#554f41" stroke-width="1.8"/>
        <path d="M-9 77v-6a9 9 0 0 1 18 0v6" fill="none" stroke="#454b46" stroke-width="3"/>
        <path d="M-24 82-16 73H16l8 9-5 5h-38Z" fill="#727268" stroke="#424942" stroke-width="1.8"/>
        <path d="M-19 87h38l-4 35h-30Z" fill="url(#${side}-glass)" stroke="#6b5947" stroke-width="1.8"/>
        <path d="m6 88 12 0-4 32H5Z" fill="#e3934e" opacity=".63"/>
        <path d="M-9 89v31m16-31-1 31" stroke="#72604b" stroke-width="2.1"/>
        <path d="m-14 91 2 16m3 5h4" fill="none" stroke="#fff3bd" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M-20 120h40v6l-7 4h-26l-7-4Z" fill="#565b52" stroke="#414641" stroke-width="1.8"/>
        <path d="M-17 82h33m-31 42h24" stroke="#aaa68a" stroke-width="1.3" stroke-linecap="round"/>
      </g>
    </g>`;
  }

  const cliffs = {
    left: {
      outline: 'M0 0H147l-8 30-28 14-8 30-34 25-8 35-26 20 7 47-20 33 11 40-12 70 27 47-13 58 22 42-9 54 28 44-14 54 27 36-9 43 41 38-11 32 29 28-8 38 21 32-16 31 18 42H0Z',
      faces: '<path d="m0 0h147l-8 30-32 19-27-4-36 26L0 77Zm0 158 35-4 7 47-20 33 11 40L0 261Zm0 191 22-5 26 47-13 58-35 22Zm0 164 57-22-9 54 28 44-21 27-55 12Zm0 174 62-44 27 36-9 43-39 13-41 19Zm0 93 121-20-11 32 29 28-8 38-49 14L0 852Z"/>',
      moss: 'M0 7Q28-9 57 9l27-7 25 14 29-8-4 17-28 14-10 21-14-6-13 20-20 1-11 17-20-9L0 101ZM0 322l18-6 9 14-4 20 15 23-19 5-10-12-9 9Zm0 321 20-9 13 8 13-12 19 13 15 22-11 9-19-9-14 22-17-1-19 17Zm0 166 32-19 21 11 18-10 33 9 22-3 10 18-19 13-15-6-14 22-25-3-22 12-17-11-24 11Z',
      seams: 'M2 91 25 80l13 11 24-19m-58 49 22-3 8-12m-27 144 15-8 6 6m-28 90 18 7m-14 66 11-6 16 11m-29 66 22-10 7 8m-27 90 25-9 23 10m-46 105 27-14 10 3m-49 95 39-16 17 10m-42 68 23-11 19 8m-54 57 23-10 18 8'
    },
    right: {
      outline: 'M0 0H156l-5 30-31 7-3 24-32 15-14 30-24 12 7 31-23 25 9 40-19 34 9 36-12 53 24 41-7 45 21 38-10 62 25 35-7 56 26 37-8 37 35 33-10 44 31 27-14 37 26 46-19 29 16 54H0Z',
      faces: '<path d="M0 0h156l-5 30-31 7-3 24-48 5-36 21L0 72Zm0 144 47-26 7 31-23 25 9 40-40 20Zm0 172 26-31-8 52 24 41-7 22-35 7Zm0 154 35-47 21 38-10 62-46 21Zm0 104 46-51 25 35-7 56-64 8Zm0 153 85-40 32 29-10 44-38 15-69 7Zm0 103 107-70 31 27-14 37-58 24-66 16Z"/>',
      moss: 'M0 6 23 3l19 11 34-7 29 10 44-10-5 18-27 9-9 20-15-4-18 17-21-3-12 19-18-9L0 89Zm0 279 17-14 10 10-9 19 7 24-13 9L0 322Zm0 284 18-6 14 10 19-17 14 9-4 31-24-1-19 19-18-3Zm0 238 27-21 24 6 27-14 21 15 26-7 8 16-23 12-15-3-22 17-28-3-25 16L0 836Z',
      seams: 'M1 82 22 78l13 13 22-14m-55 33 23-5 9-9m-28 107 12 5 9-11m-20 111 14-12m-19 74 17-7 12 6m-31 92 20-18 8 4m-21 96 23 10 10-5m-38 96 29-11 14 7m-44 87 27-12 18 11m-46 74 24-9 19 6m-46 68 42-14 20 9'
    }
  };

  function stone(side) {
    const {outline, faces, moss, seams} = cliffs[side];
    return `<path d="${outline}" fill="url(#${side}-stone)"/>
      <g fill="url(#${side}-face)" opacity=".69">${faces}</g>
      <path d="${seams}" fill="none" stroke="#46554c" stroke-opacity=".51" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="${moss}" fill="url(#${side}-moss)" stroke="#647650" stroke-width="1.35"/>
      <path d="${outline}" fill="url(#${side}-flecks)"/>`;
  }

  const left = 'left', right = 'right';
  const foliage = {
    left: vine(left, 'M85 22q6 29-3 52t1 52q6 19-4 52',
      [[87,38,53,.81],[85,54,154,.85],[81,72,48,.96],[79,89,158,1],[82,108,58,.93],[84,129,160,.8],[82,154,54,.72],[79,177,116,.58]], [[91,63,.85],[70,96],[95,135,.91],[78,166,.7]]) +
      vine(left, 'M37 39q6 25-1 45t2 39',
        [[37,50,157,.74],[39,65,41,.86],[36,82,157,.70],[35,96,60,.76],[38,117,131,.68]], [[49,79,.75],[27,103,.72]]) +
      vine(left, 'M12 325q18 20 16 49',
        [[16,333,166,.55],[22,345,48,.67],[27,361,150,.54],[28,374,117,.47]], [[17,354,.66]]) +
      vine(left, 'M68 833q-10-32-37-35m37 35q2-36 22-49',
        [[57,816,188,.84],[54,808,230,.93],[64,823,282,.82],[71,817,325,.91],[81,796,290,.98],[89,788,330,.7]]) +
      cluster(left, 78, 838, .93) + cluster(left, 25, 389, .47) + lantern(left, 63, 101, .84),
    right: vine(right, 'M107 20q11 28 3 56t-3 58q10 40-4 74',
      [[111,38,70,.85],[112,52,157,.96],[110,70,42,1.1],[106,95,148,1],[108,117,48,.89],[113,143,158,.98],[111,167,60,.76],[109,187,154,.8],[103,205,111,.65]], [[99,66,.89],[125,95,1],[103,132,.83],[119,160,.75],[104,198,.65]]) +
      vine(right, 'M48 23q-4 29 2 60t-10 56',
        [[48,39,164,.8],[46,54,47,.87],[48,75,157,.93],[50,94,58,.77],[45,119,154,.73],[40,138,121,.58]], [[58,68,.76],[40,107,.88]]) +
      vine(right, 'M30 569q6-19 28-27m-28 27q-4-16-16-23',
        [[27,561,210,.62],[20,552,233,.69],[36,555,333,.70],[53,547,312,.54]], [[36,555,.67]]) +
      cluster(right, 53, 617, .73) + cluster(right, 105, 795, 1.08) +
      vine(right, 'M75 848q-13-34-21-35m21 35q17-23 38-26',
        [[63,829,222,1],[58,817,207,.8],[59,821,277,.86],[74,843,299,.9],[87,833,349,.91],[103,825,324,.78]]) +
      lantern(right, 69, 117, .91)
  };

  for (const side of [left, right]) {
    frame.insertAdjacentHTML('beforeend', `<div class="cave-wall cave-wall--${side}"><svg viewBox="0 0 160 950" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">${paints(side)}${stone(side)}${foliage[side]}</svg></div>`);
  }

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const wide = matchMedia('(min-width: 64rem)');
  let sparkleTimer;
  let sparkle;
  let lastGlint;

  function scheduleGlint() {
    clearTimeout(sparkleTimer);
    if (reduced.matches || document.hidden || !wide.matches) {
      sparkle?.cancel();
      return;
    }
    sparkleTimer = window.setTimeout(() => {
      const candidates = [...frame.querySelectorAll('.cave-glint')].filter(glint => glint !== lastGlint);
      lastGlint = candidates[Math.floor(Math.random() * candidates.length)];
      sparkle = lastGlint.animate([
        {opacity:0}, {opacity:.76, offset:.39}, {opacity:.28, offset:.7}, {opacity:0}
      ], {duration:1050, easing:'ease-in-out'});
      scheduleGlint();
    }, 4200 + Math.random() * 8200);
  }

  for (const item of frame.querySelectorAll('[data-cave-sway]')) {
    item.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'mouse' || reduced.matches || item.getAnimations().length) return;
      const isLantern = item.dataset.caveSway === 'lantern';
      const direction = item.closest('.cave-wall--right') ? -1 : 1;
      const angles = isLantern ? [0, 9, -6, 3.2, -1.6, .7, 0] : [0, 3.7, -2.6, 1.3, -.5, 0];
      item.animate(angles.map(angle => ({transform:`rotate(${angle * direction}deg)`, easing:'ease-in-out'})), {
        duration:isLantern ? 1650 : 970
      });
    });
  }

  reduced.addEventListener('change', () => {
    if (reduced.matches) for (const animation of frame.getAnimations({subtree:true})) animation.cancel();
    scheduleGlint();
  });
  wide.addEventListener('change', scheduleGlint);
  document.addEventListener('visibilitychange', scheduleGlint);
  scheduleGlint();
})();
