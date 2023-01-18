import { Habit } from "./components/habit"
import './styles/global.css'

function App() {
  return (
    <div className="App">
      <h1>
        Hello World
      </h1>
      <Habit completed={3}/>
    </div>
  )
}

export default App
