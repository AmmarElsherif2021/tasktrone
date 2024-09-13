//import './App.css'
import { Blog } from './Blog.jsx'

import { Header } from '../Components/Header/Header.jsx'
import { Board } from './Board.jsx'

export function Home() {
  //Filters State

  return (
    <div style={{ padding: 8, background: 'yellow' }}>
      <Header />
      <div style={{ display: 'flex', flexDirection: 'horizontal' }}>
        <Blog />
        <Board />
      </div>
    </div>
  )
}
