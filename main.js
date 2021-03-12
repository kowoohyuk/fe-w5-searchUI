import API from './src/javascript/api.js';
import RollKeyword from './src/javascript/rollKeyword.js';
import Best from './src/javascript/best.js';
import Event from './src/javascript/event.js';
import Box from './src/javascript/box.js';
import CarouselBox from './src/javascript/carouselBox.js';

const rollKeywordTarget = document.getElementById('rollKeywordTarget');
const bestItemTarget = document.getElementById('bestTarget');
const eventTarget = document.getElementById('eventTarget');
const eventPagingTarget = document.getElementById('eventPagingTarget');
const boxTarget = document.getElementById('boxTarget');
const moreButtonTarget = document.getElementById('moreButtonTarget');
const carouselBoxTarget = document.getElementById('carouselBoxTarget');
const carouselBoxPagingTarget = document.getElementById('carouselBoxPagingTarget');

// 12시 전 까지 할 일
// carouselBox 분리
// 검색 기능 분리하여 구현
// 검색 화살표 이동 기능 구현
// 검색 텍스트 입력 후 엔터 시 로컬 스토리지 저장

// 2시 이전까지 발표할 주제 결정해야함.
// 리팩토링?

// 이후 3시 30분까지 발표 자료 작성 및 리허설

const api = new API();

const init = () => {
  createRollKeyword(rollKeywordTarget);
  createBest(bestItemTarget);
  createEvent({ target : eventTarget, pagingTarget : eventPagingTarget });
  createBox({ target : boxTarget, buttonTarget : moreButtonTarget });
  createCarouselBox({ target : carouselBoxTarget, pagingTarget : carouselBoxPagingTarget })
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

const createCarouselBox = async ({ target, pagingTarget }) => {
  const data = await api.getItem({ type : 'carousel' });
  const carouselBox = new CarouselBox({ target, pagingTarget, ...data });
  carouselBox.init();
}


init();
