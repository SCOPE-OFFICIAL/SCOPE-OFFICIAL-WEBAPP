import Image from "next/image";
import React from "react";

export default function FaqPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#040A28] text-white font-sans">
      

      
      <main className="flex-grow container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl  max-h-10 font-bold tracking-tight font-orbitron">
              Frequently 
            </h1>
            <h1 className="text-5xl  md:text-6xl font-bold tracking-tight font-orbitron">
               Asked  Questions
            </h1>
            <p className="text-gray-300 leading-relaxed">
              Navigating Your Queries with Precision. Explore answers to common
              questions about circuits, components, electronics fundamentals and
              the upcoming events. Need more help? Reach out to us!
            </p>

            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-gray-200 rounded-lg border border-transparent opacity-70 focus:border-blue-400 focus:ring-0 px-4 py-3 text-black placeholder-gray-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full bg-gray-200 rounded-lg border border-transparent opacity-70 focus:border-blue-400 focus:ring-0 px-4 py-3 text-black placeholder-gray-500"
                  />
                </div>
                <div className="md:col-span-1">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-gray-200 rounded-lg border border-transparent opacity-70 focus:border-blue-400 focus:ring-0 px-4 py-3 text-black placeholder-gray-500"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="query"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Post Your Queries Here
                </label>
                <textarea
                  id="query"
                  rows={8}
                  className="w-full bg-gray-200 rounded-lg border border-transparent opacity-70 focus:border-blue-400 focus:ring-0 px-4 py-3 text-black placeholder-gray-500"
                ></textarea>
              </div>
            </form>
          </div>

          
          <div className="hidden lg:flex items-center justify-center ml-48">
  <Image
    src="/images/faq_pic.png"
    alt="Illustration of a person with a large question mark"
    width={380}
    height={409.7}
  />
</div>
        </div>
      </main>

     
    </div>
  );
}
