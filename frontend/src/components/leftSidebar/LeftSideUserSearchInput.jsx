import React from 'react'
import { Search } from 'lucide-react'

function LeftSideUserSearchInput() {
  return (
     <div className="p-2 bg-white flex items-center border-b border-[#f0f2f5]">
          <div className="bg-[#f0f2f5] flex items-center w-full rounded-lg px-3 py-1.5 gap-3">
            <Search className="w-4 h-4 text-[#667781]" />
            <input
              type="text"
              placeholder="Search or start new chat"
              className="bg-transparent text-sm w-full focus:outline-none placeholder-[#667781]"
            />
          </div>
        </div>
  )
}

export default LeftSideUserSearchInput