// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from "../utils";

function Board() {
  const [squares, setSquares] = React.useState(Array(9).fill(null))
  const [savedGame, setSavedGame] = useLocalStorageState('savedGame', squares)
  const [gameHistory, setGameHistory] = useLocalStorageState('gameHistory', [Array(9).fill(null)])
  const [step, setStep] = useLocalStorageState('step',0)


  React.useEffect(()=> {
    savedGame && setSquares(savedGame)
  }, [])

  React.useEffect(()=> {
    setSavedGame(squares)
  }, [squares])

  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)

  // This is the function your square click handler will call. `square` should
  // be an index. So if they click the center square, this will be `4`.
  function selectSquare(square) {
    if (winner || squares[square]) return;
    const squaresCopy= [...squares]
    const gameHistoryCopy = gameHistory.length - step > 1 ? [...gameHistory.slice(0, step)] : [...gameHistory]
    setStep(previousStep => previousStep + 1)

    // 🐨 set the value of the square that was selected
    squaresCopy[square] = nextValue
    gameHistoryCopy[step+1] = squaresCopy
    setSquares(squaresCopy)
    setGameHistory(gameHistoryCopy)
  }

  function restart() {
    setSquares(Array(9).fill(null))
    setGameHistory([Array(9).fill(null)])
    setStep(0)
  }
  function selectHistory(i) {
    setSquares(gameHistory[i])
    setStep(i)
  }
  function renderHistory() {
    // console.debug("renderHistory")
    // console.debug({gameHistory})
    // console.debug(gameHistory.length)
    return (gameHistory.map((item, i) => {
      let btnText = ""
      if (i===0){
        btnText = "Go to game start";
      } else {
        btnText = step === i ? `Go to move #${i} (Current)` : `Go to move #${i}`
      }
      return <button
        disabled={step === i}
        onClick={() => selectHistory(i)}
      >{btnText}</button>
    }))
  }


  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <>
      <div style={{display: 'inline-block', marginRight: '10px'}}>
        <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
        <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
        <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      </div>
      <div style={{display: 'inline-block', verticalAlign:'top' }}>
        <div className="status">{status}</div>
        <div>{renderHistory()}</div>
      </div>
      <div>
        <button className="restart" onClick={restart}>restart</button>
      </div>
    </>
  )
}

function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
