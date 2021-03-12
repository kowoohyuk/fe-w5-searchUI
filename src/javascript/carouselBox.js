export default function CarouselBox({ target, pagingTarget, prefix, list }) {
  this.target = target;
  this.pagingTarget = pagingTarget;
  this.prefix = prefix;
  this.list = list;
  this.leftArrow = null;
  this.rightArrow = null;
  this.pagingInterval = null;
}

CarouselBox.prototype = {
  init,
  renderCarouselBox,
  getCarouselBoxBlock,
  setTargetInitialStyle,
  renderArrow,
  createArrowEvent,
  moveCarouselBox,
  shuffleCarouselBoxItem
}

CarouselBox.constructor = CarouselBox;

function init() {
  this.renderCarouselBox();
  this.setTargetInitialStyle();
  this.renderArrow();
  this.createArrowEvent();
}

function renderCarouselBox() {
  const boxList = this.list.reduce((acc, item) => acc += this.getCarouselBoxBlock(item), '');
  this.target.insertAdjacentHTML('beforeend', boxList);
}

function getCarouselBoxBlock(item) {
  return `
    <a class="box__item carousel__item" href="">
      <img class="box__item__img" src="${this.prefix}${item.src}">
      <span class="box__item__title">${item.title}</span>
      <span class="box__item__content">${item.content}</span>
      <span class="box__item__tag">${item.tag}</span>
    </a>
  `;
}

function setTargetInitialStyle() {
  const { target, list } = this;
  target.style.width = `${list.length * 20}%`;
  setTimeout(() => {
    const childWidth = target.firstElementChild.getBoundingClientRect().width;
    target.dataset.width = childWidth;
    target.dataset.default_width = childWidth * -parseInt(list.length / 2);
    target.style.transform = `translateX(${target.dataset.default_width}px)`;
  }, 300);
}

function renderArrow() {
  const arrowPrefixClassName = 'box-paging__arrow';
  const arrowWrap = document.createElement('div');
  arrowWrap.classList.add(arrowPrefixClassName);

  const leftArrow = document.createElement('div');
  leftArrow.classList.add(`${arrowPrefixClassName}__left`);
  leftArrow.dataset.arrow = 'prev';

  const rightArrow = document.createElement('div');
  rightArrow.classList.add(`${arrowPrefixClassName}__right`);
  rightArrow.dataset.arrow = 'next';

  arrowWrap.append(leftArrow);
  arrowWrap.append(rightArrow);
  this.pagingTarget.append(arrowWrap);
  this.leftArrow = leftArrow;
  this.rightArrow = rightArrow;
}

function createArrowEvent() {
  this.pagingTarget.addEventListener('mousedown', ({ target }) => {
    this.pagingInterval = setInterval(() => {
      this.moveCarouselBox(target.dataset.arrow, 2);
      target.dataset.moved = '1';
    }, 2000);
  });
  this.pagingTarget.addEventListener('mouseup', ({ target }) => {
    if(!target.dataset.moved) {
      this.moveCarouselBox(target.dataset.arrow);
    }
    delete target.dataset.moved;
    clearInterval(this.pagingInterval);
  });
}

function moveCarouselBox(type, count = 1) {
  if(!type) return;
  const { target } = this;
  let move = +target.dataset.width * count;
  if(type === 'next') {
    move *= -1;
  }
  target.classList.add('transition-on');
  target.style.transform = `translateX(${+target.dataset.default_width + move}px)`;
  this.shuffleCarouselBoxItem(type, count);
} 

function shuffleCarouselBoxItem(type, count) {
  const { target } = this;
  let first = null;
  let end = null;
  setTimeout(() => {
    while(count-- > 0) {
      if(type === 'prev') {
        first = target.lastElementChild;
        end = target.firstElementChild;
      }
      if(type === 'next') {
        first = target.firstElementChild;
      }
      target.classList.remove('transition-on');
      target.insertBefore(first, end);
    }
    target.style.transform = `translateX(${target.dataset.default_width}px)`;
  }, 300);
}
