import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getAdminRecord, getRecordId, listAdminRecords, runAdminAction, saveAdminRecord, deleteAdminRecord } from '@/modules/admin/api';
import { ADMIN_MODULE_BY_KEY } from '@/modules/admin/config';
import type { AdminFormField, AdminModuleDefinition, AdminRecord } from '@/modules/admin/types';
import type { ModuleRegistry } from '@/modules/shared/registry';
import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';

type FormMode = 'create' | 'edit';

/**
 * Generic config-driven CRUD screen. Defaults to the admin module registry,
 * but any role (teacher / parent / student) can pass its own registry so the
 * same engine powers every portal — identical list / search / filter /
 * pagination / detail / create / update / delete / row-action behaviour.
 */
export function AdminModuleScreen({
  registry = ADMIN_MODULE_BY_KEY,
  scope,
}: {
  registry?: ModuleRegistry;
  /** Caller-injected scope (e.g. a parent's selected student_id). */
  scope?: Record<string, string | undefined>;
}) {
  const router = useRouter();
  const params = useLocalSearchParams<{ module?: string }>();
  const moduleParam = Array.isArray(params.module) ? params.module[0] : params.module;
  const definition = moduleParam ? registry[moduleParam] : undefined;

  if (!definition) {
    return (
      <ScreenContainer scroll>
        <Header showBack greeting="Module" title="Module not found" subtitle={moduleParam ?? 'Unknown module'} />
        <Button label="Back" variant="secondary" onPress={() => router.back()} />
      </ScreenContainer>
    );
  }

  return <AdminModuleContent definition={definition} scope={scope} registry={registry} />;
}

