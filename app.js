'use strict';

const draftKey = 'vibe-gaming-draft-v1';
const fields = stages.flatMap(stage => stage.fields);
const fieldsById = new Map(fields.map(field => [field.id, field]));
const tones = ['warm', 'mist', 'peach', 'lilac', 'ice', 'sand'];
const pageSize = 4;
const pages = new Map();
const toolbox = document.querySelector('#toolbox-dialog');
const stepNav = document.querySelector('#step-nav');
const editor = document.querySelector('#editor');
const generateButton = document.querySelector('#generate');
const generateLabel = document.querySelector('#generate-label');
const routeNote = document.querySelector('#route-note');
const progressBar = document.querySelector('#progress-bar');
const progressCount = document.querySelector('#progress-count');
const announcement = document.querySelector('#announcement');
const copyDialog = document.querySelector('#copy-dialog');
const manualText = document.querySelector('#manual-text');
const previousAnswers = new Map();
const draft = readDraft();

for (const field of fields) {
  const selected = field.options.findIndex(option => option.value === draft.answers[field.id]);
  if (selected >= 0) pages.set(field.id, Math.floor(selected / pageSize));
}

let activeStage = draft.stage;
let showingResult = false;
let generatedPrompt = '';
let openedTip = null;
let copyTrigger = null;

function readDraft() {
  let stored;
  try {
    stored = JSON.parse(localStorage.getItem(draftKey));
  } catch {
    // The form still works when storage is blocked or unreadable.
  }

  const answers = Object.create(null);
  for (const field of fields) {
    const savedAnswer = stored?.answers?.[field.id];
    answers[field.id] = typeof savedAnswer === 'string' ? savedAnswer.slice(0, field.max ?? 1000) : '';
  }
  return {
    stage: stages.some(stage => stage.id === stored?.stage) ? stored.stage : stages[0].id,
    answers
  };
}

function saveDraft() {
  try {
    localStorage.setItem(draftKey, JSON.stringify(draft));
  } catch {
    // Keep the current answers in memory.
  }
}

