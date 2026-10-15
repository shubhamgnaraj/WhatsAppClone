import React from "react";
import LeftSideBar from "../left-sidebar/LeftSideBar";

function InheritTwoPage({ children }) {
  return (
    <div className="flex h-screen w-screen bg-[#eae6df] overflow-hidden font-sans antialiased text-[#111b21]">
      <LeftSideBar />
      {children}
    </div>
  );
}

export default InheritTwoPage;
