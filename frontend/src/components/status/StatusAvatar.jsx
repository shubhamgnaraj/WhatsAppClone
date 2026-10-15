import { CircleUserRound } from "lucide-react";

function StatusAvatar({ src, name, size = 56 }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {src ? (
          <img
            src={src}
            alt={name}
            className="h-full w-full rounded-full object-cover"
          />
      ) : (
        <div className="h-full w-full rounded-full bg-[#dfe5e7] flex items-center justify-center">
          <CircleUserRound className="text-[#8696a0]" size={size * 0.65} />
        </div>
      )}
    </div>
  );
}

export default StatusAvatar;
