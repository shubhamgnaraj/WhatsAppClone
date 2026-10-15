import React from "react";
import SidebarIcon from "./compo/SidebarIcon";
import {
  MessageCircle,
  Phone,
  CircleDashed,
  Archive,
  Star,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";

function LeftSideBar() {
  const iconProps = { size: 15, strokeWidth: 1.8, className: "text-[#3b4a54]" };

  const topIcons = [
    { link: "/users/chats", icon: MessageCircle, label: "Chats" },
    { link: "/users/calls", icon: Phone, label: "Calls" },
    { link: "/users/status", icon: CircleDashed, label: "Status" },
    { link: "/users/archive", icon: Archive, label: "Archive" },
    { link: "/users/star", icon: Star, label: "Star" },
  ];

  const bottomIcons = [
    { link: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="h-screen w-16 bg-[#f0f2f5] flex flex-col items-center justify-between py-3">
      <div className="flex flex-col items-center gap-2">
        {topIcons.map((icon) => (
          <Link to={icon.link} key={icon.label} className="w-full h-full">
            <SidebarIcon
              icon={<icon.icon {...iconProps} />}
              label={icon.label}
            />
          </Link>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2">
        {bottomIcons.map((icon) => (
          <Link to={icon.link} key={icon.label} className="w-full h-full">
            <SidebarIcon
              icon={<icon.icon {...iconProps} />}
              label={icon.label}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default LeftSideBar;
