import { auth } from "@auth";
import { redirect } from "next/navigation";
import { ApiKeyRepository } from "@repositories/apikey-repository";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const repository = new ApiKeyRepository();
  const initialKeys = await repository.getAllByUserId(session.user.id);

  return (
    <DashboardClient initialKeys={JSON.parse(JSON.stringify(initialKeys))} />
  );
}
