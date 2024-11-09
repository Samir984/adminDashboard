import { UserTable } from "@/components/UserTable";

export default function Dashboard() {
  return (
    <div className="p-6  h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      <div>
        <UserTable />
      </div>
    </div>
  );
}
