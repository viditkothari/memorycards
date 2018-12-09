$(document).ready(function(){
  /* get all DOM elements and set all game state variables */
  let cardClassesList = [
    'fa-js',
    'fa-css3-alt',
    'fa-html5',
    'fa-opera',
    'fa-bluetooth',
    'fa-chrome',
    'fa-firefox',
    'fa-react',
    'fa-js',
    'fa-css3-alt',
    'fa-html5',
    'fa-opera',
    'fa-bluetooth',
    'fa-chrome',
    'fa-firefox',
    'fa-react'
  ];

  let timer = new GameTimer();

  let base = document.getElementById('base');
  let starsList = document.getElementById('stars');
  let resetBtn = document.getElementById('btn_reset');
  let movesCntr = document.getElementById('moves');
  let timerCntr = document.getElementById('timer');

  let time_results = document.getElementById('time_results');
  let moves_results = document.getElementById('moves_results');
  
  let modal = document.getElementById('themodal');
  let modalObj = M.Modal.getInstance(modal);
  let modal_reset_btn = document.getElementById('m_btn_reset');

  let moves = 0;
  let grade = 3;

  let isGameOver = false;
  let isGameOn = false;

  let matches = [];
  let lastFlipped = null;
  let pause = false;

  movesCntr.innerText = moves;
  timerCntr.innerText = timer.getTimeStr();

  // Shuffle function from http://stackoverflow.com/a/2450976
  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  // creates li cards, gives data-card attr to each
  function createCard(card_class) {
    let li = document.createElement('li');
    li.classList.add('card');
    li.classList.add('card-' + card_class);
    li.setAttribute('data-card', card_class);
    let i = document.createElement('i');
    i.classList.add('card-icon', 'fab', card_class);
    i.setAttribute('data-card', card_class);
    li.appendChild(i);
    return li;
  }

  resetBtn.addEventListener('click', resetGame);
  modal_reset_btn.addEventListener('click', resetGame);
  // infoBtn.addEventListener('click', info);

  // updates grade with every move
  function updateGrade() {
    if(moves > 12) {
      if(grade !== 2) {
        grade = 2;
        // gradeSpan.innerText = grade;
        starsList.removeChild(starsList.children[0]);
      }
    }
    if(moves > 24) {
      if(grade !== 1) {
        grade = 1;
        // gradeSpan.innerText = grade;
        starsList.removeChild(starsList.children[0]);
      }
    }
  }

  function clearBase() {
    base.innerHTML = '';
  }

  function generateCards() {
    let card_classes = shuffle(cardClassesList);
    for(let index = 0; index < 16; index++) {
      let card_class = card_classes[index];
      let new_elm = createCard(card_class);
      base.appendChild(new_elm);
    }
  }

  function activateCards() {
    document.querySelectorAll('.card').forEach(function(card) {
      card.addEventListener('click', function() {


        if(isGameOn === false) { // If game hasn't started onClick on any card, the game starts here.
          isGameOn = true;
          timer.startTimer(function(){
            timerCntr.innerText = timer.getTimeStr();
          });
        }


        if (card === lastFlipped || matches.includes(card) || pause || isGameOver) {
          // prevents comparing cards to themselves or playing when game is over
          return;
        }

        card.classList.add('open', 'show');

        if (lastFlipped) { // a previous card was clicked; compare last clicked to this click
          let thisCard = card.childNodes[0].getAttribute('data-card');
          let lastCard = lastFlipped.childNodes[0].getAttribute('data-card');
          moves++;
          movesCntr.innerText = moves;
          updateGrade();

          if (thisCard === lastCard) {
            card.classList.add('match');
            lastFlipped.classList.add('match');
            matches.push(card);
            matches.push(lastFlipped);
            lastFlipped = null;
            if(matches.length === 16) {
              gameOver();
              return;
            }
          }
          else {
            pause = true;
            setTimeout(function() {
              card.classList.remove('open', 'show');
              lastFlipped.classList.remove('open', 'show');
              lastFlipped = null;
              pause = false;
            }, 800);
          }
        }
        else {
          lastFlipped = card;
        }
      });
    });
  }

  function getRandomItem(arrObj) {
    return arrObj[Math.floor(Math.random() * arrObj.length)];
  }

  function start() {
    generateCards();
    activateCards();
    previewCards();
    console.log('game started.');
  }

  /* sets the info in the modal */
  function gameOver() {
    isGameOver = true;
    timer.stopTimer();
    moves_results.innerText = moves;
    time_results.innerText = timer.getTimeStr();
    $('#themodal').modal('toggle')
  }

  /* Resets the game */
  function resetGame(e) {
    if(e && e.preventDefault) { e.preventDefault(); }

    // clears board then regenerate cards
    clearBase();
    generateCards();
    activateCards();
    previewCards();
    timer.resetTimer();
    $('#themodal').modal('hide')

    // reset game state
    moves = 0;
    grade = 3;
    isGameOver = false;
    matches = [];
    lastFlipped = null;
    pause = false;
    isGameOn = false;

    // reset DOM state
    starsList.innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>';
    movesCntr.innerText = moves;
    timerCntr.innerText = timer.getTimeStr();
  }

  /* add the show/open classes then removes them after 4secs timeout */
  function previewCards() {
    document.querySelectorAll('.card').forEach(function(card) {
      card.classList.add('open', 'show');
    });
    setTimeout(function(){
      document.querySelectorAll('.card').forEach(function(card) {
        card.classList.remove('open', 'show');
      });
    }, 4000);
  }
  start();
});