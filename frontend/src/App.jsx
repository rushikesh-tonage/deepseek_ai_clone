import React from 'react'
import { Routes ,Route, Navigate } from "react-router"
import Home from './components/Home.jsx'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import { useAuth } from '../context/AuthProvider.jsx'

function App() {
  


  const [authUser]=useAuth()
  console.log(authUser);
  

  return (
    <>
    <Routes>
      <Route path="/" element={authUser? <Home />: <Navigate to="/login"/>} />
      <Route path='/login' element={authUser? <Navigate to="/" />: <Login />} />
      <Route path='/signup' element={authUser? <Navigate to="/" />: <Signup />} />
    </Routes>
    </>
  )
}

export default App