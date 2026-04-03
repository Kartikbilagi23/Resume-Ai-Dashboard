import React from 'react'
import { useState } from 'react';
import '../App.css';

const Signup = () => {
  const [form, setform] = useState({
    name:"",
    email:"",
    password:""
  });
  const handlechange=(e)=>{
    setform({...form,[e.target.name]:e.target.value})
  };
  const handleSignup=async () => {
    try {
      const res=await fetch("http://localhost:5000/api/auth/register",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(form),
      });
      const data=await res.json();
      if(!res.ok) throw new Error(data.message);
      localStorage.setItem("token",data.token);
      alert("Account created!")
      window.location.href="/dashboard";
    } catch (err) {
      alert(err.message);
    }
  };
  return (
    <div className='flex items-center justify-center h-screen bg-[#202430]'>
      <div className='p-[15px]  rounded-[23px] border border-white/10 w-[400px] shadow'>
        <h2 className='text=2xl font-semibold mb-4 text-center'>Create account</h2>
        <input name='name'
        placeholder='Username'
        className='w-[97%] p-[5px] mb-3 border rounded bg-[#333848] text-[#f5deb3]'
        onChange={handlechange}
        type="text" />
        <input name='email'
        placeholder='Email'
        className='w-[97%] p-[5px] mb-3 border rounded bg-[#333848] text-[#f5deb3]'
        onChange={handlechange}
        type="text" />
        <input name='password'
        placeholder='Password'
        className='w-[97%] p-[5px] mb-3 border rounded bg-[#333848] text-[#f5deb3]'
        onChange={handlechange}
        type="text" />
        <button
        onClick={handleSignup}
        className='w-full bg-blue-600 white p-[5px] rounded mt-[7px]'
        >Signup</button>
      </div>
    </div>
  )
}

export default Signup