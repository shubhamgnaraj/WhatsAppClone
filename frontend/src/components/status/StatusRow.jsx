import StatusAvatar from "./StatusAvatar";
import StatusRing from "./StatusRing";

function StatusRow({ name, time, avatar, segments, viewed }) {
  const ringSize = 56;
  const padding = 4; 
  return (
    <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#f5f6f6] active:bg-[#f0f2f5] transition-colors text-left">
      <div className="relative shrink-0" style={{ width: ringSize, height: ringSize }}>
        <StatusRing size={ringSize} segments={segments} viewed={viewed} />
        <div
          className="absolute rounded-full overflow-hidden"
          style={{
            top: padding,
            left: padding,
            right: padding,
            bottom: padding,
          }}
        >
          <StatusAvatar src={avatar} name={name} size={ringSize - padding * 2} />
        </div>
      </div>

      <div className="min-w-0 flex-1 border-b border-[#f0f2f5] pb-2.5 pt-0.5">
        <p className="text-[15px] font-normal text-[#111b21] truncate">
          {name}
        </p>
        <p className="text-[13px] text-[#667781] truncate">{time}</p>
      </div>
    </button>
  );
}

export default StatusRow;