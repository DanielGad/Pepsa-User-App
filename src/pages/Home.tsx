import DiademLogo from '../assets/images/diadem-luxury-logo.png';

const Home = () => {
  return (
    <div className="">
      <section className="header-container relative flex flex-col items-center justify-center mx-20 " >
        <img src={DiademLogo} alt="Diadem Logo" className='shadow-md'/>
        <span className="Diadem text-4xl font-bold text-white">Diadem Luxury</span>
      </section>
    </div>
  )
}

export default Home