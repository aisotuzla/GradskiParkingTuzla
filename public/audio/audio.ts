const audio = new Audio();

function playInstruction(file: string) {
  audio.src = `/public/audio/${file}.mp3 `;
  audio.play();
}

function stopAudio() {
  audio.pause();
  audio.currentTime = 0;
}
