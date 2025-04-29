import React from 'react'

const Categories = () => {

  const categories = [
    "All", 
    "Clothings", 
    "Bags", 
    "Hair", 
    "Skincare", 
    "Toys", 
    "Shoes", 
    "Accessories", 
    "Jewelry"
  ];
  return (
    <div>
      <section className="w-full mt-1 px-4 lg:px-20">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Shop by Category</h2>

        <div className="flex space-x-2 lg:space-x-10 overflow-x-auto scrollbar-hide pb-4">
          {categories.map((category) => (
            <div 
              key={category}
              className="flex-shrink-0 bg-white rounded-xl border border-red-600 w-[150px] text-center py-1 text-gray-700 font-medium shadow hover:bg-[#a000004d] cursor-pointer transition-all"
            >
              {category}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Categories