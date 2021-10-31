function setCookie(cmode, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toGMTString();
    document.cookie = cmode + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cmode) {
    let mode = cmode + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(mode) == 0) {
            return c.substring(mode.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    let user = getCookie("usermode");
    if (user == "light") {
        var modechoice = 1
        skipintro(modechoice)
    }
    if (user == "dark") {
        var modechoice = 2
        skipintro(modechoice)
    }
}

function playButtonClicked() {
    let element1 = document.getElementById("Welcometexttwo");
    element1.classList.remove("introbutton");
    element1.classList.add("changeWelcometwo");
    setTimeout(function() { changeFadedWelcome(); }, 2500);
    let element2 = document.getElementById('playbutton');
    element2.setAttribute('onclick', '');
    element2.classList.add("playbuttonanim");
    element2.classList.remove("innerbutton");
    setTimeout(function() { playbuttontextremove(); }, 2000);
    setTimeout(function() { playbutton2onclickchange(); }, 5000);
    let element3 = document.getElementById('lightbutton');
    element3.classList.add("lightbuttonanim");
    element3.classList.add("button2");
    element3.classList.remove("innerbutton");
    setTimeout(function() { lightbuttontextdisplay(); }, 3000);
    let element4 = document.getElementById('darkbutton');
    element4.classList.add("darkbuttonanim");
    element4.classList.add("button2");
    element4.classList.remove("innerbutton");
    setTimeout(function() { darkbuttontextdisplay(); }, 3000);
    setTimeout(function() { cookieAskPos(); }, 3500);
}

function cookieAskPos() {
    let cookieAskele = document.getElementById('cookieAsk');
    cookieAskele.classList.add("CookieAskPos");
}

function lightbuttontextdisplay() {
    document.getElementById("lightbutton").innerHTML = "<div id='lightcard'><img src='images/lightmode.png'><p class='nomargin'>Light<br>Mode</p></div>";
    let lightele = document.getElementById('lightcard');
    lightele.classList.add("modecards");
    let elementlightbutton = document.getElementById('lightbutton');
    elementlightbutton.setAttribute("onclick", "settingPicked('light')");
}

function darkbuttontextdisplay() {
    document.getElementById("darkbutton").innerHTML = "<div id='darkcard'><img src='images/darkmode.png'></img><br><p class='nomargin'>Dark<br>Mode</p></div>";
    let darkele = document.getElementById('darkcard');
    darkele.classList.add("modecards");
    let elementdarkbutton = document.getElementById('darkbutton');
    elementdarkbutton.setAttribute("onclick", "settingPicked('dark')");
}

function settingPicked(setting) {
    if (playbuttonclicks % 2 === 1) {
        setCookie("usermode", setting, 30);
    }
    var modesetting = setting;
    let startmenu = document.getElementById('buttonbox');
    document.getElementById("cookieAsk").innerHTML = "";
    let elementdarkbutton2 = document.getElementById('darkbutton');
    let elementlightbutton2 = document.getElementById('lightbutton');
    let elementplaybutton2 = document.getElementById('playbutton');
    let elementdarkcard2 = document.getElementById('darkcard');
    let elementlightcard2 = document.getElementById('lightcard');
    let elementwelcometextone2 = document.getElementById('Welcometextone');
    let elementwelcometexttwo2 = document.getElementById('Welcometexttwo');
    let elementanimatedlogo = document.getElementById('AnimatedLogo');
    let elementpagebody = document.getElementById('pagebody');
    elementdarkcard2.classList.remove("modecards");
    elementlightcard2.classList.remove("modecards");
    elementdarkcard2.classList.add("fadeOut");
    elementlightcard2.classList.add("fadeOut");
    elementdarkbutton2.classList.add("darkbuttonfadeOut");
    elementdarkbutton2.classList.remove("darkbuttonanim")
    elementlightbutton2.classList.add("lightbuttonfadeOut");
    elementlightbutton2.classList.remove("lightbuttonanim")
    elementplaybutton2.classList.add("playbuttonfadeOut");
    elementplaybutton2.classList.remove("playbuttonanim");
    elementwelcometextone2.classList.add('introtextfadeOut');
    elementwelcometextone2.classList.remove('introtextin');
    elementwelcometexttwo2.classList.add('introtextfadeOut');
    elementwelcometexttwo2.classList.remove('introtextin');
    elementwelcometexttwo2.classList.remove('changeWelcometwo');
    elementanimatedlogo.classList.add('mainMenuLogoShrink');
    elementanimatedlogo.classList.remove('titleanimation');
    elementanimatedlogo.classList.remove('logomaxwidthone');
    elementpagebody.classList.remove('pageneutral');
    if (setting == "light") {
        elementpagebody.classList.add('NeutralToLightBG');
    } else if (setting == "dark") {
        elementpagebody.classList.add('NeutralToDarkBG');
    }
    setTimeout(function() { initiateExpandMenu(modesetting); }, 2500);
}

function initiateExpandMenu(setting) {
    let elementanimatedlogo = document.getElementById('AnimatedLogo');
    let elementpagebody = document.getElementById('pagebody');
    if (setting == "light") {
        document.getElementById("buttonbox").innerHTML = "<div class='expandToMainMenu' id='MainMenuContainer'></div>";
        elementpagebody.classList.remove('NeutralToLightBG');
        elementpagebody.classList.add('LightModeBG');
    } else if (setting == "dark") {
        document.getElementById("buttonbox").innerHTML = "<div class='DarkexpandToMainMenu' id='MainMenuContainer'></div>";
        elementpagebody.classList.remove('NeutralToDarkBG');
        elementpagebody.classList.add('DarkModeBG');
    }
    elementanimatedlogo.classList.remove('mainMenuLogoShrink');
    elementanimatedlogo.classList.add('mainMenuLogosmall');
    setTimeout(function() { makeMenuElements(setting); }, 2000);
}

function playbutton2onclickchange() {
    let elementplaybutton = document.getElementById('playbutton');
    elementplaybutton.setAttribute('onclick', 'playbutton2toggle()');
    document.getElementById("playbutton").innerHTML += "<span class='dot' id='playbuttondot' style='opacity: 0;'></span>";
    let elementplaydot = document.getElementById('playbuttondot');
    elementplaydot.classList.add("playcheckboxno")
}

var playbuttonclicks = 0

function playbutton2toggle() {
    let elementplaydot = document.getElementById('playbuttondot');
    playbuttonclicks++;
    if (playbuttonclicks % 2 === 1) {
        elementplaydot.classList.add("playcheckboxyes");
        elementplaydot.classList.remove("playcheckboxno");
    } else {
        elementplaydot.classList.add("playcheckboxno");
        elementplaydot.classList.remove("playcheckboxyes");
    }
}

function changeFadedWelcome() {
    document.getElementById("Welcometexttwo").innerHTML = "Oh, before you begin, choose a theme!";
}

function playbuttontextremove() {
    document.getElementById("playbutton").innerHTML = "";
}

function ifuserlight() {
    let user = getCookie("usermode");
    if (user == "light") {
        document.write("success");
    };
}

function skipintro(modechoice) {
    let user = getCookie("usermode")
    let elementpagebody = document.getElementById('pagebody');
    let elementanimatedlogo = document.getElementById('AnimatedLogo');
    elementanimatedlogo.classList.add('mainMenuLogoShrink');
    elementanimatedlogo.classList.remove('titleanimation');
    elementanimatedlogo.classList.remove('logomaxwidthone');
    document.getElementById("Welcometextone").innerHTML = "Welcome back to Slideshow Karaoke!<br>Have fun!";
    document.getElementById("Welcometexttwo").innerHTML = "";
    document.getElementById("buttonbox").innerHTML = "";
    if (user == "light") {
        elementpagebody.classList.remove('pageneutral');
        elementpagebody.classList.add('LightModeBG');
    } else if (user == "dark") {
        elementpagebody.classList.remove('pageneutral');
        elementpagebody.classList.add('DarkModeBG');
    }
    setTimeout(function() { initiateExpandMenu(user); }, 3500);
    setTimeout(function() { disappearWelcometext(); }, 3500);
}

function disappearWelcometext() {
    let elementwelcometextone2 = document.getElementById('Welcometextone');
    let elementwelcometexttwo2 = document.getElementById('Welcometexttwo');
    elementwelcometextone2.classList.add('introtextfadeOut');
    elementwelcometextone2.classList.remove('introtextin');
    elementwelcometexttwo2.classList.add('introtextfadeOut');
    elementwelcometexttwo2.classList.remove('introtextin');
    elementwelcometexttwo2.classList.remove('changeWelcometwo');
}

function makeMenuElements(setting) {
    document.getElementById("MainMenuContainer").innerHTML = `
  <div id='InfoBox' class='mainMenuBox1'>
    <h1 class='infoheader'>Welcome to Slideshow Karaoke!</h1>
    <p>Slideshow Karaoke is meant to be a fun game where you make a business pitch, lecture, or just a statement off a bunch of random images!</p>
    <p >Make it as goofy or funny as you want, it is purely up to your imagination!</p>
    <p>But the most important thing is to have fun! 
  </div>
  <div id='start-screen' class='mainMenuBox2'>
    <h2 class='infoheader'>
      Game Parameters
    </h2>
    <br />
    Limit: 
    <input type='number' id='amount' min='1' step='1' value='15' />
    <select id='limit-type'>
      <option selected='selected' value='slides'>Slides </option>
      <option value='minutes'>Minutes</option>
    </select>
    <button id='start-button' class='start-game startgamebutton' onclick='prepareGameP1()'>Start!</button>
    <div id='input-error-message'></div><br><div>Click the images to go to the next slide, and if you need to, click the white bar next to the image to go back a slide.</div>
  </div>
  `
}

function prepareGameP1() {
    let elementinfobox = document.getElementById('InfoBox');
    let elementstartscreen = document.getElementById('start-screen');

    elementinfobox.classList.add('fadeOutOnly');
    //elementinfobox.classList.remove('introtextin');
    elementstartscreen.classList.add('fadeOutOnly');
    //elementstartscreen.classList.remove('introtextin');
    setTimeout(function() { prepareGameP2(); }, 1000);
}

function prepareGameP2() {
    const type = document.getElementById("limit-type").value;
    const amount = document.getElementById("amount").value;
    document.getElementById('MainMenuContainer').innerHTML = "<div class='introtextin middlecenter'><div id='main'><div id='start-screen'><h1>Welcome to Slideshow Karaoke!</h1>         Limit:          <input type='number' id='amount' min='1' step='1' value='15' />          <select id='limit-type'>           <option selected='selected' value='slides'>Slides</option>           <option value='minutes'>Minutes</option>         </select>          <button id='start-button'>Start!</button>          <div id='input-error-message'></div>       </div>       <div id='game-window'>         <div id='last'>          </div>         <img src='' id='game-display' />       </div>       <div id='end-screen'>         <h1>The end!</h1>       </div>     </div>      <div id='footer'>       <div id='progress' class='timerslidebox'></div>       <!-- I figure it might be worth putting            - forwards and backwards buttons in the bottom here.            -->     </div></div>";
    startGame(type, amount);
}

function reopenMenu() {
    let elementendscreen = document.getElementById('end-screen');
    elementendscreen.classList.remove('intrologo');
    elementendscreen.classList.add('fadeOutOnly');
    setTimeout(function() { makeMenuElements(); }, 1500);
}