import Phone from '../assets/images/phone.png'
import Location from '../assets/images/location.png'

const Footer = () => {
  return (
    <footer className="bg-black text-white px-6 md:px-20 py-10 mt-20">
      <div className="flex flex-col md:flex-row justify-between gap-10">
        
        {/* Left Section */}
        <div className="flex flex-col space-y-8">
          {/* About Us */}
          <div>
            <h3 className="text-xl font-semibold mb-4">About Us</h3>
            <p className="text-white w-[full] md:w-[400px]">
              Diadem Luxury is a store that offers all your needs, from food stuff to fashion wears and all.
            </p>
          </div>

          {/* Contact Us */}
          <div>
            <div className='flex flex-col md:flex-row md:justify-self-end md:gap-100 gap-10'>
              <div>
                <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
                <div className='flex gap-2 items-center mb-2'>
                <img src={Phone} alt="Phone" />
                <p className="text-gray-400"> 09054720093</p>
                </div>
                <div className='flex gap-2 items-center mb-2'>
                  <img src={Location} alt="Location" />
                  <p className="text-gray-400">Address: 26, Apatuku Street, Akobo, Oju Irin, Ibadan.</p>

                </div>
              </div>

              <div className="w-full md:max-w-md">
                <h3 className="text-xl font-semibold mb-4">Sign Up For Newsletters</h3>
                <p className="text-gray-400 mb-4">Stay updated with our latest offers and products.</p>
                <form className="flex flex-col space-y-3">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="p-3 rounded-md border-1 border-white text-white focus:outline-[#a00000]"
                  />
                  <button 
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-red-700 transition py-3 rounded-md font-medium"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>

        </div>

      </div>

      <div className='flex justify-between items-center mt-10 border-t border-gray-700 pt-6'>
            <h3 className="">Powered By Pepsa.co</h3>
          <div className="">
        &copy; {new Date().getFullYear()} Diadem Luxury. All rights reserved.
      </div>
      </div>
      
    </footer>
  );
};

export default Footer;