function isFilled(value) {
  return /[^\s\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/u.test(value);
}

function isStageComplete(stage) {
  return stage.fields.every(field => isFilled(draft.answers[field.id]));
}

function updateProgress() {
  const completed = stages.filter(isStageComplete);
  const hasAllAnswers = completed.length === stages.length;

  for (const [index, stage] of stages.entries()) {
    const button = stepNav.children[index];
    const isCurrent = stage.id === activeStage && !showingResult;
    const isComplete = completed.includes(stage);
    if (isCurrent) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
    button.classList.toggle('is-complete', isComplete);
    const answered = stage.fields.filter(field => isFilled(draft.answers[field.id])).length;
    const partial = answered > 0 && !isComplete;
    const status = isComplete ? 'Заполнен' : partial
      ? 'Заполнен не до конца · ' + answered + ' из ' + stage.fields.length
      : 'Ещё не заполнен';
    button.classList.toggle('is-partial', partial);
    button.title = status;
    button.querySelector('.step-check').textContent = isComplete ? '✓' : partial ? '×' : '';
    button.querySelector('.step-status').textContent = ' — ' + status;
  }

  progressBar.max = stages.length;
  progressBar.value = completed.length;
  progressCount.textContent = completed.length + ' из ' + stages.length;
  generateButton.disabled = !hasAllAnswers;
  generateLabel.textContent = generatedPrompt ? 'Открыть промпт' : 'Собрать промпт';
  routeNote.hidden = hasAllAnswers;
  routeNote.textContent = document.querySelector('.step-button.is-partial')
    ? 'Красным крестиком отмечен этап с пустыми полями.'
    : 'Заполни все этапы, чтобы собрать промпт.';

  const continueButton = editor.querySelector('[data-continue]');
  if (continueButton && activeStage === stages.at(-1).id) {
    continueButton.textContent = hasAllAnswers ? 'Собрать промпт' : 'К незаполненному этапу';
  }
}

function renderOptions(field) {
  const start = (pages.get(field.id) || 0) * pageSize;
  return field.options.slice(start, start + pageSize).map((option, position) => {
    const index = start + position;
    const tipId = field.id + '-tip-' + index;
    return `<div class="example" data-tone="${tones[index % tones.length]}">
      <button class="example-choice" draggable="true" type="button" data-choice="${index}" aria-pressed="false" aria-describedby="${tipId}">
        <span class="touch-grip" aria-hidden="true">⠿</span>
        <svg class="example-art" viewBox="0 0 120 78" aria-hidden="true"><g fill="none" stroke="#34353b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${option.art}</g></svg>
        <span class="example-label">${option.title}</span>
      </button>
      <button class="info-button" type="button" aria-label="Объяснить пример «${option.title}»" aria-expanded="false" aria-controls="${tipId}">?</button>
      <span class="example-tip" id="${tipId}" role="tooltip">${option.tip}</span>
    </div>`;
  }).join('');
}

function renderField(field) {
  const singleLine = field.id === 'name';
  const id = 'answer-' + field.id;
  const max = field.max ?? 1000;
  const input = singleLine
    ? `<input type="text" id="${id}" maxlength="${max}" placeholder="${field.placeholder}" autocomplete="off" aria-required="true">`
    : `<textarea id="${id}" maxlength="${max}" rows="${field.id === 'genre' ? 2 : 3}" placeholder="${field.placeholder}" aria-required="true"></textarea>`;

  const label = `<div class="answer-heading">
    <label for="${id}">${field.label}</label>
    <button class="undo-button" type="button" data-undo hidden>Вернуть предыдущий ответ</button>
  </div>`;

  return `<section class="field" data-field="${field.id}">
    <div class="gallery-heading">
      ${field.id === 'genre' ? '<strong>Примеры жанров</strong>' : label}
      <div class="pager" role="group" aria-label="Страницы примеров">
        <button type="button" data-page="-1" aria-label="Предыдущие примеры">‹</button>
        <span class="page-count" aria-live="polite"></span>
        <button type="button" data-page="1" aria-label="Следующие примеры">›</button>
      </div>
    </div>
    <div class="examples" role="group" aria-label="Примеры. ${field.label}">${renderOptions(field)}</div>
    <div class="answer">${field.id === 'genre' ? label : ''}<div class="drop-zone">
      <span class="drop-hint">Перетащи пример сюда или напиши свой вариант</span>${input}
    </div></div>
  </section>`;
}

function renderStage(stage) {
  const stageIndex = stages.indexOf(stage);
  const isLast = stageIndex === stages.length - 1;
  cancelDrag();
  editor.innerHTML = `<div class="editor-heading">
    <div><h2 tabindex="-1">${stage.heading}</h2><p>${stage.description}</p></div>
    <div class="stage-meta">
      <span class="stage-index">Этап ${stageIndex + 1} из ${stages.length}</span>
      <button class="route-jump" type="button" data-route>К маршруту</button>
    </div>
  </div>
  <div class="fields">${stage.fields.map(renderField).join('')}</div>
  <div class="editor-footer">
    <button class="plain-button" type="button" data-previous ${stageIndex === 0 ? 'hidden' : ''}>Назад</button>
    <button class="continue-button" type="button" data-continue>${isLast ? 'К незаполненному этапу' : 'Следующий этап'}</button>
  </div>`;

  for (const field of stage.fields) {
    editor.querySelector('#answer-' + field.id).value = draft.answers[field.id];
    updateField(field, editor.querySelector('[data-field="' + field.id + '"]'));
  }
}

function updateField(field, wrapper) {
  const value = draft.answers[field.id];
  for (const button of wrapper.querySelectorAll('[data-choice]')) {
    button.setAttribute('aria-pressed', String(field.options[Number(button.dataset.choice)].value === value));
  }
  const page = pages.get(field.id) || 0;
  const start = page * pageSize;
  wrapper.querySelector('.page-count').textContent = (start + 1) + '–' + Math.min(start + pageSize, field.options.length) + ' из ' + field.options.length;
  wrapper.querySelector('[data-page="-1"]').disabled = page === 0;
  wrapper.querySelector('[data-page="1"]').disabled = start + pageSize >= field.options.length;
  wrapper.querySelector('[data-undo]').hidden = !previousAnswers.has(field.id);
}

function updateAnswer(field, wrapper, value) {
  if (draft.answers[field.id] !== value) {
    const wasComplete = isStageComplete(stages.find(stage => stage.id === activeStage));
    draft.answers[field.id] = value;
    generatedPrompt = '';
    saveDraft();
    updateProgress();
    const stage = stages.find(item => item.id === activeStage);
    if (!wasComplete && isStageComplete(stage)) {
      announcement.textContent = 'Этап «' + stage.title + '» заполнен. Готово ' + progressCount.textContent + '.';
    } else if (wasComplete && !isStageComplete(stage)) {
      announcement.textContent = 'В этапе «' + stage.title + '» есть пустое поле. Готово ' + progressCount.textContent + '.';
    }
  }
  updateField(field, wrapper);
}

function focusWorkspace() {
  const heading = editor.querySelector('h2');
  heading.focus({ preventScroll: true });
  const { top, bottom } = heading.getBoundingClientRect();
  if (top < 10 || bottom > window.innerHeight * 0.75) {
    document.querySelector('#workspace').scrollIntoView({ block: 'start' });
  }
}

function activateStage(id) {
  if (activeStage === id && !showingResult) {
    focusWorkspace();
    return;
  }

  closeTip();
  const stage = stages.find(item => item.id === id);
  activeStage = id;
  draft.stage = id;
  showingResult = false;
  saveDraft();
  renderStage(stage);
  updateProgress();
  focusWorkspace();
}

function showResult() {
  if (!stages.every(isStageComplete)) return;
  closeTip();
  if (showingResult) {
    focusWorkspace();
    return;
  }

  generatedPrompt ||= buildPrompt(stages, draft.answers);
  showingResult = true;
  editor.innerHTML = `<div class="editor-heading result-heading">
    <div><h2 tabindex="-1">Твой промпт готов</h2><p>Вставь промпт в чат с ИИ. Сохрани полученный код как <strong>game.html</strong> и открой файл двойным щелчком.</p></div>
    <span class="result-mark">${icon('check')}</span>
  </div>
  <div class="result-content">
    <label class="sr-only" for="prompt-output">Готовый промпт</label>
    <textarea id="prompt-output" class="prompt-output" readonly rows="12"></textarea>
    <div class="result-actions">
      <button class="plain-button" type="button" data-edit>${icon('edit')} Вернуться к этапам</button>
      <button class="primary-button" type="button" data-copy="main">${icon('copy')} <span>Скопировать промпт</span></button>
    </div>
  </div>
  <div class="more-prompts"><button type="button" data-toolbox class="plain-button" aria-haspopup="dialog">Запросы для доработки игры</button></div>`;
  editor.querySelector('#prompt-output').value = generatedPrompt;
  updateProgress();
  focusWorkspace();
}

function closeTip(suppress = false) {
  if (!openedTip) return;
  openedTip.classList.remove('tip-open');
  openedTip.classList.toggle('tip-muted', suppress);
  openedTip.querySelector('.info-button').setAttribute('aria-expanded', 'false');
  openedTip = null;
}

function openOrCloseTip(wrapper) {
  if (openedTip === wrapper) {
    closeTip(true);
    return;
  }
  closeTip();
  wrapper.classList.remove('tip-muted');
  wrapper.classList.add('tip-open');
  wrapper.querySelector('.info-button').setAttribute('aria-expanded', 'true');
  openedTip = wrapper;
}

function copyWithSelection(text, trigger) {
  const temporary = document.createElement('textarea');
  temporary.className = 'clipboard-helper';
  temporary.value = text;
  temporary.readOnly = true;
  temporary.tabIndex = -1;
  document.body.append(temporary);
  temporary.focus({ preventScroll: true });
  temporary.select();
  temporary.setSelectionRange(0, text.length);
  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    temporary.remove();
    if (trigger.isConnected) trigger.focus({ preventScroll: true });
  }
}

