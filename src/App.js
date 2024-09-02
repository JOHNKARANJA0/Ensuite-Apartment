import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css'
import { AuthProvider } from './context/AuthContext'
import Login from './components/Login'
import Home from './components/Home';
import SignUpForm from './components/SignUp';

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='login' element={<Login/>}/>
          <Route path='/' element={<Home/>}/>
          <Route path='/sign-up' element={<SignUpForm/>}/>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
