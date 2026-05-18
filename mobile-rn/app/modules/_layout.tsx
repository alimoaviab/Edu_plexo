/**
 * Shared module route group. The same screens are reused across admin,
 * teacher, parent, and student roles — each screen inspects `useTenant()`
 * to render role-appropriate actions (admins see Create/Edit/Delete;
 * students/parents see read-only views and the role-specific endpoints).
 *
 * Stack-based so module screens can push detail / form pages naturally.
 */

import { Stack } from 'expo-router';

export default function ModulesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
        animation: 'slide_from_right',
      }}
    />
  );
}
