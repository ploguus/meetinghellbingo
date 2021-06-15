import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { randomNumber, slugify, deslugify } from '../lib/helpers'
import squareSource from '../_data/squares'

const BingoSquare = ({ id, label, checked, onClick, isClickable = true } = {}) => (
  <button
    className={`h-24 flex items-center justify-center p-2 ${isClickable ? 'cursor-pointer' : 'cursor-default'} ${checked ? 'bg-red-700' : 'bg-white'}`}
    onClick={() => isClickable && onClick(id)}>
    <p className={`text-center text-lg ${checked ? 'text-white' : 'text-red-700'}`}>{label}</p>
  </button>
)

export default function Home(props) {
  const [ squares, setSquares ] = useState([])
  const [ checked, setChecked ] = useState([])
  const [ slug, setSlug ] = useState()

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

  const onClickSquare = clickedId => {
    const isChecked = checked.includes(clickedId)

    if (isChecked) setChecked(checked.filter((id) => id !== clickedId))
    else setChecked([ ...checked, clickedId ])
  }

  return (
    <main className="bg-gradient-to-t from-yellow-400 via-red-500 to-pink-500 w-screen h-screen">
      <div className="w-full h-full flex items-center justify-center">
        <div className="bg-white w-1/2 shadow-2xl rounded-lg">
          <h1 className="text-6xl uppercase text-center text-white py-4 bg-red-700 rounded-t-lg">Meeting Hell Bingo</h1>

          <div className="grid grid-cols-5 grid-flow-row gap-2 px-2">
            {squares.map((props) => (
              <BingoSquare
                {...props}
                key={props.id}
                checked={props.id === 'FREE' || checked.includes(props.id)}
                onClick={onClickSquare} />
            ))}
          </div>

          <div className="rounded-b-lg py-4">
          </div>
        </div>
      </div>
    </main>
  )
}