async function copyPrompt(trigger) {
  const key = trigger.dataset.copy;
  const text = key === 'main' ? generatedPrompt : improvements.find(item => item.id === key)?.text;
  if (!text || trigger.dataset.copying) return;
  trigger.dataset.copying = 'true';
  let copied = false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      copied = true;
    }
  } catch {
    // Try the selection-based clipboard path on restricted origins.
  }
  delete trigger.dataset.copying;
  if (!trigger.isConnected) return;
  if (!copied) copied = copyWithSelection(text, trigger);

  if (copied) {
    const label = trigger.querySelector('span');
    const originalLabel = key === 'main' ? 'Скопировать промпт' : 'Копировать';
    label.textContent = 'Скопировано';
    trigger.classList.add('copied');
    announcement.textContent = key === 'main' ? 'Готовый промпт скопирован.' : 'Запрос на доработку скопирован.';
    clearTimeout(trigger.copyFeedbackTimer);
    trigger.copyFeedbackTimer = setTimeout(() => {
      label.textContent = originalLabel;
      trigger.classList.remove('copied');
    }, 2200);
    return;
  }

  copyTrigger = trigger;
  manualText.value = text;
  if (!copyDialog.open) copyDialog.showModal();
  manualText.focus();
  manualText.select();
}

let drag = null;
let touchScrollFrame = 0;
let suppressTouchClick = false;

