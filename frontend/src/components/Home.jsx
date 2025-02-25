import React from 'react'
import NavBar from './landingPage/NavBar';
import Hero from './landingPage/Hero';
import Footer from './landingPage/Footer';

const Home = () => {

  return (
    <div className='h-[100svh] w-[100shw]'>
      <NavBar />
      <Hero />
      <Footer />
    </div>
  )
}

export default Home;