"use client";

import UserSidebar from '@/components/UserSidebar';
import UserNavbar from '@/components/UserNavbar';
import { useState } from 'react';

const popularVenues = [
  { name: "Roundboy Bagels", address: "St Kilda", img: "/flood.jpg" },
  { name: "125 Pizzeria", address: "South Yarra", img: "/flood1.jpg" },
  { name: "230 Chapel Street", address: "Albion", img: "/flood2.jpg" },
  { name: "112 Brewer Street", address: "Brunswick West", img: "/flood3.jpg" },
  { name: "322 Lennox Street", address: "Richmond", img: "/flood4.jpg" },
];

const latestNews = [
  { title: "Free Chocolate Dumplings", img: "/flood.jpg", desc: "Dumpling dessert for every sweet tooth!" },
  { title: "Miss Katie's Cash Stash", img: "/flood1.jpg", desc: "New cafe at the Robster Cafe!" },
  { title: "A Toast Cafe", img: "/flood2.jpg", desc: "The Final Frontier?" },
  { title: "A Modern Take", img: "/flood3.jpg", desc: "On an Athenian food table." },
];

const latestRecipes = [
  { title: "Poach n Egg with Top Paddock", img: "/flood.jpg" },
  { title: "ACME's Mushroom Lasagna", img: "/flood1.jpg" },
  { title: "Mr Wilkinson's Super Salad", img: "/flood2.jpg" },
  { title: "Five & Dime DIY Bagels", img: "/flood3.jpg" },
];

export default function UserNewsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-[#edf2f9] font-sans text-gray-800">
      <UserSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg transition-all duration-300 overflow-hidden">
        <UserNavbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-6">

          {/* Main Highlight & Popular Venues */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Main Highlight */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <img src="/flood.jpg" alt="Main News" className="w-full h-64 object-cover rounded-lg" />
              <h2 className="text-2xl font-bold mt-2">The Pot and The Kettle Black</h2>
              <p className="text-gray-700 text-sm mb-2"><span className="font-bold">JUST OPEN</span> It doesn't feel right until you call The Kettle Black a cafe. The Pot should come later. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam euismod, justo eget tincidunt dictum, enim erat dictum erat, euismod dictum erat enim erat dictum erat.</p>
            </div>
            {/* Popular Venues */}
            <div className="bg-gray-50 rounded-lg p-4 shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Popular Venues</h3>
              <ul className="space-y-3">
                {popularVenues.map((venue, idx) => (
                  <li key={venue.name} className="flex items-center gap-3">
                    <img src={venue.img} alt={venue.name} className="w-12 h-12 object-cover rounded" />
                    <div>
                      <div className="font-semibold text-sm">{venue.name}</div>
                      <div className="text-xs text-gray-500">{venue.address}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Latest News */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Latest News</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestNews.map((news, idx) => (
                <div key={news.title} className="bg-white rounded-lg shadow-md border border-gray-200 p-3 flex flex-col">
                  <img src={news.img} alt={news.title} className="w-full h-32 object-cover rounded mb-2" />
                  <div className="font-semibold text-blue-700 text-base mb-1">{news.title}</div>
                  <div className="text-xs text-gray-500 mb-2">{news.desc}</div>
                  <a href="#" className="text-xs text-blue-500 hover:underline mt-auto">Read more</a>
                </div>
              ))}
            </div>
          </div>

          {/* Recipe Finder & Featured Recipe */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recipe Finder */}
            <div className="bg-gray-50 rounded-lg p-4 shadow-md border border-gray-200 mb-4 lg:mb-0">
              <h3 className="text-lg font-semibold mb-4">Recipe Finder</h3>
              <input type="text" placeholder="Search by keyword" className="w-full mb-2 p-2 border rounded" />
              <select className="w-full mb-2 p-2 border rounded"><option>Chef</option></select>
              <select className="w-full mb-2 p-2 border rounded"><option>Cuisine</option></select>
              <select className="w-full mb-2 p-2 border rounded"><option>Ingredient</option></select>
              <select className="w-full mb-2 p-2 border rounded"><option>Complexity</option></select>
            </div>
            {/* Featured Recipe */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col">
              <img src="/flood2.jpg" alt="Featured Recipe" className="w-full h-48 object-cover rounded mb-4" />
              <h3 className="text-xl font-bold mb-2">Fried Chicken & Waffles by Mr Big Stuff</h3>
              <p className="text-gray-700 text-sm">Mr Big Stuff serves the American food you'll love. A unique chicken and waffle combo, plus specialty house-made chicken sauce. <span className="font-semibold">Recipe:</span> Mix, fry, and enjoy!</p>
            </div>
          </div>

          {/* Latest Recipes */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Latest Recipes</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {latestRecipes.map((rec, idx) => (
                <div key={rec.title} className="bg-white rounded-lg shadow-md border border-gray-200 p-3 flex flex-col items-center">
                  <img src={rec.img} alt={rec.title} className="w-full h-24 object-cover rounded mb-2" />
                  <div className="font-semibold text-blue-700 text-center text-base mb-1">{rec.title}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 