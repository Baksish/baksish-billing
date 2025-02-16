"use client";
import { useAuth } from "@/app/Utils/Context/AuthContext";
import React, { useState } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const UserNavigation:React.FC = () => {
  const { user,logout } = useAuth();

  const [showOptions, setshowOptions] = useState<Boolean>(false);
  const handleToggleOptions = () => {
    setshowOptions(!showOptions);
  };
  const handleLogout=() => {
    logout(); // Clear user session
    window.location.href = "/"; // Redirect to the login page after logout
  };
  return (
    <div>
      <div onMouseEnter={handleToggleOptions} className="absolute max-w-[190px] min-w-20 cursor-pointer w-fit flex justify-center items-center right-10 top-2 text-white text-sm p-1 rounded-full px-3 bg-zinc-700">
          <span className="truncate">{user?.name}</span>
          <span><ExpandMoreIcon className="size-6"/></span>
      </div>


      {showOptions && <section onMouseLeave={handleToggleOptions} className="relative transition-all ">
        <ul className="bg-zinc-300 rounded p-2 z-20 text-sm absolute right-10 top-11 min-w-32">
          <li className="cursor-pointer hover:font-semibold transition-all duration-100">View Profile</li>
          <li className="cursor-pointer hover:font-semibold transition-all duration-100" onClick={handleLogout}>Logout</li>
        </ul>
      </section>}


    </div>
  );
};



export default UserNavigation;
