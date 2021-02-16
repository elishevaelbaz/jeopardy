import { getHighScores } from './fetch';

const highscores = document.querySelector('.highscore-grid__body');

export default function loadScores() {
  if (highscores) { // on highscore html page
    getHighScores()
      .then(data => {
        console.log(data);

        loadRow(data);
      });
  }
}

function loadRow(data) {
  data.forEach((entry, index) => {
    const row = document.createElement('tr');
    row.classList.add('highscore-grid__row');

    const place = document.createElement('td');
    place.textContent = index + 1;

    const name = document.createElement('td');
    name.textContent = entry.name;

    const score = document.createElement('td');
    score.textContent = entry.score;

    row.append(place, name, score);
    highscores.append(row);
  });
}
