import React from 'react'

export default function Footer() {
  return (
    <footer className='fixed bottom-0 w-full bg-[#4464c2]'>
      <section className='flex items-center justify-around max-w-5xl gap-2 p-3 mx-auto'>
          <a className='flex-1 text-sm font-bold text-right underline sm:text-base' href='https://www.youtube.com/shorts/_Na3a1ZrX7c' target="_blank" >How to play?</a>
          <strong className='mx-4 text-lg'>|</strong>
          <p className='flex-1 hidden sm:block'>Created by <a className='font-bold' href='https://github.com/Jupkobe'>@Jupkobe</a></p>
          <p className='flex-1 block text-sm sm:hidden'>By <a className='font-bold' href='https://github.com/Jupkobe'>@Jupkobe</a></p>
      </section>
    </footer>
  )
}