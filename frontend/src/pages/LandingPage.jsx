import Hero from '../components/landingPage/Hero';
import Footer from '../components/landingPage/Footer';
import NavBar from '../components/landingPage/NavBar';

const LandingPage = () => {
  return (
    <div className='h-dvh w-dvw'>
      <NavBar />
      <Hero />
      <Footer />
    </div>
  )
}

export default LandingPage
