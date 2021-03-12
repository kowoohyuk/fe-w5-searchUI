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
const keywordListTarget = document.getElementById('keywordListTarget');

const api = new API();

const init = async () => {
  const keywords = await api.getKeyword();

  createRollKeyword({ target : rollKeywordTarget, keywords });
  createBest(bestItemTarget);
  createEvent({ target : eventTarget, pagingTarget : eventPagingTarget });
  createBox({ target : boxTarget, buttonTarget : moreButtonTarget });
  createCarouselBox({ target : carouselBoxTarget, pagingTarget : carouselBoxPagingTarget });
}

const createRollKeyword = ({ target, keywords }) => {
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