function selectExample(wrapper, button) {
  const field = fieldsById.get(wrapper.dataset.field);
  const option = field.options[Number(button.dataset.choice)];
  const input = wrapper.querySelector('input, textarea');
  const previous = draft.answers[field.id];
  if (option.value !== previous) {
    if (isFilled(previous)) previousAnswers.set(field.id, previous);
    input.value = option.value;
    updateAnswer(field, wrapper, input.value);
  }
  closeTip(true);
  button.closest('.example').classList.add('tip-muted');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (const track of option.motion || []) {
    const element = button.querySelector(track.selector);
    if (!element?.animate) continue;
    for (const animation of element.getAnimations()) animation.cancel();
    element.animate(track.frames, {duration: track.duration, delay: track.delay || 0, easing: 'ease-in-out'});
  }
}

function cancelDrag() {
  if (!drag) return;
  const {wrapper, ghost, button, pointerId} = drag;
  drag = null;
  cancelAnimationFrame(touchScrollFrame);
  wrapper.classList.remove('drag-active', 'drag-over');
  button.classList.remove('drag-source');
  if (pointerId != null && button.hasPointerCapture(pointerId)) button.releasePointerCapture(pointerId);
  ghost?.remove();
}

function startDrag(button) {
  cancelDrag();
  closeTip(true);
  const wrapper = button.closest('[data-field]');
  drag = {wrapper, button};
  wrapper.classList.add('drag-active');
  button.classList.add('drag-source');
}

function isDropTarget(target) {
  return drag && target?.closest?.('.drop-zone') === drag.wrapper.querySelector('.drop-zone');
}

editor.addEventListener('dragstart', event => {
  const button = event.target.closest('[data-choice]');
  if (!button) return;
  startDrag(button);
  event.dataTransfer.effectAllowed = 'copy';
  event.dataTransfer.setData('application/x-vibe-choice', button.dataset.choice);
});
editor.addEventListener('dragover', event => {
  if (!drag) return;
  event.preventDefault();
  const valid = Boolean(isDropTarget(event.target));
  event.dataTransfer.dropEffect = valid ? 'copy' : 'none';
  drag.wrapper.classList.toggle('drag-over', valid);
});
editor.addEventListener('dragleave', event => {
  if (drag && !isDropTarget(event.relatedTarget)) drag.wrapper.classList.remove('drag-over');
});
document.addEventListener('drop', event => {
  if (!drag) return;
  event.preventDefault();
  if (isDropTarget(event.target)) selectExample(drag.wrapper, drag.button);
  cancelDrag();
});
document.addEventListener('dragend', cancelDrag);
window.addEventListener('blur', cancelDrag);

