import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"
import SettingsPage from "./pages/SettingsPage"
import ProfilePage from "./pages/ProfilePage"

import { Routes, Route, Navigate } from "react-router-dom"
import { useAuthStore } from "./store/useAuthStore"
import { useEffect } from "react"

import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast';

function App() {
 
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth()
  }, []);
  console.log({ authUser });

  if(isCheckingAuth && !authUser){
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin"/>
      </div>
    )
  }

  return (
    <>
      <div>
        <Navbar />

        <Routes>
          <Route path="/" element={authUser ?  <HomePage/> : <Navigate to='/login'/>} />
          <Route path="/signup" element={!authUser ? <SignupPage/> : <Navigate to='/'/>}/>
          <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to='/'/>}/>
          <Route path="/settings" element={<SettingsPage/>}/>
          <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to='/login'/>}/>
          {/* <Route path="/profile" element={<div style={{ background: 'yellow', padding: 40 }}>TESTING PROFILE ROUTE</div>} /> */}


        </Routes>

        <Toaster />
      </div>
    </>
  )
}

export default App
