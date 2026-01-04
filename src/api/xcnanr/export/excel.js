import * as XLSX from 'xlsx';

function auto_width(ws, data){
    /*set worksheet max width per col*/
    const colWidth = data.map(row => row.map(val => {
        /*if null/undefined*/
        if (val == null) {
            return {'wch': 10};
        }
        /*if chinese*/
        else if (val.toString().charCodeAt(0) > 255) {
            return {'wch': val.toString().length * 2};
        } else {
            return {'wch': val.toString().length};
        }
    }))
    /*start in the first row*/
    let result = colWidth[0];
    for (let i = 1; i < colWidth.length; i++) {
        for (let j = 0; j < colWidth[i].length; j++) {
            if (result[j]['wch'] < colWidth[i][j]['wch']) {
                result[j]['wch'] = colWidth[i][j]['wch'];
            }
        }
    }
    ws['!cols'] = result;
}

function json_to_array(key, jsonData){
    return jsonData.map(v => key.map(j => { return v[j] }));
}

// fix data,return string
function fixdata(data) {
    let o = ''
    let l = 0
    const w = 10240
    for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
    return o
}

// get head from excel file,return array
function get_header_row(sheet) {
    const headers = []
    const range = XLSX.utils.decode_range(sheet['!ref'])
    let C
    const R = range.s.r /* start in the first row */
    for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        var cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })] /* find the cell in the first row */
        var hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
    }
    return headers
}

export const export_table_to_excel= (id, filename) => {
    const table = document.getElementById(id);
    const wb = XLSX.utils.table_to_book(table);
    XLSX.writeFile(wb, filename);
}

export const export_json_to_excel = ({data, key, title, filename, autoWidth}) => {
    const wb = XLSX.utils.book_new();
    data.unshift(title);
    const ws = XLSX.utils.json_to_sheet(data, {header: key, skipHeader: true});
    if(autoWidth){
        const arr = json_to_array(key, data);
        auto_width(ws, arr);
    }
    XLSX.utils.book_append_sheet(wb, ws, filename);
    XLSX.writeFile(wb, filename + '.xlsx');
}

