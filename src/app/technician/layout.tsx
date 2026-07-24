import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import TechnicianLayoutClient from "@/components/layouts/TechnicianLayout";

export default async function TechnicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return <TechnicianLayoutClient>{children}</TechnicianLayoutClient>;
}

