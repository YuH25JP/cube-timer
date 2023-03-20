import { randomScrambleForEvent } from "https://cdn.cubing.net/js/cubing/scramble";

const time = document.getElementById('time');
const scramble = document.getElementById('scramble');
document.addEventListener('keydown', keydownEvent, false);

var isStarted = false;

var startTime;
var stopTime;
var timeoutID;

scramble.innerHTML = String(await randomScrambleForEvent('333'));

function displayTime() {
    const dt = new Date(Date.now() - startTime);
    const s = String(dt.getMinutes() * 60 + dt.getSeconds());
    const millis = String(dt.getMilliseconds()).padEnd(3, '0');

    time.textContent = `${s}.${millis}`;
    timeoutID = setTimeout(displayTime, 10);
}

async function keydownEvent(e) {
    if (!isStarted && e.key === ' ') {
        isStarted = true;

        startTime = Date.now();
        displayTime();
    } else if (isStarted) {
        stopTime = Date.now();
        isStarted = false;
        clearTimeout(timeoutID);
        // re-calculating/rendering the final result
        const res = new Date(stopTime - startTime);
        const s = String(res.getMinutes()*60 + res.getSeconds());
        const millis = String(res.getMilliseconds()).padEnd(3, '0');
        time.textContent = `${s}.${millis}`;
        scramble.innerHTML = String(await randomScrambleForEvent('333'));
    }
}