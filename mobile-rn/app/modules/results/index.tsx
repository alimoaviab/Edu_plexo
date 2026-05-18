import { useMemo, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ErrorState, EmptyState, LoadingBlock } from '@/components/ui/EmptyState';
import { ListItemCard } from '@/components/ui/ListItemCard';
import { Picker } from '@/components/ui/Picker';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useExams, useResults, useTenant } from '@/hooks';
import { colors, spacing } from '@/theme/tokens';
import { formatDate } from '@/utils/format';

export default function ResultsList() {
  const { role, studentId } = useTenant();
  const examsQ = useExams();

  const [examId, setExamId] = useState('');

  const examOptions = useMemo(
    () => (examsQ.items ?? []).map((e) => ({ label: e.name, value: e._id ?? e.id ?? '' })),
    [examsQ.items],
  );

  const results = useResults({
    exam_id: examId || undefined,
    student_id: role === 'student' || role === 'parent' ? studentId : undefined,
  });
  const items = results.items ?? [];

  return (
    <ScreenContainer flush>
      <View style={{ paddingHorizontal: spacing.base }}>
        <SectionHeader title="Results" subtitle={`${items.length} record${items.length === 1 ? '' : 's'}`} />
        <Picker
          label="Filter by exam"
          value={examId}
          onChange={setExamId}
          placeholder="All exams"
          options={examOptions}
          clearable
        />
      </View>
      {results.isError ? (
        <ErrorState message={results.error?.message ?? 'Failed.'} onRetry={() => results.refetch()} />
      ) : results.isLoading && !results.items ? (
        <LoadingBlock />
      ) : items.length === 0 ? (
        <EmptyState icon="star" title="No results" description="Results will appear after grading." />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(r, i) => r._id ?? r.id ?? String(i)}
          contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.xl3 }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          refreshControl={<RefreshControl refreshing={results.isFetching && !results.isLoading} onRefresh={() => results.refetch()} tintColor={colors.primary} />}
          renderItem={({ item }) => (
            <ListItemCard
              title={`${item.marks_obtained ?? '—'} / ${item.total_marks ?? '—'}`}
              subtitle={item.grade ? `Grade ${item.grade}` : item.remarks}
              meta={formatDate(item.created_at)}
              icon="star"
            />
          )}
        />
      )}
    </ScreenContainer>
  );
}
