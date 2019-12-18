/**
 *
 * @param {number[]} range The start and end values of the tween
 * @param {number} duration Amount of time in milliseconds
 * @param {function} callback Function that applies current value of tween
 * @returns {Promise<number>} Promise resolves at end of tween with final value
 */
export function tween(range, duration, callback, ease = easeInCubic) {
  return new Promise(resolve => {
    let start = performance.now();
    let end = start + duration;
    requestAnimationFrame(function animate(timestamp) {
      if (timestamp < end) requestAnimationFrame(animate);
      else {
        callback(range[1], 1);
        resolve(range[1]);
      }
      let progress = (timestamp - start) / duration;
      let val = (range[1] - range[0]) * progress + range[0];
      callback(val, progress);
    });
  });
}

/**
 * delays code execution asynchronously
 * @param {number} ms number of miliseconds to delay
 */
export function delay(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

/**
 * Wraps the css animation in a promise so that it can be sequenced in js
 * @param {HTMLElement} el element to be animated
 * @param {string} animClass the CSS string title of the animation class to be applied
 */
export function animateEl(el, animClass) {
  return new Promise(resolve => {
    el.addEventListener(
      "animationend",
      () => {
        el.classList.remove(animClass);
        resolve();
      },
      { once: true }
    );
    el.classList.add(animClass);
  });
}

//EASINGS
//============================================
function easeLinear(t) {
  return t;
}

function easeInCubic() {
  return t ** 3;
}
