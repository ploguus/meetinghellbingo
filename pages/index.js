import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useWindowSize } from 'react-use'
import Confetti from 'confetti-react'

import { randomNumber, slugify, checkWin } from '../lib/helpers'
import squareSource from '../_data/squares'

const BingoSquare = ({ index, id, label, checked, onClick, isClickable = true } = {}) => (
  <button
    className={`h-24 flex items-center justify-center p-2 focus:outline-none rounded ${isClickable ? 'cursor-pointer' : 'cursor-default'} ${checked ? 'bg-red-700' : 'bg-red-50'}`}
    onClick={() => isClickable && onClick(id, index)}>
    {id === 'FREE' ? (
      <p className="text-center text-2xl text-white">{label}</p>
    ) : (
      <p className={`text-center text-sm ${checked ? 'text-white' : 'text-red-700'}`}>{label}</p>
    )}
  </button>
)

const WinnerText = ({ onClose }) => (
  <div className="absolute flex flex-col justify-center items-center w-screen h-screen">
    <div className="flex flex-col justify-center items-center w-full h-full">
      <p className="text-9xl text-white uppercase win-text font-bold text-center">
        WINRAR!
      </p>
      <p className="text-white text-center bg-black py-2 px-24 mt-10">
        ...or lose really. I'm sorry. That meeting must have sucked.
      </p>

      <button className="bg-pink-600 text-white text-lg" onClick={onClose}>
        Play again?
      </button>
    </div>
  </div>
)

export default function Home(props) {
  const [ squares, setSquares ] = useState([])
  const [ checked, setChecked ] = useState([])
  const [ slug, setSlug ] = useState()
  const [ winner, setWinner ] = useState(false)
  const [ width, setWidth ] = useState(0)
  const [ height, setHeight ] = useState(0)

  useEffect(() => {
    const shuffled = []
    const used = []
    let slugString = ''

    while (shuffled.length <= 24) {
      if (shuffled.length === 12) shuffled.push({ label: 'FREE', id: 'FREE', checked: true, isClickable: false })
      else {
        const index = randomNumber(0, squareSource.length - 1)
        const square = squareSource[index]

        if (!used.includes(square.id)) {
          shuffled.push({ ...square, isClickable: true })
          slugString += slugify(index)
          used.push(square.id)
        }
      }
    }

    setSquares(shuffled)
    setSlug(slugString)
  }, [])

  useEffect(() => {
    const isWinner = checkWin(checked)
    setWinner(isWinner)
  }, [checked])

  useEffect(() => {
    setWidth(global.window.screen.width)
    setHeight(global.window.screen.height)

    setWinner(true)
  }, [global.window])

  const onClickSquare = (clickedId, index) => {
    const square = squares[index]
    const isChecked = checked.includes(index)

    if (isChecked) setChecked(checked.filter((i) => i !== index))
    else setChecked([ ...checked, index ])
  }

  return (
    <>
      <Head>
        <title>Are you in meeting hell?</title>
      </Head>
      {winner ? <WinnerText /> : null}
      {winner ? <Confetti width={width} height={height} /> : null}
      <main className="bg-gradient-to-t from-yellow-400 via-red-500 to-pink-500 w-screen h-screen">
        <div className="w-full h-full flex items-center justify-center">
          <div className="bg-white w-1/2 shadow-2xl rounded-lg">
            <h1 className="text-6xl uppercase text-center text-white py-4 bg-red-700 rounded-t-lg font-bold">Meeting Hell Bingo</h1>

            <div className="grid grid-cols-5 grid-flow-row gap-2 px-4 py-8">
              {squares.map((props, index) => (
                <BingoSquare
                  {...props}
                  index={index}
                  key={props.id}
                  checked={props.id === 'FREE' || checked.includes(index)}
                  onClick={onClickSquare} />
              ))}
            </div>

            <div className="rounded-b-lg py-4">
              <p className="text-center text-sm text-gray-400">
                This is a fun project by <a className="font-bold" href="https://fiiv.dev">@fiiv</a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <script async defer src="https://lalala.meetinghellbingo.com/latest.js"></script>
      <noscript><img src="https://lalala.meetinghellbingo.com/noscript.gif" alt="" referrerpolicy="no-referrer-when-downgrade" /></noscript>
    </>
  )
}
