"use client"
import React from 'react'

function AuthPage({isSignin}:{
    isSignin: boolean
}) {
    const submitHandler = ()=>{

    }
  return (
    <div className='w-screen h-screen flex justify-center items-center'>
        <div className='p-2 m-2 bg-white rounded'>
            <input className='bg-gray-500' type="text" placeholder='email@gmail.com'/>
            <br />
            <br />
            <input className='bg-gray-500' placeholder='password' type="password" name="" id="" />
            <br />
            <br />
            <button onClick={submitHandler} className='text-black'>{isSignin? "sign in": "sign up"}</button>
        </div>
    </div>
  )
}

export default AuthPage
