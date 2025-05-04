import { Link } from 'react-router-dom';
import NGN from "../assets/images/NGN.png";

const MobileAccDetails = () => {
  return (
    <section className='lg:hidden'>
      <div className="mt-[-20px] mb-10 flex justify-center gap-2 text-sm bg-gray-200 py-1 relative">
        <Link to={"/"}><span className="">Home</span></Link>
         &gt; 
         <span className="">My Account</span>
      </div>

    <div className="flex flex-col items-center justify-center bg-white lg:px-4 mt-[-30px]">
      <div className="mt-8 w-full max-w-md px-4">
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1">
            Name
          </label>
          <input
            type="name"
            id="name"
            placeholder="Enter full name"
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2  placeholder-gray-400 text-gray-900"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter email address"
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2  placeholder-gray-400 text-gray-900"
          />
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-800 mb-1">
            Phone number
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <img
                src={NGN}
                alt="Nigeria flag"
                className="w-5 h-5 mr-1"
              />
              <input type="tel" placeholder="+234" className="px-3 py-3 border border-gray-300 rounded-md text-gray-700 text-sm font-medium w-15"/>
            </div>
            <input
              type="tel"
              id="phone"
              className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2  placeholder-gray-400 text-gray-900"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1">
            Address
          </label>
          <input
            type="text"
            id="address"
            placeholder="Enter full address"
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2  placeholder-gray-400 text-gray-900"
          />
        </div>


        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">
            Landmark
          </label>
          <input
            type="text"
            id="address"
            placeholder="Enter full address"
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2  placeholder-gray-400 text-gray-900"
          />
        </div>

        <div className="mb-15">
          <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">
            House No
          </label>
          <input
            type="text"
            id="address"
            placeholder="Enter full address"
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2  placeholder-gray-400 text-gray-900"
          />
        </div>

        <button className="w-full bg-red-700 hover:bg-red-800 text-white text-lg font-semibold py-3 rounded-lg transition cursor-pointer">
          Save
        </button>

      </div>
    </div>
    </section>
  )
}

export default MobileAccDetails