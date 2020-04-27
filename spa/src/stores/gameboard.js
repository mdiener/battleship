import { v4 as uuidv4 } from 'uuid'
import { writable, derived } from 'svelte/store'

function createGameField () {
  const field = []
  for (let i = 0; i < 10; i++) {
    let row = []
    for (let j = 0; j < 10; j++) {
      row.push('')
    }
    field.push(row)
  }

  const { subscribe, set, update } = writable(field)
  if (window.localStorage.getItem('game:gamefield') != null) {
    set(JSON.parse(window.localStorage.getItem('game:gamefield')))
  }

  return {
    subscribe,
    reset: () => {
      const field = []
      for (let i = 0; i < 10; i++) {
        let row = []
        for (let j = 0; j < 10; j++) {
          row.push('')
        }
        field.push(row)
      }
      window.localStorage.setItem('game:gamefield', JSON.stringify(field))
      set(field)
    },
    setSquare: (row, col, value) => {
      update((field) => {
        field[row][col] = value
        window.localStorage.setItem('game:gamefield', JSON.stringify(field))
        return field
      })
    }
  }
}

function createFieldState() {
  const { subscribe, set } = writable('new')
  if (window.localStorage.getItem('game:fieldstate') != null) {
    set(window.localStorage.getItem('game:fieldstate'))
  }

  return {
    subscribe,
    set: (val) => {
      window.localStorage.setItem('game:fieldstate', val)
      set(val)
    }
  }
}

function createFieldId() {
  const id = uuidv4()
  const { subscribe, set } = writable(id)
  if (window.localStorage.getItem('game:fieldid') != null) {
    set(window.localStorage.getItem('game:fieldid'))
  } else {
    window.localStorage.setItem('game:fieldid', id)
  }

  return {
    subscribe,
    new: () => {
      const id = uuidv4()
      window.localStorage.setItem('game:fieldid', id)
      set(id)
    }
  }
}

export const fieldid = createFieldId()
export const state = createFieldState()
export const field = createGameField()
export const hasShips = derived(
  field,
  $field => $field.some((row) => row.some((square) => square == '#'))
)
