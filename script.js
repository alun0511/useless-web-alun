const body = document.querySelector("body");
const h2 = document.querySelector("h2");
const h1 = document.querySelector("h1");
const root = document.querySelector(":root");
const grid = document.querySelector(".grid");
const cssVar = getComputedStyle(root);

//// Generate colors and grid items ////

// array of "ROYGBIV"
const rainbowColors = [
  "violet",
  "indigo",
  "blue",
  "green",
  "yellow",
  "orange",
  "red",
];

// function that takes string and returns it within div
const stringToHTML = (str) => {
  const div = document.createElement("div");
  div.innerHTML = str;
  return div.firstChild;
};

// function that creates a griditem with a dataset which will be assigned a value from the array of rainbowcolors
const createGridItem = (color) => {
  return `<div class="hidden grid-item" data-color=${color}></div>`;
};

//foreach rainbow color append the above griditem to the grid-div in the html
const generateRainbow = () => {
  rainbowColors.forEach((rainbowColor) => {
    const gridItem = createGridItem(rainbowColor);
    grid.appendChild(stringToHTML(gridItem));
  });
};
generateRainbow();
//selectes the appended griditems as a const
const gridItems = document.querySelectorAll(".grid-item");

//function that on event will change the value of the root css variable depending on the dataset color
const colorChanger = (e) => {
  const hoverColor = e.target.dataset.color;
  root.style.setProperty("--color-rainbow", hoverColor);
};
// turns gridItems into an array and adds a mousover evenlistener
Array.from(gridItems).forEach((element) => {
  element.addEventListener("mouseover", colorChanger);
});

//// Audio ////

// Defines oscillator variable and isPlaying boolean

let osc, isPlaying;

// create audiocontext with muter and player

const audioContext = new window.AudioContext(),
  muter = document.querySelector(".muter"),
  player = document.querySelector(".player-div");

// Starts sound and changes styling on click of player-div

const start = player.addEventListener("click", () => {
  // gives visual feedback on click
  h2.remove();
  muter.classList.remove("hidden");
  grid.classList.remove("hidden");
  player.classList.add("widen");
  const wideDiv = document.querySelector(".widen");

  // defines width and hight of player-div
  const playerWidth = player.clientWidth;
  const playerHeight = player.clientHeight;

  // player logic ->

  if (isPlaying) {
    //Stops oscillating if isPlaying returns true

    if (osc) osc.stop(audioContext.currentTime + 0.2);
    muter.innerHTML = "CLICK TO UNMUTE";
    player.classList.toggle("rainbow");
    muter.classList.toggle("rainbow");
  } else {
    // Creates and starts oscillator + gainnode if isPlaying returns false
    // Creates gainnode for volume that receives oscillator signal

    osc = new OscillatorNode(audioContext, {
      frequency: 440,
      type: "sine",
      detune: 100,
    });

    gain = new GainNode(audioContext, {
      gain: 0.01,
    });
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start(audioContext.currentTime + 0.2);

    // Toggles innerHTML and styling when stopped or playing
    muter.innerHTML = "CLICK TO MUTE";
    player.classList.toggle("rainbow");
    muter.classList.toggle("rainbow");
  }

  // Toggles the boolean isPlaying on player click
  isPlaying = !isPlaying;

  // defines cursor coordinates
  let mouseX;
  let mouseY;

  function updatePos(event) {
    mouseX = event.pageX;
    // -100 to get approximate offset of the player-div's hight
    mouseY = event.pageY - 100;
    // divides mouseposition with width and hight of the player-div
    let freqCalc = (mouseX / (playerWidth / 12)) * 100;
    let gainCalc = 1 - (mouseY / playerHeight) * 1;

    // "/100" to adjust the very high volume on gain
    osc.frequency.value = freqCalc;
    gain.gain.value = gainCalc / 100;
    console.log(gainCalc / 100);
  }

  // adds eventlisteners to the updatePos function

  player.addEventListener("mousemove", updatePos, false);
  player.addEventListener("mouseenter", updatePos, false);
  player.addEventListener("mouseleave", updatePos, false);
});
