const baseJeopardyURL = 'http://jservice.io/api';
const baseTextSimilarityURL = 'https://api.dandelion.eu/datatxt/sim/v1/';
const token = 'ec7a5cd8231b45fa90b9f78fa8b23570';

function getCategories() {
  const randomOffset = Math.floor(Math.random() * Math.floor(10000));
  return fetch(`${baseJeopardyURL}/categories/?count=6&offset=${randomOffset}`)
    .then(r => r.json());
};

function getClue(value, category) {
  return fetch(`${baseJeopardyURL}/clues?value=${value}&category=${category}`)
    .then(r => r.json())
}

function getSimilarity(text1, text2) {
  return fetch(`${baseTextSimilarityURL}?text1=${text1}&text2=${text2}&lang=en&token=${token}`)
    .then(r => r.json())
}
