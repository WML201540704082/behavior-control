
import ExcelJS from 'exceljs'

/**
 * 导出数据
 * @param dataList
 * @param columnObjects
 */
export const exportData = (dataList, columnObjects, downloadName) => {
  // 获取 roomAcXlsx 的键顺序
  const headerKeys = Object.keys(columnObjects);
  // 过滤数据，只保留 roomAcXlsx 中存在的字段，并按照 roomAcXlsx 的顺序排列
  const filteredData = dataList.map(item => {
    const filteredItem = {}
    headerKeys.forEach(key => {
      if (item.hasOwnProperty(key)) {
        filteredItem[key] = item[key]
      }
    })
    return filteredItem
  })
  // 创建工作簿和工作表
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Sheet1')
  // 添加表头
  const headers = headerKeys.map(key => columnObjects[key])
  worksheet.addRow(headers)
  // 添加数据行
  filteredData.forEach(row => {
    worksheet.addRow(Object.values(row))
  })
  // 设置表头样式
  const headerRow = worksheet.getRow(1)
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFDDDDDD'}
    }
    cell.font = {
      bold: true,
      color: {argb: 'FF000000'}
    }
    cell.border = {
      top: {style: 'thin'},
      left: {style: 'thin'},
      bottom: {style: 'thin'},
      right: {style: 'thin'}
    }
    cell.alignment = {horizontal: 'center', vertical: 'middle'}
  })

  // 设置数据行样式
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) { // 跳过表头行
      row.eachCell((cell) => {
        cell.border = {
          top: {style: 'thin'},
          left: {style: 'thin'},
          bottom: {style: 'thin'},
          right: {style: 'thin'}
        }
        cell.alignment = {horizontal: 'center', vertical: 'middle'}
      })
    }
  })
  // 自动调整列宽
  worksheet.columns.forEach(column => {
    let maxLength = 0
    const MAX_COLUMN_WIDTH = 30; // 设置最大列宽为30（可根据需要调整）
    column.eachCell((cell) => {
      const columnLength = cell.value ? cell.value.toString().length : 10
      if (columnLength > maxLength) {
        maxLength = columnLength
      }
    })
    column.width = maxLength < 10 ? 10 : MAX_COLUMN_WIDTH
  })
  // 导出文件
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    // 设置文件名
    a.download = downloadName + '.xlsx'
    a.click()
    window.URL.revokeObjectURL(url)
  })
}

/**
 * 提交上传文件
 */
export const submitUpload = (fileList, columnObjects) => {
  const promises = fileList.map(file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result)
        const workbook = new ExcelJS.Workbook()
        workbook.xlsx.load(data).then(() => {
          const worksheet = workbook.getWorksheet(1)
          const rows = worksheet._rows
          // 获取表头
          const headers = rows[0].values
          const info = []
          for (let i = 1; i < rows.length; i++) {
            const row = rows[i]
            // 跳过无效行
            if (!row || !row.values) continue
            const rowData = {}
            headers.forEach((header, index) => {
              // 使用映射关系转换属性名
              rowData[columnObjects[header] || header] = row.values[index] || ''
            })
            info.push(rowData)
          }
          resolve(info)
        }).catch(reject)
      }
      reader.onerror = reject
      reader.readAsArrayBuffer(file.raw)
    })
  })

  return Promise.all(promises).then(dataArrays => {
    return dataArrays.flat()
  })
}
