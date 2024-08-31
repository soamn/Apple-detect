import React from "react";

const Navbar = () => {
  return (
    <>
      <div className=" w-screen p-4 shadow-xl bg-red-100 flex  gap-24 sticky top-0  ">
        <div className="text-red-900 font-semibold text-nowrap flex justify-center text-sm lg:text-lg">
          <p>Apple Disorder Detection</p>
          <p>🍎</p>
        </div>
        <div className="flex gap-10 text-red-700 ">
          <a className="hover:text-black" href="/">
            Home
          </a>
          <a className="hover:text-black" href="/about">
            About
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;
