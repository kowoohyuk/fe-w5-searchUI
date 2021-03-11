export default function Best({ target, prefix, list }) {
  this.target = target;
  this.prefix = prefix;
  this.list = list;
}

Best.prototype = {
  init,
  renderBest,
  getBestBlock,
}

Best.constructor = Best;

async function init() {
  this.renderBest();
}

function renderBest() {
  this.target.innerHTML = this.getBestBlock();
}

function getBestBlock() {
  return `<a><img src="${this.prefix}${this.list[0].src}"></a>`;
}
