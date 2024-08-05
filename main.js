const paragraph = document.querySelector('p'),
    canvas = document.querySelector('canvas'),
    ctx = canvas.getContext('2d');

let position = 0, frequency = 0, speed = 4, amplitude = 90, offset = 25, offsetP = 0, touched = false, time = 0, timeMultiplier = 1, globalMultiplier = 1;

let opacity = 1, opacitySpeed = 0.05;

const sineGraph = (pos, pitch) => {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, innerHeight / 5 * 4 + offset + offsetP - 1, innerWidth, innerHeight / 5 * 4 - offset - offsetP + 1)
    for (let i = 0; i < innerWidth; i++) {
        ctx.fillRect(i, innerHeight / 5 * 4 + offset + offsetP, 1, Math.sin((i + pos) / pitch) * amplitude - amplitude);
    }
}

// abbreviated from pointBetweenPointsByTime()
const PBPBT = (a, b, t) => [(1 - t) * a[0] + t * b[0], (1 - t) * a[1] + t * b[1]];

const ease = (a, b, c = [0.3, 0.7], t = 0) => PBPBT(PBPBT(a, c, t), PBPBT(b, c, t), t);

const frame = () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight; // apparently this blanks the canvas' contents
    if(touched){
        if (opacity > 0) opacity -= opacitySpeed;
        globalMultiplier = 3;
    }
    else{
        if (opacity < 1) opacity += opacitySpeed;
        globalMultiplier = 1;
    }
    paragraph.style.opacity = opacity;
    if (time >= 1) timeMultiplier = -1;
    else if (time <= 0) timeMultiplier = 1;
    offsetP = ease([0, 0], [0, 0], [0, innerHeight/11], time)[1];
    time += timeMultiplier / 600 * globalMultiplier;
    let wave = Math.abs(Math.cos(frequency * Math.PI / 180) * 31 + 50);
    sineGraph(position * Math.PI / 180 * wave, wave);
    frequency = (frequency + 0.2 * globalMultiplier) % 360;
    position = (position + speed * globalMultiplier) % 360;
    requestAnimationFrame(frame);
}

addEventListener('mousedown', () => touched = true);
addEventListener('mouseup', () => touched = false);
addEventListener('touchstart', () => touched = true);
addEventListener('touchend', () => touched = false);
frame();