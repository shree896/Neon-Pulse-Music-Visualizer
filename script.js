const audioFileInput = document.getElementById("audioFile");
const playButton = document.getElementById("playButton");
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

let audioContext, analyser, source;
let dataArray, bufferLength;
let audio = new Audio();
let isPlaying = false;

canvas.width = window.innerWidth * 0.9;
canvas.height = 300;

// Load audio file
audioFileInput.addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const objectURL = URL.createObjectURL(file);
        audio.src = objectURL;
    }
});

// Play button event
playButton.addEventListener("click", function() {
    if (!isPlaying) {
        startVisualizer();
        audio.play();
        playButton.textContent = "Pause";
    } else {
        audio.pause();
        playButton.textContent = "Play";
    }
    isPlaying = !isPlaying;
});

// Initialize audio and analyzer
function startVisualizer() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        analyser.fftSize = 256;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
    }
    animate();
}

// Animate the visualizer
function animate() {
    requestAnimationFrame(animate);
    analyser.getByteFrequencyData(dataArray);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;
        const r = barHeight + 50;
        const g = 255 - barHeight;
        const b = 150;
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 2;
    }
}
