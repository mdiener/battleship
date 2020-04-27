import { writable } from 'svelte/store'

const fieldArray = []
for (let i = 0; i < 10; i++) {
  let row = []
  for (let j = 0; j < 10; j++) {
    row.push('')
  }
  fieldArray.push(row)
}

function createFieldId() {
  const { subscribe, set } = writable('')
  if (window.localStorage.getItem('view:fieldid') != null) {
    set(window.localStorage.getItem('view:fieldid'))
  }

  return {
    subscribe,
    set: (val) => {
      window.localStorage.setItem('view:fieldid', val)
      set(val)
    }
  }
}

export const fieldid = createFieldId()
export const field = writable(fieldArray)
