import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import type { ModulePackage } from '@/modules/subscription/types';
import { useSubscription } from '@/modules/subscription/useSubscription';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';

const MODULE_NAMES: Record<string, string> = {
  'academic-years': 'Academic Years Setup',
  classes: 'Classes Setup',
  teachers: 'Teachers Directory',
  students: 'Students Directory',
  subjects: 'Subjects Configuration',
  homework: 'Homework & Assignments',
  exams: 'Exam Management',
  tests: 'Class Tests',
  results: 'Results & Marksheets',
  'question-papers': 'Question Papers Generator',
  'question-bank': 'Question Bank Repository',
  'academic-analytics': 'Academic Analytics',
  attendance: 'Attendance Tracking',
  leave: 'Leave Management',
  timetable: 'Timetable Scheduler',
  behavior: 'Behavior Tracking & Incident Reports',
  fee: 'Fee & Invoicing Collection',
  announcements: 'School Announcements & Noticeboards',
  conversations: 'Instant Conversations & Chat',
  'live-classes': 'Live Classes Integration',
  certificates: 'Student Certificate Generator',
  templates: 'Template Designer',
  schedule: 'Event Calendar Schedules',
};

const DEFAULT_PACKAGES: ModulePackage[] = [
  {
    id: 'pkg_core',
    name: 'Core Administration (Required)',
    rate: 10,
    mandatory: true,
    modules: ['academic-years', 'classes', 'teachers', 'students', 'subjects', 'attendance'],
  },
  {
    id: 'pkg_academic',
    name: 'Academic & Assessment Suite',
    rate: 15,
    mandatory: false,
    modules: ['homework', 'exams', 'tests', 'results', 'question-papers', 'academic-analytics'],
  },
  {
    id: 'pkg_finance',
    name: 'Fee Collection & Finance',
    rate: 12,
    mandatory: false,
    modules: ['fee'],
  },
  {
    id: 'pkg_operations',
    name: 'School Operations & Comms',
    rate: 8,
    mandatory: false,
    modules: ['announcements', 'conversations', 'leave', 'timetable', 'behavior', 'certificates', 'live-classes'],
  },
];

