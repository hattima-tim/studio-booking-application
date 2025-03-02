import type React from "react";

interface StudioPlaceholderProps {
  name: string;
}

const StudioPlaceholder: React.FC<StudioPlaceholderProps> = ({ name }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 200"
      fill="none"
      className="w-full h-full"
    >
      <rect width="400" height="200" fill="#f3f4f6" />
      <g transform="translate(50, 50)">
        <path d="M150 0H0v100h150V0z" fill="#e5e7eb" />
        <path d="M30 20h90v60H30V20z" fill="#d1d5db" />
        <circle cx="75" cy="50" r="15" fill="#9ca3af" />
        <rect x="35" y="85" width="80" height="5" fill="#9ca3af" />
        <path
          d="M180 10h120v15H180V10zM180 35h80v10H180V35zM180 55h100v10H180V55zM180 75h90v10H180V75z"
          fill="#d1d5db"
        />
      </g>
      <text
        x="200"
        y="180"
        fontFamily="Arial, sans-serif"
        fontSize="12"
        fill="#4b5563"
        textAnchor="middle"
      >
        {name}
      </text>
    </svg>
  );
};

export default StudioPlaceholder;