export const export_array_to_excel = ({key, data, title, filename, autoWidth}) => {
  const wb = XLSX.utils.book_new();
    const arr = json_to_array(key, data);
    arr.unshift(title);
    const ws = XLSX.utils.aoa_to_sheet(arr);
    if(autoWidth){
        auto_width(ws, arr);
    }
    XLSX.utils.book_append_sheet(wb, ws, filename);
    XLSX.writeFile(wb, filename + '.xlsx');
}

 // export const export_array_to_excelMerged = ({key, data, title, filename, autoWidth}) => {
 //     const wb = XLSX.utils.book_new();
 //     const arr = json_to_array(key, data);
 //     arr.unshift(title);
 //     const ws = XLSX.utils.aoa_to_sheet(arr);
 //     let CurrIndex = [];
 //     let start = 0;
 //
 //     for (let i = 0; i < data.length; i++) {
 //         // 如果是最后一个元素或者当前的 faultId 与下一个元素不同
 //         if (i === data.length - 1 || data[i].faultId !== data[i + 1].faultId) {
 //             // 仅当 start 和 i 不同，表示 faultId 相同的元素至少有两个时，记录下标
 //             if (start !== i) {
 //                 CurrIndex.push({start: start, end: i});
 //             }
 //             start = i + 1; // 更新下一组的起始下标
 //         }
 //     }
 //     //记录需要合并的列
 //     const merage=[]
 //     for (let i = 0; i < CurrIndex.length; i++) {
 //         const arr0 = {
 //             s: {r: CurrIndex[i].start + 1, c: 0}, e: {r: CurrIndex[i].end + 1, c: 0}
 //         }
 //         const arr1 = {
 //             s: {r: CurrIndex[i].start + 1, c: 1}, e: {r: CurrIndex[i].end + 1, c: 1}
 //         }
 //         const arr2 = {
 //             s: {r: CurrIndex[i].start + 1, c: 2}, e: {r: CurrIndex[i].end + 1, c: 2}
 //         }
 //         const arr3 = {
 //             s: {r: CurrIndex[i].start + 1, c: 3}, e: {r: CurrIndex[i].end + 1, c: 3}
 //         }
 //         const arr4 = {
 //             s: {r: CurrIndex[i].start + 1, c: 4}, e: {r: CurrIndex[i].end + 1, c: 4}
 //         }
 //         const arr5 = {
 //             s: {r: CurrIndex[i].start + 1, c: 5}, e: {r: CurrIndex[i].end + 1, c: 5}
 //         }
 //         const arr6 = {
 //             s: {r: CurrIndex[i].start + 1, c: 6}, e: {r: CurrIndex[i].end + 1, c: 6}
 //         }
 //         const arr7 = {
 //             s: {r: CurrIndex[i].start + 1, c: 7}, e: {r: CurrIndex[i].end + 1, c: 7}
 //         }
 //         const arr8 = {
 //             s: {r: CurrIndex[i].start + 1, c: 8}, e: {r: CurrIndex[i].end + 1, c: 8}
 //         }
 //         const arr9 = {
 //             s: {r: CurrIndex[i].start + 1, c: 9}, e: {r: CurrIndex[i].end + 1, c: 9}
 //         }
 //         const arr10 = {
 //             s: {r: CurrIndex[i].start + 1, c: 10}, e: {r: CurrIndex[i].end + 1, c: 10}
 //         }
 //         const arr11 = {
 //             s: {r: CurrIndex[i].start + 1, c: 11}, e: {r: CurrIndex[i].end + 1, c: 11}
 //         }
 //         const arr12 = {
 //             s: {r: CurrIndex[i].start + 1, c:12}, e: {r: CurrIndex[i].end + 1, c: 12}
 //         }
 //         const arr13 = {
 //             s: {r: CurrIndex[i].start + 1, c: 13}, e: {r: CurrIndex[i].end + 1, c: 13}
 //         }
 //         const arr14 = {
 //             s: {r: CurrIndex[i].start + 1, c: 14}, e: {r: CurrIndex[i].end + 1, c: 14}
 //         }
 //         const arr15 = {
 //             s: {r: CurrIndex[i].start + 1, c: 15}, e: {r: CurrIndex[i].end + 1, c: 15}
 //         }
 //         const arr16 = {
 //             s: {r: CurrIndex[i].start + 1, c: 16}, e: {r: CurrIndex[i].end + 1, c: 16}
 //         }
 //         const arr17 = {
 //             s: {r: CurrIndex[i].start + 1, c: 17}, e: {r: CurrIndex[i].end + 1, c: 17}
 //         }
 //         const arr18 = {
 //             s: {r: CurrIndex[i].start + 1, c: 18}, e: {r: CurrIndex[i].end + 1, c: 18}
 //         }
 //         merage.push(arr0);
 //         merage.push(arr1);
 //         merage.push(arr2);
 //         merage.push(arr3);
 //         merage.push(arr4);
 //         merage.push(arr5);
 //         merage.push(arr6);
 //         merage.push(arr7);
 //         merage.push(arr8);
 //         merage.push(arr9);
 //         merage.push(arr10);
 //         merage.push(arr11);
 //         merage.push(arr12);
 //         merage.push(arr13);
 //         merage.push(arr14);
 //         merage.push(arr15);
 //         merage.push(arr16);
 //         merage.push(arr17);
 //         merage.push(arr18);
 //     }
 //     ws['!merges']=merage;
 //         if (autoWidth) {
 //             auto_width(ws, arr);
 //         }
 //         XLSX.utils.book_append_sheet(wb, ws, filename);
 //         XLSX.writeFile(wb, filename + '.xlsx');
 // }
function setCellAlignment(ws, cellAddress) {
    if (!ws[cellAddress]) return;
    ws[cellAddress].s = {
        alignment: {
            horizontal: 'center',
            vertical: 'center'
        }
    };
}

