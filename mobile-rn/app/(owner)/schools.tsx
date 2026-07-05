import { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';
import { api } from '@/api/client';
import { useAuthStore } from '@/store/auth-store';
import { prefStorage, StorageKeys } from '@/utils/secure-storage';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';

interface School {
  _id: string;
  school_id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  principal_name?: string;
  status: 'active' | 'inactive';
}

export default function SchoolsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const hydrateAuth = useAuthStore((s) => s.hydrate);

  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [principalName, setPrincipalName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch all schools under this owner's portfolio
  const schoolsQuery = useQuery({
    queryKey: ['owner-schools'],
    queryFn: async () => {
      const result = await api.get<School[]>('/owner/schools');
      if (!result.ok || !result.data) {
        throw new Error(result.message ?? 'Failed to load schools');
      }
      return result.data;
    },
  });

  // Switch active school / Impersonation
  const switchSchoolMutation = useMutation({
    mutationFn: async (schoolId: string) => {
      await prefStorage.set(StorageKeys.activeSchoolId, schoolId);
      await hydrateAuth();
    },
    onSuccess: () => {
      // Clear TanStack query cache to force all endpoints to reload under the new tenant
      queryClient.clear();
      Alert.alert('Campus Switched', 'Active campus has been updated successfully.', [
        { text: 'OK', onPress: () => router.replace('/(owner)' as never) },
      ]);
    },
    onError: (err: any) => {
      Alert.alert('Error', err.message ?? 'Failed to switch campus.');
    },
  });

  // Create/Onboard new school campus
  const onboardMutation = useMutation({
    mutationFn: async () => {
      const result = await api.post<any, any>('/owner/schools/create', {
        name: name.trim(),
        code: code.trim(),
        city: city.trim(),
        address: address.trim(),
        principal_name: principalName.trim(),
        email: email.trim(),
        password,
      });
      if (!result.ok) {
        throw new Error(result.message ?? 'Failed to onboard new campus');
      }
      return result.data;
    },
    onSuccess: () => {
      setModalVisible(false);
      resetForm();
      schoolsQuery.refetch();
      Alert.alert('Success', 'New campus onboarded successfully.');
    },
    onError: (err: any) => {
      setFormError(err.message ?? 'Failed to onboard campus.');
    },
  });

  const activeSchoolId = user?.activeSchoolId || user?.schoolId;

  // Set default active school on load if not set
  useEffect(() => {
    if (schoolsQuery.data && schoolsQuery.data.length > 0 && !user?.activeSchoolId) {
      const firstActive = schoolsQuery.data.find(s => s.status === 'active') || schoolsQuery.data[0];
      if (firstActive) {
        prefStorage.set(StorageKeys.activeSchoolId, firstActive.school_id).then(() => {
          hydrateAuth();
        });
      }
    }
  }, [schoolsQuery.data, user?.activeSchoolId, hydrateAuth]);

  function resetForm() {
    setName('');
    setCode('');
    setCity('');
    setAddress('');
    setPrincipalName('');
    setEmail('');
    setPassword('');
    setFormError(null);
  }

  function handleCreateSchool() {
    setFormError(null);
    if (!name.trim() || !code.trim() || !city.trim() || !principalName.trim() || !email.trim() || !password) {
      setFormError('Please fill out all required fields.');
      return;
    }
    onboardMutation.mutate();
  }

  return (
    <ScreenContainer scroll>
      <Header
        greeting="Owner Portal"
        title="Portfolio"
        subtitle="Manage all your educational branches"
        right={
          <Pressable
            onPress={() => setModalVisible(true)}
            style={({ pressed }) => [styles.onboardBtn, pressed && styles.pressed]}
          >
            <Icon name="plus" size={16} color={colors.white} />
            <Text style={styles.onboardBtnText}>Onboard</Text>
          </Pressable>
        }
      />

      {schoolsQuery.isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : schoolsQuery.isError ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{(schoolsQuery.error as Error).message}</Text>
          <Button label="Retry" onPress={() => schoolsQuery.refetch()} />
        </View>
      ) : (
        <View style={styles.list}>
          {schoolsQuery.data?.length === 0 ? (
            <View style={styles.empty}>
              <Icon name="building" size={48} color={colors.gray300} />
              <Text style={styles.emptyTitle}>No schools found</Text>
              <Text style={styles.emptySubtitle}>
                Get started by onboarding your first school campus.
              </Text>
              <Button label="Onboard Campus" onPress={() => setModalVisible(true)} />
            </View>
          ) : (
            schoolsQuery.data?.map((school) => {
              const isActive = school.school_id === activeSchoolId;
              return (
                <View key={school._id} style={[styles.card, shadows.card]}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardTitleWrap}>
                      <Icon name="building" size={18} color={isActive ? colors.primary : colors.gray500} />
                      <Text style={styles.cardTitle}>{school.name}</Text>
                    </View>
                    <View style={[styles.badge, school.status === 'active' ? styles.badgeActive : styles.badgeInactive]}>
                      <Text style={[styles.badgeText, school.status === 'active' ? styles.badgeTextActive : styles.badgeTextInactive]}>
                        {school.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.details}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Code:</Text>
                      <Text style={styles.detailValue}>{school.code}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>City:</Text>
                      <Text style={styles.detailValue}>{school.city}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Address:</Text>
                      <Text style={styles.detailValue} numberOfLines={1}>{school.address || '—'}</Text>
                    </View>
                    {school.principal_name ? (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Principal:</Text>
                        <Text style={styles.detailValue}>{school.principal_name}</Text>
                      </View>
                    ) : null}
                  </View>

                  <View style={styles.actions}>
                    {isActive ? (
                      <View style={styles.activeLabel}>
                        <Icon name="check-circle" size={16} color={colors.success} />
                        <Text style={styles.activeLabelText}>Currently Active</Text>
                      </View>
                    ) : (
                      <Button
                        label="Switch to Campus"
                        size="sm"
                        variant="secondary"
                        onPress={() => switchSchoolMutation.mutate(school.school_id)}
                        loading={switchSchoolMutation.isPending && switchSchoolMutation.variables === school.school_id}
                      />
                    )}
                  </View>
                </View>
              );
            })
          )}
        </View>
      )}

      {/* Onboard Campus Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Onboard Campus</Text>
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
                style={styles.closeBtn}
              >
                <Icon name="chevron-right" size={20} color={colors.gray500} />
              </Pressable>
            </View>

            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Input label="Campus Name *" placeholder="Oakridge High School" value={name} onChangeText={setName} />
                <Input label="Branch Code *" placeholder="OHS-01" value={code} onChangeText={setCode} />
                <Input label="City *" placeholder="Lahore" value={city} onChangeText={setCity} />
                <Input label="Address" placeholder="12-B Main Boulevard" value={address} onChangeText={setAddress} />
                <View style={styles.divider} />
                <Text style={styles.formSectionTitle}>Principal / Admin Account</Text>
                <Input label="Principal Name *" placeholder="Adnan Ahmad" value={principalName} onChangeText={setPrincipalName} />
                <Input label="Email Address *" placeholder="principal@school.com" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
                <Input label="Password *" placeholder="••••••••" value={password} onChangeText={setPassword} passwordToggle />
              </View>

              {formError ? (
                <View style={styles.formErrorBox}>
                  <Icon name="shield" size={16} color={colors.error} />
                  <Text style={styles.formErrorText}>{formError}</Text>
                </View>
              ) : null}

              <View style={styles.formActions}>
                <Button
                  label="Onboard Campus"
                  loading={onboardMutation.isPending}
                  onPress={handleCreateSchool}
                  fullWidth
                />
                <Button
                  label="Cancel"
                  variant="secondary"
                  onPress={() => {
                    setModalVisible(false);
                    resetForm();
                  }}
                  fullWidth
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.base,
    gap: spacing.md,
  },
  center: {
    flex: 1,
    padding: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onboardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  onboardBtnText: {
    ...typography.bodySm,
    color: colors.white,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    gap: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
    paddingBottom: spacing.sm,
  },
  cardTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  cardTitle: {
    ...typography.bodyLg,
    color: colors.gray900,
    fontWeight: '800',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  badgeActive: {
    backgroundColor: colors.successLight,
  },
  badgeInactive: {
    backgroundColor: colors.gray100,
  },
  badgeText: {
    ...typography.caption,
    fontWeight: '800',
  },
  badgeTextActive: {
    color: colors.success,
  },
  badgeTextInactive: {
    color: colors.gray500,
  },
  details: {
    gap: spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  detailLabel: {
    ...typography.caption,
    color: colors.gray400,
    fontWeight: '700',
    width: 70,
  },
  detailValue: {
    ...typography.bodySm,
    color: colors.gray700,
    fontWeight: '500',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
    paddingTop: spacing.md,
  },
  activeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  activeLabelText: {
    ...typography.bodySm,
    color: colors.success,
    fontWeight: '700',
  },
  errorCard: {
    margin: spacing.base,
    padding: spacing.md,
    backgroundColor: colors.errorLight,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.error,
    gap: spacing.md,
  },
  errorText: {
    ...typography.bodySm,
    color: colors.error,
    fontWeight: '700',
  },
  empty: {
    paddingVertical: 64,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
  },
  emptyTitle: {
    ...typography.bodyLg,
    color: colors.gray900,
    fontWeight: '800',
  },
  emptySubtitle: {
    ...typography.bodySm,
    color: colors.gray500,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl2,
    borderTopRightRadius: radius.xl2,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  modalTitle: {
    ...typography.bodyLg,
    color: colors.gray900,
    fontWeight: '800',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalForm: {
    padding: spacing.md,
  },
  formGroup: {
    gap: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray100,
    marginVertical: spacing.sm,
  },
  formSectionTitle: {
    ...typography.bodyMd,
    color: colors.gray900,
    fontWeight: '800',
  },
  formErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.md,
    backgroundColor: colors.errorLight,
    borderRadius: radius.md,
    marginTop: spacing.md,
  },
  formErrorText: {
    ...typography.bodySm,
    color: colors.error,
    fontWeight: '700',
    flex: 1,
  },
  formActions: {
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingBottom: spacing.xl2,
  },
});
