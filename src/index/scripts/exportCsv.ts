export function exportCsv(tableBody: HTMLTableSectionElement) {
    const rows = tableBody.querySelectorAll('tr');
    const csvData = ['ノーツ数,simai書式,判定誤差(f)']; // ヘッダー

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length === 3 && cells[0].textContent !== '--') {
            const noteCount = cells[0].textContent || '';
            const simaiFormat = `"${cells[1].textContent?.replace(/"/g, '""') || ''}"`;
            const timingError = cells[2].textContent?.replace(" ", '').replace(/\+/g, '') || '';
            
            const rowData = `${noteCount},${simaiFormat},${timingError}`;
            csvData.push(rowData);
        }
    });

    if (csvData.length > 1) {
        const csvContent = csvData.join('\n');
        // UTF-8 BOMを追加してExcel/スプレッドシートでの文字化けと列分離を改善
        const bom = '\uFEFF';
        const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        const timestamp = new Date().getTime();
        link.setAttribute('download', `answer-shift-${timestamp}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}