function AdminModuleContent({
  definition,
  scope,
  registry,
}: {
  definition: AdminModuleDefinition;
  scope?: Record<string, string | undefined>;
  registry: ModuleRegistry;
}) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<AdminRecord | null>(null);
  const [formState, setFormState] = useState<{ mode: FormMode; record?: AdminRecord } | null>(null);

  const scopeKey = scope ? JSON.stringify(scope) : '';
  const listKey = ['admin-module', definition.key, page, search, filters, scopeKey] as const;
  const listQuery = useQuery({
    queryKey: listKey,
    queryFn: () => listAdminRecords(definition, { page, search, filters, scope }),
  });

  const detailId = selected ? getRecordId(selected) : '';
  const detailQuery = useQuery({
    queryKey: ['admin-module-detail', definition.key, detailId],
    queryFn: () => getAdminRecord(definition, selected ?? {}),
    enabled: !!selected && !!detailId && !!definition.getPath,
  });

  const saveMutation = useMutation({
    mutationFn: (args: { payload: AdminRecord; mode: FormMode; record?: AdminRecord }) =>
      saveAdminRecord({ definition, ...args }),
    onSuccess: async () => {
      setFormState(null);
      setSelected(null);
      await queryClient.invalidateQueries({ queryKey: ['admin-module', definition.key] });
    },
    onError: (error) => Alert.alert('Save failed', error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (record: AdminRecord) => deleteAdminRecord(definition, record),
    onSuccess: async () => {
      setSelected(null);
      await queryClient.invalidateQueries({ queryKey: ['admin-module', definition.key] });
    },
    onError: (error) => Alert.alert('Delete failed', error.message),
  });

  const actionMutation = useMutation({
    mutationFn: (args: { method: 'POST' | 'PATCH' | 'PUT' | 'DELETE'; path: string; body?: AdminRecord }) =>
      runAdminAction(args.method, args.path, args.body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-module', definition.key] });
      if (detailId) {
        await queryClient.invalidateQueries({ queryKey: ['admin-module-detail', definition.key, detailId] });
      }
    },
    onError: (error) => Alert.alert('Action failed', error.message),
  });

  const records = useMemo(() => {
    const items = listQuery.data?.items ?? [];
    if (!search.trim() || definition.searchable) return items;
    return clientFilter(items, search, definition.clientSearchKeys);
  }, [definition.clientSearchKeys, definition.searchable, listQuery.data?.items, search]);

  const total = listQuery.data?.total ?? records.length;
  const limit = listQuery.data?.limit ?? definition.pageSize ?? 20;
  const pages = listQuery.data?.pages ?? (total > limit ? Math.ceil(total / limit) : undefined);
  const canPrev = page > 1;
  const canNext = pages ? page < pages : records.length >= limit && !definition.singleton;
  const detail = detailQuery.data ?? selected;

  function updateFilter(key: string, value: string) {
    setPage(1);
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function confirmDelete(record: AdminRecord) {
    Alert.alert('Delete record', 'This will delete the record through the backend API.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate(record) },
    ]);
  }

  function runAction(actionKey: string, record: AdminRecord) {
    const action = definition.rowActions?.find((candidate) => candidate.key === actionKey);
    if (!action) return;
    const perform = () =>
      actionMutation.mutate({
        method: action.method,
        path: action.path(record),
        body: action.body?.(record),
      });

    if (action.confirm) {
      Alert.alert(action.label, action.confirm, [
        { text: 'Cancel', style: 'cancel' },
        { text: action.label, style: action.destructive ? 'destructive' : 'default', onPress: perform },
      ]);
      return;
    }
    perform();
  }

  return (
    <>
      <Stack.Screen options={{ title: definition.title }} />
      <ScreenContainer scroll>
        <Header showBack greeting="Admin Module" title={definition.title} subtitle={definition.subtitle} />

        <View style={styles.toolbar}>
          <View style={styles.searchBox}>
            <Input
              label="Search"
              value={search}
              onChangeText={(value) => {
                setPage(1);
                setSearch(value);
              }}
              placeholder={definition.searchable ? 'Server search' : 'Search loaded records'}
            />
          </View>
          {definition.createPath ? (
            <Button
              label="New"
              size="sm"
              onPress={() => setFormState({ mode: 'create' })}
              iconLeft={<Icon name="plus" size={16} color={colors.white} />}
            />
          ) : null}
        </View>

        {definition.filters?.length ? (
          <View style={styles.filters}>
            {definition.filters.map((filter) =>
              filter.type === 'select' && filter.options ? (
                <View key={filter.key} style={styles.filterBlock}>
                  <Text style={styles.filterLabel}>{filter.label}</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
                    {filter.options.map((option) => {
                      const active = (filters[filter.key] ?? '') === option.value;
                      return (
                        <Pressable
                          key={option.value}
                          onPress={() => updateFilter(filter.key, option.value)}
                          style={[styles.chip, active && styles.chipActive]}
                        >
                          <Text style={[styles.chipText, active && styles.chipTextActive]}>{option.label}</Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>
              ) : (
                <Input
                  key={filter.key}
                  label={filter.label}
                  value={filters[filter.key] ?? ''}
                  onChangeText={(value) => updateFilter(filter.key, value)}
                  placeholder={filter.placeholder}
                />
              ),
            )}
          </View>
        ) : null}

        <View style={styles.resultHeader}>
          <Text style={styles.resultCount}>
            {definition.singleton ? 'Current record' : `${total} records`}
          </Text>
          <Pressable onPress={() => listQuery.refetch()} style={styles.refresh}>
            {listQuery.isFetching ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={styles.refreshText}>Refresh</Text>
            )}
          </Pressable>
        </View>

        {listQuery.isLoading ? (
          <LoadingState />
        ) : listQuery.isError ? (
          <ErrorState message={listQuery.error.message} onRetry={() => listQuery.refetch()} />
        ) : records.length === 0 ? (
          <EmptyState />
        ) : (
          <View style={styles.list}>
            {records.map((record, index) => (
              <RecordCard
                key={getRecordId(record) || `${definition.key}-${index}`}
                definition={definition}
                record={record}
                onPress={() => setSelected(record)}
              />
            ))}
          </View>
        )}

        {!definition.singleton ? (
          <View style={styles.pagination}>
            <Button
              label="Prev"
              variant="secondary"
              size="sm"
              disabled={!canPrev}
              onPress={() => setPage((value) => Math.max(1, value - 1))}
            />
            <Text style={styles.pageText}>Page {page}{pages ? ` of ${pages}` : ''}</Text>
            <Button
              label="Next"
              variant="secondary"
              size="sm"
              disabled={!canNext}
              onPress={() => setPage((value) => value + 1)}
            />
          </View>
        ) : null}
      </ScreenContainer>

      <DetailModal
        definition={definition}
        record={detail}
        loading={detailQuery.isFetching}
        onClose={() => setSelected(null)}
        onEdit={
          definition.updatePath
            ? () => detail && setFormState({ mode: 'edit', record: detail })
            : undefined
        }
        onDelete={
          definition.deletePath && detail
            ? () => confirmDelete(detail)
            : undefined
        }
        onAction={detail ? (key) => runAction(key, detail) : undefined}
      />

      <AdminFormModal
        definition={definition}
        state={formState}
        saving={saveMutation.isPending}
        onClose={() => setFormState(null)}
        registry={registry}
        onSubmit={(payload) => {
          if (!formState) return;
          const enriched = applyScopeToPayload(definition, payload, scope);
          saveMutation.mutate({ payload: enriched, mode: formState.mode, record: formState.record });
        }}
      />
    </>
  );
}

function RecordCard({
  definition,
  record,
  onPress,
}: {
  definition: AdminModuleDefinition;
  record: AdminRecord;
  onPress: () => void;
}) {
  const title = firstValue(record, definition.displayFields) || getRecordId(record) || definition.title;
  const fields = definition.displayFields
    .filter((field) => String(readPath(record, field) ?? '').trim() !== String(title).trim())
    .slice(0, 5);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.record, shadows.card, pressed && styles.pressed]}>
      <View style={styles.recordIcon}>
        <Icon name={definition.icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.recordBody}>
        <Text style={styles.recordTitle} numberOfLines={1}>{title}</Text>
        <View style={styles.recordMeta}>
          {fields
            .filter((field) => !shouldHideField(field, readPath(record, field)))
            .map((field) => (
              <Text key={field} style={styles.metaText} numberOfLines={1}>
                {getFieldLabel(field, definition)}: {formatValue(readPath(record, field), field)}
              </Text>
            ))}
        </View>
      </View>
      <Icon name="chevron-right" size={18} color={colors.gray400} />
    </Pressable>
  );
}