// A separate touch grip leaves the rest of each card available for scrolling.
function updateTouchTarget() {
  const target = document.elementFromPoint(drag.x, drag.y);
  drag.wrapper.classList.toggle('drag-over', Boolean(isDropTarget(target)));
}

function scrollWhileDragging() {
  if (!drag?.ghost) return;
  const edge = Math.min(95, innerHeight * 0.15);
  const distance = drag.y < edge ? drag.y - edge : Math.max(0, drag.y - innerHeight + edge);
  if (distance) {
    window.scrollBy(0, Math.sign(distance) * Math.min(15, Math.ceil(Math.abs(distance) / 5)));
    updateTouchTarget();
  }
  touchScrollFrame = requestAnimationFrame(scrollWhileDragging);
}

editor.addEventListener('pointerdown', event => {
  const grip = event.target.closest('.touch-grip');
  if (!grip || event.pointerType === 'mouse' || !event.isPrimary) return;
  event.preventDefault();
  const button = grip.closest('[data-choice]');
  startDrag(button);
  drag.pointerId = event.pointerId;
  drag.x = event.clientX;
  drag.y = event.clientY;
  drag.ghost = document.createElement('div');
  drag.ghost.className = 'drag-ghost';
  drag.ghost.textContent = button.querySelector('.example-label').textContent;
  drag.ghost.style.left = drag.x + 'px';
  drag.ghost.style.top = drag.y + 'px';
  document.body.append(drag.ghost);
  button.setPointerCapture(event.pointerId);
  touchScrollFrame = requestAnimationFrame(scrollWhileDragging);
});
editor.addEventListener('pointermove', event => {
  if (drag?.pointerId !== event.pointerId) return;
  drag.x = event.clientX;
  drag.y = event.clientY;
  drag.ghost.style.left = drag.x + 'px';
  drag.ghost.style.top = drag.y + 'px';
  updateTouchTarget();
});
editor.addEventListener('pointerup', event => {
  if (drag?.pointerId !== event.pointerId) return;
  if (isDropTarget(document.elementFromPoint(event.clientX, event.clientY))) selectExample(drag.wrapper, drag.button);
  suppressTouchClick = true;
  setTimeout(() => { suppressTouchClick = false; }, 0);
  cancelDrag();
});
editor.addEventListener('pointercancel', event => {
  if (drag?.pointerId === event.pointerId) cancelDrag();
});
editor.addEventListener('lostpointercapture', event => {
  if (drag?.pointerId === event.pointerId) cancelDrag();
});

stepNav.innerHTML = stages.map(stage => `<button type="button" class="step-button" data-stage="${stage.id}" aria-controls="workspace">
  <span class="step-icon">${icon(stage.id)}</span><span class="step-name">${stage.title}</span>
  <span class="step-check" aria-hidden="true"></span><span class="step-status sr-only"></span>
</button>`).join('');
document.querySelector('#tools-icon').innerHTML = icon('tools');
document.querySelector('#improvement-grid').innerHTML = improvements.map(item => `
  <article class="improvement" data-tone="${item.tone}">
    <span class="improvement-icon">${toolIllustration(item.id)}</span>
    <div><h3>${item.title}</h3><p>${item.description}</p></div>
    <button class="mini-copy" type="button" data-copy="${item.id}" aria-label="Скопировать запрос «${item.title}»"><span>Копировать</span></button>
  </article>`).join('');
