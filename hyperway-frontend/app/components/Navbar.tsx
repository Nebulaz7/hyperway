import React from "react";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <h2>Hyperway</h2>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        connect app
      </button>
    </div>
  );
};

export default Navbar;