function DetailModal({
  definition,
  record,
  loading,
  onClose,
  onEdit,
  onDelete,
  onAction,
}: {
  definition: AdminModuleDefinition;
  record: AdminRecord | null | undefined;
  loading: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onAction?: (key: string) => void;
}) {
  return (
    <Modal visible={!!record} animationType="slide" onRequestClose={onClose}>
      <ScreenContainer scroll>
        <Header
          showBack
          onBack={onClose}
          greeting={definition.title}
          title={record ? firstValue(record, definition.displayFields) || getRecordId(record) || 'Details' : 'Details'}
          subtitle={loading ? 'Refreshing from API' : 'Live backend record'}
        />

        {record ? (
          <Card style={styles.detailCard}>
            {definition.detailFields
              .filter((field) => !shouldHideField(field, readPath(record, field)))
              .map((field) => (
                <View key={field} style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{getFieldLabel(field, definition)}</Text>
                  <Text style={styles.detailValue}>{formatValue(readPath(record, field), field)}</Text>
                </View>
              ))}
          </Card>
        ) : null}

        <View style={styles.actions}>
          {definition.rowActions?.map((action) => (
            <Button
              key={action.key}
              label={action.label}
              variant={action.destructive ? 'danger' : 'secondary'}
              size="sm"
              onPress={() => onAction?.(action.key)}
            />
          ))}
          {onEdit ? <Button label="Edit" size="sm" onPress={onEdit} /> : null}
          {onDelete ? <Button label="Delete" variant="danger" size="sm" onPress={onDelete} /> : null}
          <Button label="Close" variant="secondary" size="sm" onPress={onClose} />
        </View>
      </ScreenContainer>
    </Modal>
  );
}

