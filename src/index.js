import './scss/style.scss';
import { getClue, getCategories } from './fetch';
import openModal from './modal';

const gameBoard = document.querySelector('.game-grid-container');

getCategories()
  .then(data => {
    fillInTileInfo(data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

function fillInTileInfo(data) {
  const categoryTiles = document.querySelectorAll('.grid__category-tile');
  if (categoryTiles.length) {
    categoryTiles.forEach((tile, index) => {
      tile.textContent = data[index].title.toUpperCase();

      let sibling = tile;
      for (let i = 0; i < 5; i++) {
        sibling = sibling.nextElementSibling;
        sibling.setAttribute('data-category', data[index].id);
      }
    });
  }
}

if (gameBoard) {
  gameBoard.addEventListener('click', e => {
    if (!e.target.matches('.grid__clue-tile') || !e.target.hasAttribute('data-remaining')) {
      return;
    }
    markClueAsRead(e);

    const [value, category] = [e.target.dataset.value, e.target.dataset.category]

    getClue(value, category)
      .then(data => {
        const randomInt = Math.floor(Math.random() * Math.floor(data.length));
        openModal(data[randomInt].question, data[randomInt].answer, value);
        console.log(data);
      })
      .catch((error) => {
        console.error('Error:', error);
        getClue(value / 2, category)
          .then(data => {
            const randomInt = Math.floor(Math.random() * Math.floor(data.length));
            openModal(data[randomInt].question, data[randomInt].answer, value);
          });
      });
  });
}

function markClueAsRead(e) {
  e.target.removeAttribute('data-remaining');
  e.target.textContent = '';
}
