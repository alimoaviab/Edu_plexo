import { Image, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Icon, type IconName } from '@/components/ui/Icon';
import type { AdminRecord } from '@/modules/admin/types';
import {
  collectRecordFields,
  getRecordImageUri,
  groupRecordFields,
  recordTitle,
} from '@/modules/admin/record-utils';
import { colors, radius, spacing, typography } from '@/theme/tokens';

interface RecordProfileProps {
  record: AdminRecord;
  fallbackTitle: string;
  subtitle?: string;
  icon: IconName;
  emptyText?: string;
}

export function RecordProfile({
  record,
  fallbackTitle,
  subtitle,
  icon,
  emptyText = 'No profile information is available yet.',
}: RecordProfileProps) {
  const imageUri = getRecordImageUri(record);
  const fields = collectRecordFields(record);
  const groups = groupRecordFields(fields);
  const title = recordTitle(record, undefined, fallbackTitle);

  return (
    <View style={styles.wrap}>
      <Card style={styles.hero} padding="md">
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.photo} />
        ) : (
          <View style={styles.avatar}>
            <Icon name={icon} size={26} color={colors.primary} />
          </View>
        )}
        <View style={styles.heroText}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </Card>

      {groups.length === 0 ? (
        <Card padding="md">
          <Text style={styles.empty}>{emptyText}</Text>
        </Card>
      ) : (
        groups.map((group) => (
          <Card key={group.title} style={styles.section} padding="md">
            <Text style={styles.sectionTitle}>{group.title}</Text>
            {group.fields.map((field) => (
              <View key={field.key} style={styles.row}>
                <Text style={styles.label}>{field.label}</Text>
                <Text style={styles.value}>{field.formatted}</Text>
              </View>
            ))}
          </Card>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  photo: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.gray100,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: { flex: 1, gap: 2 },
  title: { ...typography.h3, color: colors.gray900 },
  subtitle: { ...typography.bodySm, color: colors.gray500 },
  section: { gap: spacing.sm },
  sectionTitle: { ...typography.bodyLg, color: colors.gray900, fontWeight: '800' },
  row: {
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
    gap: 2,
  },
  label: { ...typography.labelXs, color: colors.gray400 },
  value: { ...typography.bodyMd, color: colors.gray900, fontWeight: '600' },
  empty: { ...typography.bodySm, color: colors.gray500, textAlign: 'center' },
});
