"use client";

import {
  ActionIcon,
  Anchor,
  Badge,
  Button,
  Card,
  Group,
  Menu,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconCircleCheck,
  IconCopy,
  IconDots,
  IconEdit,
  IconExternalLink,
  IconEye,
  IconEyeOff,
  IconFileDescription,
  IconFiles,
  IconHome,
  IconLayoutBottombar,
  IconLayoutNavbar,
  IconPencilExclamation,
  IconPlus,
  IconSearch,
  IconSettings,
  IconTrash,
} from "@tabler/icons-react";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { deletePage, duplicatePage, unpublishPage } from "../actions";

export type DashboardPage = {
  id: number;
  title: string;
  path: string;
  isHome: boolean;
  status: "draft" | "published";
  hasChanges: boolean;
  updated: string;
};

export type DashboardPart = {
  key: "header" | "footer";
  label: string;
  status: "published" | "changes" | "unpublished";
  updated: string | null;
};

function idForm(id: number) {
  const form = new FormData();
  form.set("id", String(id));
  return form;
}

function StatusBadge({ page }: { page: DashboardPage }) {
  if (page.status === "draft") {
    return (
      <Badge variant="light" color="gray">
        Draft
      </Badge>
    );
  }
  return (
    <Group gap={6} wrap="nowrap">
      <Badge variant="light" color="teal">
        Published
      </Badge>
      {page.hasChanges && (
        <Tooltip label="The draft has changes that aren't live yet">
          <Badge variant="dot" color="orange">
            Changes
          </Badge>
        </Tooltip>
      )}
    </Group>
  );
}

const PART_STATUS = {
  published: { label: "Published", color: "teal" },
  changes: { label: "Unpublished changes", color: "orange" },
  unpublished: { label: "Not published", color: "gray" },
} as const;

