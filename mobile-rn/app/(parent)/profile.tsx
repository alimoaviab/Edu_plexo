import { useEffect } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { fetchParentChildren } from '@/modules/dashboard/api';
import { useAuthStore } from '@/store/auth-store';
import { useSelectedChild } from '@/store/selected-child-store';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';

export default function ParentProfile() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const studentId = useSelectedChild((s) => s.studentId);
  const children = useSelectedChild((s) => s.children);
  const setChildren = useSelectedChild((s) => s.setChildren);
  const select = useSelectedChild((s) => s.select);

  const childrenQuery = useQuery({ queryKey: ['parent-children'], queryFn: fetchParentChildren });
  useEffect(() => {
    if (childrenQuery.data) setChildren(childrenQuery.data);
  }, [childrenQuery.data, setChildren]);

  function confirmLogout() {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => logout() },
    ]);
  }

  return (
    <ScreenContainer scroll>
      <Header greeting="Account" title="Profile" subtitle={user?.email ?? 'Parent account'} />

      <Text style={styles.sectionLabel}>Linked Children</Text>
      <View style={styles.list}>
        {children.length === 0 ? (
          <Card>
            <Text style={styles.empty}>No linked children found.</Text>
          </Card>
        ) : (
          children.map((child) => {
            const active = child.student_id === studentId;
            return (
              <Pressable
                key={child.student_id}
                onPress={() => select(child.student_id)}
                style={({ pressed }) => [styles.childRow, shadows.card, active && styles.childRowActive, pressed && styles.pressed]}
              >
                <View style={[styles.avatar, active && styles.avatarActive]}>
                  <Icon name="family" size={20} color={active ? colors.white : colors.primary} />
                </View>
                <View style={styles.childText}>
                  <Text style={styles.childName}>{child.name}</Text>
                  <Text style={styles.childMeta} numberOfLines={1}>
                    {[child.class_name ?? child.class, child.section, child.roll_no].filter(Boolean).join(' · ') || 'Student'}
                  </Text>
                </View>
                {active ? <Icon name="check-circle" size={20} color={colors.success} /> : <Icon name="chevron-right" size={18} color={colors.gray400} />}
              </Pressable>
            );
          })
        )}
      </View>

      <Text style={styles.sectionLabel}>Account</Text>
      <Pressable onPress={confirmLogout} style={({ pressed }) => [styles.logoutRow, shadows.card, pressed && styles.pressed]}>
        <View style={styles.logoutIcon}>
          <Icon name="logout" size={20} color={colors.error} />
        </View>
        <View style={styles.childText}>
          <Text style={styles.logoutLabel}>Sign Out</Text>
          <Text style={styles.childMeta}>End your session</Text>
        </View>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  sectionLabel: { ...typography.label, color: colors.gray500, textTransform: 'uppercase', marginTop: spacing.lg, marginBottom: spacing.sm },
  list: { gap: spacing.sm },
  childRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  childRowActive: { borderColor: colors.primary },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarActive: { backgroundColor: colors.primary },
  childText: { flex: 1, gap: 2 },
  childName: { ...typography.bodyMd, fontWeight: '700', color: colors.gray900 },
  childMeta: { ...typography.bodySm, color: colors.gray500 },
  empty: { ...typography.bodySm, color: colors.gray400, textAlign: 'center' },
  pressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  logoutIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutLabel: { ...typography.bodyMd, fontWeight: '700', color: colors.error },
});
