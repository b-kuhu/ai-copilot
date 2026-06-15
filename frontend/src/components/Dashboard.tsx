"use client"

import { AppData } from "../context/AppContext"

const Dashboard = () => {
  const { user, logoutUser } = AppData();
  console.log({user})
  
  return (
    <button onClick={logoutUser} className='bg-red-500 text-white p-2 mt-40 rounded-md'>Logout</button>
  )
}

export default Dashboard