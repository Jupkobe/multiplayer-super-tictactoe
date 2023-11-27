import React from 'react'

export default function Footer() {
  return (
    <footer className='fixed bottom-0 w-full bg-[#4464c2]'>
      <section className='flex items-center justify-center max-w-5xl p-3 mx-auto'>
        <div className='flex items-center justify-center gap-2 text-[#0b0d40]'>
          <a className='font-bold underline text-md' href='https://www.youtube.com/shorts/_Na3a1ZrX7c' target="_blank" >How to play?</a>
          <strong className='text-lg'>|</strong>
          <p>Created by <a className='font-bold underline text-md' href='https://github.com/Jupkobe'>@Jupkobe</a></p>
        </div>
      </section>
    </footer>
  )
}