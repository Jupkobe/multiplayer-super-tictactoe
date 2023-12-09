import React from 'react'
import logo from '../../images/super-tictactoe-logo.svg';

export default function Navbar() {
  return (
    <nav className='fixed w-full bg-[#4464c2]'>
      <section className='flex items-center justify-center max-w-5xl p-4 mx-auto'>
        <div className='flex items-center justify-center gap-2'>
          <h1 className='text-4xl font-medium text-[#0b0d40]'>SUPER</h1>
          <div className='w-1/6 sm:w-1/5'>
            <img src={logo} className="logo" alt="super-tictactoe logo" />
          </div>
        </div>
      </section>
    </nav>
  )
}