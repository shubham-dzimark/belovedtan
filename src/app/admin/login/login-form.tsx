"use client";

import { Alert, Box, Button, Center, Paper, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { IconAlertCircle, IconLock, IconMail } from "@tabler/icons-react";
import { useActionState } from "react";
import { login } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <Center
      mih="100vh"
      p="md"
      style={{
        background:
          "radial-gradient(1200px 600px at 10% -10%, var(--mantine-color-brand-1), transparent 60%), radial-gradient(900px 500px at 110% 110%, #f5e9d6, transparent 60%), var(--mantine-color-body)",
      }}
    >
      <Paper w="100%" maw={420} p={{ base: "lg", sm: 36 }} radius="lg" shadow="xl">
        <Stack gap="lg">
          <Stack gap={6} align="center">
            <Box
              w={52}
              h={52}
              style={{
                display: "grid",
                placeItems: "center",
                borderRadius: 14,
                background: "linear-gradient(135deg, var(--mantine-color-brand-7), #c9a063)",
                color: "white",
                fontWeight: 700,
                fontSize: 20,
              }}
            >
              BT
            </Box>
            <Title order={2} ta="center" mt="xs">
              Welcome back
            </Title>
            <Text c="dimmed" size="sm" ta="center">
              Sign in to manage the BelovedTan website
            </Text>
          </Stack>

          <form action={action}>
            <Stack gap="md">
              {state?.error && (
                <Alert color="red" variant="light" icon={<IconAlertCircle size={18} />}>
                  {state.error}
                </Alert>
              )}
              <TextInput
                name="email"
                type="email"
                label="Email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                leftSection={<IconMail size={18} stroke={1.6} />}
              />
              <PasswordInput
                name="password"
                label="Password"
                placeholder="Your password"
                autoComplete="current-password"
                required
                leftSection={<IconLock size={18} stroke={1.6} />}
              />
              <Button type="submit" size="md" fullWidth loading={pending} mt="xs">
                Sign in
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Center>
  );
}
