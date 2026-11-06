/**
 * Utility for exporting data to CSV with UTF-8 BOM encoding for Brazilian Portuguese Excel compatibility.
 */
export function exportToCSV<T extends Record<string, unknown>>(
  filename: string,
  rows: T[],
  columnHeaders?: { key: keyof T; label: string }[]
) {
  if (!rows || rows.length === 0) {
    alert('Nenhum dado disponível para exportação com os filtros atuais.');
    return;
  }

  const keys = columnHeaders ? columnHeaders.map((c) => c.key) : (Object.keys(rows[0]) as (keyof T)[]);
  const headers = columnHeaders ? columnHeaders.map((c) => c.label) : (keys as string[]);

  const escapeCSV = (value: unknown): string => {
    if (value === null || value === undefined) return '""';
    let str = String(value);
    // Format booleans nicely
    if (typeof value === 'boolean') {
      str = value ? 'Sim' : 'Não';
    }
    // Format arrays
    if (Array.isArray(value)) {
      str = value.join(', ');
    }
    // Escape internal quotes
    str = str.replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvRows: string[] = [];
  csvRows.push(headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(';'));

  for (const row of rows) {
    const line = keys.map((key) => escapeCSV(row[key])).join(';');
    csvRows.push(line);
  }

  // Prepend \uFEFF BOM for Excel UTF-8 recognition
  const csvContent = '\uFEFF' + csvRows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().substring(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
