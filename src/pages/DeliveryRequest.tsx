import Lefticon from "../assets/images/left-icon.png";
import UserIcon from "../assets/images/users-icon.png";
import Target from "../assets/images/target.png";
import Car from "../assets/images/Car.png";
import Bike from "../assets/images/Bike.png";
import Van from "../assets/images/van.png";

const DeliveryRequest = () => {
  return (
    <div className="mx-5 md:mx-40 mt-[-10px]">
      <div className="md:hidden flex items-center justify-between">
        <div className="flex items-center space-x-4 mb-4">
          <img src={Lefticon} alt="Back" className="w-auto h-8" />
          <span className="font-semibold text-lg text-gray-700">Delivery Request</span>
        </div>
        <img src={UserIcon} alt="User Icon" className="w-auto h-9 pb-2"/>
      </div>
      <h2 className="font-bold text-xl">Deliver To</h2>
      
      <form action="">
        <div className="flex flex-col space-y-4 mt-4">
          <label htmlFor="text" className="mb-1 font-semibold text-md">Delivery Location</label>
          <div>
            <img src={Target} alt="Target" className="absolute ml-2 mt-3" />
            <input type="text" placeholder="Eleyele-Arulogun road" className="border border-gray-600 rounded-lg p-2 pl-7 w-full" />
          </div>
          <label htmlFor="text" className="mb-1 font-semibold text-md">Name (Shop/Person)</label>
          <input type="text" placeholder="Adebayo" className="border border-gray-600 rounded-lg p-2 pl-6" />
          <label htmlFor="text" className="mb-1 font-semibold text-md">Phone Number</label>
          <input type="text" placeholder="08123456789" className="border border-gray-600 rounded-lg p-2 pl-6" />
          <label htmlFor="text" className="mb-1 font-semibold text-md">Building/Floor Number</label>
          <input type="text" placeholder="No 1" className="border border-gray-600 rounded-lg p-2 pl-6" />
          <label htmlFor="text" className="mb-1 font-semibold text-md">Landmark/Busstop</label>
          <input type="text" placeholder="Oju-irin Akobo" className="border border-gray-600 rounded-lg p-2 pl-6" />
          <label htmlFor="text" className="mb-1 font-semibold text-md">Item Details</label>
          <select className="border border-gray-600 rounded-lg p-2 pl-6">
            <option value="select">Select</option>
            <option value="item1">Item 1</option>
            <option value="item2">Item 2</option>
            <option value="item3">Item 3</option>
          </select>

          <h2 className="text-xl font-semibold text-gray-600 mt-2">Vehicle Type</h2>
          <div className="flex items-center justify-between md:justify-start space-x-4">
            <img src={Bike} alt="Bike Inage" className="h-20 w-auto cursor-pointer" />
            <img src={Car} alt="Car Inage" className="h-20 w-auto cursor-pointer" />
            <img src={Van} alt="Van Inage" className="h-20 w-auto cursor-pointer" />
          </div>

          <div>
          <input type="checkbox" className="text-left accent-red-600"/>
          <label htmlFor="text" className="ml-2 font-semibold text-md">I accept all the Terms & Condition and there are no restricted items in the package.</label>
          </div>
        </div>
        <button type="submit" className="bg-[#a00000] text-white font-semibold py-3 px-4 rounded-lg mt-4 w-full md:w-[20%] mb-10 ">Save</button>
      </form>
    </div>
  )
}

export default DeliveryRequest