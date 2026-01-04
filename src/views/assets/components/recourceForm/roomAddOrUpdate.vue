<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="page_body">
      <formTitle :titleText="'机房信息'" :titleType="'page_title'"></formTitle>
      <el-scrollbar style="height:calc(100% - 50px - 48px)">
        <el-form :model="form" :rules="rules" ref="dataForm" class="xt_form" label-width="150px" :disabled="isChange">
          <el-row>
            <el-col :span="8">
              <el-form-item label="机房名称" prop="roomName">
                <el-input v-model="form.roomName" placeholder="请输入机房名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="简称" prop="abbreviation">
                <el-input v-model="form.abbreviation" placeholder="请输入简称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="机房类型"
                prop="roomType"
              >
                <el-select v-model="form.roomType" placeholder="请选择机房类型" clearable>
                  <el-option
                    v-for="dict in roomTypeList"
                    :key="dict.dictKey"
                    :label="dict.dictValue"
                    :value="dict.dictKey"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="机房功能" prop="roomFunction">
                <el-select v-model="form.roomFunction" placeholder="请选择机房功能" clearable>
                  <el-option
                    v-for="dict in roomFunctionList"
                    :key="dict.dictKey"
                    :label="dict.dictValue"
                    :value="dict.dictKey"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>


            <el-col :span="8">
              <el-form-item label="机房位置" prop="roomLocation">
                <el-input v-model="form.roomLocation" placeholder="请输入机房位置" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="机房高度(m)"
                prop="roomHeight"
              >
                <el-input v-model="form.roomHeight" placeholder="请输入机房高度" type="number" @input="(val)=>{ form.roomHeight = val.replace(/[^0-9.]/g, '').replace(/-/g, '').replace(/(\.\d{2})\d+/g, '$1') }"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="机房进深(m)"
                prop="roomDepth"
              >
                <el-input v-model="form.roomDepth" placeholder="请输入房间进深" type="number" @blur="sumArea()" @input="(val)=>{ form.roomDepth = val.replace(/[^0-9.]/g, '').replace(/-/g, '').replace(/(\.\d{2})\d+/g, '$1') }"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="机房宽度(m)"
                prop="roomWidth"
              >
                <el-input v-model="form.roomWidth" placeholder="请输入机房宽度" type="number" @blur="sumArea()" @input="(val)=>{ form.roomWidth = val.replace(/[^0-9.]/g, '').replace(/-/g, '').replace(/(\.\d{2})\d+/g, '$1') }"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="机房面积(m²)"
                prop="roomArea"
              >
                <el-input v-model="form.roomArea" placeholder="请输入机房面积" type="number" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="空调方式"
                prop="airMethod"
              >
                <el-select v-model="form.airMethod" placeholder="请选择空调方式" clearable>
                  <el-option
                    v-for="dict in airMethodList"
                    :key="dict.dictKey"
                    :label="dict.dictValue"
                    :value="dict.dictKey"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="取暖方式"
                prop="heatingMethod"
              >
                <el-select v-model="form.heatingMethod" placeholder="请选择取暖方式" clearable>
                  <el-option
                    v-for="dict in heatingMethodList"
                    :key="dict.dictKey"
                    :label="dict.dictValue"
                    :value="dict.dictKey"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="走线方式"
                prop="routingMethod"
              >
                <el-select v-model="form.routingMethod" placeholder="请选择走线方式" clearable>
                  <el-option
                    v-for="dict in routingMethodList"
                    :key="dict.dictKey"
                    :label="dict.dictValue"
                    :value="dict.dictKey"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="维护单位" prop="maintenanceUnitName" clearable>
                <xt-tree-lzay-select :formValue="form.maintenanceUnitName"
                                     :selectType="'CORP'"
                                     @getTreeItem="getEntityUnit"
                                     v-if="$route.query.treeType =='1'"
                ></xt-tree-lzay-select>
                <el-input v-else v-model="form.maintenanceUnitName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="维护人"
                prop="maintenanceUser"
              >
                <el-input v-model="form.maintenanceUser" placeholder="请输入维护人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="值班电话"
                prop="dutyPhone"
              >
                <el-input v-model="form.dutyPhone" placeholder="请输入值班电话"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="I6000关联机房" prop="i6000Uuid">
                <el-select v-model="form.i6000Uuid" placeholder="请选择I6000关联机房" clearable>
                  <el-option v-for="dict in roomI6000" :key="dict.uuid" :label="dict.name"
                             :value="dict.uuid"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="form-btn">
          <el-button type="primary" @click="onSubmit" :loading="saveLoading" v-show="!isChange">提交</el-button>
          <el-button
            plain
            class="border-btn"
            @click="$closePage('/assets/comdevManage')"
          >返 回
          </el-button>
        </div>
      </el-scrollbar>
    </div>
  </basic-container>
</template>

