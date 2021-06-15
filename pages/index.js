import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { randomNumber, slugify, deslugify } from '../lib/helpers'
import squareSource from '../_data/squares'

export default function Home(props) {
  const [ squares, setSquares ] = useState([])
  const [ slug, setSlug ] = useState()

  useEffect(() => {
    const shuffled = []
    const used = []
    let slugString = ''

    while (shuffled.length <= 24) {
      if (shuffled.length === 12) shuffled.push({ label: 'FREE', id: 'FREE' })
      else {
        const index = randomNumber(0, squareSource.length - 1)
        const square = squareSource[index]

        if (!used.includes(square.id)) {
          shuffled.push({ ...square })
          slugString += slugify(index)
          used.push(square.id)
        }
      }
    }

    setSquares(shuffled)
    setSlug(slugString)
  }, [])

  return (
    <main className="bg-gradient-to-t from-yellow-400 via-red-500 to-pink-500 w-screen h-screen">
      <div className="w-full h-full flex items-center justify-center">
        <div className="bg-white w-1/2 shadow-2xl rounded-lg">
          <h1 className="text-6xl uppercase text-center text-white py-4 bg-black rounded-t-lg">Meeting Hell Bingo</h1>

          <div className="grid grid-cols-5 grid-flow-row gap-2 bg-black px-2">
            {squares.map(({ id, label }, i) => (
              <div className="h-24 flex items-center justify-center bg-white p-2" key={id}>
                <p className="text-center text-lg">{label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-b-lg py-4 bg-black">
            <p className="text-white">{slug}</p>
          </div>
        </div>
      </div>
    </main>
  )
}
