import { mount } from 'svelte'
import './app.css'
import AppShell from './AppShell.svelte';

const app = mount(AppShell, {
  target: document.getElementById('app')!,
})

export default app
