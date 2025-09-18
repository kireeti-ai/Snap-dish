import StatsCard from "../components/StatsCard";
import ChartCard from "../components/ChartCard";
import DataTable from "../components/DataTable";

const Dashboard = () => {
  const chartData = [
    { day: "Mon", sales: 120 },
    { day: "Tue", sales: 200 },
    { day: "Wed", sales: 150 },
    { day: "Thu", sales: 300 },
    { day: "Fri", sales: 250 },
  ];

  const tableData = [
    ["#123", "Pizza", "Pending"],
    ["#124", "Burger", "Delivered"],
    ["#125", "Pasta", "Preparing"],
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatsCard title="Total Orders" value="1,234" />
        <StatsCard title="Revenue" value="$45,000" />
        <StatsCard title="Active Users" value="320" />
        <StatsCard title="Top Dish" value="Pizza" />
      </div>

      {/* Chart */}
      <ChartCard data={chartData} />

      {/* Recent Orders */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Recent Orders</h3>
        <DataTable columns={["Order ID", "Item", "Status"]} data={tableData} />
      </div>
    </div>
  );
};

export default Dashboard;
