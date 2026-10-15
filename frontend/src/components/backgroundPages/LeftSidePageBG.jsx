import React from "react";

function LeftSidePageBG({ children }) {
  return (
    <div className="w-[30%] min-w-[340px] max-w-[400px] bg-white flex flex-col border-r border-[#e9edef] relative">
      {children}
    </div>
  );
}

export default LeftSidePageBG;
