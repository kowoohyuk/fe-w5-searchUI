import Rolling from './rolling.js';

export default function RollKeyword({ target, keywords }) {
  this.target = target;
  this.keywords = keywords;
};

RollKeyword.prototype = {
  init,
  renderRollKeyword,
  getRollKeywordBlock,
  createRollKeywordEvent
}

RollKeyword.constructor = RollKeyword;

function init() {
  this.renderRollKeyword();
  this.createRollKeywordEvent();
}

function renderRollKeyword() {
  const { target, keywords, getRollKeywordBlock } = this;
  target.innerHTML = keywords.reduce((acc, cur, idx) => acc += getRollKeywordBlock({ cur, idx }), '');
}

function getRollKeywordBlock({ cur, idx }) {
  return `<li><span class="keyword__rank">${idx + 1}</span><span>${cur}</span></li>`
}

function createRollKeywordEvent() {
  new Rolling({ target : this.target, ms : 300}).init();
}