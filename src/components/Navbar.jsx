import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import Swal from "sweetalert2";
import { Power } from "lucide-react";

const Navbar = ({ name }) => {
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure you want to log out of your account?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await signOut(auth);
    }
  };

  return (
    <div>
      <div className="hidden md:flex flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-serif text-white font-semiboldbold italic">
            Good Morning, {name}
          </h1>
        </div>
        <div>
          <h1 className="text-2xl font-serif text-secondary font-bold">
            Subscription Tracker
          </h1>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="bg-white border p-3 rounded-full hover:bg-gray-200 hover:cursor-pointer"
          >
            <Power className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>

      <div className="md:hidden flex flex-col gap-4 mb-6">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-xl font-serif text-secondary font-bold">
            Subscription Tracker
          </h1>
          <button
            onClick={handleLogout}
            className="bg-white border p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer"
          >
            <Power className="w-3 h-3 text-black" />
          </button>
        </div>
        <div>
          <h1 className="text-xl font-serif text-white font-semiboldbold text-center italic">
            Good Morning, {name}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