// export const export_array_to_excelMerged = ({ key, data, title, filename, autoWidth }) => {
//     const wb = XLSX.utils.book_new();
//     const arr = json_to_array(key, data);
//     arr.unshift(title);
//     const ws = XLSX.utils.aoa_to_sheet(arr);
//     let CurrIndex = [];
//     let start = 0;
//
//     for (let i = 0; i < data.length; i++) {
//         if (i === data.length - 1 || data[i].faultId!== data[i + 1].faultId) {
//             if (start!== i) {
//                 CurrIndex.push({ start: start, end: i });
//             }
//             start = i + 1;
//         }
//     }
//
//     const mergeRanges = [];
//     for (let i = 0; i < CurrIndex.length; i++) {
//         for (let col = 0; col <= 18; col++) {
//             const range = {
//                 s: { r: CurrIndex[i].start + 1, c: col },
//                 e: { r: CurrIndex[i].end + 1, c: col }
//             };
//             mergeRanges.push(range);
//         }
//     }
//     ws['!merges'] = mergeRanges;
//
//     // 设置数据居中
//     for (let rowIndex = 0; rowIndex < ws['!ref'].split(':')[1][1]; rowIndex++) {
//         for (let colIndex = 0; colIndex < ws['!ref'].split(':')[1][0]; colIndex++) {
//             const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
//             setCellAlignment(ws, cellAddress);
//         }
//     }
//
//     if (autoWidth) {
//         auto_width(ws, arr);
//     }
//
//     XLSX.utils.book_append_sheet(wb, ws, filename);
//     XLSX.writeFile(wb, filename + '.xlsx');
// };
export const export_array_to_excelMerged = ({ key, data, title, filename, autoWidth }) => {
    const wb = XLSX.utils.book_new();
    const arr = json_to_array(key, data);
    arr.unshift(title);
    const ws = XLSX.utils.aoa_to_sheet(arr);
    let CurrIndex = [];
    let start = 0;

    // 找出需要合并的行范围
    for (let i = 0; i < data.length; i++) {
        if (i === data.length - 1 || data[i].faultId !== data[i + 1].faultId
        ||data[i].faultId ==null||data[i].faultId=='') {
            if (start !== i) {
                CurrIndex.push({ start: start, end: i });
            }
            start = i + 1;
        }
    }

    // 生成合并范围
    const mergeRanges = [];
    for (let i = 0; i < CurrIndex.length; i++) {
        for (let col = 0; col <= 18; col++) {
            const range = {
                s: { r: CurrIndex[i].start + 1, c: col }, // 开始行和列
                e: { r: CurrIndex[i].end + 1, c: col }    // 结束行和列
            };
            mergeRanges.push(range);
        }
    }
    ws['!merges'] = mergeRanges;

    // 设置所有单元格居中对齐
    const range = XLSX.utils.decode_range(ws['!ref']);  // 获取工作表的范围
    for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = { c: C, r: R }; // 获取单元格地址
            const cellRef = XLSX.utils.encode_cell(cellAddress); // 编码为Excel格式
            if (!ws[cellRef]) continue; // 如果该单元格不存在，跳过

            // 设置单元格的对齐属性，水平垂直居中
            ws[cellRef].s = {
                alignment: {
                    vertical: "center", // 垂直居中
                    horizontal: "center" // 水平居中
                }
            };
        }
    }

    // 自动设置列宽
    if (autoWidth) {
        auto_width(ws, arr);
    }

    // 将工作表添加到工作簿并保存
    XLSX.utils.book_append_sheet(wb, ws, filename);
    XLSX.writeFile(wb, filename + '.xlsx');
};

 export const export_array_to_excelMergedFa = ({ key, data, title, filename, autoWidth }) => {
    const wb = XLSX.utils.book_new();
    const arr = json_to_array(key, data);
    arr.unshift(title);
    const ws = XLSX.utils.aoa_to_sheet(arr);
    let CurrIndex = [];
    let start = 0;

    // 找出需要合并的行范围
    for (let i = 0; i < data.length; i++) {

        if (i === data.length - 1 || data[i].autoId !== data[i + 1].autoId
         ||data[i].autoId ==null||data[i].autoId==''
        ) {
            console.log("data[i].autoId---",data[i].autoId)
            if (start !== i) {
                CurrIndex.push({ start: start, end: i });
            }
            start = i + 1;
        }
    }

    // 生成合并范围
    const mergeRanges = [];
    for (let i = 0; i < CurrIndex.length; i++) {
        for (let col = 0; col <= 18; col++) {
            const range = {
                s: { r: CurrIndex[i].start + 1, c: col }, // 开始行和列
                e: { r: CurrIndex[i].end + 1, c: col }    // 结束行和列
            };
            mergeRanges.push(range);
        }
    }
    ws['!merges'] = mergeRanges;

    // 设置所有单元格居中对齐
    const range = XLSX.utils.decode_range(ws['!ref']);  // 获取工作表的范围
    for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = { c: C, r: R }; // 获取单元格地址
            const cellRef = XLSX.utils.encode_cell(cellAddress); // 编码为Excel格式
            if (!ws[cellRef]) continue; // 如果该单元格不存在，跳过

            // 设置单元格的对齐属性，水平垂直居中
            ws[cellRef].s = {
                alignment: {
                    vertical: "center", // 垂直居中
                    horizontal: "center" // 水平居中
                }
            };
        }
    }

    // 自动设置列宽
    if (autoWidth) {
        auto_width(ws, arr);
    }

    // 将工作表添加到工作簿并保存
    XLSX.utils.book_append_sheet(wb, ws, filename);
    XLSX.writeFile(wb, filename + '.xlsx');
};

export const read = (data, type) => {
    const workbook = XLSX.read(data, { type: type });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const header = get_header_row(worksheet);
    const results = XLSX.utils.sheet_to_json(worksheet);
    return {header, results};
}

export default {
  export_table_to_excel,
  export_array_to_excel,
  export_json_to_excel,
  read,
  export_array_to_excelMerged,
    export_array_to_excelMergedFa
}