document.addEventListener('click', event => {
  if (event.target.closest('[data-toolbox]') && !toolbox.open) toolbox.showModal();
});
toolbox.addEventListener('click', event => {
  const trigger = event.target.closest('[data-copy]');
  if (trigger) void copyPrompt(trigger);
});
document.querySelector('#generate-icon').innerHTML = icon('spark');

stepNav.addEventListener('click', event => {
  const button = event.target.closest('[data-stage]');
  if (button) activateStage(button.dataset.stage);
});
generateButton.addEventListener('click', showResult);

editor.addEventListener('input', event => {
  const wrapper = event.target.closest('[data-field]');
  if (!wrapper || !event.target.matches('input, textarea')) return;
  const field = fieldsById.get(wrapper.dataset.field);
  previousAnswers.delete(field.id);
  updateAnswer(field, wrapper, event.target.value);
});

editor.addEventListener('click', event => {
  if (suppressTouchClick) return;
  const button = event.target.closest('button');
  if (!button) return;

  if (button.matches('.info-button')) {
    openOrCloseTip(button.closest('.example'));
    return;
  }

  const wrapper = button.closest('[data-field]');
  if (wrapper) {
    const field = fieldsById.get(wrapper.dataset.field);
    const input = wrapper.querySelector('input, textarea');
    if (button.matches('[data-page]')) {
      const current = pages.get(field.id) || 0;
      const last = Math.ceil(field.options.length / pageSize) - 1;
      pages.set(field.id, Math.max(0, Math.min(last, current + Number(button.dataset.page))));
      closeTip();
      wrapper.querySelector('.examples').innerHTML = renderOptions(field);
      updateField(field, wrapper);
      if (button.disabled) wrapper.querySelector('[data-page]:enabled')?.focus({preventScroll:true});
      return;
    }
    if (button.matches('[data-choice]')) {
      selectExample(wrapper, button);
    } else if (button.matches('[data-undo]') && previousAnswers.has(field.id)) {
      input.value = previousAnswers.get(field.id);
      previousAnswers.delete(field.id);
      input.focus({ preventScroll: true });
      updateAnswer(field, wrapper, input.value);
    }
    return;
  }

  if (button.matches('[data-copy]')) {
    void copyPrompt(button);
    return;
  }
  const stageIndex = stages.findIndex(stage => stage.id === activeStage);
  if (button.matches('[data-route]')) {
    stepNav.querySelector('[aria-current]').focus({ preventScroll: true });
    stepNav.closest('.route').scrollIntoView({ block: 'start' });
  }
  if (button.matches('[data-edit]')) activateStage(activeStage);
  if (button.matches('[data-previous]') && stageIndex > 0) activateStage(stages[stageIndex - 1].id);
  if (button.matches('[data-continue]')) {
    const next = stages[stageIndex + 1] ?? stages.find(stage => !isStageComplete(stage));
    if (next) activateStage(next.id);
    else showResult();
  }
});

document.addEventListener('click', event => {
  if (openedTip && !openedTip.contains(event.target)) closeTip(true);
});
document.addEventListener('focusin', event => {
  if (openedTip && !openedTip.contains(event.target)) closeTip(true);
});
editor.addEventListener('pointerout', event => {
  const wrapper = event.target.closest('.example');
  if (wrapper && !wrapper.contains(event.relatedTarget) && wrapper !== openedTip) {
    wrapper.classList.remove('tip-muted');
  }
});
editor.addEventListener('focusout', event => {
  const wrapper = event.target.closest('.example');
  if (wrapper && !wrapper.contains(event.relatedTarget)) wrapper.classList.remove('tip-muted');
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  cancelDrag();
  if (openedTip) closeTip(true);
  for (const wrapper of editor.querySelectorAll('.example:hover, .example:focus-within')) {
    wrapper.classList.add('tip-muted');
  }
});
copyDialog.addEventListener('close', () => {
  manualText.value = '';
  if (copyTrigger?.isConnected) copyTrigger.focus({ preventScroll: true });
  copyTrigger = null;
});

renderStage(stages.find(stage => stage.id === activeStage));
updateProgress();
