import { useState } from 'react'
import './App.css'
import { TURNS } from './Constant/constant'
import { Square } from './Components/Square'
import confetti from 'canvas-confetti'
import { checkWinnerFrom, checkEndGame } from '../src/Logic/board'
import WinnerModal from './Components/WinnerModal'

function App () {
  // const [data, setData] = useState([]);
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
  })
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X
  })
  // null no hay ganador, false empate
  const [winner, setWinner] = useState(null)
  const updateBoard = (index) => {
    // No actualizar posicion si ya tiene algo
    if (board[index] || winner) return
    // Actualizar tablero
    const newBoard = [...board]
    newBoard[index] = turn // x u o
    setBoard(newBoard)
    // Cambiar Turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    // Guardar partida
    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn', newTurn)
    // Revisar si hay ganador
    const newWinner = checkWinnerFrom(newBoard)
    if (newWinner) {
      setWinner(newWinner)
      confetti()
    } else if (checkEndGame(newBoard)) {
      setWinner(false)
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setWinner(null)
    setTurn(TURNS.X)

    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }

  // useEffect(() => {
  //   fetch('https://pokeapi.co/api/v2/pokemon')
  //     .then(response => response.json())
  //     .then(responseData => setData(responseData.results))
  //     .catch((err) => console.log(err))
  // },[])

  return (
    <main className='board'>
      {/* <ul>
      {
        data.map(pokemon => (
          <li key={pokemon.name}>
            {pokemon.name} <br />
            {pokemon.url}
          </li>

        ))
      }
      </ul> */}

      <h1>Ta Te Ti</h1>
      <button onClick={resetGame}>Resetear Juego</button>
      <section className='game'>
        {
          board.map((square, index) => {
            return (
              <Square
                key={index}
                index={index}
                updateBoard={updateBoard}
              >
                {square}
              </Square>
            )
          })
        }
      </section>
      <section className='turn'>
        <Square isSelected={turn === TURNS.X}>
          {TURNS.X}
        </Square>
        <Square isSelected={turn === TURNS.O}>
          {TURNS.O}
        </Square>
      </section>
      <WinnerModal win={winner} resetGame={resetGame} />
    </main>
  )
}

export default App
