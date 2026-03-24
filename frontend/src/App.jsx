import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import SignOut from './pages/SignOut'

const App = () => {
  return (
    <Routes>
      <Route path='/signup' element={<SignUp/>}/>
      <Route path='/signin' element={<SignIn/>}/>
      <Route path='/signout' element={<SignOut/>}/>
    </Routes>
  )
}

export default App
