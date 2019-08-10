const IMAGES = ['silly', 'lookin-up', 'coy'];
const INTERVAL_MS = 2 * 1000;
const IMAGE_PREFIX = 'public/images/';
const IMAGE_SUFFIX = '.jpg';
const ANIM_FRAME = 1000 / 60;

function run() {
  setTimeout(transition, INTERVAL_MS);
}

function getRandom(arr, exclude) {
  let result;
  do {
    result = arr[Math.floor(Math.random() * arr.length)];
  } while (result === exclude);
  return result;
}

function nameToURL(name) {
  return `${IMAGE_PREFIX}${name}${IMAGE_SUFFIX}`;
}

async function transition() {
  let curImg = document.getElementById('main-img');
  let curName = curImg.dataset.name;

  let nextImgName = getRandom(IMAGES, curName);
  let nextImg = await loadOffscreen(nextImgName);

  await pushLeft(curImg, nextImg);
  setTimeout(transition, INTERVAL_MS);
}

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function pushLeft(curImg, nextImg) {
  curImg.insertAdjacentElement('afterend', nextImg);
  let { width } = curImg.getBoundingClientRect();

  nextImg.setAttribute('id', 'main-img');
  nextImg.classList.add('fullscreen');
  nextImg.style.zIndex = 1;

  let remaining = -width;
  let interval = 0.01 * width;
  while (remaining < 0) {
    await wait(ANIM_FRAME);
    remaining += interval;
    remaining = Math.min(0, remaining);
    nextImg.style.left = `${remaining}px`;
  }

  nextImg.style.zIndex = 0;
  nextImg.style.left = '0';
  curImg.remove();
}

async function loadOffscreen(name) {
  let url = nameToURL(name);
  let el = document.createElement('img');
  el.setAttribute('src', url);
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  el.dataset.name = name;

  let promise = new Promise((resolve, reject) => {
    el.addEventListener('load', resolve);
    el.addEventListener('abort', reject);
    el.addEventListener('error', reject);
  });

  document.body.appendChild(el);
  return promise.then(() => el);
}

document.addEventListener('DOMContentLoaded', run);
