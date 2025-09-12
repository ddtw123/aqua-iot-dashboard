import { PolarAngleAxis, RadialBar, RadialBarChart as RechartsRadialBarChart } from "recharts";
import { useTheme } from "@/hooks/useTheme";

export function RadialGaugeChart({
    value,
    minValue = 1,
    maxValue = 14,
    startAngle = 180,
    endAngle = 0,
    width = 300,
    height = 300,
    innerRadius = 100,
    outerRadius = 150,
    fillColor = "#FF8C00",
    displayValue = true
}: {
    value: number,
    minValue: number;
    maxValue: number;
    startAngle?: number;
    endAngle?: number;
    width?: number;
    height?: number;
    innerRadius?: number;
    outerRadius?: number;
    fillColor?: string;
    displayValue?: boolean;
}) {
  const calculateProgress = (value: number): number => {
    const percentage = ((value - minValue) / (maxValue - minValue)) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  };

  const chartData = [
    {
      name: "Value",
      value: calculateProgress(value),
      fill: fillColor,
    }
  ];

  return (
    <div className="w-full h-[175px] md:h-full flex justify-center items-center relative">
        <RechartsRadialBarChart 
            width={width} 
            height={height} 
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            data={chartData} 
            startAngle={startAngle} 
            endAngle={endAngle}
            cx="50%" 
            cy="50%"
        >
            <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
            />
            <RadialBar
                background
                dataKey="value"
                cornerRadius={20}
            />
        </RechartsRadialBarChart>
        
        {displayValue && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <DynamicText 
              x="50%" 
              y="50%" 
              value={value} 
              className="font-medium text-h4SM md:text-h3MD lg:text-h3LG cursor-pointer"
            />
          </div>
        )}
    </div>
  );
}

const DynamicText = ({ x, y, value, className }: { x: string, y: string, value: number, className: string }) => {
    const { theme } = useTheme();
    const textColor = theme === 'dark' ? "#FFFFFF" : "#000000";
    
    return (
      <svg
        x="0"
        y="0"
        width="100%"
        height="100%"
        className="absolute inset-0 pointer-events-none"
      >
        <text 
          x={x} 
          y={y} 
          textAnchor="middle" 
          dominantBaseline="middle"
          fill={textColor}
          className={className}
        >
          {value}
        </text>
      </svg>
    );
};