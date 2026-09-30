"use client";

import {
  ActionIcon,
  AppShell,
  Avatar,
  Badge,
  Box,
  Burger,
  Divider,
  Group,
  Menu,
  NavLink,
  ScrollArea,
  Text,
  Tooltip,
  UnstyledButton,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronDown,
  IconExternalLink,
  IconFilePlus,
  IconFiles,
  IconLayoutBottombar,
  IconLayoutNavbar,
  IconLogout,
  IconMoon,
  IconStack2,
  IconSun,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { logout } from "../actions";

type NavItem = {
  label: string;
  href: string;
  icon: typeof IconFiles;
  description?: string;
  /** Full page load (used for the full-screen editors, which live outside this shell). */
  external?: boolean;
  match?: (path: string) => boolean;
};

const CONTENT: NavItem[] = [
  { label: "Pages", href: "/admin", icon: IconFiles, match: (p) => p === "/admin" || /^\/admin\/pages\/\d+/.test(p) },
  { label: "New page", href: "/admin/pages/new", icon: IconFilePlus },
  { label: "Global widgets", href: "/admin/global-widgets", icon: IconStack2, description: "Reusable sections" },
];

const LAYOUT: NavItem[] = [
  { label: "Header", href: "/admin/site/header", icon: IconLayoutNavbar, description: "Shown on every page", external: true },
  { label: "Footer", href: "/admin/site/footer", icon: IconLayoutBottombar, description: "Shown on every page", external: true },
];

const SETTINGS: NavItem[] = [{ label: "Users", href: "/admin/users", icon: IconUsers }];

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AdminShell({ user, children }: { user: { name: string; email: string }; children: ReactNode }) {
  const [opened, { toggle, close }] = useDisclosure();
  const pathname = usePathname();
  const { setColorScheme } = useMantineColorScheme();
  const scheme = useComputedColorScheme("light", { getInitialValueInEffect: true });

  const renderItem = (item: NavItem) => {
    const active = item.match ? item.match(pathname) : pathname === item.href;
    const common = {
      label: item.label,
      description: item.description,
      leftSection: <item.icon size={19} stroke={1.6} />,
      active,
      variant: "light" as const,
      onClick: close,
      style: { borderRadius: "var(--mantine-radius-md)" },
    };
    return item.external ? (
      <NavLink key={item.href} href={item.href} component="a" {...common} />
    ) : (
      <NavLink key={item.href} href={item.href} component={Link} {...common} />
    );
  };

  const section = (title: string, items: NavItem[]) => (
    <Box mb="lg">
      <Text size="xs" fw={600} c="dimmed" tt="uppercase" px="sm" mb={6} style={{ letterSpacing: "0.06em" }}>
        {title}
      </Text>
      {items.map(renderItem)}
    </Box>
  );

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{ width: 272, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding={{ base: "md", sm: "xl" }}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between" wrap="nowrap">
          <Group gap="sm" wrap="nowrap">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" aria-label="Toggle navigation" />
            <UnstyledButton component={Link} href="/admin">
              <Group gap={10} wrap="nowrap">
                <Box
                  w={34}
                  h={34}
                  style={{
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 10,
                    background: "linear-gradient(135deg, var(--mantine-color-brand-7), #c9a063)",
                    color: "white",
                    fontWeight: 700,
                    fontSize: 15,
                  }}
                >
                  BT
                </Box>
                <Box visibleFrom="xs">
                  <Text fw={700} size="md" lh={1.1}>
                    BelovedTan
                  </Text>
                  <Text size="xs" c="dimmed" lh={1.2}>
                    Site admin
                  </Text>
                </Box>
              </Group>
            </UnstyledButton>
          </Group>

          <Group gap="xs" wrap="nowrap">
            <Tooltip label="View live site">
              <ActionIcon component="a" href="/" target="_blank" variant="default" size="lg" aria-label="View live site">
                <IconExternalLink size={18} stroke={1.6} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={scheme === "dark" ? "Light mode" : "Dark mode"}>
              <ActionIcon
                variant="default"
                size="lg"
                onClick={() => setColorScheme(scheme === "dark" ? "light" : "dark")}
                aria-label="Toggle color scheme"
              >
                {scheme === "dark" ? <IconSun size={18} stroke={1.6} /> : <IconMoon size={18} stroke={1.6} />}
              </ActionIcon>
            </Tooltip>
            <Menu position="bottom-end" width={240} shadow="md">
              <Menu.Target>
                <UnstyledButton px={6} py={4} style={{ borderRadius: "var(--mantine-radius-md)" }}>
                  <Group gap={8} wrap="nowrap">
                    <Avatar color="brand" radius="xl" size={34}>
                      {initials(user.name)}
                    </Avatar>
                    <Box visibleFrom="sm" maw={160}>
                      <Text size="sm" fw={600} truncate>
                        {user.name}
                      </Text>
                      <Text size="xs" c="dimmed" truncate>
                        {user.email}
                      </Text>
                    </Box>
                    <IconChevronDown size={14} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Signed in as {user.email}</Menu.Label>
                <Menu.Item component={Link} href="/admin/users" leftSection={<IconUsers size={16} />}>
                  Users & password
                </Menu.Item>
                <Menu.Divider />
                <form action={logout}>
                  <Menu.Item type="submit" color="red" leftSection={<IconLogout size={16} />}>
                    Sign out
                  </Menu.Item>
                </form>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow component={ScrollArea}>
          {section("Content", CONTENT)}
          {section("Site layout", LAYOUT)}
          {section("Settings", SETTINGS)}
        </AppShell.Section>
        <AppShell.Section>
          <Divider mb="sm" />
          <Group justify="space-between" px="xs">
            <Text size="xs" c="dimmed">
              Visual page builder
            </Text>
            <Badge variant="light" size="sm">
              Puck
            </Badge>
          </Group>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main bg="var(--mantine-color-body)" style={{ minHeight: "100vh" }}>
        <Box maw={1200} mx="auto">
          {children}
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
