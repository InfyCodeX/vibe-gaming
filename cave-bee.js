'use strict';

(() => {
  const frame = document.querySelector('.cave-frame');
  const layout = document.querySelector('.layout');
  const perches = frame?.querySelectorAll('[data-bee-perch]');
  if (!layout || !perches?.length) return;

  const wide = matchMedia('(min-width: 64rem)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const bee = document.createElement('div');
  bee.className = 'cave-bee';
  bee.hidden = true;
  bee.innerHTML = `<svg viewBox="0 0 40 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path class="cave-bee-wing cave-bee-wing--back" d="M25 14 29 5l7-1 1 4-5 5-6 3Z" fill="#c5e1d9" stroke="#799d96" stroke-width="1"/>
    <path class="cave-bee-wing" d="M17 16 15 7l5-5 6 1 2 4-4 8-5 3Z" fill="#edf6e9" stroke="#8da9a0" stroke-width="1"/>
    <path d="m22 14 10 5 1 9-9 5-11-3-3-9Z" fill="#e69f4b" stroke="#5d4838" stroke-linejoin="round" stroke-width="1.3"/>
    <path d="m20 15 7 3 2 12-4 2-3-12Zm8 3 4 2 1 8-3 2Z" fill="#584438"/>
    <path d="m8 18 7-4 7 2 2 8-4 6-10-1-4-5Z" fill="#ffd675" stroke="#634936" stroke-linejoin="round" stroke-width="1.3"/>
    <path d="m7 20 7-4 7 2m4 6 4-2" fill="none" stroke="#ffe8a4" stroke-linecap="round" stroke-width="1.25"/>
    <path d="m10 17-2-4-2 .2m9 2 .3-5 2-1m-2 21-1 3m6-2 1 3m6-3 2 2" fill="none" stroke="#584438" stroke-linecap="round" stroke-width="1.45"/>
    <path d="M8.8 22h2.5v4H9Zm8-.5h2.6v4h-2.6Z" fill="#393944"/>
    <path d="m12 27 3 .3 1-1" fill="none" stroke="#905a3f" stroke-linecap="round"/>
  </svg>`;
  frame.append(bee);

  const radius = 15;
  let timer = 0;
  let animation = 0;
  let visit = null;
  let previousPerch;

  const canVisit = () => wide.matches && !reduced.matches && !document.hidden;
  const cap = (value, min, max) => Math.max(min, Math.min(max, value));
  const choose = list => list[Math.floor(Math.random() * list.length)];
  const range = (start, end) => start + Math.random() * (end - start);

  function schedule() {
    clearTimeout(timer);
    if (canVisit()) timer = window.setTimeout(land, range(120000, 270000));
  }

  function reset() {
    cancelAnimationFrame(animation);
    visit = null;
    bee.hidden = true;
    bee.classList.remove('cave-bee--rest');
    schedule();
  }

  function perchPoint() {
    const matrix = visit.perch.getScreenCTM();
    return {
      x: cap(matrix.e - visit.frame.left, visit.min, visit.max),
      y: matrix.f - visit.frame.top - 13
    };
  }

  function entrance() {
    const {edge, frame:bounds, min, max} = visit;
    switch (Math.floor(Math.random() * 3)) {
      case 0: return {x:range(min,max),y:-radius*2};
      case 1: return {x:range(min,max),y:bounds.height+radius*2};
      default: return {x:edge,y:range(bounds.height*.12,bounds.height*.87)};
    }
  }

  function place(point) {
    const x = visit.edge < 0 ? Math.min(point.x, visit.max) : Math.max(point.x, visit.min);
    const previousX = visit.position?.x;
    if (previousX !== undefined && Math.abs(x - previousX) > .3) {
      bee.style.setProperty('--bee-facing', x > previousX ? '-1' : '1');
    }
    bee.style.transform = `translate(${x-radius}px, ${point.y-13}px)`;
    visit.position = {x, y:point.y};
  }

  function fly(from, to, phase, duration, now) {
    const {min,max} = visit;
    visit.flight = {
      from, to, phase, duration, start:now,
      bend:range(min,max), wave:range(13,28) * (Math.random() < .5 ? 1 : -1)
    };
  }

  function leave(now) {
    bee.classList.remove('cave-bee--rest');
    let destination = entrance();
    if (Math.hypot(destination.x - visit.position.x, destination.y - visit.position.y) < 70) {
      destination = {x:visit.edge,y:visit.position.y + (visit.position.y < visit.frame.height/2 ? 80 : -80)};
    }
    fly(visit.position, destination, 'departing', range(1000,1900), now);
  }

  function tick(now) {
    if (!visit || !canVisit()) {
      reset();
      return;
    }
    if (visit.restUntil !== null) {
      place(perchPoint());
      if (now >= visit.restUntil) {
        visit.restUntil = null;
        leave(now);
      }
    } else {
      const {from,to,phase,duration,start,bend,wave} = visit.flight;
      const progress = cap((now-start)/duration,0,1);
      const t = phase === 'departing' ? progress*progress : 1 - (1-progress)**1.35;
      const drift = Math.sin(t*Math.PI);
      place({
        x:from.x*(1-t) + to.x*t + drift*(bend-(from.x+to.x)/2)*.55,
        y:from.y*(1-t) + to.y*t + drift*wave
      });
      if (progress === 1) {
        if (phase === 'departing') {
          reset();
          return;
        }
        place(perchPoint());
        bee.classList.add('cave-bee--rest');
        visit.restUntil = now + range(2100,3900);
      }
    }
    animation = requestAnimationFrame(tick);
  }

  function land() {
    if (!canVisit()) return;
    const perch = choose([...perches].filter(item => item !== previousPerch));
    previousPerch = perch;
    const frameBounds = frame.getBoundingClientRect();
    const layoutBounds = layout.getBoundingClientRect();
    const wall = perch.closest('.cave-wall');
    const left = wall.classList.contains('cave-wall--left');
    const width = wall.getBoundingClientRect().width;
    const innerEdge = left
      ? Math.min(width, layoutBounds.left - frameBounds.left)
      : Math.max(frameBounds.width - width, layoutBounds.right - frameBounds.left);
    visit = {
      perch, frame:frameBounds, restUntil:null, position:null,
      min:left ? radius : innerEdge+radius,
      max:left ? innerEdge-radius : frameBounds.width-radius,
      edge:left ? -radius*2 : frameBounds.width+radius*2
    };
    const from = entrance();
    const to = perchPoint();
    place(from);
    bee.hidden = false;
    fly(from,to,'arriving',range(1550,2600),performance.now());
    animation = requestAnimationFrame(tick);
  }

  bee.addEventListener('click', event => {
    if (event.button !== 0 || event.pointerType === 'touch' || visit?.restUntil == null) return;
    visit.restUntil = null;
    leave(performance.now());
  });
  document.addEventListener('visibilitychange', reset);
  reduced.addEventListener('change', reset);
  wide.addEventListener('change', reset);
  window.addEventListener('resize', () => { if (visit) reset(); });
  schedule();
})();
