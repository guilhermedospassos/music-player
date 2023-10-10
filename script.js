const songName = document.getElementById("song-name");
const bandName = document.getElementById("band-name");
const song = document.getElementById("audio");
const cover = document.getElementById("cover");
const play = document.getElementById("play");
const next = document.getElementById("next");
const previous = document.getElementById("previous");
const likeButton = document.getElementById("like");
const currentProgress = document.getElementById("current-progress");
const progressContainer = document.getElementById("progress-container");
const shuffleButton = document.getElementById("shuffle");
const repeatButton = document.getElementById("repeat");
const songTime = document.getElementById("song-time");
const totalTime = document.getElementById("total-time");

const sunflower = {
  songName: "Sunflower",
  artist: "Post Malone, Swae Lee",
  file: "sunflower",
  liked: false,
};

const blinding_lights = {
  songName: "Blinding Lights",
  artist: "The Weeknd",
  file: "blinding_lights",
  liked: false,
};

const coldplay = {
  songName: "Adventure Of A Lifetime",
  artist: "Coldplay",
  file: "adventure_of_a_lifetime",
  liked: false,
};

const maroon5 = {
  songName: "Payphone",
  artist: "Maroon 5, Wiz Khalifa",
  file: "payphone",
  liked: false,
};

const avicii = {
  songName: "Hey Brother",
  artist: "Avicii",
  file: "hey_brother",
  liked: false,
};

const originalPlaylist = JSON.parse(localStorage.getItem("playlist")) ?? [
  sunflower,
  blinding_lights,
  coldplay,
  maroon5,
  avicii,
];
let index = 0;
let isShuffled = false;
let repeatOn = false;
let isPlaying = false;
let sortedPlaylist = [...originalPlaylist];

function playSong() {
  play.querySelector(".bi").classList.remove("bi-play-circle-fill");
  play.querySelector(".bi").classList.add("bi-pause-circle-fill");
  song.play();
  isPlaying = true;
}

function pauseSong() {
  play.querySelector(".bi").classList.add("bi-play-circle-fill");
  play.querySelector(".bi").classList.remove("bi-pause-circle-fill");
  song.pause();
  isPlaying = false;
}

function playPauseDecider() {
  if (isPlaying === true) {
    pauseSong();
  } else {
    playSong();
  }
}

function likeButtonRender() {
  if (sortedPlaylist[index].liked === true) {
    likeButton.querySelector(".bi").classList.remove("bi-heart");
    likeButton.querySelector(".bi").classList.add("bi-heart-fill");
    likeButton.classList.add("button-active");
  } else {
    likeButton.querySelector(".bi").classList.remove("bi-heart-fill");
    likeButton.querySelector(".bi").classList.add("bi-heart");
    likeButton.classList.remove("button-active");
  }
}

function initialize_song() {
  cover.src = `images/${sortedPlaylist[index].file}.webp`;
  song.src = `songs/${sortedPlaylist[index].file}.mp3`;
  songName.innerText = sortedPlaylist[index].songName;
  bandName.innerText = sortedPlaylist[index].artist;
  likeButtonRender();
}

function previousSong() {
  if (index === 0) {
    index = sortedPlaylist.length - 1;
  } else {
    index -= 1;
  }
  initialize_song();
  playSong();
}

function repeatCurrentSong() {
  song.currentTime = 0;
}

function nextSong() {
  if (repeatOn) {
    repeatCurrentSong();
  } else {
    {
      if (index === sortedPlaylist.length - 1) {
        index = 0;
      } else {
        index += 1;
      }
    }
    initialize_song();
    playSong();
  }
}

function updateProgress() {
  const barWidth = (song.currentTime / song.duration) * 100;
  currentProgress.style.setProperty("--progress", `${barWidth}%`);
  songTime.innerText = toMMSS(song.currentTime);
}

function jumpTo(event) {
  const width = progressContainer.clientWidth;
  const clickPosition = event.offsetX;
  const jumpToTime = (clickPosition / width) * song.duration;
  song.currentTime = jumpToTime;
}

function shuffleArray(preShuffleArray) {
  const size = preShuffleArray.length;
  let currentIndex = size - 1;
  while (currentIndex > 0) {
    let randomIndex = Math.floor(Math.random() * size);
    let aux = preShuffleArray[currentIndex];
    preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
    preShuffleArray[randomIndex] = aux;
    currentIndex -= 1;
  }
}

function shuffleButtonClicked() {
  if (isShuffled === false) {
    isShuffled = true;
    shuffleArray(sortedPlaylist);
    shuffleButton.classList.add("button-active");
  } else {
    isShuffled = false;
    sortedPlaylist = [...originalPlaylist];
    shuffleButton.classList.remove("button-active");
  }
}

function repeatButtonClicked() {
  if (repeatOn === false) {
    repeatOn = true;
    repeatButton.classList.add("button-active");
  } else {
    repeatOn = false;
    repeatButton.classList.remove("button-active");
  }
}

function nextOrRepeat() {
  if (repeatOn === false) {
    nextSong();
  } else {
    playSong();
  }
}

function toMMSS(originalNumber) {
  let hours = Math.floor(originalNumber / 3600);
  let min = Math.floor((originalNumber - hours * 3600) / 60);
  let secs = Math.floor(originalNumber - hours * 3600 - min * 60);

  return `${min.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

function updateTotalTime() {
  toMMSS(song.duration);
  totalTime.innerText = toMMSS(song.duration);
}

function likeButtonClicked() {
  if (sortedPlaylist[index].liked === false) {
    sortedPlaylist[index].liked = true;
  } else {
    sortedPlaylist[index].liked = false;
  }
  likeButtonRender();
  localStorage.setItem("playlist", JSON.stringify(originalPlaylist));
}

initialize_song();

play.addEventListener("click", playPauseDecider);
previous.addEventListener("click", previousSong);
next.addEventListener("click", nextSong);
song.addEventListener("timeupdate", updateProgress);
song.addEventListener("ended", nextOrRepeat);
song.addEventListener("loadedmetadata", updateTotalTime);
progressContainer.addEventListener("click", jumpTo);
shuffleButton.addEventListener("click", shuffleButtonClicked);
repeatButton.addEventListener("click", repeatButtonClicked);
likeButton.addEventListener("click", likeButtonClicked);
