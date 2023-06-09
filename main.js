import { randomScrambleForEvent } from "https://cdn.cubing.net/js/cubing/scramble";

const time = document.getElementById('time');
const scramble = document.getElementById('scramble');
const historyArea = document.getElementById('historyArea');
document.addEventListener('keydown', keydownEvent, false);
document.addEventListener('keyup', keyupEvent, false);

var isStarted = false;

var startTime;
var stopTime;
var rightAfterStop = false;
var holdTime = 0.3;
var heldOver = false;
var beingHeld = false;
var inspectionTime = 15;
var inspectionCompleted = false;
var timeoutID;

var array;
var index;

// 
window.onload = () => {
    // if 'time-data' does not exist in local storage, array is initialized with empty array
    // otherwise, existing data in local storage is passed to array
    if (localStorage.getItem('time-data') == null) {
        console.log('time-data is null');
        array = [];
    } else {
        array = getData();
        // all the existing histories are added to historyArea
        for (const obj of array) {
            addTimeToHistoryArea(obj);
        }
        document.getElementById('ao5').innerHTML = calculateAverageOf(5);
    }
    index = array.length + 1;
}

scramble.innerHTML = "Scramble: " + String(await randomScrambleForEvent('333'));

function displayTime() {
    const dt = new Date(Date.now() - startTime);
    const s = String(dt.getMinutes() * 60 + dt.getSeconds());
    const millis = String(dt.getMilliseconds()).padEnd(3, '0');

    time.textContent = `${s}.${millis}`;
    timeoutID = setTimeout(displayTime, 10);
}

function addTimeToStorage(obj) {
    array.push(obj);
    const jsonString = JSON.stringify(array);
    localStorage.setItem('time-data', jsonString);
}

function addTimeToHistoryArea(obj) {
    var new_element = document.createElement('p');
    new_element.className = 'history';
    new_element.textContent = obj.time;
    historyArea.prepend(new_element);
}

function getData() {
    const jsonString = localStorage.getItem('time-data');
    return JSON.parse(jsonString);
}

function calculateAverageOf(x) {
    var res = `ao${x}: `;
    const dataArray = getData();
    const lengthOfDataArray = dataArray.length;
    if (lengthOfDataArray < x) {
        return res + '-';
    } else {
        var sum = 0;
        for (let i = 0; i < x; i++) {
            sum += dataArray[lengthOfDataArray - i - 1].time;
        }
        sum = Math.round((sum / x) * 1000) / 1000;
        return res + sum;
    }
}

async function keydownEvent(e) { // stop timer by keydown
    if (isStarted) {
        stopTime = Date.now();
        isStarted = false;
        rightAfterStop = true;
        heldOver = false;
        clearTimeout(timeoutID);

        // re-calculating/rendering the final result
        const res = new Date(stopTime - startTime);
        const s = String(res.getMinutes()*60 + res.getSeconds());
        const millis = String(res.getMilliseconds()).padEnd(3, '0');
        time.textContent = `${s}.${millis}`;
        const obj = {
            index: index,
            time: Number(`${s}.${millis}`),
            scramble: scramble.innerHTML.replace('Scramble: ', ''),
        }

        addTimeToStorage(obj);
        addTimeToHistoryArea(obj);
        document.getElementById('ao5').innerHTML = calculateAverageOf(5);
        index += 1;
        scramble.innerHTML = "Scramble: " + String(await randomScrambleForEvent('333'));
    } else if (!rightAfterStop && e.key === ' ' && !beingHeld) {
        time.style.color = 'red'; // turn the timer color into red while space key is pressed
        beingHeld = true;
        timeoutID = setTimeout(() => {
            time.style.color = 'green';
            heldOver = true;
        }, holdTime * 1000);
    }
}

function keyupEvent(e) { // start timer by keyup
    if (beingHeld) { beingHeld = false; }
    if (!isStarted && !heldOver && !rightAfterStop && e.key === ' ') {
        clearTimeout(timeoutID);
        time.style.color = 'black';
    } else if (!isStarted && heldOver && !rightAfterStop && e.key === ' ') {
        time.style.color = 'black'; // turn the timer color back into black right after started
        isStarted = true;
        startTime = Date.now();
        displayTime();
    } else if (rightAfterStop) {
        rightAfterStop = false;
    }
}