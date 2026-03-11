"use client";

import BlockiesSvg from "blockies-react-svg";

interface BlockieProps {
  address: string;
  size?: number;
  className?: string;
}

export default function Blockie({ address, size = 32, className }: BlockieProps) {
  return (
    <BlockiesSvg
      address={address}
      size={8}
      scale={size / 8}
      caseSensitive={false}
      className={className}
      style={{
        borderRadius: "50%",
        flexShrink: 0,
        width: size,
        height: size,
      }}
    />
  );
}