function AdminFormModal({
  definition,
  state,
  saving,
  onClose,
  registry,
  onSubmit,
}: {
  definition: AdminModuleDefinition;
  state: { mode: FormMode; record?: AdminRecord } | null;
  saving: boolean;
  onClose: () => void;
  registry: ModuleRegistry;
  onSubmit: (payload: AdminRecord) => void;
}) {
  const fields = useMemo(
    () => (definition.fields ?? []).filter((field) => visibleForMode(field, state?.mode ?? 'create')),
    [definition.fields, state?.mode],
  );
  const [values, setValues] = useState<Record<string, string | boolean>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!state) {
      setValues({});
      setError(null);
      return;
    }

    const next: Record<string, string | boolean> = {};
    for (const field of fields) {
      const existing = state.record ? readPath(state.record, field.key) : undefined;
      next[field.key] = fieldToStateValue(field, existing ?? field.defaultValue);
    }
    setValues(next);
    setError(null);
  }, [fields, state]);

  function setField(key: string, value: string | boolean) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function submit() {
    const built = buildPayload(fields, values);
    if (!built.ok) {
      setError(built.message);
      return;
    }
    onSubmit(built.payload);
  }

  return (
    <Modal visible={!!state} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalFlex}>
        <ScreenContainer scroll>
          <Header
            showBack
            onBack={onClose}
            greeting={state?.mode === 'edit' ? 'Edit Record' : 'Create Record'}
            title={definition.title}
            subtitle="Submits directly to the backend API"
          />

          {error ? <Text style={styles.formError}>{error}</Text> : null}

          <View style={styles.form}>
            {fields.map((field) => (
              <FieldControl
                key={field.key}
                field={field}
                value={values[field.key]}
                onChange={(value) => setField(field.key, value)}
                registry={registry}
              />
            ))}
          </View>

          <View style={styles.actions}>
            <Button label="Cancel" variant="secondary" onPress={onClose} disabled={saving} />
            <Button label="Save" onPress={submit} loading={saving} />
          </View>
        </ScreenContainer>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function FieldControl({
  field,
  value,
  onChange,
  registry,
}: {
  field: AdminFormField;
  value: string | boolean | undefined;
  onChange: (value: string | boolean) => void;
  registry: ModuleRegistry;
}) {
  const type = field.type ?? 'text';

  const relationModuleKey = getRelationModuleKey(field.key);
  if (relationModuleKey) {
    return (
      <RelationSelector
        field={field}
        value={value}
        onChange={onChange as (value: string) => void}
        registry={registry}
      />
    );
  }

  if (type === 'boolean') {
    return (
      <View style={styles.switchRow}>
        <View style={styles.switchText}>
          <Text style={styles.fieldLabel}>{field.label}</Text>
          {field.helper ? <Text style={styles.helper}>{field.helper}</Text> : null}
        </View>
        <Switch value={Boolean(value)} onValueChange={onChange} />
      </View>
    );
  }

  if (type === 'select' && field.options) {
    return (
      <View style={styles.filterBlock}>
        <Text style={styles.fieldLabel}>{field.label}{field.required ? ' *' : ''}</Text>
        <View style={styles.chipsWrap}>
          {field.options.map((option) => {
            const active = String(value ?? '') === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => onChange(option.value)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>
        {field.helper ? <Text style={styles.helper}>{field.helper}</Text> : null}
      </View>
    );
  }

  return (
    <View style={styles.inputWrap}>
      <Input
        label={`${field.label}${field.required ? ' *' : ''}`}
        value={typeof value === 'boolean' ? String(value) : value ?? ''}
        placeholder={field.placeholder}
        onChangeText={onChange}
        multiline={type === 'textarea' || type === 'json'}
        numberOfLines={type === 'textarea' || type === 'json' ? 4 : 1}
        keyboardType={type === 'number' ? 'numeric' : type === 'email' ? 'email-address' : 'default'}
        secureTextEntry={type === 'password'}
        autoCapitalize={type === 'email' ? 'none' : 'sentences'}
      />
      {field.helper ? <Text style={styles.helper}>{field.helper}</Text> : null}
    </View>
  );
}

function LoadingState() {
  return (
    <Card style={styles.stateCard}>
      <ActivityIndicator color={colors.primary} />
      <Text style={styles.stateText}>Loading real data...</Text>
    </Card>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card style={styles.stateCard}>
      <Text style={styles.errorTitle}>Request failed</Text>
      <Text style={styles.stateText}>{message}</Text>
      <Button label="Retry" size="sm" onPress={onRetry} />
    </Card>
  );
}

function EmptyState() {
  return (
    <Card style={styles.stateCard}>
      <Text style={styles.errorTitle}>No records</Text>
      <Text style={styles.stateText}>The backend returned an empty result for this module.</Text>
    </Card>
  );
}

function buildPayload(
  fields: AdminFormField[],
  values: Record<string, string | boolean>,
): { ok: true; payload: AdminRecord } | { ok: false; message: string } {
  const payload: AdminRecord = {};

  for (const field of fields) {
    const raw = values[field.key];
    if (field.type !== 'boolean' && (raw === undefined || String(raw).trim() === '')) {
      if (field.required) return { ok: false, message: `${field.label} is required.` };
      continue;
    }

    const parsed = parseFieldValue(field, raw);
    if (!parsed.ok) return parsed;
    setPath(payload, field.key, parsed.value);
  }

  return { ok: true, payload };
}

function parseFieldValue(
  field: AdminFormField,
  raw: string | boolean | undefined,
): { ok: true; value: unknown } | { ok: false; message: string } {
  const type = field.type ?? 'text';
  if (type === 'boolean') return { ok: true, value: Boolean(raw) };

  const text = String(raw ?? '').trim();
  if (type === 'number') {
    const value = Number(text);
    if (!Number.isFinite(value)) return { ok: false, message: `${field.label} must be a number.` };
    return { ok: true, value };
  }
  if (type === 'csv') {
    return { ok: true, value: text.split(',').map((part) => part.trim()).filter(Boolean) };
  }
  if (type === 'json') {
    try {
      return { ok: true, value: text ? JSON.parse(text) : null };
    } catch {
      return { ok: false, message: `${field.label} must be valid JSON.` };
    }
  }
  return { ok: true, value: text };
}

function fieldToStateValue(field: AdminFormField, value: unknown): string | boolean {
  if (field.type === 'boolean') return Boolean(value);
  if (field.type === 'json') return value === undefined ? '' : JSON.stringify(value, null, 2);
  if (field.type === 'csv') return Array.isArray(value) ? value.join(', ') : String(value ?? '');
  return String(value ?? '');
}

function visibleForMode(field: AdminFormField, mode: FormMode): boolean {
  if (field.createOnly && mode !== 'create') return false;
  if (field.editOnly && mode !== 'edit') return false;
  return true;
}

/**
 * Inject scoped values (e.g. a parent's selected student_id) into the payload
 * for create/update, mapping scope keys onto target fields via
 * `definition.scopeToPayload`. Existing user-entered values win.
 */
function applyScopeToPayload(
  definition: AdminModuleDefinition,
  payload: AdminRecord,
  scope?: Record<string, string | undefined>,
): AdminRecord {
  if (!definition.scopeToPayload || !scope) return payload;
  const next: AdminRecord = { ...payload };
  for (const [scopeKey, targetField] of Object.entries(definition.scopeToPayload)) {
    const value = scope[scopeKey];
    const existing = next[targetField];
    if (value && (existing === undefined || existing === null || String(existing).trim() === '')) {
      next[targetField] = value;
    }
  }
  return next;
}

function clientFilter(records: AdminRecord[], term: string, keys: string[] | undefined): AdminRecord[] {
  const needle = term.trim().toLowerCase();
  if (!needle) return records;
  const searchKeys = keys?.length ? keys : undefined;
  return records.filter((record) => {
    const haystack = searchKeys
      ? searchKeys.map((key) => formatValue(readPath(record, key))).join(' ')
      : JSON.stringify(record);
    return haystack.toLowerCase().includes(needle);
  });
}

function readPath(record: AdminRecord | undefined, path: string): unknown {
  if (!record) return undefined;
  return path.split('.').reduce<unknown>((current, part) => {
    if (current && typeof current === 'object' && part in current) {
      return (current as Record<string, unknown>)[part];
    }
    return undefined;
  }, record);
}

function setPath(target: AdminRecord, path: string, value: unknown) {
  const parts = path.split('.');
  let current: AdminRecord = target;
  parts.forEach((part, index) => {
    if (index === parts.length - 1) {
      current[part] = value;
      return;
    }
    if (!current[part] || typeof current[part] !== 'object' || Array.isArray(current[part])) {
      current[part] = {};
    }
    current = current[part] as AdminRecord;
  });
}

function firstValue(record: AdminRecord, fields: string[]): string {
  for (const field of fields) {
    const value = readPath(record, field);
    const formatted = formatValue(value);
    if (formatted && formatted !== '-') return formatted;
  }
  return '';
}

function formatValue(value: unknown, key?: string): string {
  if (value === null || value === undefined || value === '') return '-';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';

  // Format ISO timestamps to human readable dates if it represents dates
  if (typeof value === 'string' && (key?.toLowerCase().endsWith('_at') || key?.toLowerCase().endsWith('_date') || /^\d{4}-\d{2}-\d{2}/.test(value))) {
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
    } catch {}
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return '-';
    return value.map((val) => formatValue(val, key)).join(', ');
  }
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function labelize(path: string): string {
  return path
    .split('.')
    .pop()!
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function shouldHideField(key: string, value: unknown): boolean {
  const keyLower = key.toLowerCase();
  
  if (keyLower === '_id' || keyLower === 'id' || keyLower === 'password' || keyLower === 'password_hash') {
    return true;
  }
  
  if (keyLower.endsWith('_id') || keyLower.endsWith('_ids')) {
    return true;
  }
  
  if (typeof value === 'string' && /^[0-9a-fA-F]{24}$/.test(value)) {
    return true;
  }
  
  return false;
}

function getFieldLabel(fieldKey: string, definition: AdminModuleDefinition): string {
  const found = definition.fields?.find((f) => f.key === fieldKey);
  if (found?.label) return found.label;

  const overrides: Record<string, string> = {
    _id: 'ID',
    id: 'ID',
    user_id: 'User',
    teacher_id: 'Teacher',
    student_id: 'Student',
    institution_id: 'Institution',
    class_id: 'Class',
    created_at: 'Created At',
    updated_at: 'Updated At',
    class_ids: 'Classes',
    teacher_ids: 'Teachers',
    subject_ids: 'Subjects',
    admission_no: 'Admission No',
  };

  const keyLower = fieldKey.toLowerCase();
  if (overrides[keyLower]) return overrides[keyLower];

  const lastPart = fieldKey.split('.').pop() || '';
  const lastPartLower = lastPart.toLowerCase();
  if (overrides[lastPartLower]) return overrides[lastPartLower];

  return labelize(fieldKey);
}

function getRelationModuleKey(key: string): string | null {
  if (key === 'class_id' || key === 'class_ids') return 'classes';
  if (key === 'student_id' || key === 'student_ids') return 'students';
  if (key === 'exam_id') return 'exams';
  if (key === 'subject_id' || key === 'subject_ids') return 'subjects';
  if (key === 'teacher_id' || key === 'teacher_ids') return 'teachers';
  if (key === 'template_id') return 'certificate-templates';
  if (key === 'fee_id') return 'fees';
  if (key === 'requester_id') return 'teachers';
  if (key === 'recipient_id' || key === 'recipient_ids') return 'teachers';
  if (key === 'academic_year_id') return 'academic-years';
  if (key === 'class_teacher_id') return 'teachers';
  if (key === 'host_teacher_id') return 'teachers';
  if (key === 'target_student_id') return 'students';
  if (key === 'chapter_id' || key === 'chapter_ids') return 'chapters';
  if (key === 'fee_type_id') return 'fee-types';
  return null;
}

function RelationSelector({
  field,
  value,
  onChange,
  registry,
}: {
  field: AdminFormField;
  value: string | boolean | undefined;
  onChange: (value: string) => void;
  registry: ModuleRegistry;
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [records, setRecords] = useState<AdminRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const targetModuleKey = getRelationModuleKey(field.key);
  const targetDefinition = targetModuleKey
    ? registry[targetModuleKey] || ADMIN_MODULE_BY_KEY[targetModuleKey]
    : undefined;

  useEffect(() => {
    if (!modalVisible || !targetDefinition) return;
    
    async function loadOptions() {
      setLoading(true);
      try {
        const result = await listAdminRecords(targetDefinition!, {
          page: 1,
          search: searchQuery,
        });
        setRecords(result.items || []);
      } catch (err) {
        console.error('Failed to load relation records:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadOptions();
  }, [modalVisible, targetDefinition, searchQuery]);

  if (!targetDefinition) {
    return (
      <View style={styles.inputWrap}>
        <Input
          label={`${field.label}${field.required ? ' *' : ''}`}
          value={String(value ?? '')}
          placeholder={field.placeholder}
          onChangeText={onChange}
        />
        {field.helper ? <Text style={styles.helper}>{field.helper}</Text> : null}
      </View>
    );
  }

  const getRecordLabel = (record: AdminRecord) => {
    if (targetModuleKey === 'classes') {
      return record.section ? `${record.name} (${record.section})` : String(record.name);
    }
    if (targetModuleKey === 'students' || targetModuleKey === 'teachers') {
      return `${record.first_name || ''} ${record.last_name || ''}`.trim() || String(record.email || getRecordId(record));
    }
    if (targetModuleKey === 'exams') {
      return String(record.title);
    }
    if (targetModuleKey === 'subjects') {
      return String(record.name);
    }
    if (targetModuleKey === 'certificate-templates') {
      return String(record.name);
    }
    if (targetModuleKey === 'fees') {
      return record.invoice_no ? `${record.invoice_no} (${record.student_name || ''})` : getRecordId(record);
    }
    if (targetModuleKey === 'academic-years') {
      return String(record.year);
    }
    if (targetModuleKey === 'chapters') {
      return record.chapter_number ? `Ch ${record.chapter_number}: ${record.title}` : String(record.title);
    }
    if (targetModuleKey === 'fee-types') {
      return String(record.name);
    }
    return String(record.name ?? record.title ?? getRecordId(record));
  };

  const isMultiSelect = field.key.endsWith('_ids') || (field.type === 'csv' && getRelationModuleKey(field.key) !== null);

  const displayValue = (() => {
    if (!value) return '';
    const ids = String(value).split(',').map((s) => s.trim()).filter(Boolean);
    const labels = ids.map((id) => {
      const found = records.find((r) => getRecordId(r) === id);
      return found ? getRecordLabel(found) : id;
    });
    return labels.join(', ');
  })();

  const handleItemPress = (id: string) => {
    if (isMultiSelect) {
      const ids = String(value || '').split(',').map((s) => s.trim()).filter(Boolean);
      let nextIds: string[];
      if (ids.includes(id)) {
        nextIds = ids.filter((x) => x !== id);
      } else {
        nextIds = [...ids, id];
      }
      onChange(nextIds.join(', '));
    } else {
      onChange(id);
      setModalVisible(false);
    }
  };

  const isSelected = (id: string) => {
    if (isMultiSelect) {
      return String(value || '').split(',').map((s) => s.trim()).filter(Boolean).includes(id);
    }
    return String(value) === id;
  };

  return (
    <View style={styles.inputWrap}>
      <Text style={styles.fieldLabel}>{field.label}{field.required ? ' *' : ''}</Text>
      <Pressable onPress={() => setModalVisible(true)} style={styles.selectorPressable}>
        <Text style={[styles.selectorText, !value && styles.selectorPlaceholder]} numberOfLines={1}>
          {displayValue || `Select ${field.label}`}
        </Text>
        <View style={{ transform: [{ rotate: '90deg' }] }}>
          <Icon name="chevron-right" size={18} color={colors.gray500} />
        </View>
      </Pressable>
      {field.helper ? <Text style={styles.helper}>{field.helper}</Text> : null}

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <ScreenContainer scroll>
          <Header
            showBack
            onBack={() => setModalVisible(false)}
            greeting="Select Relation"
            title={targetDefinition.title}
            subtitle={`Choose ${isMultiSelect ? 'one or more' : 'a'} ${field.label}`}
          />
          <View style={styles.selectorSearchWrap}>
            <Input
              label="Search"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={`Search ${targetDefinition.title}...`}
            />
          </View>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: spacing.lg }} />
          ) : (
            <View style={styles.selectorList}>
              {records.map((record) => {
                const id = getRecordId(record);
                const label = getRecordLabel(record);
                const active = isSelected(id);
                return (
                  <Pressable
                    key={id}
                    onPress={() => handleItemPress(id)}
                    style={[styles.selectorItem, active && styles.selectorItemActive]}
                  >
                    <Text style={[styles.selectorItemText, active && styles.selectorItemTextActive]}>
                      {label}
                    </Text>
                    {active && <Icon name="check-circle" size={18} color={colors.primary} />}
                  </Pressable>
                );
              })}
              {records.length === 0 && (
                <Text style={styles.selectorEmptyText}>No records found.</Text>
              )}
            </View>
          )}
          <View style={styles.actions}>
            <Button label="Cancel" variant="secondary" onPress={() => setModalVisible(false)} />
            {isMultiSelect && <Button label="Done" onPress={() => setModalVisible(false)} />}
          </View>
        </ScreenContainer>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  searchBox: { flex: 1 },
  filters: { gap: spacing.md, marginBottom: spacing.md },
  filterBlock: { gap: spacing.sm },
  filterLabel: { ...typography.labelXs, color: colors.gray500, marginLeft: 8 },
  chips: { gap: spacing.sm, paddingRight: spacing.md },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.bodySm, color: colors.gray700, fontWeight: '700' },
  chipTextActive: { color: colors.white },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  resultCount: { ...typography.bodySm, color: colors.gray500, fontWeight: '700' },
  refresh: { minWidth: 72, alignItems: 'flex-end' },
  refreshText: { ...typography.bodySm, color: colors.primary, fontWeight: '700' },
  list: { gap: spacing.sm, paddingBottom: spacing.md },
  record: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.white,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  recordIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordBody: { flex: 1, gap: 6 },
  recordTitle: { ...typography.bodyLg, color: colors.gray900, fontWeight: '800' },
  recordMeta: { gap: 2 },
  metaText: { ...typography.bodySm, color: colors.gray500 },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
  },
  pageText: { ...typography.bodySm, color: colors.gray600, fontWeight: '700' },
  stateCard: { alignItems: 'center', gap: spacing.sm, marginTop: spacing.md },
  stateText: { ...typography.bodySm, color: colors.gray500, textAlign: 'center' },
  errorTitle: { ...typography.bodyLg, color: colors.gray900, fontWeight: '800' },
  detailCard: { gap: spacing.md },
  detailRow: { gap: 4, paddingBottom: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  detailLabel: { ...typography.labelXs, color: colors.gray400 },
  detailValue: { ...typography.bodyMd, color: colors.gray900, fontWeight: '600' },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.lg,
    marginBottom: spacing.xl3,
  },
  modalFlex: { flex: 1, backgroundColor: colors.surface },
  form: { gap: spacing.md },
  formError: {
    ...typography.bodySm,
    color: colors.error,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  inputWrap: { gap: 6 },
  helper: { ...typography.bodySm, color: colors.gray400, marginLeft: 8 },
  fieldLabel: { ...typography.labelXs, color: colors.gray500 },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.lg,
  },
  switchText: { flex: 1, paddingRight: spacing.md },
  selectorPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.gray200,
    backgroundColor: colors.white,
    height: 48,
  },
  selectorText: {
    ...typography.bodyMd,
    color: colors.gray900,
    fontWeight: '500',
    flex: 1,
  },
  selectorPlaceholder: {
    color: colors.gray400,
  },
  selectorSearchWrap: {
    marginBottom: spacing.md,
  },
  selectorList: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  selectorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.gray100,
    backgroundColor: colors.gray50,
  },
  selectorItemActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  selectorItemText: {
    ...typography.bodyMd,
    color: colors.gray800,
  },
  selectorItemTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  selectorEmptyText: {
    ...typography.bodySm,
    color: colors.gray400,
    textAlign: 'center',
    marginVertical: spacing.md,
  },
});
