const HOLE_HEIGHT = 200;
const PIPE_WIDTH = 120;
const PIPE_INTERVAL = 1500; // how often we create the pipe (1.5s)
const PIPE_SPEED = 0.75;
let pipes = [];
let timeSinceLastPipe;
let passedPipeCount;

export function setupPipes() {
  document.documentElement.style.setProperty("--pipe-width", PIPE_WIDTH);
  document.documentElement.style.setProperty("--hole-height", HOLE_HEIGHT);
  pipes.forEach((pipe) => pipe.remove());
  timeSinceLastPipe = PIPE_INTERVAL;
  passedPipeCount = 0;
}

export function updatePipes(delta) {
  // create the pipe every PIPE_INTERVAL
  timeSinceLastPipe += delta;
  if (timeSinceLastPipe > PIPE_INTERVAL) {
    timeSinceLastPipe -= PIPE_INTERVAL;
    createPipe();
  }

  // make the pipe to move to the left
  pipes.forEach((pipe) => {
    // check if the pipe is already gone outside the screen
    if (pipe.left + PIPE_WIDTH < 0) {
      passedPipeCount++;
      return pipe.remove();
    }
    pipe.left = pipe.left - delta * PIPE_SPEED;
  });
}

export function getPassedPipesCount() {
  return passedPipeCount;
}

export function getPipeRects() {
  return pipes.flatMap((pipe) => pipe.rects());
}

function createPipe() {
  const pipeElem = document.createElement("div");
  const topElem = createPipeSegment("top");
  const bottomElem = createPipeSegment("bottom");
  pipeElem.append(topElem);
  pipeElem.append(bottomElem);
  pipeElem.classList.add("pipe");
  pipeElem.style.setProperty(
    "--hole-top",
    randomNumberBetween(
      HOLE_HEIGHT * 1.5,
      window.innerHeight - HOLE_HEIGHT * 0.5
    )
  );
  const pipe = {
    get left() {
      return parseFloat(
        getComputedStyle(pipeElem).getPropertyValue("--pipe-left")
      );
    },
    set left(value) {
      pipeElem.style.setProperty("--pipe-left", value);
    },
    // to remove the pipe that's already outside the screen
    remove() {
      pipes = pipes.filter((p) => p !== pipe);
      pipeElem.remove();
    },
    rects() {
      return [
        topElem.getBoundingClientRect(),
        bottomElem.getBoundingClientRect(),
      ];
    },
  };
  pipe.left = window.innerWidth; // to put the pipe at the right side of the screen
  document.body.append(pipeElem);
  pipes.push(pipe);
}

function createPipeSegment(position) {
  const segment = document.createElement("div");
  segment.classList.add("segment", position);
  return segment;
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
