import './app.css'
import App from './App.svelte'

import Framework7 from 'framework7'
import Framework7Svelte from 'framework7-svelte'

Framework7.use(Framework7Svelte)

window.addEventListener("contextmenu", (e: MouseEvent) => {
  import.meta.env.PROD ? e.preventDefault() : void 0
})

const app = new App({
  target: document.getElementById('app')!,
})

export default app