<script>
  import {addRoom, getRoomDetail, getI6000RoomList} from "@/api/device/resoureroom";
  import {getDictList} from "@/api/dict";
  import {mapGetters} from "vuex";
  import {getDeptList} from "@/api/system/dept";
  import xtTreeLzaySelect from "@/components/xtTreeLzaySelect/index.vue";
  import areaTreeSelect from "@/components/areaTreeSelect/index.vue";


  export default {
    name: "roomAddOrUpdate",
    components: {xtTreeLzaySelect, areaTreeSelect},

    data() {
      return {
        form: {
          maintenanceUnitName: '',
          airMethod: '3',
          i6000Uuid: '',
          i6000Name: '',
          roomHeight: 0,
          roomDepth: 0,
          roomWidth: 0,
        },
        rules: {
          roomName: [
            {required: true, message: '名称不能为空', trigger: 'blur'}
          ],
          maintenanceUnitName: [
            {required: true, message: '维护单位不能为空', trigger: 'change'}
          ],
          roomType: [
            {required: true, message: '机房类型不能为空', trigger: 'change'}
          ],
          roomFunction: [
            {required: true, message: '机房功能不能为空', trigger: 'change'}
          ],
          regionName: [
            {required: true, message: '所属区域不能为空', trigger: 'change'}
          ],
          roomLocation: [
            {required: true, message: '机房位置不能为空', trigger: 'blur'}
          ]
        },
        maintenanceFactoryList: [],
        roomTypeList: [],
        roomFunctionList: [],
        heatingMethodList: [],
        airMethodList: [],
        routingMethodList: [],
        isMonitorList: [],
        unitList: [],
        saveLoading: false,
        isChange: false,
        roomI6000: [],
      };
    },
    computed: {
      ...mapGetters(["permission", "userInfo"]),
    },
    mounted() {
      this.setPageContentHeight();
      //字典加载
      this.getDictList("maintenanceFactory");
      this.getDictList("room_type");
      this.getDictList("room_function");
      this.getDictList("heating_method");
      this.getDictList("air_method");
      this.getDictList("routing_method");
      this.getDictList("yesNo");
      //获取 部门列表
      this.getDeptList();
      // 获取I6000机房数据
      this.getI6000Rooms();

      if (this.$route.query.showType === "修改") {
        getRoomDetail(this.$route.query.id).then(res => {
          let datas = res.data
          datas.roomFunction = datas.roomFunction.toString()
          this.form = datas
        });
      } else if (this.$route.query.showType === "详情") {
        getRoomDetail(this.$route.query.id).then(res => {
          let datas = res.data
          datas.roomFunction = datas.roomFunction.toString()
          this.form = datas
        });
        this.isChange = true
      } else {
        if (this.$route.query.treeType == 1) {
          this.form.regionCode = this.$route.query.areaId
          this.form.regionName = this.$route.query.areaName;
        } else {
          this.form.maintenanceUnit = this.$route.query.areaId
          this.form.maintenanceUnitName = this.$route.query.areaName;
        }
      }
    },
    methods: {
      // deviceHeightInput(){
      //   this.form.roomHeight = this.form.roomHeight.replace(/[^0-9]/g, '')
      // },
      onBlur(val) {
        this.form.roomHeight = val.replace(/[^0-9.]/g, '').replace(/-/g, '').replace(/(\.\d{2})\d+/g, '$1')
      },
      sumArea() {
        let a = this.form.roomDepth;
        let b = this.form.roomWidth;
        if (a != null && b != null) {
          let num = a * b
          num = num.toFixed(2)
          this.form.roomArea = num
          this.$forceUpdate()
        }
      },
      getDictList(code) {
        getDictList(code).then(res => {
          if (code === "maintenanceFactory") {
            this.maintenanceFactoryList = res.data;
          } else if (code === "room_type") {
            this.roomTypeList = res.data;
          } else if (code === 'room_function') { // 机房功能
            this.roomFunctionList = res.data;
          } else if (code === "heating_method") {
            this.heatingMethodList = res.data;
          } else if (code === "air_method") {
            this.airMethodList = res.data;
          } else if (code === "routing_method") {
            this.routingMethodList = res.data;
          } else if (code === "yesNo") {
            this.isMonitorList = res.data;
          }
        });
      },
      getEntityUnit(val) {
        //选择领用单位 部门
        this.form.maintenanceUnitName = val.fullName
        this.form.maintenanceUnit = val.id
        this.$forceUpdate()
      },
      // 选择地区
      getAreaInfo(val) {
        this.form.regionCode = val.id
        this.form.regionName = val.name
        this.$forceUpdate()
      },
      getDeptList() {
        //获取部门 单位
        getDeptList().then(res => {
          this.unitList = res.data
        })
      },
      submitReset() {
        this.$closePage("/assets/comdevManage");
      },
      getI6000Rooms() {
        getI6000RoomList().then(res => {
          if (res.code == 200) {
            this.roomI6000 = res.data;
          }
        });
      },
      onSubmit() {
        let areaParentId = this.$route.query.areaParentId
        this.form.areaParentId = areaParentId;
        if(this.form.i6000Uuid){
          let current = this.roomI6000.filter(el=> el.uuid == this.form.i6000Uuid)[0];
          this.form.i6000Name = current.name;
        }
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.saveLoading = true
            addRoom(this.form).then((res) => {
              this.$message({
                type: "success",
                message: "操作成功!"
              });

              let handleType = ''
              if (this.$route.query.showType === "修改") handleType = '修改'
              else handleType = '新增'

              res.data.name = res.data.roomName
              res.data.id = res.data.uuid
              this.$store.commit('SET_LIST_UPDATE', (new Date()).getTime())
              this.$store.commit('SET_UPDATE_FORM', {handleType: handleType, dataType: 'room', nodeDetail: res.data})
              this.submitReset()
              this.saveLoading = false
            }).catch(() => {
              this.saveLoading = false
            })
          } else {
            this.$message.warning("请将信息填写完整!")
          }
        })
      }
    }
  };
</script>

<style scoped>
</style>
