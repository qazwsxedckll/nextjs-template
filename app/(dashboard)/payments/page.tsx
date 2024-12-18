import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Payment[]> {
  const result: Payment[] = [];

  for (let i = 0; i < 1000; i++) {
    result.push({
      id: `payment-${i}`,
      amount: Math.random() * 1000,
      status: [
        "pending" as const,
        "processing" as const,
        "success" as const,
        "failed" as const,
      ][Math.floor(Math.random() * 4)],
      email: `
        user-${Math.floor(Math.random() * 1000)}@example.com`,
    });
  }

  return result;
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
