

function SidebarIcon({ icon, badge, selected, label }) {
  return (
    <button
      aria-label={label}
      className={`relative flex items-center justify-center h-11 w-11 rounded-full transition-colors
        ${selected ? "bg-[#d9dbde]" : "hover:bg-[#E5E7EB]"}`}
    >
      {icon}
      {badge != null && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[19px] h-[19px] px-1 rounded-full bg-[#00a884] text-white text-[11px] font-medium flex items-center justify-center leading-none">
          {badge}
        </span>
      )}
    </button>
  );
}

export default SidebarIcon;