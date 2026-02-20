
import {  Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import { Search, ShoppingCart } from "lucide-react";
import MobileNav from "./mobilenav";
import { useSearch } from "../context/searchContext";

export default function Header() {
  const{searchTerm,setSearchTerm}=useSearch();
 
  const navitems = [
    { name: "الرئيسية", link: "/" },
    { name: "العطور", link: "/perfumes" },
    { name: "الملابس", link: "/clothes" },
    { name: "الجوارب", link: "/socks" },
    { name: "احذيه", link: "/shoes" },
    {name:"الادمن" ,link:"/admin"}
  ];

  return (
  <div>
      <nav className=" justify-between items-center px-5 w-full fixed top-0 left-0 bg-white shadow-md z-10 hidden md:flex">
      <div>
        <img src={Logo} alt="logo image" className="w-[150px]   " />
      </div>

      <div className=" flex justify-end items-center gap-5 ">
        {navitems.map((items, index) => (
          <Link key={index} to={items.link} className=" text-gray-700 text-lg font-semibold hover:text-blue-600 transition-all duration-150" >
            {items.name}
          </Link>
        ))}
      </div>

      <div className="flex gap-4 items-center">
       <Link to="cart">
        <ShoppingCart
          size={25}
          className=" hover:text-blue-600 transition-all duration-150 cursor-pointer"
        /></Link>
        <div className="flex gap-2">
          <input
            type="text"
            name="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث عن منتجك المفضل"
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
         
        </div>
      </div>
      
    </nav>
    <MobileNav  />
  </div>
   
  );
}
