'use client';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { name: "Systems Track", value: 35, color: "#FFD43B" },
  { name: "Web Track", value: 45, color: "#4C6EF5" },
  { name: "Mobile Track", value: 30, color: "#BF5AF2" },
  { name: "AI Track", value: 20, color: "#2EE59D" },
];

const TrackDistribution = () => {
  return (
    <div className="lg:col-span-4 lg:row-span-2 bg-dark-grey rounded-2xl p-6 flex flex-col justify-center items-center text-gray-400">
        <h1 className=" text-white font-semibold text-2xl">Track Distribution</h1>
      <div className="w-full flex justify-center text-white items-center gap-6">
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#222",
                border: "none",
                borderRadius: "8px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex flex-col lg:pl-40 md:pl-10 gap-2 text-sm">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-gray-300 lg:text-xl">{entry.name}</span>
              <span className="ml-2 text-white lg:text-xl font-medium">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrackDistribution;
