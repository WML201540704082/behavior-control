<template>
  <div>
    <el-table
      :ref="ref"
      :data="tableList"
      stripe
      :size="size"
      :height="tableHeight"
      v-loading="tableLoading || tableInit"
      @row-dblclick="rowDbClcik"
      @selection-change="selectionChange"
    >
      <af-table-column v-if="needSelect" type="selection" align="center"></af-table-column>
      <div
        v-for="(item, index) in colList"
        :key="index"
      >
        <af-table-column
          v-if="item.key.split('_')[0] === 'attr'"
          :label="item.title"
          :prop="item.key"
          show-overflow-tooltip
          align="center">
          <slot :name="item.key"></slot>
        </af-table-column>

        <af-table-column
          v-else-if="item.key.split('_')[0] === 'global'"
          :label="item.title"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="scope.row[item.key] === '--'">--</span>
            <el-tag
              v-else
              v-for="item in scope.row[item.key]"
              :key="item.id"
              type="info"
              size="small"
            >{{ item.value }}
            </el-tag>
          </template>
        </af-table-column>
      </div>

      <el-table-column fixed="right" align="center" v-if="needAction" label="操作" :width="actionWidth">
        <template slot-scope="scope">
          <slot name="action" :scopeData="scope"></slot>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
export default {
  props: {
    needSelect: {
      type: Boolean,
      default: true
    },
    needAction: {
      type: Boolean,
      default: false
    },
    actionWidth: {
      type: String,
      default: '150px'
    },
    ref: {
      type: String,
      default: 'table'
    },
    size: {
      type: String,
      default: 'small',
    },
    tableData: {
      type: Array,
      default: []
    },
    colList: {
      type: Array,
      default: []
    },
    tableHeight: {
      type: String,
      default: undefined
    },
    tableLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableList: [],
      tableInit: false,
    }
  },
  watch: {
    colList: {
      deep: true,
      handler() {
        this.initData()
      },
    }
  },
  mounted() {
    // this.initData()
  },
  methods: {
    initData() {
      this.tableList = []
      this.tableInit = true
      this.tableData.forEach((item, index) => {
        let resRowData = Object.assign(item.attrEntityData, item.globalAttrEntityData)
        let rowData = {}
        // 设置行数据初始值
        this.colList.forEach(it => {
          rowData = item
          rowData[it.key] = '--'
        })

        for (let key in resRowData) {
          // let arrtType = key[]
          if (resRowData[key].valueList.length == 1 && typeof resRowData[key].valueList[0] != 'object') {
            rowData[key] = resRowData[key].actualValueList[0]
          } else {
            rowData[key] = resRowData[key].actualValueList
          }
        }
        this.tableList.push(rowData)
      })
      this.tableInit = false
      this.$nextTick(() => {
        this.$refs[this.ref].doLayout()
      })
    },
    rowDbClcik(row, column, event) {
      this.$emit('rowDbClcik', {row, column, event})
    },
    selectionChange(selection){
      this.$emit('selectionChange', selection)
    }
  }
}
</script>
