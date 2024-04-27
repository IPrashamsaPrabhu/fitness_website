"use client"
import React , {useState} from 'react'
import '../auth.css'
import { ToastContainer,toast } from 'react-toastify';

const LoginPage = () => {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');

  const handleLogin = async()=>{
  try{
    const response=await fetch(process.env.NEXT_PUBLIC_BACKEND_API+ '/admin/login',{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
    },
    body:JSON.stringify({email,password}),
    credentials:"include"
  })
  const data=await response.json();
  if(data.ok){
    //handle successful login e.g.,show a success message
    console.log('admin login successful',data);
    toast.success('Admin login successful', {
    position: toast.POSITION.TOP_CENTER,
});
window.location.href='/pages/addworkout';

  }else{
    //handle login error
    console.log('Admin login failed',data.statusText);
    toast.error('Admin login failed', {
    position: toast.POSITION.TOP_CENTER,
});

  } 
}
catch(error){
  toast.error('An error occured login');
  console.log('An error occured during login',error);
}
  }
  return (
    <div className='formpage'>
      <form action="">
       <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e)=>setEmail(e.target.value)}
      />
       <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e)=>setPassword(e.target.value)}
      />
       <button
       onClick={(e) => {
       e.preventDefault()
       handleLogin()
      }}
      >Login</button>
      </form>

<p>Don't have an account?  <button onClick={() => {
}}>Signup</button></p>

    </div>
  )
}

export default LoginPage