import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Navbar = ({ name }) => {
  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="flex flex-row justify-between items-center mb-6 gap-4">
      <h1 className="text-2xl font-bold">Hello, {name}</h1>
      <div className="flex gap-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default Navbar;
