const ALPHAS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-1234567890'
const WINS = [
  [ 0, 1, 2, 3, 4 ],
  [ 5, 6, 7, 8, 9 ],
  [ 10, 11, 13, 14 ],
  [ 15, 16, 17, 18, 19 ],
  [ 20, 21, 22, 23, 24 ],
  [ 0, 6, 18, 24 ],
  [ 4, 8, 16, 20 ],
  [ 0, 5, 10, 15, 20 ],
  [ 1, 6, 11, 16, 21 ],
  [ 2, 7, 17, 22 ],
  [ 3, 8, 13, 18, 23 ],
  [ 4, 9, 14, 19, 24 ]
]

export const randomNumber = (min, max) => (
  Math.floor(Math.random() * (max - min + 1) + min)
)

export const slugify = n => ALPHAS[n]

export const deslugify = d => ALPHAS.indexOf(d)

export const checkWin = (selected = []) => {
  if (selected.length < 4) return false

  for (const condition of WINS) {
    let matches = 0

    for (const digit of selected) {
      if (condition.includes(digit)) matches += 1
    }

    if (matches === condition.length) return true
  }

  return false
}
