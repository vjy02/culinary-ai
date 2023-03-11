import Input from "./Input.jsx"
import Instructions from "./Instructions.jsx"
import "./index.css"
import "./App.css"
import {useState} from "react"

function App() {
  const [hidden, setHidden] = useState(false)

  const handleHidden = (newState) => {
    setHidden(newState)
  }

  return (
    <div>
      <div className={`hide ${hidden ? 'hidden' : ''}`}>
        <Instructions handleHidden={handleHidden}/> 
        <div className="absolute inset-0 bg-black opacity-70 z-20"></div>
        <div class="h-screen bg-cover bg-[url('./assets/background.jpg')]">
          <Input/>
        </div>
      </div>
      <div class="h-screen bg-cover bg-[url('./assets/background.jpg')] opacity-100 transition-opacity duration-500 delay-500">
        <Input/>
      </div>
    </div>
  )
}

export default App