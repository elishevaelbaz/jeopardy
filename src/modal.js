import { getSimilarity } from './fetch';

const modal = document.querySelector('.modal');
const modalButtonClose = document.querySelector('.modal__button--close');
const answerText = document.querySelector('.modal__answer-text');
const answerConfirmation = document.querySelector('.modal__answer-confirmation');
const answerButton = document.querySelector('.modal__button-buzz');
const passButton = document.querySelector('.modal__button-pass');

const answerPreface = document.querySelector('.modal__answer-preface');
const vetoButton = document.querySelector('.modal__answer-veto');
const answerOverride = document.querySelector('.modal__answer-override');

const submitButton = document.querySelector('.modal__form-submit');
const modalInput = document.querySelector('.modal__form-input');
const modalForm = document.querySelector('.modal__form');

// const gameTiles = document.querySelectorAll('.grid__clue-tile');

const questionPrefixes = ['who is ', 'who are ', 'what is ', 'what are '];

// not good but need global vars
let answerGlobal;

let timeoutId;
let score = 0;

export default function openModal(clue, answer, value) {
  if (modal) {
    modal.classList.toggle('modal--active');
  }
  answerGlobal = answer;
  modal.setAttribute('data-value', value)
  const clueLocation = document.querySelector('.jeopardy-clue');
  clueLocation.innerText = clue;
  answerText.innerHTML = answer.replaceAll('\\', '');
  timeoutId = setTimeout(() => {
    // not using toggle - because user can exit the modal at any time
    // and the things we think are shown may not be and vice versa
    answerButton.classList.add('modal--active');
    passButton.classList.add('modal--active');
  }, 3000);
  console.log(answer);
}

if (modalButtonClose) {
  modalButtonClose.addEventListener('click', () => {
    closeModal();
  });
}

function closeModal() {
  modal.classList.toggle('modal--active');
  answerText.textContent = '';
  hideElements(answerButton, passButton, modalForm, answerConfirmation, answerOverride);
  answerPreface.textContent = '';
  vetoButton.removeAttribute('data-veto');

  clearTimeout(timeoutId); // in case user closes modal before the answerButton timeout
}

if (answerButton) {
  answerButton.addEventListener('click', () => {
    hideElements(answerButton, passButton);
    modalForm.classList.add('modal--active');
    answerOverride.classList.add("modal--active");
  });
}

if (passButton) {
  passButton.addEventListener('click', () => {
    displayAnswer('pass');
  });
}

if (vetoButton) {
  vetoButton.addEventListener('click', e => {
    if (vetoButton.hasAttribute('data-veto')) {
      addToScore(2);
    }
    else {
      subtractFromScore(2);
    }
    closeModal();
  });
}

if (submitButton) {
  submitButton.addEventListener('click', e => {
    e.preventDefault();
    if (!modalInput) {
      return;
    }

    const userInput = sanitizeInputforURL(modalInput);
    console.log('hello!', answer);
    answerGlobal = sanitizeAnswerforURL(answerGlobal);
    console.log(userInput, answerGlobal);
    getSimilarity(userInput, answerGlobal)
      .then(data => {
        if (data.similarity >= 0.55) {
          console.log(data.similarity);
          addToScore();
          displayAnswer('correct');
        }
        else {
          subtractFromScore();
          displayAnswer('incorrect');
        }
      });

    modalInput.value = '';
  });
}

function displayAnswer(response) {
  hideElements(answerButton, passButton, modalForm);

  console.log(answerText);
  if (response === 'correct') {
    answerPreface.textContent = 'Correct! The answer was: ';
    vetoButton.textContent = 'I didn\'t really get that correct...';
    vetoButton.classList.add('modal--active');
  }

  else if (response === 'incorrect') {
    answerPreface.textContent = 'That is incorrect! The answer was: ';
    vetoButton.setAttribute('data-veto', '');
    vetoButton.textContent = 'Hey! I should have gotten credit!';
    vetoButton.classList.add('modal--active');
  }

  else {
    answerPreface.textContent = 'The answer is: ';
    vetoButton.classList.remove('modal--active');
  }
  answerConfirmation.classList.add('modal--active');
}

function addToScore(multiplier = 1) {
  score += parseInt(modal.dataset.value * multiplier, 10);
  displayScore();
}

function subtractFromScore(multiplier = 1) {
  score -= parseInt(modal.dataset.value * multiplier, 10);
  displayScore();
}

function displayScore() {
  const scoreSpan = document.querySelector('.score');
  scoreSpan.textContent = score;
}

function sanitizeInputforURL(userInput) {
  let input = userInput.value.trim().toLowerCase();
  input.trim().toLowerCase();
  questionPrefixes.forEach(prefix => {
    if (input.startsWith(prefix)) {
      input = input.slice(prefix.length);
    }
  });
  console.log(input);
  return encodeURIComponent(input);
}

function sanitizeAnswerforURL(text) {
  // can probably just slice both in one step
  // but didn't want to assume both tags are there
  if (text.startsWith('<i>')) {
    text = text.slice(3);
  }
  if (text.endsWith('</i>')) {
    text = text.slice(0, -4);
  }
  text = text.replaceAll('\\', '');

  return encodeURIComponent(text);
}

function hideElements(...args) {
  args.forEach(arg => {
    arg.classList.remove('modal--active');
  });
}
