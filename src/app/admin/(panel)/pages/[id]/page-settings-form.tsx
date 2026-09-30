"use client";

import {
  Alert,
  Anchor,
  Badge,
  Button,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconArrowLeft,
  IconEdit,
  IconExternalLink,
  IconEye,
  IconTrash,
} from "@tabler/icons-react";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { useActionState, useEffect, useTransition } from "react";
import { deletePage, updatePageSettings } from "../../../actions";

type PageInfo = {
  id: number;
  title: string;
  slug: string;
  path: string;
  status: "draft" | "published";
  hasChanges: boolean;
  updated: string;
  published: string | null;
};

export function PageSettingsForm({ page }: { page: PageInfo }) {
  const [state, action, pending] = useActionState(updatePageSettings, undefined);
  const [deleting, startDelete] = useTransition();

  useEffect(() => {
    if (state?.success) notifications.show({ color: "teal", title: "Saved", message: state.success });
  }, [state]);

  const confirmDelete = () =>
    modals.openConfirmModal({
      title: `Delete "${page.title}"?`,
      children: (
        <Text size="sm">
          This removes the page and its published version. It can&rsquo;t be undone.
        </Text>
      ),
      labels: { confirm: "Delete page", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () =>
        startDelete(async () => {
          const form = new FormData();
          form.set("id", String(page.id));
          try {
            await deletePage(form);
          } catch (error) {
            unstable_rethrow(error);
            notifications.show({ color: "red", title: "Delete failed", message: "Please try again." });
          }
        }),
    });

  return (
    <Stack gap="lg">
      <div>
        <Anchor component={Link} href="/admin" size="sm" c="dimmed">
          <Group gap={4}>
            <IconArrowLeft size={14} /> All pages
          </Group>
        </Anchor>
        <Group justify="space-between" align="flex-end" mt="xs">
          <div>
            <Title order={2}>{page.title}</Title>
            <Text c="dimmed" mt={4}>
              {page.path}
            </Text>
          </div>
          <Button component="a" href={`/admin/editor/${page.id}`} leftSection={<IconEdit size={16} />}>
            Open editor
          </Button>
        </Group>
      </div>

      <Grid gap="lg">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper p="xl" radius="lg">
            <form action={action}>
              <input type="hidden" name="id" value={page.id} />
              <Stack gap="md">
                <Title order={4}>Details</Title>
                {state?.error && (
                  <Alert color="red" variant="light" icon={<IconAlertCircle size={18} />}>
                    {state.error}
                  </Alert>
                )}
                <TextInput name="title" label="Page title" defaultValue={page.title} required maxLength={200} />
                <TextInput
                  name="slug"
                  label="URL"
                  defaultValue={page.slug}
                  maxLength={200}
                  leftSection={<Text c="dimmed">/</Text>}
                  description="Leave blank to make this the home page."
                />
                <Group justify="flex-end">
                  <Button type="submit" loading={pending}>
                    Save settings
                  </Button>
                </Group>
              </Stack>
            </form>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="lg">
            <Paper p="xl" radius="lg">
              <Stack gap="sm">
                <Title order={4}>Status</Title>
                <Group gap="xs">
                  <Badge variant="light" color={page.status === "published" ? "teal" : "gray"}>
                    {page.status === "published" ? "Published" : "Draft"}
                  </Badge>
                  {page.hasChanges && (
                    <Badge variant="dot" color="orange">
                      Unpublished changes
                    </Badge>
                  )}
                </Group>
                <Text size="sm" c="dimmed">
                  Last saved {page.updated}
                  {page.published && (
                    <>
                      <br />
                      Published {page.published}
                    </>
                  )}
                </Text>
                <Group gap="xs" mt="xs">
                  <Button
                    component="a"
                    href={`/admin/preview/${page.id}`}
                    target="_blank"
                    variant="default"
                    size="xs"
                    leftSection={<IconEye size={14} />}
                  >
                    Preview
                  </Button>
                  {page.status === "published" && (
                    <Button
                      component="a"
                      href={page.path}
                      target="_blank"
                      variant="default"
                      size="xs"
                      leftSection={<IconExternalLink size={14} />}
                    >
                      View live
                    </Button>
                  )}
                </Group>
              </Stack>
            </Paper>

            <Paper p="xl" radius="lg" style={{ borderColor: "var(--mantine-color-red-3)" }}>
              <Stack gap="sm">
                <Title order={4} c="red">
                  Danger zone
                </Title>
                <Text size="sm" c="dimmed">
                  Deleting removes the page and its published version permanently.
                </Text>
                <Button
                  color="red"
                  variant="light"
                  leftSection={<IconTrash size={16} />}
                  onClick={confirmDelete}
                  loading={deleting}
                >
                  Delete page
                </Button>
              </Stack>
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
