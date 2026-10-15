function StatusRing({ size = 56, segments = 1, viewed = false }) {
  if (viewed) {
    // Viewed = no ring. Just enough space reserved so avatars stay aligned.
    return <div style={{ width: size, height: size }} />;
  }

  const stroke = 2.5;
  const radius = size / 2 - stroke;
  const circumference = 2 * Math.PI * radius;
  const gap = 4; // px gap between segments
  const segmentLength = circumference / segments - gap;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="absolute -inset-0 -rotate-90"
    >
      {Array.from({ length: segments }).map((_, i) => {
        const offset = i * (circumference / segments);
        return (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#25D366"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${segmentLength} ${circumference}`}
            strokeDashoffset={-offset}
          />
        );
      })}
    </svg>
  );
}

export default StatusRing;