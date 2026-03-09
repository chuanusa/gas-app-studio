/**
 * 匯出資料為 CSV 檔案（UTF-8 BOM 確保中文正常顯示）
 */
export function exportToCSV(data: Record<string, string>[], filename: string) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers.map(h => {
        const val = row[h] ?? '';
        // Escape quotes and wrap in quotes if contains comma/newline
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',')
    ),
  ];

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvRows.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
