import { updateBird, setupBird, getBirdRect } from "./bird.js";
import {
  updatePipes,
  getPassedPipesCount,
  setupPipes,
  getPipeRects,
} from "./pipe.js";

document.addEventListener("keypress", handleStart, { once: true });

const title = document.querySelector("[data-title]");
const subtitle = document.querySelector("[data-subtitle]");

let lastTime = null;
function updateLoop(time) {
  if (lastTime == null) {
    lastTime = time;
    window.requestAnimationFrame(updateLoop);
    return;
  }
  console.log(time - lastTime);
  const delta = time - lastTime;
  updateBird(delta);
  updatePipes(delta);
  if (checkLose()) return handleLose();
  lastTime = time;
  window.requestAnimationFrame(updateLoop);
}

function checkLose() {
  // check if the bird is outside the window
  const birdRect = getBirdRect();
  const insidePipe = getPipeRects().some((rect) => isCollision(birdRect, rect));
  const outsideWorld = birdRect.top < 0 || birdRect.bottom > window.innerHeight;
  return outsideWorld || insidePipe;
}

function isCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  );
}

function handleStart() {
  title.classList.add("hide");
  setupBird();
  setupPipes();
  lastTime = null;
  window.requestAnimationFrame(updateLoop);
}

function handleLose() {
  // setTimeout to make it pause a litle bit before the user can restart the game, just to avoid accidental misspress that suddenly start the game again
  setTimeout(() => {
    console.log("handleLose called");
    title.classList.remove("hide");
    subtitle.classList.remove("hide");
    subtitle.textContent = `${getPassedPipesCount()} Pipes`;
    document.addEventListener("keypress", handleStart, { once: true });
  }, 500);
}
