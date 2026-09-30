"use client";

import {
  ActionIcon,
  Alert,
  Avatar,
  Badge,
  Button,
  Group,
  Paper,
  PasswordInput,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconTrash, IconUserPlus } from "@tabler/icons-react";
import { useActionState, useEffect, useRef, useTransition } from "react";
import { changePassword, createUser, deleteUser } from "../../actions";

type UserRow = { id: number; name: string; email: string; added: string };

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function UsersScreen({ meId, users }: { meId: number; users: UserRow[] }) {
  const [pending, startTransition] = useTransition();

  const confirmRemove = (user: UserRow) =>
    modals.openConfirmModal({
      title: `Remove ${user.name}?`,
      children: (
        <Text size="sm">
          <Text span fw={600}>
            {user.email}
          </Text>{" "}
          will no longer be able to sign in.
        </Text>
      ),
      labels: { confirm: "Remove user", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () =>
        startTransition(async () => {
          const form = new FormData();
          form.set("id", String(user.id));
          try {
            await deleteUser(form);
            notifications.show({ color: "teal", title: "User removed", message: user.email });
          } catch {
            notifications.show({ color: "red", title: "Couldn't remove user", message: "Please try again." });
          }
        }),
    });

  return (
    <Stack gap="xl">
      <div>
        <Title order={2}>Users</Title>
        <Text c="dimmed" mt={4}>
          Everyone listed here can sign in and edit every page, the header and the footer.
        </Text>
      </div>

      <Paper radius="lg" p={0} style={{ overflow: "hidden" }}>
        <Table.ScrollContainer minWidth={560}>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th pl="md">Name</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Added</Table.Th>
                <Table.Th pr="md" />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody style={{ opacity: pending ? 0.6 : 1 }}>
              {users.map((user) => (
                <Table.Tr key={user.id}>
                  <Table.Td pl="md">
                    <Group gap="sm" wrap="nowrap">
                      <Avatar color="brand" radius="xl">
                        {initials(user.name)}
                      </Avatar>
                      <Text fw={600}>{user.name}</Text>
                      {user.id === meId && (
                        <Badge variant="light" size="sm">
                          You
                        </Badge>
                      )}
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{user.email}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {user.added}
                    </Text>
                  </Table.Td>
                  <Table.Td pr="md">
                    <Group justify="flex-end">
                      {user.id !== meId && (
                        <Tooltip label="Remove user">
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() => confirmRemove(user)}
                            aria-label={`Remove ${user.email}`}
                          >
                            <IconTrash size={18} />
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Paper>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <AddUserForm />
        <ChangePasswordForm />
      </SimpleGrid>
    </Stack>
  );
}

function AddUserForm() {
  const [state, action, pending] = useActionState(createUser, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      notifications.show({ color: "teal", title: "User added", message: state.success });
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <Paper p="xl" radius="lg">
      <form ref={formRef} action={action}>
        <Stack gap="md">
          <div>
            <Title order={4}>Add user</Title>
            <Text size="sm" c="dimmed">
              They can sign in straight away with this password.
            </Text>
          </div>
          {state?.error && (
            <Alert color="red" variant="light" icon={<IconAlertCircle size={18} />}>
              {state.error}
            </Alert>
          )}
          <TextInput name="name" label="Name" required maxLength={100} />
          <TextInput name="email" type="email" label="Email" required />
          <PasswordInput
            name="password"
            label="Password"
            description="At least 8 characters."
            minLength={8}
            required
            autoComplete="new-password"
          />
          <Group justify="flex-end">
            <Button type="submit" loading={pending} leftSection={<IconUserPlus size={16} />}>
              Add user
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}

function ChangePasswordForm() {
  const [state, action, pending] = useActionState(changePassword, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      notifications.show({ color: "teal", title: "Password updated", message: state.success });
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <Paper p="xl" radius="lg">
      <form ref={formRef} action={action}>
        <Stack gap="md">
          <div>
            <Title order={4}>Change your password</Title>
            <Text size="sm" c="dimmed">
              You&rsquo;ll stay signed in on this device.
            </Text>
          </div>
          {state?.error && (
            <Alert color="red" variant="light" icon={<IconAlertCircle size={18} />}>
              {state.error}
            </Alert>
          )}
          <PasswordInput name="current" label="Current password" required autoComplete="current-password" />
          <PasswordInput
            name="next"
            label="New password"
            description="At least 8 characters."
            minLength={8}
            required
            autoComplete="new-password"
          />
          <Group justify="flex-end">
            <Button type="submit" loading={pending}>
              Update password
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
