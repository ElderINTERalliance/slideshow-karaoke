"use strict";

import data from "./urls.json" assert { type: "json" };
let urls = data.urls;

function* generateUrls() {
    while (true) {
        if (urls.length == 0) {
            urls = data.urls;
            console.debug("reset")
        }
        // select a random url
        let randChoice = urls[Math.floor(Math.random() * urls.length)];
        // remove it from the list
        urls = urls.filter(url => url !== randChoice);
        // if we have used all the urls, reset the list
        yield randChoice;
    }
}


for (let i = 0; i < 30; i++) {
    console.log(generateUrls().next().value)
}
