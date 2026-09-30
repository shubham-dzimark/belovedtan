"use client";

import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Group,
  List,
  Menu,
  Paper,
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
  IconAlertCircle,
  IconDots,
  IconEdit,
  IconEye,
  IconPencil,
  IconStack2,
  IconStar,
  IconTrash,
} from "@tabler/icons-react";
import { useActionState, useEffect, useTransition } from "react";
import { deleteGlobalBlock, renameGlobalBlock } from "../../actions";

export type WidgetRow = {
  id: number;
  name: string;
  typeLabel: string;
  usedIn: string[];
  updated: string;
  hasChanges: boolean;
};

function RenameForm({ widget, onDone }: { widget: WidgetRow; onDone: () => void }) {
  const [state, action, pending] = useActionState(renameGlobalBlock, undefined);

  useEffect(() => {
    if (state?.success) {
      notifications.show({ color: "teal", title: "Widget renamed", message: state.success });
      onDone();
    }
  }, [state, onDone]);

  return (
    <form action={action}>
      <input type="hidden" name="id" value={widget.id} />
      <Stack gap="md">
        {state?.error && (
          <Alert color="red" variant="light" icon={<IconAlertCircle size={18} />}>
            {state.error}
          </Alert>
        )}
        <TextInput name="name" label="Name" defaultValue={widget.name} required maxLength={80} data-autofocus />
        <Group justify="flex-end">
          <Button variant="default" onClick={onDone}>
            Cancel
          </Button>
          <Button type="submit" loading={pending}>
            Save
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

export function GlobalWidgets({ widgets }: { widgets: WidgetRow[] }) {
  const [pending, startTransition] = useTransition();

  const openRename = (widget: WidgetRow) => {
    const modalId = `rename-widget-${widget.id}`;
    modals.open({
      modalId,
      title: "Rename global widget",
      children: <RenameForm widget={widget} onDone={() => modals.close(modalId)} />,
    });
  };

  const confirmDelete = (widget: WidgetRow) =>
    modals.openConfirmModal({
      title: `Delete "${widget.name}"?`,
      children:
        widget.usedIn.length > 0 ? (
          <Stack gap="xs">
            <Text size="sm">
              It&rsquo;s used in {widget.usedIn.length} {widget.usedIn.length === 1 ? "place" : "places"}. Each copy will
              be turned into a normal section with the widget&rsquo;s current content, so nothing disappears from your
              pages, but they&rsquo;ll no longer update together.
            </Text>
            <List size="sm">
              {widget.usedIn.map((name) => (
                <List.Item key={name}>{name}</List.Item>
              ))}
            </List>
          </Stack>
        ) : (
          <Text size="sm">It isn&rsquo;t used on any page. This can&rsquo;t be undone.</Text>
        ),
      labels: { confirm: "Delete widget", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () =>
        startTransition(async () => {
          const form = new FormData();
          form.set("id", String(widget.id));
          try {
            await deleteGlobalBlock(form);
            notifications.show({ color: "teal", title: "Widget deleted", message: widget.name });
          } catch {
            notifications.show({ color: "red", title: "Couldn't delete the widget", message: "Please try again." });
          }
        }),
    });

  return (
    <Stack gap="xl">
      <div>
        <Title order={2}>Global widgets</Title>
        <Text c="dimmed" mt={4} maw={720}>
          Reusable sections. They appear under <b>★ Global widgets</b> in the block list of every page, including new
          ones, and editing a widget here updates every page that uses it.
        </Text>
      </div>

      {widgets.length === 0 ? (
        <Paper radius="lg" p="xl">
          <Stack align="center" gap="sm" py="xl" ta="center">
            <ThemeIcon variant="light" size={56} radius="xl">
              <IconStack2 size={28} />
            </ThemeIcon>
            <Text fw={600} size="lg">
              No global widgets yet
            </Text>
            <Text c="dimmed" maw={520}>
              Open any page in the editor, select a section, then click the{" "}
              <IconStar size={14} style={{ verticalAlign: "-2px" }} /> <b>Save as global widget</b> button in its
              toolbar. It will be listed here and offered on every page.
            </Text>
            <Button component="a" href="/admin" variant="light" mt="sm">
              Go to pages
            </Button>
          </Stack>
        </Paper>
      ) : (
        <Paper radius="lg" p={0} style={{ overflow: "hidden" }}>
          <Table.ScrollContainer minWidth={720}>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th pl="md">Widget</Table.Th>
                  <Table.Th>Used in</Table.Th>
                  <Table.Th>Last saved</Table.Th>
                  <Table.Th pr="md" />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody style={{ opacity: pending ? 0.6 : 1 }}>
                {widgets.map((widget) => (
                  <Table.Tr key={widget.id}>
                    <Table.Td pl="md">
                      <Group gap="sm" wrap="nowrap">
                        <ThemeIcon variant="light" size={36} radius="md">
                          <IconStar size={18} />
                        </ThemeIcon>
                        <div>
                          <Group gap={6}>
                            <Text fw={600}>{widget.name}</Text>
                            {widget.hasChanges && (
                              <Tooltip label="The draft has changes that pages don't show yet">
                                <Badge variant="dot" color="orange" size="sm">
                                  Changes
                                </Badge>
                              </Tooltip>
                            )}
                          </Group>
                          <Text size="xs" c="dimmed">
                            {widget.typeLabel}
                          </Text>
                        </div>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      {widget.usedIn.length === 0 ? (
                        <Text size="sm" c="dimmed">
                          Not used yet
                        </Text>
                      ) : (
                        <Tooltip label={widget.usedIn.join(", ")} multiline maw={320}>
                          <Badge variant="light" color="brand">
                            {widget.usedIn.length} {widget.usedIn.length === 1 ? "place" : "places"}
                          </Badge>
                        </Tooltip>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {widget.updated}
                      </Text>
                    </Table.Td>
                    <Table.Td pr="md">
                      <Group gap={6} justify="flex-end" wrap="nowrap">
                        <Button
                          component="a"
                          href={`/admin/global/${widget.id}`}
                          size="xs"
                          variant="light"
                          leftSection={<IconEdit size={14} />}
                        >
                          Edit
                        </Button>
                        <Menu position="bottom-end" width={200} shadow="md">
                          <Menu.Target>
                            <ActionIcon variant="subtle" color="gray" aria-label={`More actions for ${widget.name}`}>
                              <IconDots size={18} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item
                              component="a"
                              href={`/admin/preview/global/${widget.id}`}
                              target="_blank"
                              leftSection={<IconEye size={16} />}
                            >
                              Preview draft
                            </Menu.Item>
                            <Menu.Item leftSection={<IconPencil size={16} />} onClick={() => openRename(widget)}>
                              Rename
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item color="red" leftSection={<IconTrash size={16} />} onClick={() => confirmDelete(widget)}>
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
        </Paper>
      )}
    </Stack>
  );
}
