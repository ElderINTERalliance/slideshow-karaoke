"use strict";

import data from "./urls.json" assert { type: "json" };
const urls = data.urls;

function* generateUrls() {
    while (true) {
        // select a random url
        yield urls[Math.floor(Math.random() * urls.length)];
    }
}

console.log(generateUrls().next().value)
console.log(generateUrls().next().value)
console.log(generateUrls().next().value)
