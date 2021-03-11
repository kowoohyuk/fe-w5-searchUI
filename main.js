import API from './src/javascript/api.js';
import RollKeyword from './src/javascript/rollKeyword.js';
import Box from './src/javascript/box.js';

const bestItemTarget = document.getElementById('bestItemTarget');
const pagingArrow = document.getElementById('pagingArrow');
const pagingHover = document.getElementById('pagingHover');
const panel = document.querySelector('.panel');
const eventItemTarget = document.getElementById('eventItemTarget');
const themePagingArrow = document.getElementById('themePagingArrow');
const themeTarget = document.getElementById('themeTarget');


const rollKeywordTarget = document.getElementById('rollKeywordTarget');
const boxTarget = document.getElementById('boxTarget');
const moreButtonTarget = document.getElementById('moreButtonTarget');

const api = new API();

const init = () => {
  
  ////////////// Best
  const getBest = async () => {
    const data = await api.getItem({ type : 'best' });
    if(data) renderBest(data);
  };
  const renderBest = ({prefix, list}) => bestItemTarget.innerHTML = `<a class="carousel__item"><img src="${prefix}${list[0].src}"></a>`;

  const moveCarousel = (target, transition = true) => {
    if(target.dataset.arrow === 'prev') {
      if(transition) {
        panel.classList.add('transition-on', 'move-prev');
      }
      setTimeout(() => {
        const list = panel.querySelectorAll('.panel__item');
        panel.insertBefore(list[list.length - 1], list[0]);
        pagingHover.insertBefore(pagingHover.firstElementChild, null);
        panel.classList.remove('transition-on', 'move-prev');
      }, 300);
    }
    if(target.dataset.arrow === 'next') {
      if(transition) {
        panel.classList.add('transition-on', 'move-next');
      }
      setTimeout(() => {
        const list = panel.querySelectorAll('.panel__item');
        panel.insertBefore(list[0], null);
        pagingHover.insertBefore(pagingHover.lastElementChild, pagingHover.firstElementChild);
        panel.classList.remove('transition-on', 'move-next');
      }, 300);
    }
  }

  pagingHover.addEventListener('click', ({ target }) => {
    if(!target.classList.contains('active')) {
      const list = pagingHover.querySelectorAll('div');
      let activeIndex = 0;
      let targetIndex = 0;
      for(let i = 0; i < list.length; i++) {
        if(list[i].classList.contains('active')) {
          activeIndex = i;
        }
        if(list[i] === target) {
          targetIndex = i;
        }
      }
      let sum = activeIndex - targetIndex;
      let str = 'prev';
      if(sum < 0) {
        str = 'next';
        sum *= -1;
      }
      while(sum-- > 0) {
        if(str === 'prev') {
          const list = panel.querySelectorAll('.panel__item');
          panel.insertBefore(list[list.length - 1], list[0]);
          pagingHover.insertBefore(pagingHover.firstElementChild, null);
        } else {
          const list = panel.querySelectorAll('.panel__item');
          panel.insertBefore(list[0], null);
          pagingHover.insertBefore(pagingHover.lastElementChild, pagingHover.firstElementChild);
        }
      }
    }
  });

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
    // 작업 중
    // const tmp = new Carousel(themeTarget, themeTarget.querySelectorAll('.carousel__item'));
    // tmp.init();
    setTimeout(() => {
      const childWidth = themeTarget.firstElementChild.getBoundingClientRect().width;
      themeTarget.dataset.width = childWidth;
      themeTarget.dataset.default_width = childWidth * -parseInt(list.length / 2);
      themeTarget.style.transform = `translateX(${themeTarget.dataset.default_width}px)`;
    }, 500);
  }

  const getEvent = async () => {
    const data = await api.getItem({ type : 'event' });
    if(data) renderEvent(data);
  };

  const renderEvent = ({prefix, list}) => {
    const str = list.reduce((acc, cur) => acc += `<a class="panel__item"><img src="${prefix}${cur.src}"></a>`, '');
    eventItemTarget.innerHTML = str;
    eventItemTarget.insertBefore(eventItemTarget.lastElementChild, eventItemTarget.firstElementChild);
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

  pagingArrow.addEventListener('click', ({ target }) => moveCarousel(target));
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
  createBox({target : boxTarget, buttonTarget : moreButtonTarget });
  getBest();
  getEvent();
  getTheme();
}

const createRollKeyword = async target => {
  const keywords = await api.getKeyword();
  const rollKeyword = new RollKeyword({target, keywords});
  rollKeyword.init();
}

const createBox = ({ target, buttonTarget }) => {
  const box = new Box({ target, buttonTarget });
  box.init();
}


init();

