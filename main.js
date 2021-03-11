import API from './src/javascript/api.js';
import RollKeyword from './src/javascript/rollKeyword.js';
import Box from './src/javascript/box.js';
import Best from './src/javascript/best.js';
import Event from './src/javascript/event.js';


const themePagingArrow = document.getElementById('themePagingArrow');
const themeTarget = document.getElementById('themeTarget');

const rollKeywordTarget = document.getElementById('rollKeywordTarget');
const bestItemTarget = document.getElementById('bestTarget');
const eventTarget = document.getElementById('eventTarget');
const eventPagingTarget = document.getElementById('eventPagingTarget');
const boxTarget = document.getElementById('boxTarget');
const moreButtonTarget = document.getElementById('moreButtonTarget');

const api = new API();

const init = () => {

  ////////////// Theme carousel
  const getTheme = async () => {
    const data = await api.getItem({ type: 'carousel' });
    if(data) renderTheme(data);
  }
  const renderTheme = ({prefix, list}) => {
    const str = list.reduce((acc, cur) => {
      /*html*/
      acc += `
      <a class="box__item carousel__item" href="">
        <img class="box__item__img" src="${prefix}${cur.src}">
        <span class="box__item__title">${cur.title}</span>
        <span class="box__item__content">${cur.content}</span>
        <span class="box__item__tag">${cur.tag}</span>
      </a>`
      return acc;
    }, '');
    themeTarget.style.width = `${list.length * 20}%`;
    themeTarget.innerHTML = str;
    setTimeout(() => {
      const childWidth = themeTarget.firstElementChild.getBoundingClientRect().width;
      themeTarget.dataset.width = childWidth;
      themeTarget.dataset.default_width = childWidth * -parseInt(list.length / 2);
      themeTarget.style.transform = `translateX(${themeTarget.dataset.default_width}px)`;
    }, 500);
  }

  const handleThemeCarousel = (target, count = 1) => moveThemeCarousel(target.dataset.arrow, count);

  const moveThemeCarousel = (target, count) => {
    let first = null;
    let end = null;
    let move = +themeTarget.dataset.width * count;
    if(target === 'next') {
      move *= -1;
    }
    themeTarget.classList.add('transition-on');
    themeTarget.style.transform = `translateX(${+themeTarget.dataset.default_width + move}px)`;
    setTimeout(() => {
      while(count-- > 0) {
        if(target === 'prev') {
          first = themeTarget.lastElementChild;
          end = themeTarget.firstElementChild;
        }
        if(target === 'next') {
          first = themeTarget.firstElementChild;
        }
        themeTarget.classList.remove('transition-on');
        themeTarget.insertBefore(first, end);
      }
      themeTarget.style.transform = `translateX(${themeTarget.dataset.default_width}px)`;
    }, 300);
  }

  let themePagingInterval = null;
  themePagingArrow.addEventListener('mousedown', ({ target }) => {
    themePagingInterval = setInterval(() => {
      handleThemeCarousel(target, 2);
      target.dataset.moved = '1';
    }, 2000);
  });
  themePagingArrow.addEventListener('mouseup', ({ target }) => {
    if(!target.dataset.moved) {
      handleThemeCarousel(target);
    }
    delete target.dataset.moved;
    clearInterval(themePagingInterval);
  });
  

  createRollKeyword(rollKeywordTarget);
  createBest(bestItemTarget);
  createEvent({ target : eventTarget, pagingTarget : eventPagingTarget });
  createBox({target : boxTarget, buttonTarget : moreButtonTarget });

  getTheme();
}

const createRollKeyword = async target => {
  const keywords = await api.getKeyword();
  const rollKeyword = new RollKeyword({target, keywords});
  rollKeyword.init();
}

const createBest = async target => {
  const data = await api.getItem({ type : 'best' });
  const best = new Best({ target, ...data });
  best.init();
}

const createEvent = async ({ target, pagingTarget }) => {
  const data = await api.getItem({ type : 'event' });
  const event = new Event({ target, pagingTarget, ...data });
  event.init();
}

const createBox = ({ target, buttonTarget }) => {
  const box = new Box({ target, buttonTarget });
  box.init();
}

init();
