const score = document.querySelector('.score-result')
const highscore = document.querySelector('.highscore-result')
const result = document.querySelector('[data-result]')
const timer = document.querySelector('[data-timer]')
const btnCheck = document.querySelector('#btn-check')
const btnPlay = document.querySelector('.play')
const userInput = document.querySelector('.input-choice')
const randomNumber = document.querySelector('.randomNumberBox')
const gameContainer = document.querySelector('.game')
const messagesBox = document.querySelector('.messages')

let userChoice
let pcChoice
let timerValue = 20  
let gameInterval
let tries
let higherScore = localStorage.getItem('score') || 0
highscore.innerText = `${higherScore}`

const randomizeDisplay = async () => {
  return new Promise(resolve=> {
    setTimeout(()=> {
      randomNumber.innerText = Math.floor(Math.random() * 20) + 1
      resolve()
    }, 115)
  })
}

const getRandomNumber = ()=> {
  return Math.floor(Math.random() * 20) + 1
}

const guess = ()=> {
  tries++
  let answer = Number(userInput.value)
  if (!answer) {
    messagesBox.innerText = 'Preencha um valor!'
    userInput.focus()
  }
  else {
    if (answer === pcChoice) {
      messagesBox.innerText = 'Parabéns! Você venceu!'
      gameContainer.classList.add('win')
      clearInterval(gameInterval)
      let newScore = Math.ceil(timerValue/tries) * 200
      score.innerText = `${newScore}` 
      let storageHighScore = localStorage.getItem('score')
      if (!storageHighScore) {
        localStorage.setItem('score', newScore)  
        higherScore = newScore
      }
      else {
        if (Number(storageHighScore) < newScore) {
          localStorage.setItem('score', newScore)
          higherScore = newScore
        }
        else {
          higherScore = Number(storageHighScore)
        }
      }
      highscore.innerText = `${higherScore}`

      restartGame('Você venceu!', true)

    }
    else {
      let msg = `Seu palpite foi mais`
      let guessInfo
      if (answer > pcChoice) {
         guessInfo = 'alto!'
      }
      else {
        guessInfo = 'baixo!'
      }
      messagesBox.innerText = `${msg} ${guessInfo}`
      gameContainer.classList.add('lose')
        setTimeout(()=> {
          gameContainer.classList.remove('lose')
      }, 500)
    
      userInput.focus()
    }
  }
}

const countDown = async ()=> {
  gameInterval = setInterval(()=> {
    timerValue--
    timer.innerText = `${timerValue}`
    if (timerValue === 0) 
    {
      clearInterval(gameInterval)
      restartGame("Tempo Esgotado!", false) 
    }
  }, 1000)
}

const restartGame = (msg, hasWin)=> {
    btnCheck.removeEventListener('click', guess) 
    document.removeEventListener('keydown', guess)
    timer.parentElement.style.display = 'none'
    result.style.display = 'flex'
    result.innerText = msg
    gameContainer.classList.add(hasWin ? 'win': 'lose')  
    btnPlay.style.visibility = 'visible'
    btnPlay.innerText = 'Jogar Novamente!'
    
    btnCheck.addEventListener('click', infoBeforeStart)
}


const play = async ()=> {
  btnCheck.removeEventListener('click', infoBeforeStart)
  document.removeEventListener('keydown', infoBeforeStart)
  tries = 0
  messagesBox.innerText = ''
  result.style.display = 'none'
  timer.parentElement.style.display = 'flex'
  timer.style.display = 'inline'
  userInput.value = ''
  score.innerText = ''
  timerValue = 20
  timer.innerText = `${timerValue}`
  gameContainer.classList.remove(...gameContainer.classList)
  gameContainer.classList.add('game')
 
  for (let i = 0; i < 20; i++) {
    await randomizeDisplay()
  }
  randomNumber.innerText = '?'
  timer.innerText = `${timerValue}`
  pcChoice = getRandomNumber()
  countDown()
  btnCheck.addEventListener('click', guess)
  document.addEventListener('keydown', (ev)=> {
    console.log(ev.keyCode)
    if (ev.keyCode === 13) {
      guess()
    } 
  })
  
}

const infoBeforeStart = ()=> {
  messagesBox.innerText = 'Pressione Jogar para começar!'
}

btnCheck.addEventListener('click', infoBeforeStart)
document.addEventListener('keydown', (ev)=> {
  if (ev.keyCode === 13) {
    infoBeforeStart()
  }
})

btnPlay.addEventListener('click', ()=> {
  btnPlay.style.visibility= 'hidden'
  play()
})

