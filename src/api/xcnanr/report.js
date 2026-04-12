import request from '@/router/axios';
// 获取报告数据
export const getReportData = ({inspectionMonth,companyId,companyName,objectId,objectName}) => request({
    url: '/api/idevelop-xcnanr/xcnanr/infoInspectionStat/getInspectionStatReportData',
    method: 'get',
    params: {
        inspectionMonth: inspectionMonth,
        companyId: companyId,
        companyName: companyName,
        objectId: objectId,
        objectName: objectName

    }
})
// 生成报告文件
export const createReportFile = ({inspectionMonth,companyId,companyName,deptName,objectId,objectName,type}) => request({
    url: '/api/idevelop-xcnanr/xcnanr/infoInspectionStat/exportInspectionStatWord',
    method: 'get',
    params: {
        inspectionMonth: inspectionMonth,
        companyId: companyId,
        companyName: companyName,
        deptName: deptName,
        objectId: objectId,
        objectName: objectName,
        type: type

    }
})

// 到处报告文件
export const exportReportFile = (fileName) => request({
    url: '/api/idevelop-xcnanr/xcnanr/infoInspectionStat/downloadLocal/'+fileName,
    method: 'get',
    responseType: 'blob'
})

// 下载文件
export function downloadFile(obj, name, suffix) {
    const url = window.URL.createObjectURL(new Blob([obj]))
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    const fileName =  name + '.' + suffix
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
