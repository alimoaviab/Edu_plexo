/**
 * Shared module-registry helpers.
 *
 * The config-driven CRUD engine (AdminModuleScreen + api.ts) is role-agnostic
 * — it operates on an {@link AdminModuleDefinition}. Each role (admin, teacher,
 * parent, student) exposes its own array of definitions and turns it into a
 * keyed registry with {@link buildRegistry}. The matching `module/[module]`
 * route then resolves the active definition from that registry.
 *
 * Because teacher CRUD endpoints are identical to admin endpoints (the Go
 * backend scopes every list/read/write by the authenticated user's role and
 * profile), teacher/student configs frequently reuse admin definitions
 * verbatim — see pickModules / withOverrides below.
 */

import type { AdminModuleDefinition } from '@/modules/admin/types';

export type ModuleDefinition = AdminModuleDefinition;
export type ModuleRegistry = Record<string, AdminModuleDefinition>;

/** Build a `{ key -> definition }` lookup from a definitions array. */
export function buildRegistry(modules: AdminModuleDefinition[]): ModuleRegistry {
  return modules.reduce<ModuleRegistry>((acc, module) => {
    acc[module.key] = module;
    return acc;
  }, {});
}

/**
 * Select a subset of definitions from a source registry by key, preserving the
 * requested order. Unknown keys are skipped. Useful for deriving a teacher /
 * student config from the admin registry.
 */
export function pickModules(
  source: ModuleRegistry,
  keys: string[],
): AdminModuleDefinition[] {
  return keys
    .map((key) => source[key])
    .filter((value): value is AdminModuleDefinition => Boolean(value));
}

/** Shallow-merge overrides onto a base definition (e.g. retitle for a role). */
export function withOverrides(
  base: AdminModuleDefinition,
  overrides: Partial<AdminModuleDefinition>,
): AdminModuleDefinition {
  return { ...base, ...overrides };
}
