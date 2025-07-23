// Utility to deep clone frames at each step
const cloneFrames = (frames) => frames.map(row => [...row]);

export function fifo(pages, capacity) {
  let frames = [];
  let pointer = 0;
  let history = [];
  let faults = 0;

  for (let i = 0; i < pages.length; i++) {
    if (!frames.includes(pages[i])) {
      if (frames.length < capacity) {
        frames.push(pages[i]);
      } else {
        frames[pointer] = pages[i];
        pointer = (pointer + 1) % capacity;
      }
      faults++;
    }
    history.push(cloneFrames([frames]));
  }

  return { history, faults };
}

export function lru(pages, capacity) {
  let frames = [];
  let recent = new Map();
  let history = [];
  let faults = 0;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    if (!frames.includes(page)) {
      if (frames.length < capacity) {
        frames.push(page);
      } else {
        let lruPage = [...recent.entries()].sort((a, b) => a[1] - b[1])[0][0];
        const index = frames.indexOf(parseInt(lruPage));
        frames[index] = page;
      }
      faults++;
    }
    recent.set(page, i);
    history.push(cloneFrames([frames]));
  }

  return { history, faults };
}

export function optimal(pages, capacity) {
  let frames = [];
  let history = [];
  let faults = 0;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    if (!frames.includes(page)) {
      if (frames.length < capacity) {
        frames.push(page);
      } else {
        let future = pages.slice(i + 1);
        let indices = frames.map(f => future.indexOf(f));
        let replaceIndex = indices.indexOf(-1) !== -1
          ? indices.indexOf(-1)
          : indices.indexOf(Math.max(...indices));
        frames[replaceIndex] = page;
      }
      faults++;
    }
    history.push(cloneFrames([frames]));
  }

  return { history, faults };
}
