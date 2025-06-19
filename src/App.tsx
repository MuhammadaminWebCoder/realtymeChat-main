import './App.css'
import { UseAuthToken } from './middleware'
function App() {
  return (
    <div className='h-screen'>
      <UseAuthToken/>
    </div>
  )
}

export default App

