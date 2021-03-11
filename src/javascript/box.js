import API from './api.js';

const api = new API();
const numberWithCommas = s => String(s).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export default function Box({target, buttonTarget, page = 1, count = 5}) {
  this.target = target;
  this.buttonTarget = buttonTarget;
  this.page = page;
  this.count = count;
  this.boxLength = 0;
  this.boxPrefix = 'box__item';
  this.buttonPrefix = 'more-button';
  this.countTarget = null;
}

Box.prototype = {
  init,
  getBoxLength,
  getBoxList,
  renderBoxList,
  getBoxBlock,
  renderMoreButton,
  isMoreItem,
  setDisableMoreButton,
  updateCount,
  createMoreEvent,
}

Box.constructor = Box;

async function init() {
  this.boxLength = await this.getBoxLength();
  this.renderMoreButton();
  await this.renderBoxList();
  this.createMoreEvent();
}

async function renderBoxList() {
  const data = await this.getBoxList();
  if(data && data.list) {
    const { prefix, list } = data;
    const boxList = list.reduce((acc, cur) => acc += this.getBoxBlock({prefix, item : cur}), '');
    this.target.insertAdjacentHTML('beforeend', boxList);
    this.updateCount();
    if(!this.isMoreItem()) {
      this.setDisableMoreButton();
    }
    this.page += 1;
  }
}

function getBoxList() {
  return api.getItem({ type: 'box', page: this.page, count: this.count});
}

function getBoxBlock({ prefix = '', item }) {
  const boxPrefix = this.boxPrefix;
  return `
  <a class="${boxPrefix}" href="">
    <img class="${boxPrefix}__img" src="${prefix}${item.src}" alt="">
    <span class="${boxPrefix}__title">${item.title}</span>
    <span class="${boxPrefix}__price">${numberWithCommas(item.price)}원</span>
  </a>
  `
}

function renderMoreButton() {
  const buttonPrefix = this.buttonPrefix;
  const button = document.createElement('div');
  button.classList.add(buttonPrefix);
  button.id = 'moreBoxButton';

  const text = document.createElement('span');
  text.classList.add(`${buttonPrefix}__text`);

  const count = document.createElement('span');
  count.classList.add(`${buttonPrefix}__count`);
  button.appendChild(text);
  button.appendChild(count);
  this.buttonTarget.appendChild(button);
  this.countTarget = count;
  this.moreButton = button;
  this.updateCount();
}

function updateCount() {
  const count = Math.min(this.count * this.page, this.boxLength);
  this.countTarget.textContent = `(${count} / ${this.boxLength})`;
}

function createMoreEvent() {
  moreBoxButton.addEventListener('click', () => this.renderBoxList());
}

function isMoreItem() {
  return this.count * this.page < this.boxLength;
}

function setDisableMoreButton() {
  console.log(this);
  this.moreButton.classList.add('not-used');
}

async function getBoxLength() {
  const data = await api.getBoxItemLength();
  return data.length;
}
