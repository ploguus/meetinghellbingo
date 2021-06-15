import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useWindowSize } from 'react-use'
import Confetti from 'confetti-react'

import { randomNumber, slugify, checkWin } from '../lib/helpers'
import squareSource from '../_data/squares'

const BingoSquare = ({ index, id, label, checked, onClick, isClickable = true } = {}) => (
  <button
    className={`h-24 flex items-center justify-center p-2 focus:outline-none rounded ${isClickable ? 'cursor-pointer' : 'cursor-default'} ${checked ? 'bg-red-700' : 'bg-white'}`}
    onClick={() => isClickable && onClick(id, index)}>
    <p className={`text-center text-md ${checked ? 'text-white' : 'text-red-700'}`}>{label}</p>
  </button>
)

export default function Home(props) {
  const { width, height } = useWindowSize()

  const [ squares, setSquares ] = useState([])
  const [ checked, setChecked ] = useState([])
  const [ slug, setSlug ] = useState()
  const [ winner, setWinner ] = useState(false)

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
    </>
  )
}
