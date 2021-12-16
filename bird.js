const birdElem = document.querySelector("[data-bird]");
const BIRD_SPEED = 0.5;
const JUMP_DURATION = 125;
let timeSinceLastJump = Number.POSITIVE_INFINITY;

export function setupBird() {
  setTop(window.innerHeight / 2);
  document.removeEventListener("keydown", handleJump);
  document.addEventListener("keydown", handleJump);
}

export function updateBird(delta) {
  if (timeSinceLastJump < JUMP_DURATION) {
    // make the bird goes up
    setTop(getTop() - BIRD_SPEED * delta); // we need to take delta into account so the speed of the bird will be consistent for every fps
  } else {
    // make the bird goes down
    setTop(getTop() + BIRD_SPEED * delta); // we need to take delta into account so the speed of the bird will be consistent for every fps
  }
  timeSinceLastJump += delta;
  console.log(getTop());
}

export function getBirdRect() {
  return birdElem.getBoundingClientRect();
}

function setTop(top) {
  birdElem.style.setProperty("--bird-top", top);
}

function getTop() {
  return parseFloat(getComputedStyle(birdElem).getPropertyValue("--bird-top"));
}

function handleJump(e) {
  if (e.code !== "Space") return;
  timeSinceLastJump = 0;
}
