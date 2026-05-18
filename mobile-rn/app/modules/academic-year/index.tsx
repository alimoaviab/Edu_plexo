import { Alert, FlatList, RefreshControl, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ErrorState, EmptyState, LoadingBlock } from '@/components/ui/EmptyState';
import { ListItemCard } from '@/components/ui/ListItemCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useAcademicYears, useSwitchAcademicYear, useTenant } from '@/hooks';
import { colors, spacing } from '@/theme/tokens';
import { formatDate } from '@/utils/format';

export default function AcademicYearScreen() {
  const { academicYearId } = useTenant();
  const yearsQ = useAcademicYears();
  const switchYear = useSwitchAcademicYear();

  return (
    <ScreenContainer flush>
      <View style={{ paddingHorizontal: spacing.base }}>
        <SectionHeader title="Academic Year" subtitle="Switch the active year for the workspace" />
      </View>
      {yearsQ.isLoading && !yearsQ.items.length ? (
        <LoadingBlock />
      ) : yearsQ.error ? (
        <ErrorState message={yearsQ.error.message} onRetry={() => yearsQ.refetch()} />
      ) : yearsQ.items.length === 0 ? (
        <EmptyState icon="calendar" title="No academic years" />
      ) : (
        <FlatList
          data={yearsQ.items}
          keyExtractor={(y) => y._id ?? y.id ?? y.year}
          contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xl3 }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          refreshControl={
            <RefreshControl
              refreshing={yearsQ.isFetching && !yearsQ.isLoading}
              onRefresh={() => yearsQ.refetch()}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item }) => {
            const id = item._id ?? item.id ?? '';
            const isActive = id === academicYearId;
            return (
              <ListItemCard
                title={item.year}
                subtitle={item.description ?? ''}
                meta={`${formatDate(item.start_date)} → ${formatDate(item.end_date)}`}
                icon="calendar"
                badge={
                  isActive
                    ? { label: 'Active', tone: 'success' }
                    : item.is_active
                      ? { label: 'Server active', tone: 'info' }
                      : undefined
                }
                onPress={() =>
                  Alert.alert(
                    'Switch academic year',
                    `Make ${item.year} the active year for this session?`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Switch',
                        onPress: async () => {
                          try {
                            await switchYear.mutateAsync(id);
                            Alert.alert('Switched', `Active year is now ${item.year}.`);
                          } catch (err) {
                            Alert.alert('Error', (err as Error).message);
                          }
                        },
                      },
                    ],
                  )
                }
              />
            );
          }}
        />
      )}
    </ScreenContainer>
  );
}
