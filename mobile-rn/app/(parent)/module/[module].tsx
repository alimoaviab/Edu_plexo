/**
 * Parent portal module route — drives the generic CRUD/read engine with the
 * parent registry, injecting the selected child's `{ student_id, class_id }`
 * as scope so every parent module is automatically scoped to that child.
 */
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { AdminModuleScreen } from '@/modules/admin/AdminModuleScreen';
import { PARENT_MODULE_BY_KEY } from '@/modules/parent/config';
import { fetchParentChildren } from '@/modules/dashboard/api';
import { useSelectedChild } from '@/store/selected-child-store';

export default function ParentModuleRoute() {
  const studentId = useSelectedChild((s) => s.studentId);
  const child = useSelectedChild((s) => s.child);
  const hydrated = useSelectedChild((s) => s.hydrated);
  const hydrate = useSelectedChild((s) => s.hydrate);
  const setChildren = useSelectedChild((s) => s.setChildren);

  useEffect(() => {
    if (!hydrated) void hydrate();
  }, [hydrated, hydrate]);

  // Ensure the child list (and thus class_id) is loaded even on deep links.
  const childrenQuery = useQuery({ queryKey: ['parent-children'], queryFn: fetchParentChildren });
  useEffect(() => {
    if (childrenQuery.data && childrenQuery.data.length > 0) setChildren(childrenQuery.data);
  }, [childrenQuery.data, setChildren]);

  const scope = { student_id: studentId, class_id: child?.class_id };

  return <AdminModuleScreen registry={PARENT_MODULE_BY_KEY} scope={scope} />;
}
