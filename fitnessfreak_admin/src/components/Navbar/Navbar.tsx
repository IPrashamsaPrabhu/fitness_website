"use client"
import React, {useEffect ,useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from './logo.png'; // Assuming correct path to logo
import './Navbar.css';

const Navbar = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  return (
    <div className="navbar">
      <Image src={logo} alt="logo" width={100} className="logo" />
      <div className="adminlinks">
        {isAdminAuthenticated ? (
          <Link href="/pages/addworkout">Add Workout</Link>
        ) : (
          <>
            <Link href="/adminauth/login">Login</Link>
            <Link href="/adminauth/register">Signup</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
