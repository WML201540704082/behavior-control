<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="基本信息"
      width="1200px"
      top="10vh"
      v-el-drag-dialog
    >
      <div>

        <el-form ref="queryForm" :model="searchForm" label-width="115px" class="xt_form" disabled>
          <el-row>
            <el-col :span="6">
              <div>
                <el-form-item label="交换机标签">
                  <el-input v-model="searchForm.swName"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="制作商">
                  <el-input v-model="searchForm.swFirm"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="品牌">
                  <el-input v-model="searchForm.swFirm"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="系列">
                  <el-input v-model="searchForm.swSeries"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="型号">
                  <el-input v-model="searchForm.swModel"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <!-- <el-col :span="6">
                <div>
                    <el-form-item label="型号">

                        <el-select v-model="searchForm.swModel" size="mini" clearable placeholder="请选择型号"
                                    style="width: 100%">
                            <el-option
                                    v-for="item in swModelList"
                                    :key="item.typeId"
                                    :value="item.typeId"
                                    :label="item.typeName"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col> -->

            <el-col :span="6">
              <div>
                <el-form-item label="安装地点">
                  <el-input v-model="searchForm.swWhere"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="用途">
                  <el-input v-model="searchForm.swPurpose"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="汇聚/接入">
                  <el-select v-model="searchForm.is3"
                             style="width: 100%">
                    <el-option v-for="item in is3List" :value="item.dictKey" :label="item.dictValue" :key="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="6">
              <div>
                <el-form-item label="工作状态">
                  <el-select v-model="searchForm.swState" style="width: 100%">
                    <el-option v-for="item in swStateList" :value="item.dictKey" :label="item.dictValue" :key="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="管理IP">
                  <el-input v-model="searchForm.telIp"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="管理用户">
                  <el-input v-model="searchForm.telUser"></el-input>
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="6">
              <div>
                <el-form-item label="管理密码">
                  <el-input v-model="searchForm.telPass"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="配置密码">
                  <el-input v-model="searchForm.configPass"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="NASIP">
                  <el-input v-model="searchForm.swIp"></el-input>
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="6">
              <div>
                <el-form-item label="NASSECRET">
                  <el-input v-model="searchForm.swPass"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="SNMP版本号">
                  <el-select v-model="searchForm.snmpVersion" style="width: 100%">
                    <el-option v-for="item in snmpVersionList" :value="item.dictKey" :label="item.dictValue" :key="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="设备编码">
                  <el-input v-model="searchForm.deviceCode"></el-input>
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="6">
              <div>
                <el-form-item label="SNMP读字符串">
                  <el-input v-model="searchForm.snmpReadStr"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="SNMP写字符串">
                  <el-input v-model="searchForm.snmpWriteStr"></el-input>
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="6">
              <div>
                <el-form-item label="认证状态">
                  <el-select v-model="searchForm.isAccessSwitch" style="width: 100%">
                    <el-option v-for="item in isAccessSwitchList" :value="item.dictKey" :label="item.dictValue" :key="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="录入人">
                  <el-input v-model="searchForm.fillMan"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="录入时间">
                  <el-input v-model="searchForm.fillDate"></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <div class="btn-row">
          <!-- <el-button type="primary"
                      @click="handleSubmit">保存</el-button> -->
          <el-button style="margin-left: 15px;"
                     @click="handleCancel">取消
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {switcheDetail} from "@/api/operation/safeaccess/switch";
import {getDictList, getDictCmdbList} from "@/api/dict";

export default {
  props: ['isShow', 'arrtId'],
  data() {
    return {
      orgCodeList: [],
      is3List: [],
      swStateList: [],
      snmpVersionList: [],
      Is802List: [],
      isAccessSwitchList: [],

      brandList: [],
      seriesList: [],
      deviceModelList: [],
      maintenanceCountryList: [],

      searchForm: {},
      rules: {
        name: [
          {required: true, message: '名称不能为空', trigger: 'blur'},
        ]
      },
      pageLoading: false,

      dataList: [],
      selectionList: [],
      total: 0,
      tableLoading: false, //表格加载
      tableHeight: undefined,
    }
  },
  computed: {
    // ids() {
    //   let ids = [];
    //   this.selectionList.forEach(ele => {
    //     ids.push(ele.id);
    //   });
    //   return ids.join(",");
    // },
  },
  created() {
    this.getDetail()
    //加载字典--工单状态
    //加载字典--入库仓库
    this.getDictList("swState");
    //加载字典--i6000同步状态
    this.getDictList("snmpVersion");
    //加载字典--WBS项目
    this.getDictList("Is802");
    //加载字典--i6000同步状态
    this.getDictList("isAccessSwitch");

    // 加载字典
    this.getDictCmdbList('1082554947272704') // 品牌
    this.getDictCmdbList('1082609011851264') // 系列
    this.getDictCmdbList('1082608047161344') // 型号
    this.getDictCmdbList('1083979207081984') // 国家及地区
    this.getDictCmdbList('1131177441558528') // 网络设备用途类型
  },
  methods: {
    handleSubmit() {
      this.$emit('setVal', this.searchForm)
    },
    handleCancel() {
      this.$emit('close')
    },
    getDictList(code) {
      //加载字典
      getDictList(code).then(res => {
        if (code === 'swState') {
          this.swStateList = res.data;
        } else if (code === 'Is802') {
          this.Is802List = res.data;
        } else if (code === 'snmpVersion') {
          this.snmpVersionList = res.data;
        } else if (code === 'isAccessSwitch') {
          this.isAccessSwitchList = res.data;
        }
      });
    },
    getDictCmdbList(ciId) {
      //加载字典
      getDictCmdbList({ciId: ciId}).then(res => {
        if (ciId === '1082554947272704') { // 品牌
          this.brandList = res.data;
        } else if (ciId === '1082609011851264') { // 系列
          this.seriesList = res.data;
        } else if (ciId === '1082608047161344') { // 型号
          this.deviceModelList = res.data;
        } else if (ciId === '1083979207081984') { // 国家及地区
          this.maintenanceCountryList = res.data;
        } else if (ciId === '1131177441558528') { // 网络设备用途类型
          this.is3List = res.data;
        }
      });
    },

    // 详情
    getDetail() {
      this.pageLoading = true
      switcheDetail({id: this.arrtId}).then(res => {
        this.pageLoading = false
        this.searchForm = res.data

        //console.log('searchForm',this.searchForm.is3)
      }).catch(() => {
        this.pageLoading = false
      })

    },

  }
}
</script>

<style lang="scss" scoped>
.formLabel {
  line-height: 20px;
}

.btn-row {
  text-align: right;
}
</style>
