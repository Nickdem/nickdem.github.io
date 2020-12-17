'use strict';

let scores, activePlayer, roundScore, gamePlaying, lastDice

const btnNew = document.querySelector('.btn--new')
const btnRoll = document.querySelector('.btn--roll')
const btnHold = document.querySelector('.btn--hold')
const dice1Dom = document.getElementById('dice--1')
const dice2Dom = document.getElementById('dice--2')

const init = () => {
  scores = [0, 0]
  activePlayer = 0
  roundScore = 0
  gamePlaying = true

  dice1Dom.style.display = 'none'
  dice2Dom.style.display = 'none'

  document.getElementById('score--0').textContent = '0'
  document.getElementById('score--1').textContent = '0'
  document.getElementById('current--0').textContent = '0'
  document.getElementById('current--1').textContent = '0'
  document.getElementById('name--0').textContent = 'Player 1'
  document.getElementById('name--1').textContent = 'Player 2'
  document.querySelector('.player--0').classList.remove('player--winner')
  document.querySelector('.player--1').classList.remove('player--winner')
  document.querySelector('.player--0').classList.remove('player--active')
  document.querySelector('.player--1').classList.remove('player--active')
  document.querySelector('.player--0').classList.add('player--active')
}

init()

btnRoll.addEventListener('click', () => {
  if (gamePlaying) {
    const dice1 = Math.floor(Math.random() * 6 + 1)
    const dice2 = Math.floor(Math.random() * 6 + 1)

    dice1Dom.style.display = 'block'
    dice2Dom.style.display = 'block'
    dice1Dom.src = `img/dice-${dice1}.png`
    dice2Dom.src = `img/dice-${dice2}.png`
    
    if (dice1 !== 1 && dice2 !== 1) {
      roundScore += dice1 + dice2
      document.querySelector(`#current--${activePlayer}`).textContent = roundScore
    } else {
      nextPlayer()
    }
  }
})

btnHold.addEventListener('click', () => {
  if (gamePlaying) {
    scores[activePlayer] += roundScore

    document.querySelector(`#score--${activePlayer}`).textContent = scores[activePlayer]

    let winningScore
    const input = document.querySelector('.final--score').value

    if (input) {
      winningScore = input
    } else {
      winningScore = 100
    }

    if (scores[activePlayer] >= winningScore) {
      document.querySelector(`#name--${activePlayer}`).textContent = 'Winner!!!'
      dice1Dom.style.display = 'none'
      dice2Dom.style.display = 'none'
      document.querySelector(`.player--${activePlayer}`).classList.add('player--winner')
      document.querySelector(`.player--${activePlayer}`).classList.remove('player--active')
      gamePlaying = false
    } else {
      nextPlayer()
    }
  }
})

btnNew.addEventListener('click', init)

const nextPlayer = () => {
  activePlayer === 0 ? activePlayer = 1 : activePlayer = 0
  roundScore = 0

  document.getElementById('current--0').textContent = '0'
  document.getElementById('current--1').textContent = '0'

  document.querySelector('.player--0').classList.toggle('player--active')
  document.querySelector('.player--1').classList.toggle('player--active')

  dice1Dom.style.display = 'none'
  dice2Dom.style.display = 'none'
}
