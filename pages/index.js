import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { useWindowSize } from 'react-use'
import Confetti from 'confetti-react'

import { randomNumber, slugify, checkWin } from '../lib/helpers'
import squareSource from '../_data/squares'

const BingoSquare = ({ index, id, label, checked, onClick, isClickable = true } = {}) => (
  <button
    className={`md:h-24 flex items-center justify-center p-2 focus:outline-none rounded ${isClickable ? 'cursor-pointer' : 'cursor-default'} ${checked ? 'bg-red-700' : 'bg-red-50'}`}
    onClick={() => isClickable && onClick(id, index)}>
    {id === 'FREE' ? (
      <p className="text-center text-lg md:text-4xl text-white">{label}</p>
    ) : (
      <p className={`text-center text-2xs md:text-sm ${checked ? 'text-white' : 'text-red-700'}`}>{label}</p>
    )}
  </button>
)

const WinnerText = ({ onClose }) => (
  <div className="absolute flex flex-col justify-center items-center w-screen h-screen">
    <div className="flex flex-col justify-center items-center w-full h-full bg-yellow-200">
      <p className="z-10 font-headline text-8xl md:text-9xl text-white uppercase win-text font-bold text-center">
        WINRAR!
      </p>
      <p className="z-10 text-yellow-800 font-bold text-center py-2 px-24 mt-10">
        That meeting must have really sucked.
      </p>

      <button className="z-10 mt-4 bg-pink-600 text-white text-lg px-8 py-4 rounded font-bold" onClick={onClose}>
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
  const sa = useRef(null)

  const shuffleSquares = () => {
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

    if (sa.current) sa.current(`served__${slugString}`)
  }

  const resetCard = () => {
    shuffleSquares()
    setChecked([])
    setWinner(false)
  }

  useEffect(() => {
    shuffleSquares()
  }, [])

  useEffect(() => {
    const isWinner = checkWin(checked)
    setWinner(isWinner)

    if (isWinner && sa.current) sa.current(`win__${slug}`)
  }, [checked])

  useEffect(() => {
    setWidth(window.screen.width)
    setHeight(window.screen.height)

    window.sa_event = window.sa_event || function(){var a=[].slice.call(arguments);window.sa_event.q?window.sa_event.q.push(a):window.sa_event.q=[a]}

    if (window.sa_event) sa.current = window.sa_event
  }, [global.window])

  const onClickSquare = (clickedId, index) => {
    const square = squares[index]
    const isChecked = checked.includes(index)

    if (isChecked) setChecked(checked.filter((i) => i !== index))
    else setChecked([ ...checked, index ])

    if (sa.current) sa.current(`selected__${square.id}`)
  }

  return (
    <>
      <Head>
        <title>Are you in meeting hell?</title>
        <meta name="description" content="Play bingo with all the ways your soul hurts during meetings." />

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:title" content="Are you in meeting hell?" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://meetinghellbingo.com" />
        <meta property="og:image" content="https://meetinghellbingo.com/shareimg.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@meetingcanary" />
        <meta name="twitter:creator" content="@mtimofiiv" />
      </Head>
      {winner ? <WinnerText onClose={resetCard} /> : null}
      {winner ? <Confetti width={width} height={height} /> : null}
      <main className="bg-gradient-to-t from-yellow-400 via-red-500 to-pink-500 w-screen">
        <div className="w-full h-full flex md:items-center justify-center">
          <div className="bg-white md:w-1/2 shadow-2xl rounded-lg">
            <h1 className="font-headline text-5xl md:text-8xl uppercase text-center text-white py-4 bg-red-700 rounded-t-lg font-bold">Meeting Hell Bingo</h1>

            <div className="text-center pt-4">
              <button className="text-gray-400" onClick={resetCard}>Generate a different bingo card</button>
            </div>

            <div className="grid grid-cols-5 grid-flow-row gap-2 px-2 md:px-4 py-8">
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
      <noscript><img src="https://lalala.meetinghellbingo.com/noscript.gif" alt="" referrerPolicy="no-referrer-when-downgrade" /></noscript>
    </>
  )
}
