// SelectedIdsPage.tsx

import { FC, useEffect } from 'react';
import { useRouter } from 'next/router';

interface SelectedIdsPageProps {
  selectedReports: string[];
}

const SelectedIdsPage: FC<SelectedIdsPageProps> = ({ selectedReports }) => {
  const router = useRouter();
  const { selectedIds } = router.query;

  useEffect(() => {
    if (Array.isArray(selectedIds)) {
      const ids = selectedIds.join(', ');
      console.log(ids); // แสดงผลลัพธ์ทั้งหมด
    }
  }, [selectedIds]);

  return (
    <div>
      <h1>Selected IDs</h1>
      <p>IDs: {Array.isArray(selectedIds) ? selectedIds.join(', ') : 'No IDs selected'}</p>
      <button onClick={() => router.back()}>Back</button>
    </div>
  );
};

export default SelectedIdsPage;
