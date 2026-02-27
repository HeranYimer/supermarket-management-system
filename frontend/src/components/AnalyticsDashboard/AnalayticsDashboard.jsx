import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Milk", stock: 40 },
  { name: "Bread", stock: 20 },
  { name: "Sugar", stock: 60 },
];

export default function AnalyticsDashboard() {
  return (
    <div style={{ height: 300 }}>
      <h2>Inventory Analytics</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="stock" fill="#2ecc71" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}