export function Dashboard({ pages, parts }: { pages: DashboardPage[]; parts: DashboardPart[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [pending, startTransition] = useTransition();

  const stats = useMemo(
    () => [
      { label: "Total pages", value: pages.length, icon: IconFiles, color: "brand" },
      { label: "Published", value: pages.filter((p) => p.status === "published").length, icon: IconCircleCheck, color: "teal" },
      { label: "Drafts", value: pages.filter((p) => p.status === "draft").length, icon: IconFileDescription, color: "gray" },
      { label: "Unpublished changes", value: pages.filter((p) => p.hasChanges).length, icon: IconPencilExclamation, color: "orange" },
    ],
    [pages],
  );

  const visible = pages.filter((page) => {
    const q = query.trim().toLowerCase();
    const matches = !q || page.title.toLowerCase().includes(q) || page.path.includes(q);
    const status = filter === "all" || (filter === "changes" ? page.hasChanges : page.status === filter);
    return matches && status;
  });

  const run = (label: string, action: () => Promise<unknown>) =>
    startTransition(async () => {
      try {
        await action();
        notifications.show({ color: "teal", title: label, message: "Done." });
      } catch (error) {
        // Redirects from server actions are control flow, not failures; let Next handle them.
        unstable_rethrow(error);
        notifications.show({ color: "red", title: `${label} failed`, message: "Please try again." });
      }
    });

  const confirmDelete = (page: DashboardPage) =>
    modals.openConfirmModal({
      title: `Delete "${page.title}"?`,
      children: (
        <Text size="sm">
          This removes the page and its published version from <Text span fw={600}>{page.path}</Text>. It can&rsquo;t be
          undone.
        </Text>
      ),
      labels: { confirm: "Delete page", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => run("Page deleted", () => deletePage(idForm(page.id))),
    });

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={2}>Pages</Title>
          <Text c="dimmed" mt={4}>
            Create pages and design them with the drag-and-drop editor.
          </Text>
        </div>
        <Button component={Link} href="/admin/pages/new" leftSection={<IconPlus size={18} />}>
          New page
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="md">
        {stats.map((stat) => (
          <Paper key={stat.label} p="lg" radius="lg">
            <Group justify="space-between" align="flex-start">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600} style={{ letterSpacing: "0.05em" }}>
                  {stat.label}
                </Text>
                <Text fw={700} fz={30} mt={4} lh={1}>
                  {stat.value}
                </Text>
              </div>
              <ThemeIcon variant="light" color={stat.color} size={42} radius="md">
                <stat.icon size={22} stroke={1.6} />
              </ThemeIcon>
            </Group>
          </Paper>
        ))}
      </SimpleGrid>

      <div>
        <Title order={4} mb="sm">
          Site layout
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          {parts.map((part) => {
            const Icon = part.key === "header" ? IconLayoutNavbar : IconLayoutBottombar;
            const status = PART_STATUS[part.status];
            return (
              <Card key={part.key} radius="lg" padding="lg">
                <Group justify="space-between" align="flex-start" gap="md">
                  <Group wrap="nowrap" align="flex-start" style={{ flex: "1 1 260px" }}>
                    <ThemeIcon variant="light" size={44} radius="md">
                      <Icon size={24} stroke={1.6} />
                    </ThemeIcon>
                    <div>
                      <Group gap="xs">
                        <Text fw={600}>Site {part.label.toLowerCase()}</Text>
                        <Badge variant="light" color={status.color} size="sm">
                          {status.label}
                        </Badge>
                      </Group>
                      <Text size="sm" c="dimmed" mt={4}>
                        Shown on every page. {part.updated ? `Last saved ${part.updated}.` : "Not edited yet."}
                      </Text>
                    </div>
                  </Group>
                  {/* Full page load: the editor renders outside this admin shell. */}
                  <Button component="a" href={`/admin/site/${part.key}`} variant="light" leftSection={<IconEdit size={16} />}>
                    Edit
                  </Button>
                </Group>
              </Card>
            );
          })}
        </SimpleGrid>
      </div>

      <Paper radius="lg" p={0} style={{ overflow: "hidden" }}>
        <Group justify="space-between" p="md" gap="sm">
          <TextInput
            placeholder="Search pages"
            leftSection={<IconSearch size={16} />}
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            size="sm"
            w={{ base: "100%", sm: 280 }}
          />
          <SegmentedControl
            size="sm"
            value={filter}
            onChange={setFilter}
            data={[
              { label: "All", value: "all" },
              { label: "Published", value: "published" },
              { label: "Drafts", value: "draft" },
              { label: "Changes", value: "changes" },
            ]}
          />
        </Group>

        {visible.length === 0 ? (
          <Stack align="center" gap="xs" py={56} px="md">
            <ThemeIcon variant="light" size={48} radius="xl" color="gray">
              <IconFiles size={24} />
            </ThemeIcon>
            <Text fw={600}>{pages.length === 0 ? "No pages yet" : "No pages match"}</Text>
            <Text size="sm" c="dimmed">
              {pages.length === 0 ? "Create your first page to get started." : "Try a different search or filter."}
            </Text>
            {pages.length === 0 && (
              <Button component={Link} href="/admin/pages/new" mt="sm" leftSection={<IconPlus size={16} />}>
                New page
              </Button>
            )}
          </Stack>
        ) : (
          <Table.ScrollContainer minWidth={720}>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th pl="md">Page</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Last updated</Table.Th>
                  <Table.Th pr="md" />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody style={{ opacity: pending ? 0.6 : 1 }}>
                {visible.map((page) => (
                  <Table.Tr key={page.id}>
                    <Table.Td pl="md">
                      <Group gap="sm" wrap="nowrap">
                        <ThemeIcon variant="light" color={page.isHome ? "brand" : "gray"} size={36} radius="md">
                          {page.isHome ? <IconHome size={18} /> : <IconFileDescription size={18} />}
                        </ThemeIcon>
                        <div>
                          <Anchor href={`/admin/editor/${page.id}`} fw={600} c="var(--mantine-color-text)">
                            {page.title}
                          </Anchor>
                          <Text size="xs" c="dimmed">
                            {page.path}
                          </Text>
                        </div>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <StatusBadge page={page} />
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {page.updated}
                      </Text>
                    </Table.Td>
                    <Table.Td pr="md">
                      <Group gap={6} justify="flex-end" wrap="nowrap">
                        <Button
                          component="a"
                          href={`/admin/editor/${page.id}`}
                          size="xs"
                          variant="light"
                          leftSection={<IconEdit size={14} />}
                        >
                          Edit
                        </Button>
                        <Menu position="bottom-end" width={200} shadow="md">
                          <Menu.Target>
                            <ActionIcon variant="subtle" color="gray" aria-label={`More actions for ${page.title}`}>
                              <IconDots size={18} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item
                              component="a"
                              href={`/admin/preview/${page.id}`}
                              target="_blank"
                              leftSection={<IconEye size={16} />}
                            >
                              Preview draft
                            </Menu.Item>
                            {page.status === "published" && (
                              <Menu.Item
                                component="a"
                                href={page.path}
                                target="_blank"
                                leftSection={<IconExternalLink size={16} />}
                              >
                                View live
                              </Menu.Item>
                            )}
                            <Menu.Item
                              component={Link}
                              href={`/admin/pages/${page.id}`}
                              leftSection={<IconSettings size={16} />}
                            >
                              Settings
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<IconCopy size={16} />}
                              onClick={() => run("Page duplicated", () => duplicatePage(idForm(page.id)))}
                            >
                              Duplicate
                            </Menu.Item>
                            {page.status === "published" && (
                              <Menu.Item
                                leftSection={<IconEyeOff size={16} />}
                                onClick={() => run("Page unpublished", () => unpublishPage(idForm(page.id)))}
                              >
                                Unpublish
                              </Menu.Item>
                            )}
                            <Menu.Divider />
                            <Menu.Item color="red" leftSection={<IconTrash size={16} />} onClick={() => confirmDelete(page)}>
                              Delete
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
      </Paper>
    </Stack>
  );
}
