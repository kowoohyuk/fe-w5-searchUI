const api = require('./api');
const moreBoxButton = document.getElementById('moreBoxButton');
const viewBoxCount = document.getElementById('viewBoxCount');
const totalBoxCount = document.getElementById('totalBoxCount');
const boxTarget = document.getElementById('boxTarget');
const bestItemTarget = document.getElementById('bestItemTarget');
const pagingArrow = document.getElementById('pagingArrow');
const pagingHover = document.getElementById('pagingHover');
const panel = document.querySelector('.panel');
const eventItemTarget = document.getElementById('eventItemTarget');
const themePagingArrow = document.getElementById('themePagingArrow');
const themeTarget = document.getElementById('themeTarget');
const numberWithCommas = s => String(s).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const rollKeywordTarget = document.getElementById('rollKeywordTarget');

const init = () => {
  
  ////////////// Best
  const getBest = async () => {
    const data = await api.getItem('best');
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

  ////////////// Box
  let moreBoxNowPage = 1;
  let moreBoxRowNumber = 5;
  const getBox = async () => {
    const data = await api.getItem('box', moreBoxNowPage, moreBoxRowNumber);
    if(data) {
      moreBoxNowPage += 1;
      setviewBoxCount(data.list.length);
      renderBox(data);
    }
    checkMoreButton();
  }

  const getBoxLength = async () => {
    const data = await api.getBoxItemLength();
    if(data) setTotalBoxCount(data.length);
  }

  const setTotalBoxCount = length => {
    if(length)
      totalBoxCount.textContent = length;
  }

  const setviewBoxCount = length => {
    if(length)
      viewBoxCount.textContent = viewBoxCount.textContent ? +viewBoxCount.textContent + length : length;
  }

  const renderBox = ({prefix, list}) => {
    /*html*/
    str = list.reduce((acc, cur) => 
      acc += `
      <a class="box__item" href="">
        <img class="box__item__img" src="${prefix}${cur.src}" alt="">
        <span class="box__item__title">${cur.title}</span>
        <span class="box__item__price">${numberWithCommas(cur.price)}원</span>
      </a>
      `
    , '');
    boxTarget.insertAdjacentHTML('beforeend', str);
  }

  const checkMoreButton = () => {
    if(+viewBoxCount.textContent >= +totalBoxCount.textContent) {
      moreBoxButton.classList.add('not-used');
    }
  }

  ////////////// Theme carousel
  const getTheme = async () => {
    const data = await api.getItem('carousel');
    if(data) renderTheme(data);
  }
  const renderTheme = ({prefix, list}) => {
    /*html*/
    str = list.reduce((acc, cur) => {
      acc += `
      <a class="box__item" href="">
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

  const getKeyword = async () => {
    const data = await api.getKeyword();
    if(data) renderRoll(data);
  }

  const getEvent = async () => {
    const data = await api.getItem('event');
    if(data) renderEvent(data);
  };

  const renderEvent = ({prefix, list}) => {
    str = list.reduce((acc, cur) => acc += `<a class="panel__item"><img src="${prefix}${cur.src}"></a>`, '');
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

  moreBoxButton.addEventListener('click', () => getBox());
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
  let rollKeyword = null;
  const renderRoll = list => {
    const str = list.reduce((acc, cur, i) => acc += `<li><span class="keyword__rank">${i + 1}</span><span>${cur}</span></li>`, '');
    rollKeywordTarget.innerHTML = str;
    rollKeywordTarget.dataset.height = rollKeywordTarget.firstElementChild.getBoundingClientRect().height;
    rollKeyword = setInterval(() => keywordRoll(rollKeywordTarget), 1500);
  }
  const keywordRoll = target => {
    target.classList.add('transition-on');
    target.style.transform = `translateY(${-target.dataset.height}px)`;
    setTimeout(() => {
      target.classList.remove('transition-on');
      target.insertBefore(target.firstElementChild, null);
      target.style.transform = `translateY(0px)`;
    }, 300);
  };

  getKeyword();
  getBoxLength();
  getBox();
  getBest();
  getEvent();
  getTheme();
}

init();

