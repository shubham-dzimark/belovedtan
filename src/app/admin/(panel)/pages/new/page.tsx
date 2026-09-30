import type { Metadata } from "next";
import { requireUser } from "@/lib/dal";
import { NewPageForm } from "./new-page-form";

export const metadata: Metadata = { title: "New page" };

export default async function NewPage() {
  await requireUser();
  return <NewPageForm />;
}
