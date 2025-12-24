/* =========================
   SCREEN TRANSITION
   ========================= */
function goToSetup() {
  const home = document.getElementById("home");
  const setup = document.getElementById("setup");

  // Home exits left
  home.classList.remove("active");
  home.classList.add("exit-left");

  // 🔥 RESET setup state
  setup.classList.remove("exit-right");
  setup.classList.remove("exit-left");

  // Setup enters
  setup.classList.add("active");
}


/* =========================
   TEXT SOURCE (EASY MODE)
   ========================= */
const text = `
Reading is a skill that improves with calm focus and regular practice
many people underestimate how quickly their eyes and mind can adapt
when words appear one at a time the brain has less distraction
this helps attention stay centered on the meaning of each word
comfort matters more than raw speed during early practice sessions
some words feel easier while others slow the rhythm slightly
that variation is normal and should not cause frustration
breathing evenly can help maintain a steady reading flow
short pauses between thoughts help understanding stay clear
there is no need to rush past unfamiliar terms
progress comes from finding a pace that feels natural
over time the same pace will begin to feel slower
that is how improvement quietly happens
the goal here is not perfection but awareness
notice when comprehension starts to fade
that moment defines your current limit
limits change with patience and consistency
even small improvements are meaningful
focus on comfort before pushing faster
reading should remain an enjoyable experience
the words will continue without warning
there is no pattern to anticipate
stay present with each new word
let the rhythm guide you forward
this exercise ends only when you decide
`;

/* =========================
   VARIABLES
   ========================= */
const words = text.trim().split(/\s+/);
const wordDisplay = document.getElementById("wordDisplay");
const speedSlider = document.getElementById("speedSlider");
const wpmValue = document.getElementById("wpmValue");
const beginBtn = document.getElementById("beginBtn");
const doneBtn = document.getElementById("doneBtn");

let wordIndex = 0;
let wpm = Number(speedSlider.value);
let intervalId = null;
//let startTime = null;
let isReading = false;

let isPaused = false;
/*let pausedAt = null;
let totalPausedTime = 0;*/

/* =========================
   HELPERS
   ========================= */

function getSpeedLabel(wpm) {
  if (wpm < 200) return "Below average — focus on comfort and clarity";
  if (wpm < 250) return "Right around the average adult reader.";
  if (wpm < 350) return "Faster than most readers 👏";
  if (wpm < 500) return "Exceptionally fast reader!";
  return "Elite reading speed — very rare 🚀";
}

function getDelayFromWPM(wpm) {
  return 60000 / wpm; // ms per word
}

/* =========================
   CORE WORD LOOP
   ========================= */
function showNextWord() {
  if (!isReading) return;

  if (wordIndex >= words.length) {
    wordIndex = 0; // loop seamlessly
  }

  const word = words[wordIndex];

  // prevent overflow for long words
  if (word.length > 18) {
    wordDisplay.style.fontSize = "2rem";
  } else {
    wordDisplay.style.fontSize = "clamp(2rem, 5vw, 4rem)";
  }

  // clear first to avoid overlap
  //wordDisplay.textContent = "";
  wordDisplay.textContent = word;

  wordIndex++;
}

/* =========================
   START READING
   ========================= */
function startReading() {
  clearInterval(intervalId);

  wordIndex = 0;
  //startTime = Date.now();
  //totalPausedTime = 0;

  isReading = true;
  isPaused = false;
  wordDisplay.textContent = "";

  intervalId = setInterval(showNextWord, getDelayFromWPM(wpm));

  pauseBtn.textContent = "PAUSE";
}

/* =========================
   EVENTS
   ========================= */
beginBtn.addEventListener("click", startReading);

speedSlider.addEventListener("input", (e) => {
  wpm = Number(e.target.value);

  // 🔥 Update UI
  wpmValue.textContent = wpm;

  if (isReading && !isPaused) {
    clearInterval(intervalId);
    intervalId = setInterval(showNextWord, getDelayFromWPM(wpm));
  }
});


doneBtn.addEventListener("click", () => {
  const setup = document.getElementById("setup");
  const result = document.getElementById("result");

  // STOP READING
  isReading = false;
  clearInterval(intervalId);
  intervalId = null;

  // CALCULATE WPM
  const finalWPM = wpm;
  const speedLabel = getSpeedLabel(finalWPM);

  document.getElementById("resultText").textContent =
    `Your maximum comfortable reading speed is ${finalWPM} WPM.
   ${speedLabel}`;

  // SETUP exits left
  setup.classList.remove("active");
  setup.classList.add("exit-left");

  // RESULT enters from right
  result.classList.remove("exit-left", "exit-right");
  result.classList.add("enter-right");

  requestAnimationFrame(() => {
    result.classList.add("active");
    result.classList.remove("enter-right");
  });
});


const backBtn = document.getElementById("backBtn");

backBtn.addEventListener("click", () => {
  const home = document.getElementById("home");
  const setup = document.getElementById("setup");

  // Setup exits right
  setup.classList.remove("active");
  setup.classList.add("exit-right");

  // Prepare home to enter from left
  home.classList.remove("exit-left");
  home.classList.add("enter-left");

  requestAnimationFrame(() => {
    home.classList.add("active");
    home.classList.remove("enter-left");
  });
});

const backToSetupBtn = document.getElementById("backToSetupBtn");

backToSetupBtn.addEventListener("click", () => {
  const result = document.getElementById("result");
  const setup = document.getElementById("setup");

  // Result exits right
  result.classList.remove("active");
  result.classList.add("exit-right");

  // Reset setup state completely
  setup.classList.remove("exit-left", "exit-right");
  setup.classList.add("enter-left");

  requestAnimationFrame(() => {
    setup.classList.add("active");
    setup.classList.remove("enter-left");
  });
});


const pauseBtn = document.getElementById("pauseBtn");

pauseBtn.addEventListener("click", () => {
  if (!isReading) return;

  if (!isPaused) {
    // ---- PAUSE ----
    clearInterval(intervalId);
    intervalId = null;

    isPaused = true;
    //pausedAt = Date.now();

    pauseBtn.textContent = "RESUME";
  } else {
    // ---- RESUME ----
    //totalPausedTime += Date.now() - pausedAt;

    isPaused = false;
    //pausedAt = null;

    intervalId = setInterval(showNextWord, getDelayFromWPM(wpm));

    pauseBtn.textContent = "PAUSE";
  }
});



