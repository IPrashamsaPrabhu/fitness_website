"use client"
import React, { useState } from 'react';
import '../auth.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent form submission
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include'
      });
      const data = await response.json();
      if (data.ok) {
        //handle successful signup e.g.,show a success message
        console.log('admin registration successful', data);
        toast.success('Admin registration successful', {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        //handle signup error
        console.log('Admin registration failed', data.statusText);
        toast.error('Admin registration failed', {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      toast.error('An error occurred during registration');
      console.log('An error occurred during registration', error);
    }
  };

  return (
    <div className='formpage'>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Signup</button>
      </form>

      <p>Already have an account? <button onClick={() => {
        // Navigate to the login page
      }}>Login</button></p>
    </div>
  );
};

export default SignupPage;
