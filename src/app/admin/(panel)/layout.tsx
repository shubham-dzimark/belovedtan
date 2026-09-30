import { requireUser } from "@/lib/dal";
import { AdminShell } from "../_components/admin-shell";
import { MantineRoot } from "../_components/mantine-root";

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  const user = await requireUser();

  return (
    <MantineRoot>
      <AdminShell user={{ name: user.name, email: user.email }}>{children}</AdminShell>
    </MantineRoot>
  );
}
