"use strict";

class SlideShow {
  constructor(SETTINGS, data) {
    this.LIMIT = SETTINGS.limit;
    // slides is a list of URLs
    this.slides = [];
    this.position = -1; // this will be immediately incremented
    this.PRELOAD_LIMIT = 5;
    this.data = data;
    this.urls = data.urls;
  }
  // generator function - generates elements for a randomized array of urls
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*
  *generateUrls() {
    while (true) {
      if (this.urls.length == 0) {
        this.urls = this.data.urls;
        console.debug("reset");
      }
      // select a random url
      let randChoice = this.urls[Math.floor(Math.random() * this.urls.length)];
      // remove it from the list
      this.urls = this.urls.filter((url) => url !== randChoice);
      // if we have used all the urls, reset the list
      console.debug(randChoice);
      yield randChoice;
    }
  }
  // asynchronous image preload
  _preloadImage(url) {
    (async () => {
      var img = new Image();
      img.src = url;
    })();
  }
  _shouldEndGame() {
    switch (this.LIMIT.type) {
      case "slides":
        // remember this.position is zero-indexed
        return this.position >= this.LIMIT.amount;

      default:
        return true;
    }
  }
  _update() {
    // make sure we always have 5 preloaded slides ready
    while (this.position > this.slides.length - this.PRELOAD_LIMIT) {
      let url = this.generateUrls().next().value;
      this._preloadImage(url);
      this.slides.push(url);
    }
    if (this._shouldEndGame()) {
      endGame();
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

// Note that a const binding != const values
const settings = {
  ALLOWED_TYPES: ["slides"],
  limit: {
    type: "slides",
    amount: 10,
  },
};

function showInputError(message) {
  document.getElementById("input-error-message").textContent = message;
}

// state management
function startGame() {
  const type = document.getElementById("limit-type").value;
  const amount = document.getElementById("amount").value;

  if (parseInt(amount) == NaN || parseInt(amount) < 1) {
    showInputError("Please enter a number amount greater than 1");
    return;
  }
  if (!settings.ALLOWED_TYPES.includes(type)) {
    showInputError("Please choose an allowed type");
    return;
  }
  showInputError(""); // clear errors

  settings.limit.amount = parseInt(amount);
  settings.limit.type = type;

  // show the user the game
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("end-screen").style.display = "none";
  document.getElementById("game-window").style.display = "flex";
}

function endGame() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-window").style.display = "none";
  document.getElementById("end-screen").style.display = "block";
}

document.getElementById("start-button").addEventListener("click", startGame);

// game logic
(async () => {
  const response = await fetch("./urls.json");
  if (response.status !== 200) {
    console.error(
      "Looks like there was a problem. Status Code: " + response.status
    );
    return;
  }
  const data = await response.json();

  // TODO: remove
  let urls = data.urls;
  console.log(data);
  console.log(urls);

  const presentation = new SlideShow(settings, data);

  // note the anonymous function is necessary to maintain the proper this context
  document
    .getElementById("next")
    .addEventListener("click", () => presentation.next());
  document
    .getElementById("last")
    .addEventListener("click", () => presentation.last());

  // set initial picture
  presentation.next();
})();
