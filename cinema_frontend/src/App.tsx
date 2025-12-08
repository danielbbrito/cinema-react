import { useState } from 'react'
import './App.css'
import Button from './components/Button'
import Input from './components/Input'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1> bem vindos!!!</h1>
      <Input id="1" type="text" label="test"></Input>
      <Button label="Hello world!" type="button" onClick={() => alert("clicou!")}></Button>
    </>
  )
}

export default App
