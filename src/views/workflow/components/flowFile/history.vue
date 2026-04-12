<template>
  <el-table v-loading="loading" :data="ProcessRecordTableData" height="500" style="width: 100%">
    <el-table-column
      type="index"
      label="序号"
      width="80"
      align="center"
    >
    </el-table-column>
    <el-table-column
      prop="activityName"
      label="节点名称"
      align="center"
      width="180"
    >
    </el-table-column>
    <el-table-column prop="assignee" label="办理人" align="center">
    </el-table-column>
    <el-table-column align="center" prop="startTime" label="接收时间">
    </el-table-column>
    <el-table-column prop="endTime" label="办理时间" align="center">
      <template #default="scope">
        {{ scope.row.endTime ? scope.row.endTime : '-' }}
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      prop="taskSourceFlag"
      label="办理方式"
    >
      <template #default="scope">
                  <span style="color: rgb(31, 138, 255)">
                    {{ scope.row.taskSourceFlag }}
                  </span>
      </template>
    </el-table-column>
    <el-table-column prop="comments" align="center" label="办理意见">
    </el-table-column>
  </el-table>
</template>

<script>
  import {
    historList,
  } from '@/api/workflow/task';
    export default {
      props: {
        processInsId: {type: String, default: ''},
        businessId: {type: String, default: ''},
      },
        data(){
            return {
              loading:false,
              ProcessRecordTableData:[]
            };
        },
      mounted() {
        this.init();
      },
      watch:{
        businessId(){
          this.init();
        }
      },
      methods:{
        async init(){
          this.loading = true;
          this.ProcessRecordTableData.splice(0)
          const { data } = await historList({
            processInsId: this.processInsId,
            businessId: this.businessId
          });
          this.loading = false;
          this.ProcessRecordTableData = data;
        }
      },

    }
</script>
