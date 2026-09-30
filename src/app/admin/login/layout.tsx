import type { ReactNode } from "react";
import { MantineRoot } from "../_components/mantine-root";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <MantineRoot>{children}</MantineRoot>;
}
