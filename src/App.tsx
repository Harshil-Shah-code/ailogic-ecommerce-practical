import { Outlet } from 'react-router-dom'
import './App.css'

function App() {

  return (
    <>
      <main className='min-h-screen w-full bg-white'>
        <Outlet />
      </main>
    </>
  )
}

export default App
