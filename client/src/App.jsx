import './App.css'
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import Signup from './components//Signup/signup'
import Login from './components/Login/login'
import Expenses from './components/Expenses/expenses'




function App() {
  

  return (
    <Router>
      <Routes>
        <Route path= '/' element ={<h1>Home Page!</h1>}/>
        <Route path= '/expenses' element ={<Expenses />} />
        <Route path='/signup' element = {<Signup />} />
        <Route path='/login' element = {<Login />}  />
      </Routes>
    </Router>
  )
}

export default App
