import { writable } from 'svelte/store'

function createState() {
  const { subscribe, set } = writable('')
  if (window.localStorage.getItem('state') != null) {
    set(window.localStorage.getItem('state'))
  }

  return {
    subscribe,
    set: (val) => {
      window.localStorage.setItem('state', val)
      set(val)
    }
  }
}

export const state = createState()