export default function CustomPlanBuilderScreen() {
  const router = useRouter();
  const { current, updatePackages, isSavingPackages } = useSubscription();

  const [availablePackages, setAvailablePackages] = useState<ModulePackage[]>(DEFAULT_PACKAGES);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [studentLimit, setStudentLimit] = useState<number>(100);

  useEffect(() => {
    if (current?.available_packages && current.available_packages.length > 0) {
      setAvailablePackages(current.available_packages);
    }
    if (current?.selected_packages && current.selected_packages.length > 0) {
      setSelectedItems(current.selected_packages);
    } else {
      // Select core by default
      const coreIds: string[] = ['pkg_core', 'academic-years', 'classes', 'teachers', 'students', 'subjects', 'attendance'];
      setSelectedItems(coreIds);
    }
    if (current?.students_limit && current.students_limit > 0) {
      setStudentLimit(current.students_limit);
    }
  }, [current]);

  const handleToggleModule = (pkgId: string, moduleId: string, mandatory: boolean) => {
    if (mandatory) return;
    setSelectedItems((prev) => {
      let next = [...prev];
      if (next.includes(moduleId)) {
        next = next.filter((x) => x !== moduleId && x !== pkgId);
      } else {
        next.push(moduleId);
        const pkg = availablePackages.find((p) => p.id === pkgId);
        if (pkg) {
          const allChecked = pkg.modules.every((m) => next.includes(m));
          if (allChecked && !next.includes(pkgId)) {
            next.push(pkgId);
          }
        }
      }
      return next;
    });
  };

  const handleTogglePackage = (pkgId: string, mandatory: boolean) => {
    if (mandatory) return;
    const pkg = availablePackages.find((p) => p.id === pkgId);
    if (!pkg) return;

    setSelectedItems((prev) => {
      let next = [...prev];
      const isSelected = next.includes(pkgId);
      if (isSelected) {
        next = next.filter((x) => x !== pkgId && !pkg.modules.includes(x));
      } else {
        if (!next.includes(pkgId)) next.push(pkgId);
        pkg.modules.forEach((m) => {
          if (!next.includes(m)) next.push(m);
        });
      }
      return next;
    });
  };

  const totalRateForDisplay = useMemo(() => {
    if (!availablePackages.length) return 0;
    let totalRate = 0;
    availablePackages.forEach((pkg) => {
      if (pkg.mandatory) {
        totalRate += pkg.rate;
        return;
      }
      let pkgSelectedRate = 0;
      pkg.modules.forEach((m) => {
        if (selectedItems.includes(m)) {
          const rate = m === 'fee' ? 4 : 2;
          pkgSelectedRate += rate;
        }
      });
      if (pkgSelectedRate > pkg.rate) {
        pkgSelectedRate = pkg.rate;
      }
      totalRate += pkgSelectedRate;
    });
    return totalRate;
  }, [availablePackages, selectedItems]);

  const isAllSelected = useMemo(() => {
    if (!availablePackages.length) return false;
    return availablePackages.every((pkg) =>
      pkg.modules.every((m) => selectedItems.includes(m)),
    );
  }, [availablePackages, selectedItems]);

  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      const mandatoryIds: string[] = [];
      availablePackages.forEach((pkg) => {
        if (pkg.mandatory) {
          if (!mandatoryIds.includes(pkg.id)) mandatoryIds.push(pkg.id);
          pkg.modules.forEach((m) => {
            if (!mandatoryIds.includes(m)) mandatoryIds.push(m);
          });
        }
      });
      setSelectedItems(mandatoryIds);
    } else {
      const allIds: string[] = [];
      availablePackages.forEach((pkg) => {
        if (!allIds.includes(pkg.id)) allIds.push(pkg.id);
        pkg.modules.forEach((m) => {
          if (!allIds.includes(m)) allIds.push(m);
        });
      });
      setSelectedItems(allIds);
    }
  };

  const estimatedCost = useMemo(() => {
    const cost = studentLimit * totalRateForDisplay;
    return cost < 500 ? 500 : cost;
  }, [studentLimit, totalRateForDisplay]);

  const handleSavePlan = async () => {
    const success = await updatePackages(selectedItems, studentLimit);
    if (success) {
      Alert.alert('Custom Plan Saved!', 'Your customized package plan has been activated successfully.', [
        { text: 'OK', onPress: () => router.replace('/(owner)/subscription' as never) },
      ]);
    } else {
      Alert.alert('Error', 'Failed to save custom plan. Please try again.');
    }
  };

  return (
    <ScreenContainer flush>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.padded}>
          <Header
            showBack
            greeting="Owner Portal"
            title="Build Your Own Plan"
            subtitle="Customize features and modules tailored to your school campuses"
          />

          {/* Pricing & Limit Config Box */}
          <LinearGradient
            colors={['#1E40AF', '#3730A3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.costCard, shadows.card]}
          >
            <View style={styles.costHeader}>
              <Text style={styles.costSub}>ESTIMATED MONTHLY COST</Text>
              <View style={styles.costPriceRow}>
                <Text style={styles.costPrice}>PKR {estimatedCost.toLocaleString()}</Text>
                <Text style={styles.costUnit}>/ month</Text>
              </View>
              <Text style={styles.perStudentText}>
                Rate: PKR {totalRateForDisplay} per student limit
              </Text>
            </View>

            <View style={styles.limitControls}>
              <Text style={styles.limitLabel}>Expected Student Capacity:</Text>
              <View style={styles.limitInputRow}>
                <TextInput
                  style={styles.limitInput}
                  keyboardType="numeric"
                  value={String(studentLimit)}
                  onChangeText={(val) => {
                    const parsed = parseInt(val, 10);
                    setStudentLimit(isNaN(parsed) || parsed < 1 ? 1 : parsed);
                  }}
                />
                <View style={styles.presetsWrap}>
                  {[100, 250, 500, 1000].map((preset) => (
                    <Pressable
                      key={preset}
                      onPress={() => setStudentLimit(preset)}
                      style={[
                        styles.presetBtn,
                        studentLimit === preset && styles.presetBtnActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.presetText,
                          studentLimit === preset && styles.presetTextActive,
                        ]}
                      >
                        {preset}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          </LinearGradient>

          {/* Select All Row */}
          <View style={styles.selectAllRow}>
            <Text style={styles.modulesHeaderTitle}>Select Feature Modules</Text>
            <Pressable
              onPress={handleSelectAllToggle}
              style={({ pressed }) => [styles.selectAllBtn, pressed && styles.pressed]}
            >
              <Icon
                name={isAllSelected ? 'check-square' : 'square'}
                size={16}
                color={colors.primary}
              />
              <Text style={styles.selectAllText}>
                {isAllSelected ? 'Deselect All' : 'Select All'}
              </Text>
            </Pressable>
          </View>

          {/* Packages List */}
          <View style={styles.packagesList}>
            {availablePackages.map((pkg) => {
              const isPkgChecked = selectedItems.includes(pkg.id) || pkg.mandatory;
              return (
                <View key={pkg.id} style={[styles.pkgCard, shadows.card]}>
                  <Pressable
                    onPress={() => handleTogglePackage(pkg.id, pkg.mandatory)}
                    style={styles.pkgHeader}
                    disabled={pkg.mandatory}
                  >
                    <View style={styles.pkgHeaderLeft}>
                      <Icon
                        name={isPkgChecked ? 'check-square' : 'square'}
                        size={20}
                        color={pkg.mandatory ? colors.gray400 : isPkgChecked ? colors.primary : colors.gray400}
                      />
                      <Text style={styles.pkgName}>{pkg.name}</Text>
                    </View>
                    {pkg.mandatory ? (
                      <View style={styles.mandatoryBadge}>
                        <Text style={styles.mandatoryBadgeText}>INCLUDED</Text>
                      </View>
                    ) : null}
                  </Pressable>

                  {/* Modules grid */}
                  <View style={styles.modulesGrid}>
                    {pkg.modules.map((m) => {
                      const isModChecked = selectedItems.includes(m) || pkg.mandatory;
                      return (
                        <Pressable
                          key={m}
                          onPress={() => handleToggleModule(pkg.id, m, pkg.mandatory)}
                          disabled={pkg.mandatory}
                          style={({ pressed }) => [
                            styles.moduleChip,
                            isModChecked ? styles.moduleChipActive : styles.moduleChipInactive,
                            pressed && styles.pressed,
                          ]}
                        >
                          <Icon
                            name={isModChecked ? 'check' : 'plus'}
                            size={12}
                            color={isModChecked ? colors.primary : colors.gray400}
                          />
                          <Text
                            style={[
                              styles.moduleChipText,
                              isModChecked ? styles.moduleChipTextActive : styles.moduleChipTextInactive,
                            ]}
                          >
                            {MODULE_NAMES[m] || m}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>

          {/* Save Button */}
          <View style={styles.actionWrap}>
            <Button
              label={isSavingPackages ? 'Activating Plan…' : 'Subscribe & Continue'}
              loading={isSavingPackages}
              onPress={handleSavePlan}
              iconRight={<Icon name="arrow-right" size={16} color={colors.white} />}
              fullWidth
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: spacing.xl3,
  },
  padded: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xl,
  },
  costCard: {
    borderRadius: radius.xl2,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  costHeader: {
    alignItems: 'center',
    gap: 4,
  },
  costSub: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  costPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  costPrice: {
    ...typography.h1,
    color: colors.white,
    fontWeight: '900',
    fontSize: 30,
  },
  costUnit: {
    ...typography.bodySm,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  perStudentText: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
  limitControls: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: radius.lg,
    padding: spacing.sm,
    gap: 8,
  },
  limitLabel: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '700',
  },
  limitInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  limitInput: {
    width: 80,
    height: 38,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingHorizontal: 10,
    ...typography.bodySm,
    color: colors.gray900,
    fontWeight: '800',
    textAlign: 'center',
  },
  presetsWrap: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
  },
  presetBtn: {
    flex: 1,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetBtnActive: {
    backgroundColor: colors.white,
  },
  presetText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '800',
  },
  presetTextActive: {
    color: colors.primary,
  },
  selectAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.sm,
  },
  modulesHeaderTitle: {
    ...typography.h3,
    color: colors.gray900,
    fontWeight: '800',
  },
  selectAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
  },
  selectAllText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '800',
  },
  packagesList: {
    gap: spacing.md,
  },
  pkgCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
  },
  pkgHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  pkgHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pkgName: {
    ...typography.bodySm,
    color: colors.gray900,
    fontWeight: '800',
    flex: 1,
  },
  mandatoryBadge: {
    backgroundColor: colors.gray100,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  mandatoryBadgeText: {
    ...typography.caption,
    color: colors.gray600,
    fontWeight: '800',
    fontSize: 9,
  },
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  moduleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  moduleChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: '#93C5FD',
  },
  moduleChipInactive: {
    backgroundColor: colors.gray50,
    borderColor: colors.gray200,
  },
  moduleChipText: {
    ...typography.caption,
    fontWeight: '700',
  },
  moduleChipTextActive: {
    color: colors.primary,
  },
  moduleChipTextInactive: {
    color: colors.gray600,
  },
  actionWrap: {
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  pressed: {
    opacity: 0.8,
  },
});
