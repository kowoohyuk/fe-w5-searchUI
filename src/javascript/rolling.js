export default function Rolling({target, ms = 300}) {
  this.target = target;
  this.ms = ms;
}

Rolling.prototype = {
  init,
  createEvent,
  interval,
  moving,
  timeout,
  rollBack
};

Rolling.constructor = Rolling;

function init() {
  this.maxCount = this.target.childElementCount;
  this.gap = this.target.firstElementChild.getBoundingClientRect().height;
  this.createEvent();
}

function createEvent() {
  this.interval();
}

function interval() {
  setInterval(() => this.moving(), this.ms * 5);
}

function moving() {
  const target = this.target;
  target.classList.add('transition-on');
  target.style.transform = `translateY(${-this.gap}px)`;
  this.timeout();
}

function timeout() {
  setTimeout(() => this.rollBack(), this.ms);
}

function rollBack() {
  const target = this.target;
  target.classList.remove('transition-on');
  target.insertBefore(target.firstElementChild, null);
  target.style.transform = `translateY(0px)`;
}
