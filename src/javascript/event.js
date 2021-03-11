export default function Event({ target, pagingTarget, prefix, list }) {
  this.target = target;
  this.pagingTarget = pagingTarget;
  this.prefix = prefix;
  this.panel = null;
  this.list = list;
  this.leftArrow = null;
  this.rightArrow = null;
  this.indicator = null;
}

Event.prototype = {
  init,
  renderEvent,
  getEventBlock,
  renderArrow,
  renderIndicator,
  createArrowEvent,
  createIndicatorEvent,
  arrowEvent,
  indicatorEvent,
  movePanel
}

Event.constructor = Event;

function init() {
  this.renderEvent();
  this.renderArrow();
  this.renderIndicator();
  this.createArrowEvent();
  this.createIndicatorEvent();
  this.arrowEvent('prev', false);
}

function renderEvent() {
  const panel = document.createElement('div');
  panel.classList.add('panel');
  panel.innerHTML = this.list.reduce((acc, item) => acc += this.getEventBlock(item), '');
  this.target.append(panel);
  this.panel = panel;
}

function getEventBlock(item) {
  return `<a class="panel__item"><img src="${this.prefix}${item.src}"></a>`;
}

function renderArrow() {
  const arrowWrap = document.createElement('div');
  arrowWrap.classList.add('paging-arrow');

  const leftArrow = document.createElement('div');
  leftArrow.classList.add('paging-arrow__left');
  leftArrow.dataset.arrow = 'prev';

  const rightArrow = document.createElement('div');
  rightArrow.classList.add('paging-arrow__right');
  rightArrow.dataset.arrow = 'next';

  arrowWrap.append(leftArrow);
  arrowWrap.append(rightArrow);
  this.pagingTarget.append(arrowWrap);
  this.leftArrow = leftArrow;
  this.rightArrow = rightArrow;
}

function renderIndicator() {
  const indicatorWrap = document.createElement('div');
  indicatorWrap.classList.add('paging-indicator');

  const buttons = this.list.reduce((acc, _) => acc += '<div class="paging-indicator__button"></div>', '');
  indicatorWrap.innerHTML = buttons;
  indicatorWrap.children[1].classList.add('active');

  this.pagingTarget.append(indicatorWrap);
  this.indicator = indicatorWrap;
}

function createArrowEvent() {
  this.leftArrow.addEventListener('click', () => this.arrowEvent('prev'));
  this.rightArrow.addEventListener('click', () => this.arrowEvent('next'));
}

function createIndicatorEvent() {
  this.indicator.addEventListener('click', ({ target }) => this.indicatorEvent(target));
}

function arrowEvent(type) {
  const toggleTransitionClassName = 'transition-on';
  const transitionClassName = 'move-' + type;
  const { panel } = this;
  panel.classList.add(toggleTransitionClassName, transitionClassName);
  setTimeout(() => {
    this.movePanel(type);
    panel.classList.remove(toggleTransitionClassName, transitionClassName);
  }, 300);
}

function indicatorEvent(target) {
  if(target.classList.contains('active')) return;
  let activeIndex = 0;
  let targetIndex = 0;
  this.indicator.childNodes.forEach((elem, i) => {
    if(elem.classList.contains('active'))
      activeIndex = i;
    if(elem === target)
      targetIndex = i;
  });
  let sum = activeIndex - targetIndex;
  let type = 'prev';
  if(sum < 0) {
    type = 'next';
    sum *= -1;
  }
  while(sum-- > 0) {
    this.movePanel(type);
  }
}

function movePanel(type) {
  const { panel, indicator } = this;
  let front = panel.firstElementChild;
  let end = null;
  let indicatorFront = indicator.lastElementChild;
  let indicatorEnd = indicator.firstElementChild;
  if(type === 'prev') {
    front = panel.lastElementChild;
    end = panel.firstElementChild;
    indicatorFront = indicator.firstElementChild;
    indicatorEnd = null;
  }
  panel.insertBefore(front, end);
  indicator.insertBefore(indicatorFront, indicatorEnd);
}
