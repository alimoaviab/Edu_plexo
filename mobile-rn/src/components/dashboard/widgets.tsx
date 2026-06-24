/**
 * Reusable dashboard widgets shared by every role dashboard (admin, teacher,
 * parent, student). Keeping these in one place guarantees the portals look and
 * behave consistently — same cards, same spacing, same navigation pattern.
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Icon, type IconName } from '@/components/ui/Icon';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';

export type Accent = 'primary' | 'success' | 'warning' | 'error' | 'neutral';

const tint: Record<Accent, { bg: string; fg: string }> = {
  primary: { bg: colors.primaryLight, fg: colors.primary },
  success: { bg: colors.successLight, fg: colors.success },
  warning: { bg: colors.warningLight, fg: colors.warning },
  error: { bg: colors.errorLight, fg: colors.error },
  neutral: { bg: colors.gray100, fg: colors.gray700 },
};

// ─── Section header ─────────────────────────────────────────────────────────

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionText}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.sectionAction}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

// ─── Navigable module grid ──────────────────────────────────────────────────

export interface ModuleGridItem {
  key: string;
  label: string;
  description?: string;
  icon: IconName;
  accent: Accent;
  href?: string;
  onPress?: () => void;
  badge?: string | number;
}

export function ModuleGrid({ items }: { items: ModuleGridItem[] }) {
  const router = useRouter();
  return (
    <View style={styles.grid}>
      {items.map((item) => {
        const palette = tint[item.accent];
        const onPress =
          item.onPress ?? (item.href ? () => router.push(item.href as never) : undefined);
        return (
          <Pressable
            key={item.key}
            onPress={onPress}
            disabled={!onPress}
            style={({ pressed }) => [styles.moduleCard, shadows.card, pressed && styles.pressed]}
            android_ripple={{ color: colors.gray100 }}
          >
            <View style={[styles.moduleIcon, { backgroundColor: palette.bg }]}>
              <Icon name={item.icon} size={22} color={palette.fg} />
            </View>
            {item.badge !== undefined && item.badge !== 0 && item.badge !== '' ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.badge}</Text>
              </View>
            ) : null}
            <Text style={styles.moduleLabel} numberOfLines={1}>
              {item.label}
            </Text>
            {item.description ? (
              <Text style={styles.moduleDescription} numberOfLines={1}>
                {item.description}
              </Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── Progress bar (attendance, fee collection, etc.) ────────────────────────

export function ProgressBar({
  value,
  accent = 'primary',
}: {
  value: number;
  accent?: Accent;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <View style={styles.progressTrack}>
      <View
        style={[styles.progressFill, { width: `${clamped}%`, backgroundColor: tint[accent].fg }]}
      />
    </View>
  );
}

// ─── Quick action pill row ──────────────────────────────────────────────────

export function QuickActions({
  actions,
}: {
  actions: { key: string; label: string; icon: IconName; href?: string; onPress?: () => void }[];
}) {
  const router = useRouter();
  return (
    <View style={styles.quickRow}>
      {actions.map((action) => {
        const onPress =
          action.onPress ?? (action.href ? () => router.push(action.href as never) : undefined);
        return (
          <Pressable
            key={action.key}
            onPress={onPress}
            style={({ pressed }) => [styles.pill, shadows.card, pressed && styles.pressed]}
            android_ripple={{ color: colors.gray100 }}
          >
            <Icon name={action.icon} size={16} color={colors.primary} />
            <Text style={styles.pillLabel} numberOfLines={1}>
              {action.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── List card (events, activities, schedule, results) ──────────────────────

export interface ListRow {
  key: string;
  title: string;
  subtitle?: string;
  meta?: string;
  icon?: IconName;
  accent?: Accent;
}

export function ListCard({
  rows,
  emptyText = 'Nothing to show yet.',
  onRowPress,
}: {
  rows: ListRow[];
  emptyText?: string;
  onRowPress?: (key: string) => void;
}) {
  if (rows.length === 0) {
    return (
      <View style={styles.listCard}>
        <Text style={styles.emptyText}>{emptyText}</Text>
      </View>
    );
  }
  return (
    <View style={styles.listCard}>
      {rows.map((row, index) => {
        const palette = tint[row.accent ?? 'primary'];
        return (
          <Pressable
            key={row.key}
            onPress={onRowPress ? () => onRowPress(row.key) : undefined}
            disabled={!onRowPress}
            style={[styles.listRow, index < rows.length - 1 && styles.listRowDivider]}
          >
            {row.icon ? (
              <View style={[styles.listIcon, { backgroundColor: palette.bg }]}>
                <Icon name={row.icon} size={16} color={palette.fg} />
              </View>
            ) : null}
            <View style={styles.listRowText}>
              <Text style={styles.listTitle} numberOfLines={1}>
                {row.title}
              </Text>
              {row.subtitle ? (
                <Text style={styles.listSubtitle} numberOfLines={1}>
                  {row.subtitle}
                </Text>
              ) : null}
            </View>
            {row.meta ? <Text style={styles.listMeta}>{row.meta}</Text> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  sectionText: { flex: 1, gap: 2 },
  sectionTitle: { ...typography.h4, color: colors.gray900 },
  sectionSubtitle: { ...typography.bodySm, color: colors.gray500 },
  sectionAction: { ...typography.bodySm, color: colors.primary, fontWeight: '700' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  moduleCard: {
    width: '47%',
    flexGrow: 1,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 6,
  },
  moduleIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleLabel: { ...typography.bodyMd, fontWeight: '700', color: colors.gray900 },
  moduleDescription: { ...typography.bodySm, color: colors.gray500 },
  badge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: radius.full,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { ...typography.labelXs, color: colors.white },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },

  progressTrack: {
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.gray100,
    overflow: 'hidden',
  },
  progressFill: { height: 8, borderRadius: radius.full },

  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  pillLabel: { ...typography.bodySm, fontWeight: '700', color: colors.gray800 },

  listCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: spacing.md,
  },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  listRowDivider: { borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  listIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listRowText: { flex: 1, gap: 2 },
  listTitle: { ...typography.bodyMd, fontWeight: '600', color: colors.gray900 },
  listSubtitle: { ...typography.bodySm, color: colors.gray500 },
  listMeta: { ...typography.bodySm, color: colors.gray500, fontWeight: '600' },
  emptyText: { ...typography.bodySm, color: colors.gray400, textAlign: 'center', paddingVertical: spacing.lg },
});
