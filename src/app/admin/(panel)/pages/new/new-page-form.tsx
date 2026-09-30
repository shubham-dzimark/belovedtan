"use client";

import {
  Alert,
  Anchor,
  Button,
  Group,
  Paper,
  Radio,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconAlertCircle, IconArrowLeft, IconFile, IconLayoutRows, IconSparkles } from "@tabler/icons-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { createPage } from "../../../actions";

const TEMPLATES = [
  {
    value: "landing",
    title: "Landing page",
    description: "Hero, services, offers, lounge, locations, shop and social feed, filled with placeholder content.",
    icon: IconSparkles,
  },
  {
    value: "service",
    title: "Service page",
    description: "Page hero, benefits strip, intro with locations and alternating treatment rows.",
    icon: IconLayoutRows,
  },
  {
    value: "blank",
    title: "Blank page",
    description: "Start from an empty canvas and add sections yourself.",
    icon: IconFile,
  },
];

export function NewPageForm() {
  const [state, action, pending] = useActionState(createPage, undefined);
  const [template, setTemplate] = useState("landing");

  return (
    <Stack gap="lg" maw={860}>
      <div>
        <Anchor component={Link} href="/admin" size="sm" c="dimmed">
          <Group gap={4}>
            <IconArrowLeft size={14} /> All pages
          </Group>
        </Anchor>
        <Title order={2} mt="xs">
          New page
        </Title>
        <Text c="dimmed" mt={4}>
          Name the page, choose a starting point, then design it in the visual editor.
        </Text>
      </div>

      <form action={action}>
        <input type="hidden" name="template" value={template} />
        <Stack gap="lg">
          {state?.error && (
            <Alert color="red" variant="light" icon={<IconAlertCircle size={18} />}>
              {state.error}
            </Alert>
          )}

          <Paper p="xl" radius="lg">
            <Stack gap="md">
              <Title order={4}>Details</Title>
              <TextInput name="title" label="Page title" placeholder="About us" required maxLength={200} />
              <TextInput
                name="slug"
                label="URL"
                placeholder="about-us"
                maxLength={200}
                leftSection={<Text c="dimmed">/</Text>}
                description="Leave blank to generate it from the title. Enter “/” to make this the home page."
              />
            </Stack>
          </Paper>

          <Paper p="xl" radius="lg">
            <Stack gap="md">
              <Title order={4}>Start from</Title>
              <Radio.Group value={template} onChange={setTemplate}>
                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                  {TEMPLATES.map((t) => (
                    <Radio.Card
                      key={t.value}
                      value={t.value}
                      radius="md"
                      p="md"
                      style={{
                        // Radio cards are buttons, which vertically centre content; keep cards top-aligned.
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        borderColor: template === t.value ? "var(--mantine-color-brand-6)" : undefined,
                        background: template === t.value ? "var(--mantine-color-brand-light)" : undefined,
                      }}
                    >
                      <Group justify="space-between" align="flex-start" wrap="nowrap">
                        <ThemeIcon variant="light" size={38} radius="md">
                          <t.icon size={20} stroke={1.6} />
                        </ThemeIcon>
                        <Radio.Indicator />
                      </Group>
                      <Text fw={600} mt="sm">
                        {t.title}
                      </Text>
                      <Text size="sm" c="dimmed" mt={4}>
                        {t.description}
                      </Text>
                    </Radio.Card>
                  ))}
                </SimpleGrid>
              </Radio.Group>
            </Stack>
          </Paper>

          <Group justify="flex-end">
            <Button component={Link} href="/admin" variant="default">
              Cancel
            </Button>
            <Button type="submit" loading={pending}>
              Create and open editor
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
}
