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

      // the game will be ended by a timer, and slides are infinite
      case "minutes":
        return false;

      // no other types are supported
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
    if (this.LIMIT.type === "slides") {
      showProgress(`${this.position + 1} / ${this.LIMIT.amount}`);
    }
  }
  _setImageToCurrentPosition() {
    const display = document.getElementById("game-display");
    display.src = this.slides[this.position];
  }
  next() {
    this.position++;
    this._update();
    this._setImageToCurrentPosition();
  }
  last() {
    if (position > 0) {
      this.position--;
    }
    this._update();
    this._setImageToCurrentPosition();
  }
}

// Note that a const binding != const values
const settings = {
  ALLOWED_TYPES: ["slides", "minutes"],
  // note that limit needs to be an object in order to avoid being passed by value
  limit: {
    type: "slides",
    amount: 15,
  },
};

function showInputError(message) {
  document.getElementById("input-error-message").textContent = message;
}

function showProgress(text) {
  document.getElementById("progress").textContent = text;
}

function startTimer(endTime /* as a Date */) {
  var x = setInterval(function () {
    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = endTime.getTime() - now;

    // TODO: Fix when distance >= 60min
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    showProgress(minutes + "m " + seconds + "s ");

    // If the count down is finished, write some text
    if (distance < 0) {
      clearInterval(x);
      showProgress("TIME'S UP");
      endGame();
    }
  }, 900);
}

function milliseconds(min, sec = 0) {
  return (min * 60 + sec) * 1000;
}

// state management
function startGame() {
  loadSlideshow();
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

  if (type === "minutes") {
    // end game in a few minutes
    showProgress(`${settings.limit.amount} m 00s`);
    startTimer(new Date(Date.now() + milliseconds(settings.limit.amount)));
  } else if (type === "slides") {
    showProgress(`1 / ${settings.limit.amount}`);
  }

  // show the user the game
  hideElementIds("MainMenuContainer", "start-screen", "end-screen");
  showElementIds("progress", "main");
  document.getElementById("game-window").style.display = "flex";
  document.getElementById("footer").style.display = "flex";
}

function endGame() {
  hideElementIds("start-screen", "game-window", "progress", "footer");
  document.getElementById("end-screen").style.display = "block";
}

function hideElementIds(...ids) {
  for (const id of ids) {
    styleElement(id, "none");
  }
}

function showElementIds(...ids) {
  for (const id of ids) {
    styleElement(id, "block");
  }
}

function styleElement(id, style) {
  for (const ele of document.querySelectorAll(`#${id}`)) {
    ele.style.display = style;
  }
}

// game logic
// loadSlideshow is a bodge - Go back and fix later
function loadSlideshow() {
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
    console.debug(data);
    console.debug(urls);

    const presentation = new SlideShow(settings, data);
    console.log("Loaded slideshow");

    // note the anonymous function is necessary to maintain the proper this context
    document
      .getElementById("next")
      .addEventListener("click", () => presentation.next());
    document
      .getElementById("game-window")
      .addEventListener("click", () => presentation.next());
    document
      .getElementById("last")
      .addEventListener("click", () => presentation.last());

    // set initial picture
    presentation.next();
  })();
}
