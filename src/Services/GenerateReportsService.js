import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

const formatDate = (dateInput) => {
    if (!dateInput) return '';
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = String(d.getDate()).padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
};

const formatDateTime = (dateInput) => {
    if (!dateInput) return '';
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    const dateStr = formatDate(d);
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const hoursStr = String(hours).padStart(2, '0');
    return `${dateStr} ${hoursStr}:${minutes} ${ampm}`;
};

const generateIncidentReportExcelService = async (reportData = [], options = {}) => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'ShiftMatch';
    workbook.lastModifiedBy = 'ShiftMatch System';
    workbook.created = new Date();
    workbook.properties.readOnlyRecommended = true; // Flag Read-Only mode on file open

    const worksheet = workbook.addWorksheet('Incident Report', {
        views: [{ showGridLines: true }]
    });

    // 1. Define Major and Minor Categories
    const defaultMajorCategories = [
        'Arson and Attempted Murder',
        'Patient Assault (Physical, Sexual, or Verbal)',
        'Arriving at Work Drunk',
        'Misuse of Medication',
        'Patient Left Unattended',
        'Neglect to or Delay in Obtaining Medical Assistance for a Patient',
        'Failure to Give the Required Treatment to a Patient',
        'Theft from a Patient (or a Deceased Person)'
    ];

    const defaultMinorCategories = [
        'Failure to Keep Accurate and Complete Records of all Nursing Care Provided to a Patient',
        'Giving Confidential Information About a Patient to Unauthorised Persons',
        'Forcing a Patient to Sign a Consent for a Surgical Procedure',
        'Failure to Prevent Injury or Accident to a Patient'
    ];

    const majorCategories = options.majorCategories || defaultMajorCategories;
    const minorCategories = options.minorCategories || defaultMinorCategories;

    const totalMajorCols = majorCategories.length;
    const totalMinorCols = minorCategories.length;
    const allCategories = [...majorCategories, ...minorCategories];
    const totalCols = 1 + totalMajorCols + totalMinorCols + 1; // Hospital Name + Major + Minor + Total

    // 2. Row 1: Header Banner - SHIFTMATCH
    const row1 = worksheet.getRow(1);
    row1.height = 32;
    worksheet.mergeCells(1, 1, 1, totalCols);
    const titleCell = row1.getCell(1);
    titleCell.value = 'SHIFTMATCH';
    titleCell.font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' }, name: 'Arial' };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } }; // Navy Blue

    // 3. Row 2: Header Subtitle - Incident Report
    const row2 = worksheet.getRow(2);
    row2.height = 24;
    worksheet.mergeCells(2, 1, 2, totalCols);
    const subtitleCell = row2.getCell(1);
    subtitleCell.value = 'Incident Report';
    subtitleCell.font = { bold: true, size: 12, color: { argb: 'FFE2E8F0' }, name: 'Arial' };
    subtitleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    subtitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };

    // 4. Row 3: Spacer Row under Header
    const row3 = worksheet.getRow(3);
    row3.height = 8;
    worksheet.mergeCells(3, 1, 3, totalCols);
    row3.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };

    // 5. Add Company Logo if available
    const logoPath = options.logoPath || path.join(process.cwd(), 'src', 'assets', 'netcarelogo.jpeg');
    if (fs.existsSync(logoPath)) {
        try {
            const logoImage = workbook.addImage({
                filename: logoPath,
                extension: logoPath.endsWith('.png') ? 'png' : 'jpeg',
            });
            worksheet.addImage(logoImage, {
                tl: { col: 0.15, row: 0.15 },
                ext: { width: 110, height: 48 },
                editAs: 'absolute' // Fixed logo position
            });
        } catch (logoErr) {
            console.warn('Unable to attach logo to Excel report:', logoErr.message);
        }
    }

    // 6. Row 4: Metadata Bar (Report Period & Generated On)
    const row4 = worksheet.getRow(4);
    row4.height = 26;

    const startDateStr = options.startDate ? formatDate(options.startDate) : '01 Jul 2026';
    const endDateStr = options.endDate ? formatDate(options.endDate) : '31 Jul 2026';
    const periodText = `Report Period : ${startDateStr} - ${endDateStr}`;
    const generatedOnText = `Generated On : ${options.generatedOn ? (typeof options.generatedOn === 'string' ? options.generatedOn : formatDateTime(options.generatedOn)) : formatDateTime(new Date())}`;

    const midCol = Math.max(2, Math.floor(totalCols / 2));
    worksheet.mergeCells(4, 1, 4, midCol);
    worksheet.mergeCells(4, midCol + 1, 4, totalCols);

    const periodCell = row4.getCell(1);
    periodCell.value = periodText;
    periodCell.font = { bold: true, size: 9, color: { argb: 'FF1E293B' }, name: 'Arial' };
    periodCell.alignment = { vertical: 'middle', horizontal: 'left' };
    periodCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };

    const genCell = row4.getCell(midCol + 1);
    genCell.value = generatedOnText;
    genCell.font = { bold: true, size: 9, color: { argb: 'FF1E293B' }, name: 'Arial' };
    genCell.alignment = { vertical: 'middle', horizontal: 'right' };
    genCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };

    for (let c = 1; c <= totalCols; c++) {
        const cell = row4.getCell(c);
        cell.border = {
            top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
            bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } }
        };
    }

    // 7. Row 5: Spacer Row
    const row5 = worksheet.getRow(5);
    row5.height = 10;

    // 8. Row 6: Main Headers (Major Offences & Minor Offences)
    const row6 = worksheet.getRow(6);
    row6.height = 26;

    // Col 1: Hospital Name (Merged A6:A7)
    worksheet.mergeCells('A6:A7');
    const hospHdrCell = worksheet.getCell('A6');
    hospHdrCell.value = 'Hospital Name';
    hospHdrCell.font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' }, name: 'Arial' };
    hospHdrCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    hospHdrCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };

    // Major Offences Header (Merged B6 to I6)
    const majorStartCol = 2;
    const majorEndCol = 1 + totalMajorCols;
    worksheet.mergeCells(6, majorStartCol, 6, majorEndCol);
    const majorHdrCell = worksheet.getCell(6, majorStartCol);
    majorHdrCell.value = 'Major Offences';
    majorHdrCell.font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' }, name: 'Arial' };
    majorHdrCell.alignment = { vertical: 'middle', horizontal: 'center' };
    majorHdrCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF991B1B' } }; // Crimson Red

    // Minor Offences Header (Merged J6 to M6)
    const minorStartCol = majorEndCol + 1;
    const minorEndCol = majorEndCol + totalMinorCols;
    worksheet.mergeCells(6, minorStartCol, 6, minorEndCol);
    const minorHdrCell = worksheet.getCell(6, minorStartCol);
    minorHdrCell.value = 'Minor Offences';
    minorHdrCell.font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' }, name: 'Arial' };
    minorHdrCell.alignment = { vertical: 'middle', horizontal: 'center' };
    minorHdrCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD97706' } }; // Amber/Gold

    // Total Header (Merged N6:N7)
    const totalColNum = totalCols;
    worksheet.mergeCells(6, totalColNum, 7, totalColNum);
    const totalHdrCell = worksheet.getCell(6, totalColNum);
    totalHdrCell.value = 'Total';
    totalHdrCell.font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' }, name: 'Arial' };
    totalHdrCell.alignment = { vertical: 'middle', horizontal: 'center' };
    totalHdrCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };

    // Apply borders to Row 6 Main Headers
    for (let c = 1; c <= totalCols; c++) {
        const cell = row6.getCell(c);
        cell.border = {
            top: { style: 'medium', color: { argb: 'FF0F172A' } },
            bottom: { style: 'thin', color: { argb: 'FF0F172A' } },
            left: { style: 'thin', color: { argb: 'FF374151' } },
            right: { style: 'thin', color: { argb: 'FF374151' } }
        };
    }

    // 9. Row 7: Sub Headers (Sub Categories under Major and Minor)
    const row7 = worksheet.getRow(7);
    row7.height = 70;

    // Major Sub Headers (Cols 2..9)
    majorCategories.forEach((cat, idx) => {
        const colNum = majorStartCol + idx;
        const cell = row7.getCell(colNum);
        cell.value = cat;
        cell.font = { bold: true, size: 8, color: { argb: 'FFFFFFFF' }, name: 'Arial' };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF374151' } };
        cell.border = {
            top: { style: 'thin', color: { argb: 'FF0F172A' } },
            bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
            left: { style: 'thin', color: { argb: 'FF4B5563' } },
            right: { style: 'thin', color: { argb: 'FF4B5563' } }
        };
    });

    // Minor Sub Headers (Cols 10..13)
    minorCategories.forEach((cat, idx) => {
        const colNum = minorStartCol + idx;
        const cell = row7.getCell(colNum);
        cell.value = cat;
        cell.font = { bold: true, size: 8, color: { argb: 'FFFFFFFF' }, name: 'Arial' };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4B5563' } };
        cell.border = {
            top: { style: 'thin', color: { argb: 'FF0F172A' } },
            bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
            left: { style: 'thin', color: { argb: 'FF6B7280' } },
            right: { style: 'thin', color: { argb: 'FF6B7280' } }
        };
    });

    // Format bottom borders for Hospital Name (col 1) and Total (col totalCols) on Row 7
    const cellA7 = row7.getCell(1);
    cellA7.border = {
        top: { style: 'medium', color: { argb: 'FF0F172A' } },
        bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
        left: { style: 'medium', color: { argb: 'FF0F172A' } },
        right: { style: 'thin', color: { argb: 'FF374151' } }
    };
    const cellN7 = row7.getCell(totalColNum);
    cellN7.border = {
        top: { style: 'medium', color: { argb: 'FF0F172A' } },
        bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
        left: { style: 'thin', color: { argb: 'FF374151' } },
        right: { style: 'medium', color: { argb: 'FF0F172A' } }
    };

    // 10. Data Rows (Rows 8+)
    const colTotals = new Array(allCategories.length).fill(0);
    let grandTotal = 0;
    let currentRowNum = 8;

    reportData.forEach((item, rIdx) => {
        const row = worksheet.getRow(currentRowNum);
        row.height = 22;

        const hospitalName = item.hospitalName || item.hospital || item.facilityName || item.name || `Hospital ${rIdx + 1}`;
        const srcObj = item.incidents || item;

        let rowTotal = 0;
        const rowValues = [hospitalName];

        allCategories.forEach((cat, cIdx) => {
            const rawVal = srcObj[cat];
            const count = (rawVal !== undefined && rawVal !== null && !isNaN(Number(rawVal))) ? Number(rawVal) : 0;
            rowValues.push(count);
            rowTotal += count;
            colTotals[cIdx] += count;
        });

        rowValues.push(rowTotal);
        grandTotal += rowTotal;

        const isEven = rIdx % 2 === 0;
        const rowBgColor = isEven ? 'FFFFFFFF' : 'FFF8FAFC';

        rowValues.forEach((val, idx) => {
            const colNum = idx + 1;
            const cell = row.getCell(colNum);
            cell.value = val;
            cell.font = { size: 9, color: { argb: 'FF1E293B' }, name: 'Arial', bold: colNum === 1 };
            cell.alignment = {
                vertical: 'middle',
                horizontal: colNum === 1 ? 'left' : 'center'
            };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBgColor } };
            cell.border = {
                top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
            };

            if (colNum > 1 && typeof val === 'number') {
                cell.numFmt = '#,##0';
            }
        });

        currentRowNum++;
    });

    // 11. Summary / Total Footer Row
    const summaryRow = worksheet.getRow(currentRowNum);
    summaryRow.height = 26;

    const summaryValues = ['Total', ...colTotals, grandTotal];
    summaryValues.forEach((val, idx) => {
        const colNum = idx + 1;
        const cell = summaryRow.getCell(colNum);
        cell.value = val;
        cell.font = { bold: true, size: 10, color: { argb: 'FF0F172A' }, name: 'Arial' };
        cell.alignment = {
            vertical: 'middle',
            horizontal: colNum === 1 ? 'left' : 'center'
        };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
        cell.border = {
            top: { style: 'thin', color: { argb: 'FF94A3B8' } },
            bottom: { style: 'double', color: { argb: 'FF0F172A' } },
            left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
            right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
        };

        if (colNum > 1 && typeof val === 'number') {
            cell.numFmt = '#,##0';
        }
    });

    // 12. Column Width Adjustments & Lock Columns
    worksheet.getColumn(1).width = 28; // Hospital Name
    for (let c = 1; c <= totalCols; c++) {
        const col = worksheet.getColumn(c);
        if (c > 1 && c < totalCols) {
            col.width = 20; // Category columns width
        } else if (c === totalCols) {
            col.width = 12; // Total column width
        }
        col.protection = { locked: true };
    }

    // 13. Lock ALL rows and cells across the worksheet
    worksheet.eachRow({ includeEmpty: true }, (row) => {
        row.protection = { locked: true };
        row.eachCell({ includeEmpty: true }, (cell) => {
            cell.protection = {
                locked: true,
                hidden: false
            };
        });
    });

    // 14. Configure Worksheet Sheet Protection Object (Cross-platform MacOS & Windows enforcement)
    worksheet.sheetProtection = {
        sheet: true,
        objects: true,
        scenarios: true,
        selectLockedCells: true,
        selectUnlockedCells: true,
        formatCells: false,
        formatColumns: false,
        formatRows: false,
        insertColumns: false,
        insertRows: false,
        insertHyperlinks: false,
        deleteColumns: false,
        deleteRows: false,
        sort: false,
        autoFilter: false,
        pivotTables: false
    };

    // 15. Enforce Password Sheet Protection
    const protectPassword = options.protectionPassword || 'ShiftMatch@Protected2026';
    await worksheet.protect(protectPassword, {

        formatCells: false,
        formatColumns: false,
        formatRows: false,
        insertColumns: false,
        insertRows: false,
        insertHyperlinks: false,
        deleteColumns: false,
        deleteRows: false,
        sort: false,
        autoFilter: false,
        pivotTables: false
    });

    // 16. Return Workbook XLSX Buffer for Direct Client Download
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
};

export {
    generateIncidentReportExcelService
};
