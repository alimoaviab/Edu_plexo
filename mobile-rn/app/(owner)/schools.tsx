import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Clipboard,
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
  id?: string;
  school_id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  principal_name?: string;
  status: 'active' | 'inactive';
  admin_email?: string;
  email?: string;
  admin_password?: string;
  class_count?: number;
  student_count?: number;
  teacher_count?: number;
  total_fee_collected?: number;
  classes_breakdown?: {
    class_id?: string;
    name: string;
    section?: string;
    student_count?: number;
    collected_fee?: number;
    pending_fee?: number;
  }[];
}

export default function SchoolsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const hydrateAuth = useAuthStore((s) => s.hydrate);

  // Onboard Modal State
  const [onboardModalVisible, setOnboardModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [principalName, setPrincipalName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Details Modal State
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Fetch all schools under this owner's portfolio
  const schoolsQuery = useQuery({
    queryKey: ['owner-schools'],
    queryFn: async () => {
      const result = await api.get<School[]>('/owner/schools');
      if (!result.ok || !result.data) {
        throw new Error(result.message ?? 'Failed to load schools');
      }
      return Array.isArray(result.data) ? result.data : [];
    },
  });

  // Switch active school / Impersonation
  const switchSchoolMutation = useMutation({
    mutationFn: async (schoolId: string) => {
      await prefStorage.set(StorageKeys.activeSchoolId, schoolId);
      await hydrateAuth();
    },
    onSuccess: () => {
      queryClient.clear();
      Alert.alert('Campus Switched', 'Active campus has been updated successfully.', [
        { text: 'OK', onPress: () => router.replace('/(owner)' as never) },
      ]);
    },
    onError: (err: any) => {
      Alert.alert('Error', err.message ?? 'Failed to switch campus.');
    },
  });

  // Login as Admin for this campus
  const handleLoginAsAdmin = async (schoolId: string) => {
    await prefStorage.set(StorageKeys.activeSchoolId, schoolId);
    await hydrateAuth();
    queryClient.clear();
    setSelectedSchool(null);
    router.replace('/(admin)' as never);
  };

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
      setOnboardModalVisible(false);
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
      const firstActive = schoolsQuery.data.find((s) => s.status === 'active') || schoolsQuery.data[0];
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

  const handleCopy = (value: string, key: string) => {
    Clipboard.setString(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <ScreenContainer scroll>
      <Header
        greeting="Owner Portal"
        title="Portfolio"
        subtitle="Manage all your educational branches and view campus metrics"
        right={
          <Pressable
            onPress={() => setOnboardModalVisible(true)}
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
          <Text style={styles.loadingText}>Loading campus portfolio...</Text>
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
              <Button label="Onboard Campus" onPress={() => setOnboardModalVisible(true)} />
            </View>
          ) : (
            schoolsQuery.data?.map((school) => {
              const isActive = school.school_id === activeSchoolId;
              return (
                <View key={school._id || school.school_id} style={[styles.card, shadows.card]}>
                  {/* Header */}
                  <View style={styles.cardHeader}>
                    <View style={styles.cardTitleWrap}>
                      <Icon name="building" size={18} color={isActive ? colors.primary : colors.gray500} />
                      <Text style={styles.cardTitle} numberOfLines={1}>{school.name}</Text>
                    </View>
                    <View style={[styles.badge, school.status === 'active' ? styles.badgeActive : styles.badgeInactive]}>
                      <Text style={[styles.badgeText, school.status === 'active' ? styles.badgeTextActive : styles.badgeTextInactive]}>
                        {(school.status || 'active').toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  {/* Campus Quick Details */}
                  <View style={styles.details}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Branch Code:</Text>
                      <Text style={styles.detailValue}>{school.school_id || school.code}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>City:</Text>
                      <Text style={styles.detailValue}>{school.city || 'N/A'}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Principal:</Text>
                      <Text style={styles.detailValue}>{school.principal_name || '—'}</Text>
                    </View>
                  </View>

                  {/* Stats Tiles */}
                  <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                      <Text style={styles.statLabel}>Classes</Text>
                      <Text style={styles.statNumber}>{school.class_count || 0}</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={styles.statLabel}>Students</Text>
                      <Text style={styles.statNumber}>{school.student_count || 0}</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={styles.statLabel}>Teachers</Text>
                      <Text style={styles.statNumber}>{school.teacher_count || 0}</Text>
                    </View>
                  </View>

                  {/* Card Actions */}
                  <View style={styles.actions}>
                    <Pressable
                      onPress={() => {
                        setSelectedSchool(school);
                        setShowPassword(false);
                      }}
                      style={({ pressed }) => [styles.btnDetails, pressed && styles.pressed]}
                    >
                      <Icon name="eye" size={14} color={colors.primary} />
                      <Text style={styles.btnDetailsText}>View Details</Text>
                    </Pressable>

                    {isActive ? (
                      <View style={styles.activeLabel}>
                        <Icon name="check-circle" size={16} color={colors.success} />
                        <Text style={styles.activeLabelText}>Active Campus</Text>
                      </View>
                    ) : (
                      <Button
                        label="Switch Campus"
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

      {/* Campus Details Modal */}
      {selectedSchool ? (
        <Modal
          animationType="slide"
          transparent={true}
          visible={!!selectedSchool}
          onRequestClose={() => setSelectedSchool(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>{selectedSchool.name}</Text>
                  <Text style={styles.modalSub}>
                    Branch Code: <Text style={styles.boldText}>{selectedSchool.school_id}</Text> · {selectedSchool.city || 'N/A'}
                  </Text>
                </View>
                <Pressable onPress={() => setSelectedSchool(null)} style={styles.closeBtn}>
                  <Icon name="chevron-right" size={20} color={colors.gray500} />
                </Pressable>
              </View>

              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                {/* Stats Row */}
                <View style={styles.modalStatsRow}>
                  <View style={[styles.modalStatTile, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.modalStatTileLabel, { color: colors.primary }]}>Classes</Text>
                    <Text style={styles.modalStatTileVal}>{selectedSchool.class_count || 0}</Text>
                  </View>
                  <View style={[styles.modalStatTile, { backgroundColor: colors.successLight }]}>
                    <Text style={[styles.modalStatTileLabel, { color: colors.success }]}>Students</Text>
                    <Text style={styles.modalStatTileVal}>{selectedSchool.student_count || 0}</Text>
                  </View>
                  <View style={[styles.modalStatTile, { backgroundColor: '#f3e8ff' }]}>
                    <Text style={[styles.modalStatTileLabel, { color: '#7c3aed' }]}>Teachers</Text>
                    <Text style={styles.modalStatTileVal}>{selectedSchool.teacher_count || 0}</Text>
                  </View>
                </View>

                {/* Admin Credentials Box */}
                <View style={styles.credentialsCard}>
                  <View style={styles.credHeader}>
                    <View style={styles.credIconBox}>
                      <Icon name="shield" size={16} color={colors.white} />
                    </View>
                    <View style={styles.credHeaderText}>
                      <Text style={styles.credTitle}>Admin Login Credentials</Text>
                      <Text style={styles.credSubtitle}>Use these to sign in as Administrator</Text>
                    </View>
                  </View>

                  <View style={styles.credRows}>
                    {/* Email Row */}
                    <View style={styles.credRow}>
                      <View style={styles.credRowText}>
                        <Text style={styles.credRowLabel}>Admin Email</Text>
                        <Text style={styles.credRowVal} numberOfLines={1}>
                          {selectedSchool.admin_email || selectedSchool.email || 'admin@school.com'}
                        </Text>
                      </View>
                      <Pressable
                        onPress={() =>
                          handleCopy(
                            selectedSchool.admin_email || selectedSchool.email || 'admin@school.com',
                            'email',
                          )
                        }
                        style={({ pressed }) => [styles.credCopyBtn, pressed && styles.pressed]}
                      >
                        <Icon
                          name={copiedKey === 'email' ? 'check' : 'copy'}
                          size={14}
                          color={colors.white}
                        />
                      </Pressable>
                    </View>

                    {/* Password Row */}
                    <View style={styles.credRow}>
                      <View style={styles.credRowText}>
                        <Text style={styles.credRowLabel}>Admin Password</Text>
                        <Text style={[styles.credRowVal, styles.credPass]}>
                          {showPassword ? (selectedSchool.admin_password || 'Test@123') : '••••••••••••'}
                        </Text>
                      </View>
                      <View style={styles.credActionsRow}>
                        <Pressable
                          onPress={() => setShowPassword(!showPassword)}
                          style={({ pressed }) => [styles.credCopyBtn, pressed && styles.pressed]}
                        >
                          <Icon name={showPassword ? 'eye-off' : 'eye'} size={14} color={colors.white} />
                        </Pressable>
                        <Pressable
                          onPress={() =>
                            handleCopy(selectedSchool.admin_password || 'Test@123', 'password')
                          }
                          style={({ pressed }) => [styles.credCopyBtn, pressed && styles.pressed]}
                        >
                          <Icon
                            name={copiedKey === 'password' ? 'check' : 'copy'}
                            size={14}
                            color={colors.white}
                          />
                        </Pressable>
                      </View>
                    </View>
                  </View>

                  {/* Login as Admin button */}
                  <Pressable
                    onPress={() => handleLoginAsAdmin(selectedSchool.school_id)}
                    style={({ pressed }) => [styles.btnLoginAdmin, pressed && styles.pressed]}
                  >
                    <Icon name="logout" size={16} color={colors.white} />
                    <Text style={styles.btnLoginAdminText}>Login as Admin for this Campus</Text>
                  </Pressable>
                </View>

                {/* Class Breakdown if any */}
                {selectedSchool.classes_breakdown && selectedSchool.classes_breakdown.length > 0 ? (
                  <View style={styles.breakdownSection}>
                    <Text style={styles.breakdownTitle}>Class Breakdown</Text>
                    <View style={styles.breakdownList}>
                      {selectedSchool.classes_breakdown.map((c, i) => (
                        <View key={c.class_id || i} style={styles.breakdownRow}>
                          <Text style={styles.breakdownClassName}>
                            {c.name} {c.section ? `(${c.section})` : ''}
                          </Text>
                          <Text style={styles.breakdownStudentCount}>
                            {c.student_count || 0} students
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ) : null}

                <View style={styles.modalCloseWrap}>
                  <Button
                    label="Close"
                    variant="secondary"
                    onPress={() => setSelectedSchool(null)}
                    fullWidth
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      ) : null}

      {/* Onboard Campus Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={onboardModalVisible}
        onRequestClose={() => {
          setOnboardModalVisible(false);
          resetForm();
        }}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Onboard Campus</Text>
              <Pressable
                onPress={() => {
                  setOnboardModalVisible(false);
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
                    setOnboardModalVisible(false);
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
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    ...typography.bodySm,
    color: colors.gray500,
    fontWeight: '600',
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
    borderRadius: radius.xl2,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
    paddingBottom: spacing.xs,
  },
  cardTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  cardTitle: {
    ...typography.bodyLg,
    color: colors.gray900,
    fontWeight: '800',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
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
    fontSize: 10,
  },
  badgeTextActive: {
    color: colors.success,
  },
  badgeTextInactive: {
    color: colors.gray500,
  },
  details: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailLabel: {
    ...typography.caption,
    color: colors.gray400,
    fontWeight: '700',
    width: 80,
  },
  detailValue: {
    ...typography.bodySm,
    color: colors.gray700,
    fontWeight: '600',
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.xs,
    backgroundColor: colors.gray50,
    borderRadius: radius.lg,
    padding: spacing.sm,
    marginVertical: 4,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    ...typography.caption,
    color: colors.gray500,
    fontWeight: '700',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  statNumber: {
    ...typography.bodyLg,
    color: colors.gray900,
    fontWeight: '900',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
    paddingTop: spacing.sm,
  },
  btnDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.md,
  },
  btnDetailsText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '800',
  },
  activeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeLabelText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: '800',
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
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
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
    ...typography.h2,
    color: colors.gray900,
    fontWeight: '800',
  },
  modalSub: {
    ...typography.caption,
    color: colors.gray500,
    marginTop: 2,
  },
  boldText: {
    fontWeight: '800',
    color: colors.gray800,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScroll: {
    padding: spacing.md,
  },
  modalStatsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  modalStatTile: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  modalStatTileLabel: {
    ...typography.caption,
    fontWeight: '800',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  modalStatTileVal: {
    ...typography.h2,
    color: colors.gray900,
    fontWeight: '900',
    marginTop: 2,
  },
  credentialsCard: {
    backgroundColor: '#0f172a',
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  credHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  credIconBox: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  credHeaderText: {
    flex: 1,
  },
  credTitle: {
    ...typography.bodySm,
    color: colors.white,
    fontWeight: '800',
  },
  credSubtitle: {
    ...typography.caption,
    color: '#94a3b8',
    fontSize: 10,
  },
  credRows: {
    gap: 8,
  },
  credRow: {
    backgroundColor: '#1e293b',
    padding: 10,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  credRowText: {
    flex: 1,
  },
  credRowLabel: {
    ...typography.caption,
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
  },
  credRowVal: {
    ...typography.bodySm,
    color: colors.white,
    fontWeight: '700',
    marginTop: 2,
  },
  credPass: {
    color: '#34d399',
    fontFamily: 'monospace',
  },
  credActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  credCopyBtn: {
    backgroundColor: '#334155',
    padding: 6,
    borderRadius: radius.sm,
  },
  btnLoginAdmin: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: radius.md,
    marginTop: 4,
  },
  btnLoginAdminText: {
    ...typography.bodySm,
    color: colors.white,
    fontWeight: '800',
  },
  breakdownSection: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  breakdownTitle: {
    ...typography.bodySm,
    color: colors.gray900,
    fontWeight: '800',
    marginBottom: 6,
  },
  breakdownList: {
    backgroundColor: colors.gray50,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gray200,
    overflow: 'hidden',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  breakdownClassName: {
    ...typography.bodySm,
    color: colors.gray900,
    fontWeight: '700',
  },
  breakdownStudentCount: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  modalCloseWrap: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
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
