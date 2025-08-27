"use client";
import { Line, LineChart, ResponsiveContainer } from "recharts";

export default function MiniSparkline({
  values,
  color = "#10b981",
  height = 80,
}: {
  values: number[];
  color?: string;
  height?: number;
}) {
  const data = values.map((v) => ({ v }));
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 6, right: 6, left: 6, bottom: 6 }}>
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


