'use strict';

// The illustrations use the same scale, ink and lighting so each subject reads at card size.
const galleryA = (() => {
  const ink = '#34353b', ivory = '#fff1d1', gold = '#f6c369', amber = '#cc8c45';
  const red = '#e38e75', rose = '#efb2a5', blue = '#8ebbcf', navy = '#607e99';
  const sage = '#b7c994', leaf = '#80a37e', lilac = '#baadd6', steel = '#aeb2bc';
  const path = (d, fill = 'none', stroke = ink) => `<path d="${d}" fill="${fill}" stroke="${stroke}"/>`;
  const box = (x, y, w, h, rx, fill) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`;
  const dot = (x, y, r, fill, stroke = ink) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}"/>`;
  const oval = (x, y, rx, ry, fill, stroke = ink) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}"/>`;
  const shine = (d) => path(d, 'none', ivory);
  const star = (x,y,r=5) => `<g transform="translate(${x} ${y}) scale(${r/5})">${path('M0-5 1.6-1.5 5 0 1.5 1.5 0 5-1.5 1.5-5 0-1.5-1.5Z', gold)}</g>`;
  const part = (name, art) => `<g class="${name}" style="transform-box:fill-box;transform-origin:center">${art}</g>`;
  const item = (title, tip, value, art, motion) => {
    const option = { title, tip, value, art };
    if (motion) option.motion = motion;
    return option;
  };
  function move(name, duration, transforms, beats) {
    const frames = transforms.map((transform, index) => beats ? {transform, offset: beats[index]} : {transform});
    return {selector: '.' + name, duration, frames, easing: beats ? 'linear' : 'ease-in-out'};
  }

  const puzzleFit = 'M55 20h27v40H55V42c14 2 14-8 0-10Z';
  const mazeRoute = 'M30 54V24h19v16h17V24h20v30';
  const matchFade = (selector, frames) => ({selector, duration:1360, frames});
  const matchedTokens = [{opacity:1}, {offset:.56,opacity:1}, {offset:.66,opacity:1,transform:'scale(1.13)'}, {offset:.79,opacity:0,transform:'scale(.42)'}, {opacity:0,transform:'scale(.42)'}];

  const genre = [
    item('Платформер', 'Расстояние между островками подсказывает, когда прыгать.', 'Платформер с видом сбоку. Герой преодолевает пропасти и добирается до выхода.',
      path('M10 59h37l-4 11H18Z',amber)+path('M9 57q7-5 13-2t13 0q8-4 13 1v5H9Z',sage)+path('M78 44h32l-5 11H82Z',amber)+path('M77 42q9-6 16-2t17-1v6H77Z',sage)+path('M19 65h6m4 2h7m50-17h5m5 2h5','none','#986645')+star(74,24)+
      part('hopper',path('M36 53q-10 3-13-5-2-4 2-6 3 4 5 5l8 1Z',amber)+
        path('M33 53q-1-8 6-14l-2-10 8 5 8-5 1 9q6 4 5 9-1 6-9 7l1 2H36Z',gold)+
        path('m40 32 4 3-3 2Zm11 1v4l-3-2Z',rose)+path('M45 51q1-7 8-8 6-1 4 6-3 3-8 3Z',ivory)+
        dot(50,41,1.7,ink)+path('m56 44 2 0-1 1m-1 3 4 1m-4 1 3 2M42 38l2 3m-7 6 3 2m4 5v2','none','#925837')),
      [move('hopper',1030,['translate(0,0)','translate(0,1px) scale(1.05,.94)','translate(16px,-17px) rotate(-5deg)','translate(31px,-22px)','translate(46px,-14px) scale(1.07,.91)','translate(46px,-14px)'],[0,.13,.34,.5,.75,1])]),
    item('Головоломка', 'Заметь закономерность и придумай ход, который изменит поле.', 'Головоломка с узорами. Игрок изучает расположение деталей и подбирает верный ход.',
      box(19,16,69,50,5,steel)+box(24,20,58,40,2,'#ede5d4')+
      path('M24 20h31v12c14 2 14 12 0 10v18H24Z',sage)+
      path('M29 52q7-13 12-10l11 12','none','#63805e')+shine('M28 25h12m-12 3v7')+
      `<path d="${puzzleFit}" fill="none" stroke="#ad805f" stroke-dasharray="2 3"/>`+
      part('tile',`<g transform="translate(16 -7)">${path(puzzleFit,red)}${shine('M59 24h18m2 3v10')}${dot(70,32,4,'#ffe9a7')}${path('m61 55 8-11 8 11','none','#a95845')}</g>`),
      [move('tile',1150,['translate(0,0)','translate(-3px,-3px) rotate(7deg)','translate(-12px,4px) rotate(2deg)','translate(-16px,7px)','translate(-16px,7px)'],[0,.22,.52,.76,1])]),
    item('Гонки', 'Выбирай траекторию, чтобы пройти поворот быстрее.', 'Аркадные гонки с поворотами, контрольными воротами и честным сравнением времени.',
      path('M9 63h94m-83 5h17m43 0h22','none',navy)+part('racer',path('m24 48 11-3 13-15h24l12 16 12 4 1 10H23Z',red)+path('m43 44 9-10h17l8 10Z',blue)+path('M60 34v10m3 5h6')+path('m47 40 7-5m9 2 4-2','none','#cbeced')+path('M24 50h6v4h-7Zm64 0 7 1v4h-7Z',ivory)+path('M50 56h18','none','#a95845')+dot(40,59,8,ink)+dot(40,59,3,ivory)+dot(80,59,8,ink)+dot(80,59,3,ivory))+path('M13 39h12m-7 6h7','none',amber),
      [move('racer',920,['translateX(0)','translateX(-8px) rotate(-2deg)','translateX(5px) rotate(-2deg)','translateX(14px) rotate(1.5deg)','translateX(14px) rotate(0deg)'],[0,.24,.4,.63,1])]),
    item('Приключение', 'Загляни в новую область и найди подсказку для пути дальше.', 'Приключение с исследованием мира, тайниками и небольшими заданиями.',
      path('m14 22 22-7 24 8 22-7 5 37-22 10-24-8-22 7Z',ivory)+
      path('m36 17 5 38 24 8-5-40Z','#ebd8ad','none')+path('m36 16 5 39m19-32 5 39','none',amber)+
      path('m21 38 7-10 6 9m11 2 6-9 6 9m-29 12 4-1m18-29 6 2','none',leaf)+
      '<path d="M25 51q10-11 21-6t17-3l11-15" fill="none" stroke="#688799" stroke-width="1.5" stroke-dasharray="2 2"/>'+
      path('m71 26 6 4m0-4-6 4','none','#b55e4f')+dot(85,48,18,amber)+dot(85,47,15,gold)+dot(85,47,11.5,'#c7e0d9')+
      path('M85 37v2m10 8h-2m-8 10v-2m-10-8h2','none','#535a68')+
      part('north',path('m85 38 3 9-3 9-3-9Z',ivory)+path('m85 38 3 9h-6Z',red)),
      [move('north',1040,['rotate(-36deg)','rotate(35deg)','rotate(-15deg)','rotate(6deg)','rotate(0)'])]),
    item('Ритм-игра', 'Нажимай в нужную долю, когда нота пересекает отметку.', 'Музыкальная ритм-игра. Ноты движутся к линии такта, а точное нажатие даёт очки.',
      box(14,32,89,29,6,'#e4e6f4')+path('M20 40h77m-77 7h77m-77 7h77','none','#929ab3')+
      box(28,28,8,37,3,gold)+shine('M31 33v24')+
      part('notes',oval(57,49,7,4.7,navy)+oval(77,44,7,4.7,navy)+
        path('M62 48V25l20-5v24','none',navy)+path('M62 25l20-5v5l-20 5Z',blue)+shine('m55 48 3-1m17-4 3-1'))+star(95,21,3),
      [move('notes',1020,['translateX(7px)','translateX(-7px)','translateX(-23px) scale(1)','translateX(-23px) scale(1.12)','translateX(-23px) scale(1)'],[0,.33,.68,.78,1])]),
    item('Стратегия', 'Расставь отряд и подумай, что может сделать соперник в ответ.', 'Пошаговая стратегия на клетках. Игрок располагает отряд и планирует несколько ходов вперёд.',
      path('m16 44 43-22 45 22v6L60 72 16 50Z',amber)+path('m16 44 43-22 45 22-44 22Z',ivory)+
      path('M16 44l11-5.5L38 44l-11 5.5Zm22 0 11-5.5L60 44l-11 5.5Zm22 0 11-5.5L82 44l-11 5.5Zm22 0 11-5.5L104 44l-11 5.5ZM38 33l11-5.5L60 33l-11 5.5Zm22 0 11-5.5L82 33l-11 5.5ZM38 55l11-5.5L60 55l-11 5.5Zm22 0 11-5.5L82 55l-11 5.5Z',sage,'#8d8469')+
      path('M63 40h20v4q-10 5-20 0Zm4 0 2-10-3-4v-8h4v3h3v-3h4v3h3v-3h3v8l-4 4 2 10Z',steel)+
      path('M68 28q6 3 12 0m-9 4-1 6','none','#eef0e5')+
      part('pawn',oval(39,53,8,3.8,amber)+path('M33 52q4-3 4-10h4q0 7 4 10Z',gold)+dot(39,39,4.5,gold)+shine('m37 39 1-2')),
      [move('pawn',1050,['translate(0,0)','translate(0,-7px)','translate(15px,-14px)','translate(15px,-7px)','translate(15px,-7px)'])]),
    item('Симулятор', 'Ухаживай за маленькой системой и наблюдай, как она меняется.', 'Уютный симулятор теплицы. Игрок выращивает растения, следит за водой и постепенно расширяет сад.',
      path('M27 61V32l28-17 29 18v28Z',blue)+path('M34 58V35l21-12 22 13v22Z',ivory)+path('M55 24v30m-19-13h39','none',steel)+path('M29 54h55v8H29Z',amber)+part('sprout',path('M54 53V40m0 7c-11 1-13-6-14-10 10-1 14 4 14 10Zm0-5c1-7 7-11 15-11-1 8-6 12-15 11Z',leaf)),
      [move('sprout',1000,['scale(.65) translateY(4px)','scale(.95) rotate(-5deg)','scale(1.14) rotate(4deg)','scale(1.05)'])]),
    item('Раннер', 'Герой бежит сам. Твоя задача — вовремя уклоняться и прыгать.', 'Раннер с автоматическим бегом. Игрок меняет дорожку и перепрыгивает заранее видимые препятствия.',
      path('M14 59h90l-4 8H18Z','#9dabba')+path('M15 60h89m-76 3h12m15 0h12m15 0h12','none','#f8ead2')+
      path('m85 56 6-20h7l5 20Z',amber)+path('M89 46h11m-17 10h21','none',red)+
      part('runner',path('m45 41-11 7-8 8 4 3 11-8 12-4Z',navy)+path('m47 43 11 5-4 9 7 2 4-13-13-9Z',blue)+
        path('m45 42 5-14 11 2-6 15Z',leaf)+path('m48 33-9 5-4-3m18-3 7 5 6-4','none','#536d60')+
        dot(57,22,6.6,rose)+path('M50 22q0-9 9-8l7 5-5 1-7-1-1 4Z',red)+dot(61,23,.95,ink)+shine('m51 32 4-1'))+
      path('M18 31h11m-14 8h10m-7 8h6','none',navy),
      [move('runner',930,['translate(0,0)','translate(5px,-3px) rotate(4deg)','translate(10px,1px) rotate(0deg)','translate(16px,-5px) rotate(-4deg)','translate(21px,0)'],[0,.22,.46,.74,1])]),
    item('Детектив', 'Сопоставь улики и проверь, какая версия объясняет их все.', 'Детективная игра с поиском улик и выбором версии событий по собранным фактам.',
      path('m23 22 32-5 8 42-33 6Z',ivory)+path('m30 31 15-2m-14 8 14-2m-13 8 9-1','none',navy)+oval(63,42,6,10,steel)+dot(68,29,3,steel)+part('lens',path('m81 46 13 12-5 6-13-14Z',amber)+dot(69,38,15,gold)+dot(69,38,11,'#b8dbe0')+shine('M61 37q0-6 6-7')),
      [move('lens',1250,['translate(9px,2px)','translate(-8px,-5px)','translate(-13px,5px)','translate(-5px,4px)','translate(-5px,4px)'])]),
    item('Сад-песочница', 'Строй и пробуй сочетания предметов в своём темпе.', 'Творческая песочница. Игрок строит собственный сад, свободно меняет дорожки, пруды и украшения.',
      path('m13 48 31-16 59 10-30 25Z',amber)+path('m13 44 32-16 59 10-31 25Z',sage)+oval(51,44,12,5,blue)+path('m82 38 2-20 7 1-2 20Z',amber)+dot(87,17,9,leaf)+part('house',path('M50 30v-9l11-5 12 5v10l-11 6Z',ivory)+path('m47 22 13-13 16 11-13 8Z',red)+path('m63 28 5-2v7l-5 2Z',navy)),
      [move('house',900,['translateY(-7px) rotate(-6deg)','translateY(6px) rotate(0deg)','translateY(2px)','translateY(4px)'])]),
    item('Спорт', 'Освой подачу, направление и силу удара.', 'Спортивная аркада. Игрок отбивает мяч через сетку и разыгрывает короткие партии.',
      path('m16 49 39-21 49 15-40 23-48-13Z',navy)+path('m16 49 39-21 49 15-40 20Z',sage)+
      path('m22 49 34-18 42 12-34 17Zm20-10 41 12','none',ivory)+
      path('m42 40 1-12 42 11-1 13ZM42 28v13m43-3v15','#d7ecdf',navy)+
      path('m47 30-1 11m6-10-1 11m6-10-1 12m6-10-1 11m6-10-1 11m6-10-1 12m6-11-1 12M43 32l41 11m-42-7 42 11','none','#769d97')+
      path('M92 48l-4 13 4 1 5-13Z',amber)+oval(96,43,9,11,red)+path('M91 41q3-5 7-5','none','#ffd9bc')+
      part('ball',dot(36,36,5,gold)+shine('m35 34 1-1')),
      [move('ball',1070,['translate(0,0)','translate(14px,-14px)','translate(28px,-17px)','translate(49px,-4px)','translate(55px,4px)'],[0,.25,.48,.73,1])]),
    item('Лабиринт', 'Ищи развилки, запоминай путь и находи выход.', 'Лабиринт с видом сверху. Игрок ориентируется по приметам и ищет путь к выходу.',
      box(18,12,80,54,5,steel)+box(22,16,72,46,3,ivory)+
      `<path d="${mazeRoute}" fill="none" stroke="#b89964" stroke-opacity=".46" stroke-width="1" stroke-dasharray="1 3" stroke-linecap="round"/>`+
      path('M39 32v30M57 16v16m0 16v14M74 32v23M39 48h11m7 4h9m8-7h5m-57-4h3','none',navy)+
      `<path class="mazeRoute" d="${mazeRoute}" fill="none" stroke="#5b937f" stroke-width="2.1" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/>`+
      star(86,54,4)+part('bead',dot(30,54,4.2,red)+dot(29,53,1.1,ivory,'none')),
      [move('bead',1740,['translate(0,0)','translate(0,-30px)','translate(19px,-30px)','translate(19px,-14px)','translate(36px,-14px)','translate(36px,-30px)','translate(56px,-30px)','translate(56px,0)','translate(56px,0)'],[0,.182,.298,.395,.499,.596,.718,.90,1]),
        {selector:'.mazeRoute', duration:1740, easing:'linear', frames:[{strokeDashoffset:'100'}, {offset:.90,strokeDashoffset:'0'}, {strokeDashoffset:'0'}]}])
  ];


  const name = [
    item('КосмоКот', 'Два слова сразу подсказывают героя и место действия.', 'КосмоКот',
      oval(60,58,22,8,navy)+dot(60,37,24,blue)+path('M44 42v-15l9 6q7-3 14 0l9-6v16q-2 12-16 12T44 42Z',gold)+path('m49 41 4 1m14 0 4-1m-15 6 4 2 4-2')+shine('M43 29q3-9 14-11')+star(94,24,4)),
    item('Огни маяка', 'Маяк обещает загадку о сигнале, который видно издалека.', 'Огни маяка',
      path('M18 61q24-9 43-1t41 0','none',navy)+path('m46 58 5-30h17l6 30Z',ivory)+path('m49 39 20-5 2 8-23 6Z',red)+box(50,20,19,10,2,gold)+path('m47 20 13-9 13 9Zm3 38h25',navy)+path('m72 21 27-8-3 17-24-3Z','#f8d98e',amber)),
    item('Турбо-улитки', 'Забавное сочетание медленной улитки и большой скорости.', 'Турбо-улитки',
      path('M23 56q9-5 23-2 12 2 21-6l8-11 12-1q10 0 9 7-2 14-21 17-24 4-53 0Z',sage)+path('m81 39 1-11m7 10 5-11')+dot(82,26,3,ivory)+dot(95,26,3,ivory)+dot(52,44,17,red)+path('M42 47q-3-12 8-14 12-2 13 10 1 8-7 9-9 1-9-6 0-5 6-5 4 0 4 4','none',amber)+path('M16 36h14m-19 7h16m-11 7h9','none',navy)),
    item('Часовой чердак', 'В имени слышен тихий ход шестерёнок.', 'Часовой чердак',
      path('M20 39 57 13l42 24-6 5-35-21-32 24Z',amber)+path('M32 41v19h52V38',ivory)+dot(59,45,14,gold)+dot(59,45,10,ivory)+path('M59 37v9l7 4m-29 2h7m35-6h-4')+dot(59,45,2,ink)),
    item('Почта облаков', 'Короткое имя подойдёт истории про летающих почтальонов.', 'Почта облаков',
      path('M32 49q-18-2-13-14 3-7 11-7 4-12 16-9 9 3 10 12 13-3 17 7t-10 12Z',ivory)+path('m51 39 35-8 7 26-36 9Z',gold)+path('m52 40 20 10 14-17m-29 31 12-17m11 0 11 8')+path('m83 23 12-6m-8 12 14-4','none',blue)),
    item('Сырный рейс', 'Название превращает доставку обычного сыра в экспедицию.', 'Сырный рейс',
      oval(59,64,43,3,'#bca992','none')+path('M22 51h72v7H22Z',navy)+
      box(22,25,48,29,4,lilac)+path('M70 34h12l12 12v8H70Z',red)+path('M74 37h7l8 9H74Z',blue)+
      path('M27 29h36M74 49h5','none',ivory)+box(91,48,5,4,1,gold)+box(20,49,4,4,1,red)+
      dot(36,56,8,ink)+dot(36,56,3.3,steel)+dot(79,56,8,ink)+dot(79,56,3.3,steel)+
      path('M33 42l13-10 13 4v10H33Z',gold)+path('m33 42 13-4 13-2','none',amber)+dot(44,43,1.4,amber,'none')+dot(52,41,1.7,amber,'none')),
    item('Лунный сад', 'Слова настраивают на тихое приключение среди необычных растений.', 'Лунный сад',
      path('M60 14c-15 6-20 26-7 37 8 7 19 7 28 1-15 20-43 13-47-9-3-15 7-27 26-29Z',gold)+path('M68 58V40m0 11c-8-1-13-6-12-10 7 0 12 3 12 10Zm0-7c0-8 7-12 14-13-1 7-6 13-14 13Z',sage)+star(80,19)+star(97,38,3)),
    item('Кнопка «Бульк»', 'Звук в названии помогает запомнить игру с первого раза.', 'Кнопка «Бульк»',
      oval(60,54,31,10,steel)+path('M35 47v9q24 12 50-1v-9Z',navy)+oval(60,45,25,9,blue)+path('M43 44v-6q17-13 34 0v6q-17 10-34 0Z',red)+oval(60,37,17,6,rose)+dot(39,23,4,blue)+dot(76,19,6,blue)+shine('M74 17h2')),
    item('Искры депо', 'Два коротких слова рисуют мир поездов и мастерских.', 'Искры депо',
      path('M18 61h84m-75 5 6-9m15 9 6-9m15 9 6-9m14 9 6-9','none',navy)+box(36,32,41,20,4,red)+box(63,20,17,19,2,amber)+box(66,23,11,10,1,blue)+path('m42 32-2-10h11l-2 10Zm-6 17-8 6h9',steel)+dot(44,53,6,ink)+dot(68,53,6,ink)+star(33,18,4)+star(55,15,3)),
    item('Карта ветров', 'Название обещает путешествие и даёт важный предмет для сюжета.', 'Карта ветров',
      path('M20 30l21-9 18 5 19-7 12 35-20 10-19-6-21 8Z','#ffe4aa')+
      path('M41 21l18 5 11 38-19-6Z','#e7bb76','none')+path('M41 21l10 37m8-32 11 38','none',amber)+
      path('m27 36 8-6 10 5 9-2 7 7-10 6-10-2-9 5Z',sage,'none')+
      path('M35 55q6-10 15-6t17 2l10-7','none',navy)+dot(35,55,2,red)+star(77,44,3)+
      path('M71 30h23c13 0 12-13 4-13-3 0-5 2-5 4M83 36h18c10 0 9 10 3 10-2 0-3-1-4-3','none',navy)+
      path('M73 33h14m-52 29 10-4','none',ivory))
  ];

  const plot = [
    item('Дорога домой', 'Что герой потерял и что будет означать возвращение?', 'После бури герой находит сломанную лодку. Он обходит остров, собирает детали и возвращается домой.',
      path('M18 52q12 4 22 1t26 0 24-1l-9 10H31Z',amber)+path('M54 51V16l-22 29h22m4-25 17 24H58Z',ivory)+path('M18 66q8-5 16 0t16 0 16 0 16 0 16 0','none',blue)),
    item('Пропавший свет', 'Первая поломка превращается в задачу для игрока.', 'Огни в городе погасли. Герой находит три осколка светового кристалла и запускает фонари по очереди.',
      path('M36 60h29m-23-1V27h13v32m-18-31 10-10 12 10Z',steel)+path('m42 29 3 15h8l4-15Z',gold)+path('m73 40 7-15 8 12-7 12Zm10 12 8-10 5 8-6 7Z',blue)+star(31,32,4)),
    item('Большой заезд', 'Придумай причину для гонки и понятный момент финиша.', 'Герой участвует в большом заезде. Два соперника проходят несколько трасс, а победу решает суммарное время.',
      path('M17 64h89m-78-7h54','none',steel)+path('m18 42 7-2 7-9h14l8 9 8 3v7H18Z',blue)+path('m31 39 5-5h9l5 5Z',ivory)+dot(29,50,5,ink)+dot(51,50,5,ink)+path('m45 52 9-3 8-10h16l8 11 7 2v7H45Z',red)+path('m61 49 5-7h10l6 7Z',ivory)+dot(58,58,5,ink)+dot(80,58,5,ink)+path('M94 40V15l12 2-3 9-9-2',gold)),
    item('Последнее письмо', 'Кому адресовано письмо и почему оно должно прийти вовремя?', 'До праздника осталось одно недоставленное письмо. По рисунку на конверте герой ищет дом адресата.',
      path('m25 32 44-9 7 31-45 9Z',ivory)+path('m26 33 26 12 16-20m-37 37 14-20m14-1 17 12')+dot(51,44,5,red)+path('M81 60V32l16-3v11l-16 3',amber)+path('m84 36 7-1','none',ivory)),
    item('Сбежавшие ноты', 'Собранные части складываются в мелодию, которую можно услышать.', 'Уличный оркестр потерял ноты. В каждом квартале игрок возвращает один музыкальный фрагмент для общего концерта.',
      path('M18 45l32-2 13 8-5 13-38 2 4-10Z',ivory)+path('M50 43l1 9 12-1','none',amber)+
      path('M27 52l19-1m-20 5 21-1m-23 5 22-1','none',navy)+
      path('M38 52v6','none',ink)+oval(35,58,3,2,ink)+
      path('M42 35l-3-20 6 2c6 2 8 7 5 11 0-4-5-6-8-6m26 17-3-22 23-5 3 23','none',ink)+
      oval(37,36,6.2,3.8,red)+path('M66 19l23-5 1 4-23 5Z',lilac)+
      oval(64,40,6.3,3.7,lilac)+oval(86,36,6.3,3.7,lilac)+
      path('M20 35l6 2m25 5 6-2m39-14 8-4m-9 22 6-1','none',amber)+star(99,13,3)),
    item('Потерянный сад', 'С каждым найденным семенем мир меняется на глазах.', 'В забытом саду сохранились пустые клумбы. Герой ищет семена и возвращает каждой клумбе её растение.',
      path('m16 56 24-13 54 8-24 15Z',amber)+path('M42 51V36m0 6q-10 1-11-8 9-1 11 8Zm0-3q1-10 12-12 0 8-12 12Z',leaf)+path('m70 52 2-13m0 0q-6-6-1-10 4-4 7 0 5-2 7 2 3 6-7 9Z',rose)+dot(75,35,2,gold)),
    item('Починка станции', 'У каждого найденного модуля есть своя функция.', 'У космической станции отключились связь и навигация. Игрок соединяет модули, чтобы снова поймать сигнал Земли.',
      path('M22 38h77v6H22Z',steel)+box(18,31,26,20,2,navy)+box(77,31,26,20,2,navy)+
      path('M22 35h18v12H22Zm59 0h18v12H81Z',blue)+path('M28 35v12m6-12v12m53-12v12m6-12v12M22 41h18m41 0h18','none',ivory)+
      box(46,27,29,27,5,steel)+box(50,30,19,21,3,ivory)+dot(59,41,6,navy)+dot(59,41,2,blue)+
      path('M55 27V21l9-7m-14-2q3 10 15 11l2-3-14-11Z',lilac)+
      path('M58 54v8h14v-8','none',ink)+box(70,58,12,8,2,amber)+
      path('M77 23q6 0 9 5m-8-11q8 0 14 8','none',amber)+star(31,18,3)+star(94,59,3)),
    item('Кто оставил следы?', 'Цепочка маленьких улик приводит к разгадке.', 'У музея появились необычные следы. Игрок сравнивает их с уликами и находит заблудившегося зверька.',
      path('M26 57q11-16 30-16t31-18','none',amber)+oval(40,49,7,4,navy)+dot(33,43,2,navy)+dot(38,41,2,navy)+dot(43,42,2,navy)+oval(65,35,6,4,navy)+dot(62,29,2,navy)+dot(68,28,2,navy)+path('M80 57V42l10-8 9 8v15Z',ivory)+path('m78 42 12-11 11 11',red))
  ];

  const hero = [
    item('Кот-космонавт', 'Шлем, полосатый хвост и ранец помогают узнать героя даже издалека.', 'Небольшой рыжий кот в синем скафандре, с прозрачным шлемом и полосатым хвостом.',
      box(41,34,13,21,4,amber)+path('M73 53q18 3 13-13-4-7 0-9 8-2 10 10 4 20-21 19Z',gold)+path('m84 37 6-2m-5 12 9 2')+path('M49 43h24l5 17-8 2-5-8-4 1-3 8-11-2Z',blue)+dot(61,29,16,ivory)+path('m49 34 1-13 6 5q6-3 11 0l6-5-1 14q-12 13-23-1Z',gold)+path('m55 31 2 1m8 0 2-1m-10 6 4 2 4-2')+box(55,45,10,6,2,steel)),
    item('Робот-садовник', 'Рабочая рука робота показывает, чем он занимается.', 'Приземистый робот-садовник на гусеницах. На спине резервуар, а вместо правой кисти — маленькая лейка.',
      box(34,49,46,14,7,navy)+dot(44,56,3,steel)+dot(55,56,3,steel)+dot(67,56,3,steel)+
      box(32,31,13,17,4,blue)+path('M35 39q4 2 7 0','none',ivory)+box(42,30,31,21,4,sage)+
      path('M53 45v-8m0 4q-5 1-5-3 3-1 5 3Zm0 1q5-6 9-4-2 5-9 4Z',leaf)+
      box(44,18,27,16,5,steel)+box(47,22,21,7,3,ink)+dot(52,25,1.5,gold)+dot(63,25,1.5,gold)+
      path('m74 37 8 5m2-3q-1-7 5-7 5 1 4 5m-9 1 11-2 1 10-12 2Z',blue)+
      path('m95 40 7-6 2 3-7 7Z',blue)+path('m104 39 3 4m-6 0 2 4','none',navy)),
    item('Гоночный карт', 'Низкое сиденье и широкие колёса отличают карт от обычной машины.', 'Низкий золотистый карт с широкими колёсами, открытым рулём и алым стартовым номером.',
      oval(63,64,43,5,'#786553','none')+box(29,42,16,12,5,'#414450')+box(76,38,14,11,4,'#414450')+
      path('m21 51 9-9 24-10 24 6 19 9 2 6-16 8-44 3-17-7Z',amber)+
      path('m21 51 9-9 22-10 25 6 19 9-14 8-39 4Z',gold)+
      path('m43 45-2-12q0-5 5-6l12 2 2 10-10 7Z',navy)+path('m46 43 2-7 11 2 3 4-9 5Z',blue)+
      path('M65 44 69 35','none',ink)+oval(70,33,6,2.7,'#525260')+
      path('m77 45 8 3-5 4-9-3Z',red)+shine('m76 48 3 .6m-20 1 7-3')+
      dot(36,59,8.5,ink)+dot(36,59,3.8,steel)+dot(84,58,8,ink)+dot(84,58,3.4,steel)+
      path('m23 54 4 2m22 4 21-1m27-4 4-2','none','#f8dca0')),
    item('Лис-курьер', 'Сумка для писем и заметный хвост пригодятся для анимации бега.', 'Проворный лис в синем шарфике. Через плечо у него сумка писем, а на конце хвоста белая кисточка.',
      path('M53 51q-20 9-30-12 12 4 18 2t13 10Z',red)+path('M23 39q5 2 10 3l-2 6-3-1Z',ivory)+
      path('M53 42q11-4 17 2l4 14-6 5-6-5-7 4-6-3Z',red)+
      path('M48 33l-1-17 12 9 10-1 12-9-1 19-12 12-10-1Z',red)+
      path('M50 21l6 5-5 3Zm27 0v8l-6-3Z',rose)+path('M49 34l14 5 17-6-13 12-9-1Z',ivory)+
      dot(57,34,1.4,ink)+dot(70,33,1.4,ink)+path('m61 39 5-1-2 3Z',ink)+
      path('m53 45 14 3 9-3-1 6-11 1-11-2Z',blue)+path('m67 50 9 8 4-4-7-5Z',navy)+
      path('m68 49-9 9','none',amber)+box(51,53,13,8,2,amber)+path('m53 55 5 3 4-3','none',ivory)),
    item('Капля дождя', 'Выразительное лицо делает героя заметным без сложной одежды.', 'Живая голубая капля с прозрачными краями, круглыми глазами и жёлтым зонтиком.',
      path('M42 48q4-13 15-24 0 8 8 15 10 12-1 21-19 9-22-12Z',blue)+dot(49,47,2,ink)+dot(59,47,2,ink)+path('m51 54 4 1 3-2')+shine('m46 42 6-9')+path('M69 49q0 6 4 5l3-2V23')+path('M58 26q8-20 20-14 12 4 16 17l-8-3-4 2-7-4-7 2-5-3Z',gold)+path('M78 13q4 5 4 14','none',amber)),
    item('Черепаха-мастер', 'Умение чинить вещи видно по инструментам и поясу.', 'Черепаха с медным панцирем, очками на лбу и поясом с инструментами.',
      path('M31 49q-2-22 19-26 23-3 27 24Z',amber)+
      path('m33 42 13-9 13 3 8-8m-21 5 1-8m12 11 2 9m-17-10 1 11m17-10 9 2','none','#885a44')+
      path('M28 48q20 6 46-2 9-2 10-12 1-6 8-4 9 2 6 11-2 7-13 7l-10 8H36Z',sage)+
      box(37,54,10,8,3,leaf)+box(62,54,10,8,3,leaf)+path('m84 32 12 3','none',navy)+
      dot(86,31,3,blue)+dot(95,33,3,blue)+dot(94,39,1.3,ink)+path('m93 43 4-1','none',ink)+
      box(50,48,7,8,2,gold)+path('m54 55 2-4m-2 4-1 5','none',navy)),
    item('Воздушный змей', 'Хвост помогает игроку видеть направление ветра.', 'Игрок управляет жёлто-красным воздушным змеем. На длинной нити трепещут три ленты.',
      path('m46 13 28 8 10 23-28 10Z',gold)+path('m46 13 17 18 11-10Zm17 18-7 23 28-10Z',red)+path('m46 13 38 31M74 21 56 54')+path('M56 54q-4 17-16 9T22 65','none',navy)+path('m46 62-9-4 3 7Zm-17 0-6-5 1 7Z',lilac)),
    item('Пингвин-повар', 'Колпак и передник сразу называют профессию героя.', 'Пингвин в пробковом фартуке и высоком белом колпаке несёт деревянную ложку.',
      oval(47,62,7,3.5,amber)+oval(65,62,7,3.5,amber)+
      path('M38 44q-7 9-8 13 9 2 13-7m29-7q9 0 13-7 1 9-9 14',navy)+
      oval(57,44,19,20,navy)+path('M44 38q3-8 12-2 8-7 13 1 6 12 0 20-8 7-20 1-8-5-5-20Z',ivory)+
      path('M41 29l1-8q-8-3-6-9 2-7 12-5 5-7 13-3 4 2 5 5 8-4 12 2t-5 11l-1 7Z',ivory)+
      path('M42 23q12 4 31-1l-1 7q-17 4-31 0Z',steel)+path('m47 12 2 4m12-7 1 6','none','#c4a99b')+
      dot(49,39,1.5,ink)+dot(63,38,1.5,ink)+path('m51 43 12-1-6 5Z',gold)+
      path('M46 51l4-5m13 1 5 5m-21-1h20l3 10q-13 4-26-1Z',amber)+
      path('M53 54h8v4h-8Z',gold)+path('M76 49l10-18','none','#81573d')+oval(88,27,4,6,amber)),
    item('Фонарь-светляк', 'Яркий животик оставляет узнаваемый световой след.', 'Маленький светляк с бирюзовыми крыльями и золотистым светящимся брюшком.',
      oval(65,43,21,15,'#ffdfa2','none')+oval(64,44,13,10,gold)+path('M57 38q-6-22-19-15-9 9 13 20Zm9-3q6-18 18-16 12 6-11 22Z',blue)+dot(51,37,9,navy)+dot(47,35,2,ivory)+path('m47 28-7-7m13 6 2-9m6 32-4 8m12-9 5 6')+star(84,51,4)+star(38,51,3)),
    item('Шахтёрский вагон', 'Объекту на рельсах можно придать характер с помощью формы и деталей.', 'Игрок ведёт маленькую шахтёрскую вагонетку с трещащей фарой, тормозным рычагом и грузом самоцветов.',
      path('m31 34 55-5-6 23-40 4Z',steel)+path('m28 32 59-6 2 6-59 6Z',navy)+path('m41 31 4-14 10 7 3 7Zm16-1 8-15 9 4 1 9Z',lilac)+dot(47,57,7,ink)+dot(47,57,3,steel)+dot(75,54,7,ink)+dot(75,54,3,steel)+dot(82,38,4,gold)+path('m21 68 77-10','none',amber))
  ];

  const world = [
    item('Лес сбоку', 'Боковой вид помогает измерить высоту веток и расстояния для прыжка.', 'Мшистый лес с видом сбоку. Вдали тянутся холмы, вблизи растут высокие грибы, между ветками есть проходы.',
      path('M15 60q20-22 39-14t49 11v8H15Z',sage)+path('m32 56 2-30h6l3 30Z',amber)+path('m22 33 15-21 15 21-8-1 10 12H20l10-12Z',leaf)+path('m70 61 2-13h6l2 13Z',ivory)+path('M60 49q13-24 29-3v3Z',red)+dot(72,42,2,ivory)+dot(80,45,2,ivory)),
    item('Город сверху', 'С высоты видны перекрёстки и удобные короткие пути.', 'Город с видом сверху, дорожными развязками, тихой площадью и парком с прудом.',
      box(19,15,82,48,5,sage)+path('M19 35h82v10H19Zm42-20h9v48h-9Z',steel)+box(28,20,23,10,2,red)+box(26,48,12,9,1,amber)+box(42,49,13,9,1,lilac)+oval(85,24,9,5,blue)+path('M21 40h11m8 0h11m26 0h10m-22 9v8','none',ivory)),
    item('Подводный мир 3D', 'Передние кораллы крупнее дальних. Камера смотрит глазами героя.', 'Настоящий объёмный подводный мир от первого лица. Игрок плывёт между кораллами к затонувшему кораблю.',
      path('M15 53q12-25 34-32 19-9 49 9 10 5 9 25l-2 10H15Z','#a7d0d5','none')+
      path('M16 59q22-9 43-1t47-2v9H16Z',amber)+
      path('M27 58V38m0 12-8-9m8 5 10-11m-17 7v-5m13 8 4 1','none',red)+
      `<g transform="rotate(13 64 50)">
        ${path('M43 48h43l-9 11H52Z',navy)}${path('M58 48V23m16 24V37m-13-10 13 10-5 1-3 6-5-3Z',ivory)}
        ${path('M47 51h34m-27 4h5m5 0h8','none','#b8c5c6')}
      </g>`+
      path('M90 59q-8-15 2-25-3 12 6 16-2-13 5-16','none',leaf)+
      path('m80 26 6 2 4-2v4l-4-2','none','#4e8091')+dot(43,27,2.1,blue)+dot(48,19,1.7,blue)),
    item('Мастерская в разрезе', 'Вид сбоку открывает сразу оба этажа маленького дома.', 'Мастерская в разрезе. Внизу стоят верстаки, наверху часы и ящики, этажи соединяет деревянная лестница.',
      path('M24 62V27l36-15 36 15v35Z',ivory)+path('M19 27 60 9l41 18-2 5-39-16-39 16Z',red)+path('M25 42h70M53 61l11-21m-7 14h7m-3-6h7')+box(32,48,15,7,2,amber)+path('M34 55v6m11-6v6')+dot(76,31,6,gold)+path('M76 27v4l3 2')),
    item('Парящие острова', 'Изометрический вид показывает и поверхность острова, и его боковые грани.', 'Цепочка парящих островов в изометрическом виде. Острова соединены мостиками, внизу медленно плывут облака.',
      path('m17 43 18-9 24 8-18 11Z',sage)+path('m17 43 24 10 18-11-9 15-9 7-13-8Z',amber)+path('m66 27 17-9 20 8-18 10Z',sage)+path('m66 27 19 9 18-10-8 16-11 5-12-8Z',steel)+path('m50 41 21-12m-17 15 21-12m-17 3 4 5m3-9 4 4','none',amber)+path('M74 59q0-6 7-6 3-9 11-4 7 1 7 10Z',ivory)),
    item('Поле по клеткам', 'Одна клетка соответствует одному ходу. Расстояния легко посчитать.', 'Игра на клетчатом поле с видом сверху. Цветные плитки различаются формой и узором, по краям есть вход и выход.',
      box(27,16,65,45,3,ivory)+path('M43 16v45m16-45v45m16-45v45M27 31h65M27 46h65','none',steel)+box(45,33,12,11,2,blue)+dot(67,53,4,gold)+path('m80 21 4 6h-8Z',red)+path('m30 53 4-4 5 4-5 5Z',lilac)),
    item('Обсерватория', 'Круглый купол и большой телескоп задают ночное настроение.', 'Ночная обсерватория с видом сбоку. В зале вращаются телескопы, за стеклянным куполом движутся звёзды.',
      path('M24 53q2-30 31-35t37 35Z',blue)+path('M25 53h67v10H25Z',steel)+path('M37 50q4-20 15-27m18-3q12 10 15 30','none',ivory)+path('m49 47 22-15 5 7-23 14Zm11 4-6 10m7-9 7 9',navy)+star(92,19,4)+star(30,26,3)),
    item('Пустыня за рулём', 'Сходящиеся к горизонту линии показывают скорость и глубину.', 'Песчаная трасса с камерой за транспортом. Вдалеке барханы и каменные арки, близко видны знаки поворотов.',
      dot(80,22,9,gold)+path('M13 48q21-22 44-6 26-19 49 1v19H13Z',amber)+path('M57 40q15 2-2 9T41 66h32q-16-8-1-16t-10-10Z',steel)+path('m27 45 3-19 4-1 3 22m-7-13-6-4v-5m9 10 6-7v-5','none',leaf)+path('m80 49 6-4 6 4-6 5Z',gold)),
    item('Бумажный театр', 'Декорации перекрывают друг друга, как слои бумажной аппликации.', 'Бумажный театр с фронтальной камерой. На переднем плане персонажи, за ними сменяются вырезанные из картона декорации.',
      box(22,17,76,45,2,amber)+box(28,23,64,33,1,ivory)+path('M27 22h23q-3 14-16 16l5 16H27Zm66 0H72q2 14 14 17l-5 15h12Z',red)+path('m45 53 10-17 8 9 7-13 9 21Z',leaf)+path('m18 62 85-1v5H18Z',navy)+star(60,28,3)),
    item('Ледяная пещера', 'Подсвеченные кристаллы помогают ориентироваться в глубине.', 'Ледяные пещеры с видом сбоку. Узоры льда светятся голубым, а контуры безопасных площадок заметны на тёмном камне.',
      path('m14 24 15-10 24 4 23-7 29 12-10 8-7-6-5 17-7-18-14 3-6 14-8-18-13 4-8 13-5-17Z',steel)+path('m19 61 10-16 9 13 9-5 9 8 20-3 13-13 14 16Z',blue)+path('m69 58 3-19 6-8 4 14-7 13Z',lilac)+shine('m75 39 1-3m-47 14 4 6m54-37 6 3'))
  ];

  const actions = [
    item('Двойной прыжок', 'Первый прыжок от земли. Пока герой опускается, второе нажатие позволяет подняться выше.', 'Герой бегает и прыгает. Между отрывом от земли и приземлением разрешён ровно один дополнительный прыжок.',
      path('M12 63h34v7H12Zm65-15h31v7H77Z',amber)+path('M12 63h34m31-15h31','none',leaf)+
      '<path d="M37 50Q47 15 62 37Q73 1 92 33" fill="none" stroke="#a9895d" stroke-width="1.25" stroke-dasharray="2 3"/>'+
      part('boost',path('m55 43 4 3m3-4 0 5m5-4-3 4','none',amber))+
      part('jumper',path('M20 57q1-8 13-9 10 3 7 11-3 5-12 3-6 2-11-1 0-3 3-4Z',leaf)+
        path('M19 60q6-5 11 0m3-2 4 4h6','none','#3f6b51')+
        dot(27,48,5,sage)+dot(36,47,5,sage)+dot(29,47,2,ivory)+dot(38,46,2,ivory)+
        dot(30,47,1,ink)+dot(39,46,1,ink)+path('M37 53q3 1 5-2m-14 3 4-2','none','#385647')),
      [move('jumper',1500,['translate(0,0)','translate(0,1px) scale(1.09,.92)','translate(16px,-25px)','translate(29px,-13px)','translate(41px,-29px)','translate(51px,-36px)','translate(58px,-16px) scale(1.08,.93)','translate(58px,-16px)'],[0,.1,.28,.43,.58,.67,.87,1]),{selector:'.boost',duration:1500,frames:[{opacity:.32},{offset:.4,opacity:.32},{offset:.48,opacity:1},{offset:.71,opacity:.2},{opacity:.32}]}]),
    item('Рывок', 'Короткое ускорение перемещает героя вперёд. Затем способность должна восстановиться.', 'Игрок мгновенно ускоряется в выбранную сторону на короткое расстояние. После рывка есть перезарядка 3 секунды.',
      path('M14 64h94','none',steel)+path('m68 30 7 5-7 5m11-12 9 7-9 7','none',amber)+
      part('speed',path('M12 34h17M9 42h17m-11 7h10m-10 8h6','none','#c99a61'))+
      part('dashBody',path('m48 33-14 4-10-2 9-4 10-2Z',red)+
        path('m45 45-9 4-7 11h-7l7-15 10-6Z',navy)+path('m45 43 10 7 11 2-2 5-14-2-10-8Z',blue)+
        path('M36 42q4-11 12-12l10 8-9 6-5 5Z',blue)+path('m47 36 7 7 6-2 3 3-11 6-8-7Z',steel)+
        path('M52 22q6-5 11 1l2 7-5 6-8-3-2-6Z',rose)+
        path('M49 28q-1-8 6-10 10-1 12 8l-8 1-4-2-3 5Z',navy)+dot(61,29,1,ink)+
        shine('m52 22 4-2m-17 19 3-4m-15 23 3-4')),
      [move('dashBody',850,['translate(0,0)','translate(-4px,2px) rotate(-6deg)','translate(19px,-2px) rotate(5deg) scale(1.07,.96)','translate(39px,0)','translate(39px,0)'],[0,.24,.37,.56,1]),{selector:'.speed',duration:850,frames:[{opacity:.3},{offset:.24,opacity:.6},{offset:.39,opacity:1,transform:'scaleX(1.8)'},{offset:.64,opacity:.25},{opacity:.3}]}]),
    item('Три в ряд', 'Обменяй соседние фишки, чтобы собрать одинаковые в линию.', 'Игрок меняет местами две соседние фишки. Ряд из трёх одинаковых исчезает, поле заполняется сверху.',
      box(22,15,76,49,5,ivory)+path('M47 16v47m26-47v47M23 40h74','none',steel)+
      part('matchLeft',dot(35,51,7,gold)+shine('m32 49 2-2'))+part('matchCenter',dot(60,51,7,gold)+shine('m57 49 2-2'))+
      part('fallLeft',path('m30 27 5-5 5 5-5 6Z',blue))+part('fallCenter',path('m55 27 5-6 5 6-5 6Z',lilac))+
      part('swapStar',part('matchRight',dot(85,27,7,gold)+shine('m82 25 3-2')))+part('swapGem',path('m79 51 6-7 6 7-6 7Z',red)),
      [move('swapStar',1360,['translateY(0)','translate(-3px,11px)','translateY(24px)','translateY(24px)'],[0,.29,.51,1]),
        move('swapGem',1360,['translateY(0)','translate(3px,-11px)','translateY(-24px)','translateY(-24px)','translateY(0)'],[0,.29,.51,.79,1]),
        ...['.matchLeft','.matchCenter','.matchRight'].map(selector=>matchFade(selector,matchedTokens)),
        ...['fallLeft','fallCenter'].map(name=>move(name,1360,['translateY(0)','translateY(0)','translateY(24px)'],[0,.79,1]))]),
    item('Ключ и замок', 'Подбери ключ с нужной формой и используй его у двери.', 'Игрок находит ключи разной формы и может открыть дверь только соответствующим ключом.',
      path('M69 61V28q12-16 24 0v33Z',amber)+path('M76 58V31q6-9 12 0v27Z',ivory)+dot(82,44,4,ink)+path('m82 46-2 6h4Z',ink)+part('unlockKey',dot(36,45,9,gold)+dot(36,45,4,ivory)+path('M45 42h22v7h-4v4h-5v-5H45Z',gold)),
      [move('unlockKey',1050,['translateX(-5px)','translateX(15px)','translateX(17px) rotate(0deg)','translateX(17px) rotate(-18deg)','translateX(17px) rotate(0deg)'])]),
    item('Крюк-кошка', 'Прицепись к отмеченной точке и качнись через провал.', 'Игрок цепляется крюком за отмеченные балки, раскачивается и отпускает трос над следующей площадкой.',
      path('M27 17h58v7H27Z',amber)+path('M13 65h26v5H13Zm67-7h26v5H80Z',leaf)+
      '<path d="M37 58Q62 75 94 52" fill="none" stroke="#bea87a" stroke-dasharray="2 3"/>'+
      `<g transform="translate(62 23)"><g class="swing" style="transform-box:fill-box;transform-origin:right top">${path('M0 0-19 25','none',navy)}${dot(-21,28,6,red)}${path('m-25 34-4 4m11-4 5 3')}${shine('m-24 27 2-2')}</g></g>`+
      dot(62,22,4,steel),
      [move('swing',1320,['rotate(0deg)','rotate(9deg)','rotate(-46deg)','rotate(-68deg)','rotate(-61deg)'],[0,.17,.48,.78,1])]),
    item('Перенос ящика', 'Толкай ящик на плиту. Для толчка позади героя должно быть свободно.', 'Герой толкает по одному ящику на соседнюю свободную клетку. Ящик на нажимной плите открывает проход.',
      path('M15 61h90','none',steel)+path('m68 59 5-6h21l6 6Z',blue)+part('pushBox',box(37,36,23,23,2,amber)+path('m40 39 17 17m-17 0 17-17','none',ivory))+part('pushHand',path('m17 47 6-4 7 5 7 1-2 6H22l-7-4Z',rose))+path('M77 43h10m-4-4 4 4-4 4','none',navy),
      [move('pushBox',1240,['translateX(0)','translateX(0)','translateX(16px)','translateX(16px)','translateX(32px)','translateX(32px)'],[0,.22,.44,.55,.81,1]),move('pushHand',1240,['translateX(-4px)','translateX(1px)','translateX(17px)','translateX(15px)','translateX(33px)','translateX(29px)'],[0,.22,.44,.55,.81,1])]),
    item('Лучи и зеркала', 'Поворачивай зеркало, пока свет не попадёт на приёмник.', 'Игрок поворачивает зеркала дискретными шагами, чтобы направить луч от лампы к приёмнику.',
      box(16,41,16,14,3,amber)+dot(31,48,4,gold)+path('M35 48h24','none',amber)+part('mirror',path('m56 54 12-17 5 3-12 17Z',blue)+shine('m60 49 7-9'))+part('beam',path('m64 46 23-21','none',amber))+dot(90,22,7,navy)+dot(90,22,3,gold),
      [move('mirror',1090,['rotate(-60deg)','rotate(-60deg)','rotate(-30deg)','rotate(-30deg)','rotate(0deg)','rotate(0deg)'],[0,.2,.39,.51,.68,1]),{selector:'.beam',duration:1090,frames:[{opacity:.08},{offset:.66,opacity:.08},{offset:.76,opacity:1},{opacity:1}]}]),
    item('Полёт на тяге', 'Импульс ранца поднимает героя, а при отпускании он снижается.', 'Игрок удерживает тягу для подъёма и отпускает для снижения. Запас энергии восстанавливается при посадке.',
      path('M17 65h69m-59 4h49','none',steel)+path('M91 46v-13m-4 4 4-5 4 5','none',navy)+
      part('jet',path('M38 52q-3 6-2 12 6-3 8-11m2 0q-2 6 0 9 4-4 5-9',gold)+
        box(36,36,9,17,3,steel)+box(43,34,8,19,3,amber)+path('M37 48h13','none',ivory)+
        path('M50 40q9-4 15 2l1 11-6 2-1 7h-8l1-12Z',blue)+
        path('M59 49l8 3 4 8h-7l-4-4m-7 6h-5m13-19 8 2 4-4','none',ink)+
        dot(59,34,8,ivory)+path('M60 30h7v7h-8q-4-3 1-7Z',navy)+shine('M62 31h3')),
      [move('jet',1280,['translate(0,0)','translate(4px,-12px) rotate(3deg)','translate(8px,-21px)','translate(11px,-23px)','translate(13px,-14px) rotate(-3deg)'])]),
    item('Магнитный захват', 'Предметы в радиусе магнита двигаются к герою.', 'Игрок на короткое время включает магнит. Только металлические предметы поблизости притягиваются к нему.',
      path('M29 24h11v17q6 15 16 2V25h12v19q-1 20-22 19-18-2-17-21Z',red)+path('M29 24h11v8H29Zm27 1h12v8H56Z',steel)+part('bolt',path('m82 32 5-7 8 3 1 8-7 5-7-3Z',navy)+dot(89,32,3,ivory))+part('nut',path('m85 52 4-5 7 3-2 5 3 2-3 4-8-5 2-3Z',steel)),
      [move('bolt',1080,['translate(0,0)','translate(-3px,-2px) rotate(15deg)','translate(-17px,-5px) rotate(65deg)','translate(-30px,-5px) rotate(110deg)','translate(-29px,-5px) rotate(110deg)'],[0,.23,.48,.73,1]),move('nut',1080,['translate(0,0)','translate(0,0)','translate(-9px,-6px) rotate(-18deg)','translate(-29px,-23px) rotate(-52deg)'],[0,.24,.57,1])]),
    item('Запомни узор', 'Посмотри, какие плитки мигнули, и повтори порядок.', 'Поле показывает последовательность вспышек. Игрок повторяет её касаниями, после успеха последовательность удлиняется.',
      box(31,13,61,51,7,navy)+part('padA',box(37,19,20,16,4,gold))+part('padB',box(64,19,21,16,4,blue))+part('padC',box(37,41,20,16,4,red))+box(64,41,21,16,4,lilac)+path('m42 27 4-4 5 5m20-2h6m-34 22h7','none',ivory),
      ['padA','padC','padB'].map((name,i)=>({selector:'.'+name,duration:320,delay:i*340,frames:[{filter:'brightness(1)'},{filter:'brightness(1.8)'},{filter:'brightness(1)'}]}))),
    item('Рисование пути', 'Нарисуй дорожку от старта к цели, огибая камни.', 'Игрок проводит непрерывный путь по свободной области поля. Герой следует по нему только после подтверждения.',
      box(21,16,79,47,5,ivory)+dot(32,50,5,sage)+path('m46 43 5-9 8 5-3 7Z',steel)+path('m71 52 4-8 8 4-3 6Z',steel)+part('trail','<path d="M34 49Q43 56 59 48T77 33L86 27" fill="none" stroke="#bd8844" stroke-width="3" stroke-dasharray="68" pathLength="68"/>')+star(87,26,5),
      [{selector:'.trail',duration:1150,frames:[{strokeDashoffset:'68'},{offset:.45,strokeDashoffset:'39'},{offset:.85,strokeDashoffset:'0'},{strokeDashoffset:'0'}]}]),
    item('Смена тяжести', 'Переключись с пола на потолок, чтобы обойти шипы.', 'Одно нажатие меняет направление тяжести. Герой переходит с пола на потолок и обратно, сохраняя движение вперёд.',
      path('M16 18h86v5H16Zm0 42h86v5H16Z',navy)+path('m61 58 5-11 5 11 5-9 5 9Z',red)+part('gravityBot',box(32,43,17,15,4,lilac)+box(35,46,11,5,2,ink)+dot(42,48,1,ivory)+path('m36 57-3 3m12-3 4 3'))+path('m86 37 4-6 4 6m-4-5v13','none',amber),
      [move('gravityBot',1150,['translate(0,0)','translate(6px,-2px) rotate(25deg)','translate(17px,-17px) rotate(120deg)','translate(26px,-20px) rotate(180deg)','translate(37px,-20px) rotate(180deg)'])])
  ];

  const controls = [
    item('Клавиатура', 'Разные клавиши позволяют двигаться и выполнять действие одновременно.', 'Стрелки или WASD двигают героя, пробел выполняет основное действие, Esc ставит игру на паузу.',
      box(19,23,82,39,7,navy)+box(22,23,76,34,5,steel)+
      [27,38,49,60,71,82].map((x,i)=>box(x,28,8,7,1.3,i===0?red:ivory)+box(x,38,8,7,1.3,[0,1,2].includes(i)?gold:ivory)).join('')+
      box(27,48,13,5,1.3,ivory)+box(43,48,34,5,1.3,ivory)+box(80,48,10,5,1.3,blue)+
      path('M29 31h3m8 0h3m8 0h3m8 0h3m8 0h3m8 0h3M29 41h3m8 0h3m8 0h3m8 0h3m8 0h3m8 0h3','none','#69596a')+
      path('M52 50h14','none',navy)),
    item('Мышь и касания', 'Один и тот же выбор удобно сделать указателем или пальцем.', 'Щелчок мыши или касание выбирает объект. Повторное нажатие на доступную цель выполняет действие.',
      path('M28 46V33q0-13 11-13t12 13v13q0 14-12 14T28 46Z',blue)+path('M39 21v17m-10 1h21m-10-19q-3-10 7-10','none',navy)+path('m67 34 4-2 3 2 2 9 8-4 8 2 2 6-5 13H76l-12-12q-3-5 2-6l5 3Z',rose)+path('m64 30-4-3m12-3 1-6m7 9 5-4','none',amber)),
    item('Клавиши и экран', 'Экранные кнопки заменяют клавиши на планшете.', 'На компьютере движение задают стрелки, действие — пробел. На сенсорном экране есть кнопки движения и большая кнопка действия.',
      box(17,17,86,47,7,navy)+box(24,22,72,37,4,'#eaf3e7')+
      path('M49 50l10-17 13 17Z',sage)+path('M63 40l5-8 9 14','none',leaf)+dot(70,29,2.4,gold)+
      box(35,32,10,23,2,navy)+box(29,38,22,10,2,navy)+
      path('M38 36l2-2 2 2m4 5 2 2-2 2m-4 5-2 2-2-2m-4-5-2-2 2-2','none',ivory)+
      dot(82,45,8,red)+path('M80 42l5 3-5 3Z',ivory)+path('M99 35v8','none',ivory)),
    item('Свайпы', 'Направление жеста определяет следующий шаг.', 'Свайп вверх, вниз, влево или вправо задаёт направление следующего шага. Стрелки дублируют эти действия на компьютере.',
      box(29,12,42,54,7,navy)+box(34,17,32,43,3,blue)+path('M43 44q8-13 16-15m-8-1 10-1-2 10','none',ivory)+path('m68 45 4-4 9 6 5 9-5 7-12-5-7-9q-2-6 3-5l4 3-7-10q-3-5 1-7Z',rose)),
    item('Одна кнопка', 'Короткое нажатие проще освоить, если действие зависит от момента.', 'Игрок нажимает пробел или большую экранную кнопку в нужный момент. Каждое нажатие запускает одно действие.',
      path('M27 45q30 15 62-1v10q-32 19-62 0Z',navy)+oval(58,45,31,11,steel)+path('M37 36v9q22 13 43-1v-8Z',amber)+oval(58,36,21,9,gold)+shine('M44 34q9-5 20-3')+path('M59 19v-7m-20 11-5-5m42 4 6-6','none',amber)),
    item('Перетащи и отпусти', 'Предмет перемещается только при попадании в подходящую область.', 'Удержание мышью или пальцем захватывает предмет. Отпускание над подходящей целью размещает его, иначе предмет возвращается обратно. Два нажатия позволяют выбрать предмет и цель.',
      path('m73 48 13-7 15 6-14 9Z',ivory)+path('m73 48 14 8 14-9v9l-14 9-14-9Z',steel)+path('m22 27 14-8 17 7-15 9Z',gold)+path('m22 27 16 8 15-9v15l-15 9-16-9Z',amber)+path('M56 29q18-8 27 6m-8-2 8 4 2-8','none',navy)+path('m43 39 14 10-7 1-3 7Z',ivory))
  ];

  return { genre, name, plot, hero, world, actions, controls };
})();

