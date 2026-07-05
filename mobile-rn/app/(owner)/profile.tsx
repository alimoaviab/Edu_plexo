import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Icon, type IconName } from '@/components/ui/Icon';
import { useAuthStore } from '@/store/auth-store';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';

type Accent = 'primary' | 'success' | 'warning' | 'error' | 'neutral';

interface ProfileItem {
  key: string;
  label: string;
  description?: string;
  icon: IconName;
  accent: Accent;
  href?: string;
  onPress?: () => void;
}

interface ProfileSection {
  title: string;
  items: ProfileItem[];
}

export default function ProfileScreen() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  function confirmLogout() {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => logout() },
    ]);
  }

  const sections: ProfileSection[] = [
    {
      title: 'Profile',
      items: [
        { key: 'my-profile', label: 'My Profile', description: user?.email ?? 'Owner account', icon: 'shield', accent: 'primary', href: '/(owner)/module/settings' },
        { key: 'owner-portfolio', label: 'My Schools', description: 'Portfolio and branch switcher', icon: 'building', accent: 'primary', href: '/(owner)/schools' },
        { key: 'academic-year', label: 'Academic Year', description: 'Sessions and active year', icon: 'calendar', accent: 'success', href: '/(owner)/module/academic-years' },
        { key: 'school-profile', label: 'School Profile', description: 'School identity and contact info', icon: 'graduation', accent: 'primary', href: '/(owner)/module/settings' },
        { key: 'subscription', label: 'Subscription', description: 'Plan, limits and billing', icon: 'wallet', accent: 'success', href: '/(owner)/module/subscription' },
        { key: 'preferences', label: 'Preferences', description: 'Workspace preferences', icon: 'settings', accent: 'neutral', href: '/(owner)/module/settings' },
        { key: 'settings', label: 'Settings', description: 'System configuration', icon: 'settings', accent: 'neutral', href: '/(owner)/module/settings' },
        { key: 'logout', label: 'Sign Out', description: 'End this session', icon: 'logout', accent: 'error', onPress: confirmLogout },
      ],
    },
  ];

  return (
    <ScreenContainer scroll>
      <Header greeting="Account" title="Profile" subtitle={user?.email ?? 'Admin'} />
      {sections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.list}>
            {section.items.map((item) => (
              <ProfileRow
                key={item.key}
                item={item}
                onPress={item.onPress ?? (item.href ? () => router.push(item.href as never) : undefined)}
              />
            ))}
          </View>
        </View>
      ))}
    </ScreenContainer>
  );
}

function ProfileRow({ item, onPress }: { item: ProfileItem; onPress?: () => void }) {
  const palette = tintMap[item.accent];
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.row, shadows.card, pressed && styles.pressed]}
      android_ripple={{ color: colors.gray100 }}
    >
      <View style={[styles.iconWrap, { backgroundColor: palette.bg }]}>
        <Icon name={item.icon} size={20} color={palette.fg} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {item.label}
        </Text>
        {item.description ? (
          <Text style={styles.rowDescription} numberOfLines={1}>
            {item.description}
          </Text>
        ) : null}
      </View>
      <Icon name="chevron-right" size={18} color={colors.gray400} />
    </Pressable>
  );
}

const tintMap = {
  primary: { bg: colors.primaryLight, fg: colors.primary },
  success: { bg: colors.successLight, fg: colors.success },
  warning: { bg: colors.warningLight, fg: colors.warning },
  error: { bg: colors.errorLight, fg: colors.error },
  neutral: { bg: colors.gray100, fg: colors.gray700 },
} as const;

const styles = StyleSheet.create({
  section: { marginBottom: spacing.lg },
  sectionTitle: {
    ...typography.h4,
    color: colors.gray900,
    marginBottom: spacing.sm,
  },
  list: { gap: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1, gap: 2 },
  rowTitle: { ...typography.bodyMd, color: colors.gray900, fontWeight: '800' },
  rowDescription: { ...typography.bodySm, color: colors.gray500 },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
});
