"use strict";

function* generateUrls() {
  while (true) {
    if (urls.length == 0) {
      urls = data.urls;
      console.debug("reset");
    }
    // select a random url
    let randChoice = urls[Math.floor(Math.random() * urls.length)];
    // remove it from the list
    urls = urls.filter((url) => url !== randChoice);
    // if we have used all the urls, reset the list
    console.debug(randChoice);
    yield randChoice;
  }
}

class SlideShow {
  constructor() {
    // slides is a list of URLs
    this.slides = [];
    this.position = -1; // this will be immediately incremented
    this.PRELOAD_LIMIT = 5;
  }
  // asynchronous image preload
  _preloadImage(url) {
    (async () => {
      var img = new Image();
      img.src = url;
    })();
  }
  _update() {
    // make sure we always have 5 preloaded slides ready
    while (this.position > this.slides.length - this.PRELOAD_LIMIT) {
      let url = generateUrls().next().value;
      this._preloadImage(url);
      this.slides.push(url);
    }
  }
  _setImageToCurrentPosition(url) {
    const display = document.getElementById("game-display");
    display.src = this.slides[this.position];
  }
  next() {
    this.position++;
    this._update();
    this._setImageToCurrentPosition();
  }
  last() {
    this.position--;
    this._update();
    this._setImageToCurrentPosition();
  }
}

(async () => {
  const response = await fetch("./urls.json");
  if (response.status !== 200) {
    console.error(
      "Looks like there was a problem. Status Code: " + response.status
    );
    return;
  }
  const data = await response.json();

  let urls = data.urls;
  console.debug(data);
  console.debug(urls);

  const presentation = new SlideShow();

  // note the anonymous function is necessary to maintain the global scope
  document
    .getElementById("next")
    .addEventListener("click", () => presentation.next());
  document
    .getElementById("last")
    .addEventListener("click", () => presentation.last());

  // set initial picture
  presentation.next();
})();
