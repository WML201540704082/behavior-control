<template>
  <basic-container>
    <div class="page_form"></div>
    <div class="page_body">
      <div class="page_c">
        <div class="d_cb_title">
          <formTitle
            :titleText="'打分模型配置'"
            :titleType="'page_title'"
          ></formTitle>
        </div>

        <div class="description_title">
          <p>机房老旧设备评分模型说明</p>
          <p>
            评价得分=机房级别*机房功能*设备状态*（超龄时间维度*运维情况+服务风险+（n-1）满足情况）*资产运维归属情况*运行情况自评*设备种类及运行需求*空调级别
          </p>
          <p>R=A*B*S*(T*C+E+H)*D*F*G*I</p>
        </div>

        <setting-title
          titleText="全局配置"
          @save="save"
        ></setting-title>

        <div class="table_box">
          <el-table
            ref="dataTable"
            stripe
            size="small"
            :data="globalConfigList"
            style="width: 100%"
          >
            <el-table-column
              prop="configItem"
              label="全局配置项"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="set"
              label="对应量化取值"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div class="select_t" v-if="scope.row.configItem == '考核周期'">

                  <el-date-picker type="year" v-model="scope.row.value"></el-date-picker>

                  <span style="margin-left: 10px">年底</span>
                </div>

                <div v-else>
                  <el-radio-group v-model="radio">
                    <el-radio :label="0">线下收集</el-radio>
                    <el-radio :label="1">台账数据</el-radio>
                  </el-radio-group>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <setting-title titleText="A 机房级别" @edit="edit" @save="save" ref="setBtnTitleJieB"></setting-title>
        <div class="table_box">
          <el-table ref="dataTable" stripe size="small" :data="jibie">
            <el-table-column
              prop="configItem"
              label="机房级别取值"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="value"
              label="对应量化取值"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.value" v-if="jiBieEdit"></el-input>
                <span v-else>{{ scope.row.value }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <setting-title titleText="B 机房功能" @edit="edit" @save="save"  ref="setBtnTitleGn"></setting-title>
        <div class="table_box">
          <el-table ref="dataTable" stripe size="small" :data="jfGongN">
            <el-table-column
              prop="configItem"
              label="机房功能取值"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="value"
              label="对应量化取值"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.value" v-if="jfGnEdit"></el-input>
                <span v-else>{{ scope.row.value }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <setting-title titleText="S 设备状态" @edit="edit" @save="save"  ref="setBtnTitleZt"></setting-title>
        <div class="table_box">
          <el-table ref="dataTable" stripe size="small" :data="sbStatusList">
            <el-table-column
              prop="configItem"
              label="设备状态取值"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="value"
              label="对应量化取值"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.value"
                  v-if="sbStatusEdit"
                ></el-input>
                <span v-else>{{ scope.row.value }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <setting-title titleText="T 超龄时间" @edit="edit" @save="save"  ref="setBtnTitleCl"></setting-title>
        <div class="table_box">
          <el-table ref="dataTable" stripe size="small" :data="clList">
            <el-table-column
              prop="configItem"
              label="超龄时间"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="value"
              label="对应量化取值"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div v-if="clEdit" class="edit_cl">
                  <span>Celling(T)+</span>
                  <el-input v-model="scope.row.value" size="mini"></el-input>
                </div>

                <div v-else>
                  <span style="margin-right: 5px"
                    >Celling(T) + {{ scope.row.value }}</span
                  >
                  <el-tooltip placement="top">
                    <div slot="content">Celling为向上取整函数</div>
                    <i class="el-icon-info" style="color: #409eff"> </i>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <setting-title titleText="C 运维情况" @edit="edit" @save="save"  ref="setBtnTitleYw"></setting-title>
        <div class="table_box">
          <el-table ref="dataTable" stripe size="small" :data="ywList">
            <el-table-column
              prop="configItem"
              label="运维情况取值"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div class="edit_cl">
                  <span style="margin-right: 5px">{{ scope.row.configItem }}</span>
                  <el-tooltip placement="top">
                    <div slot="content">
                      {{ scope.row.configItem == '有' ? '售后未到期或有维保':'售后到期且无维保' }}
                    </div>
                    <i class="el-icon-info" style="color: #409eff"> </i>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              prop="value"
              label="对应量化取值"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.value" v-if="ywEdit"></el-input>
                <span v-else>{{ scope.row.value }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <setting-title
          titleText="D 设备产权和运维部门"
          @edit="edit" @save="save"
           ref="setBtnTitleSb"
        ></setting-title>
        <div class="table_box">
          <el-table ref="dataTable" stripe size="small" :data="sbgsList">
            <el-table-column
              prop="configItem"
              label="设备归属部门取值"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="value"
              label="对应量化取值"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.value" v-if="sbgsEdit"></el-input>
                <span v-else>{{ scope.row.value }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <setting-title titleText="E 服务风险" @edit="edit" @save="save"  ref="setBtnTitleFw"></setting-title>
        <div class="table_box">
          <el-table ref="dataTable" stripe size="small" :data="fwfxList">
            <el-table-column
              prop="configItem"
              label=" 服务风险类型取值"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="value"
              label="对应量化取值"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.value" v-if="fwfxEdit"></el-input>
                <span v-else>{{ scope.row.value }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="description_title">
          <p>
            注:E=近三年故障次数*m + 近三年隐患次数*n,其中m和n为对应量化取值.
          </p>
        </div>

        <setting-title titleText="F 运行情况自评" @edit="edit" @save="save"  ref="setBtnTitleZp"></setting-title>
        <div class="table_box">
          <el-table ref="dataTable" stripe size="small" :data="yxqkList">
            <el-table-column
              prop="configItem"
              label=" 运行情况自评取值"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="value"
              label="对应量化取值"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.value" v-if="yxqkEdit"></el-input>
                <span v-else>{{ scope.row.value }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <setting-title titleText="H n-1满足情况" @edit="edit" @save="save"  ref="setBtnTitleMz"></setting-title>
        <div class="table_box">
          <el-table ref="dataTable" stripe size="small" :data="otherList">
            <af-table-column
              prop="deciceTypeName"
              label=" 设备类型"
              align="center"
              show-overflow-tooltip
            ></af-table-column>
            <af-table-column
              prop="configItem"
              label="N-1情况"
              align="center"
              show-overflow-tooltip
            ></af-table-column>
            <af-table-column
              prop="value"
              label="对应量化取值"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.value" v-if="otherEdit"></el-input>
                <span v-else>{{ scope.row.value }}</span>
              </template>
            </af-table-column>
          </el-table>
        </div>

        <div class="description_title">
          <p>
            注:n-1满足情况是指机房中任意一类基础设施损坏一个,不影响机房的正常运行.H参数评价的是自评不需要更换的设备
            (F=0)是否满足n-1,n是指机房中某类设备的总数,针对高级别机房(市,分中心,县公司核心机房)设置,默认为1.
          </p>
        </div>
      </div>
    </div>
  </basic-container>
</template>

<script>
import settingTitle from "./components/settingTitle.vue";
import {
  getConfigureList,
  updateOldDeviceconfig,
} from "@/api/device/oldEquipmentLibrary.js";
export default {
  components: {
    settingTitle,
  },
  data() {
    return {
      globalConfigList: [],
      globalConfigListOrigin: [],
      jibie: [],
      jibieOrigin: [],
      jiBieEdit: false,
      jfGnEdit: false,
      jfGongN: [],
      jfGongNOrigin: [],
      sbStatusEdit: false,
      sbStatusList: [],
      sbStatusListOrigin: [],

      clEdit: false,
      clList: [],
      clListOrigin: [],

      ywEdit: false,
      ywList: [],
      ywListOrigin: [],

      sbgsEdit: false,
      sbgsList: [],
      sbgsListOrigin: [],

      fwfxEdit: false,
      fwfxList: [],
      fwfxListOrigin: [],

      yxqkEdit: false,
      yxqkList: [],
      yxqkListOrigin: [],

      otherEdit: false,
      otherList: [],
      otherListOrigin: [],

      times: [],
      isChange: false,
      radio:0,
    };
  },
  watch:{
    radio(newV){
      if(newV == 0){
        this.globalConfigList[1].value = '0';
      }else if(newV == 1){
        this.globalConfigList[1].value = '1';

      }
    }
  },
  methods: {
    getRadio(radio){
      return parseInt(radio);
    },
    judgeDataChange(changeArray, originArray,isEdit) {

      if(isEdit == true){
        changeArray.forEach((element) => {
        let originData = originArray.find((item) => item.id === element.id);
        if (originData.value !== element.value) {
          this.isChange = true;
        }
      });
      }else{
        this.isChange = false;
      }

    },
    updateConfig(dataArray) {

      let paramsArray = [...dataArray];
       return new Promise((resolve,reject)=>{
         if(this.isChange === true){
            updateOldDeviceconfig(paramsArray).then((res) => {
        if (res.code != 200) {
          throw res.msg;
        }

        resolve(true);
      

       });

       }else{
            resolve(true);
          this.$message({
          message: "当前暂无修改项",
          type: "warning",
        });
      }

       })

     

    },

    getDateTime(time){
      const date = new Date(time);
      const options = {
        year:'numeric',
      };

      return date.toLocaleDateString('zh-CN',options);
    },
    save(titleText){
        if(titleText == '全局配置'){
            this.judgeDataChange(this.globalConfigList,this.globalConfigListOrigin,true);
            if(this.isChange === false){
               this.$message({
               message: "当前暂无修改项",
              type: "warning",
              });
              return;
            }

              
          
            if(this.globalConfigList[0].value instanceof Date){
              
              const dateS =  this.getDateTime(this.globalConfigList[0].value).replace('年','');
              let list = JSON.parse(JSON.stringify(this.globalConfigList));
              this.$set(list,0,{...list[0],value:dateS})
              this.updateConfig(list).then(res=>{
                if(res){
                    this.$message({
                    message: "全局配置项修改成功",
                   type: "success",
                });
                }
              });
            }else{
               this.updateConfig(this.globalConfigList).then(res=>{
                if(res){
                    this.$message({
                    message: "全局配置项修改成功",
                   type: "success",
                });
                }
               });
            }

    
        }
      else if (titleText == "A 机房级别") {
          this.judgeDataChange(this.jibie,this.jibieOrigin,this.jiBieEdit)
            if(this.isChange === false){
               this.$message({
               message: "当前暂无修改项",
              type: "warning",
              });
              return;
            }
            this.updateConfig(this.jibie).then(res=>{
               if(res){
                 this.$refs.setBtnTitleJieB.setBtnTitleC();
                 this.jiBieEdit = false;
                 this.$message({
                    message: "机房级别配置项修改成功",
                   type: "success",
                });
               }
            });

      } else if (titleText == "B 机房功能") {
          this.judgeDataChange(this.jfGongN,this.jfGongNOrigin,this.jfGnEdit)
            if(this.isChange === false){
               this.$message({
               message: "当前暂无修改项",
              type: "warning",
              });
              return;
            }
             this.updateConfig(this.jfGongN).then(res=>{
               if(res){
                 this.$refs.setBtnTitleGn.setBtnTitleC();
                 this.jfGnEdit = false;
                  this.$message({
                    message: "机房功能配置项修改成功",
                   type: "success",
                });
               }
            });
      } else if (titleText == "S 设备状态") {
          this.judgeDataChange(this.sbStatusList,this.sbStatusListOrigin,this.sbStatusEdit)
            if(this.isChange === false){
               this.$message({
               message: "当前暂无修改项",
              type: "warning",
              });
              return;
            }
             this.updateConfig(this.sbStatusList).then(res=>{
               if(res){
                 this.$refs.setBtnTitleZt.setBtnTitleC();
                 this.sbStatusEdit = false;
                 this.$message({
                    message: "设备状态配置项修改成功",
                   type: "success",
                });
               }
            });
      } else if (titleText == "T 超龄时间") {
          this.judgeDataChange(this.clList,this.clListOrigin,this.clEdit)
            if(this.isChange === false){
               this.$message({
               message: "当前暂无修改项",
              type: "warning",
              });
              return;
            }

            let filterList = this.clList.map(item => ({id:item.id,value:item.value,configTypeCode:item.configTypeCode}));
             this.updateConfig(filterList).then(res=>{
               if(res){
                 this.$refs.setBtnTitleCl.setBtnTitleC();
                 this.clEdit = false;
                 this.$message({
                    message: "超龄时间配置项修改成功",
                   type: "success",
                });
               }
            });
      } else if (titleText == "C 运维情况") {
          this.judgeDataChange(this.ywList,this.ywListOrigin,this.ywEdit)
            if(this.isChange === false){
               this.$message({
               message: "当前暂无修改项",
              type: "warning",
              });
              return;
            }
             this.updateConfig(this.ywList).then(res=>{
               if(res){
                 this.$refs.setBtnTitleYw.setBtnTitleC();
                 this.ywEdit = false;
                 this.$message({
                    message: " 运维情况配置项修改成功",
                   type: "success",
                });
               }
            });
      } else if (titleText == "D 设备产权和运维部门") {
          this.judgeDataChange(this.sbgsList,this.sbgsListOrigin,this.sbgsEdit)
            if(this.isChange === false){
               this.$message({
               message: "当前暂无修改项",
              type: "warning",
              });
              return;
            }              
            this.updateConfig(this.sbgsList).then(res=>{
               if(res){
                 this.$refs.setBtnTitleSb.setBtnTitleC();
                 this.sbgsEdit = false;
                 this.$message({
                    message: " 设备产权和运维部门配置项修改成功",
                   type: "success",
                });
               }
            });
      } else if (titleText == "E 服务风险") {
          this.judgeDataChange(this.fwfxList,this.fwfxListOrigin,this.fwfxEdit)
            if(this.isChange === false){
               this.$message({
               message: "当前暂无修改项",
              type: "warning",
              });
              return;
            }
              this.updateConfig(this.fwfxList).then(res=>{
               if(res){
                 this.$refs.setBtnTitleFw.setBtnTitleC();
                 this.fwfxEdit = false;
                 this.$message({
                    message: "服务风险配置项修改成功",
                   type: "success",
                });
               }
            });
      } else if (titleText == "H n-1满足情况") {
                  this.judgeDataChange(this.otherList,this.otherListOrigin,this.otherEdit)
            if(this.isChange === false){
               this.$message({
               message: "当前暂无修改项",
              type: "warning",
              });
              return;
            }
            let filterList = this.otherList.map(item => ({id:item.id,value:item.value,configTypeCode:item.configTypeCode}));
            this.updateConfig(filterList).then(res=>{
               if(res){
                 this.$refs.setBtnTitleMz .setBtnTitleC();
                 this.otherEdit  = false;
                  this.$message({
                    message: "n-1满足情况配置项修改成功",
                   type: "success",
                });
               }
            });

         
      } else if (titleText == "F 运行情况自评") {
             this.judgeDataChange(this.yxqkList,this.yxqkListOrigin,this.yxqkEdit)
            if(this.isChange === false){
               this.$message({
               message: "当前暂无修改项",
              type: "warning",
              });
              return;
            }
            this.updateConfig(this.yxqkList).then(res=>{
               if(res){
                 this.$refs.setBtnTitleZp.setBtnTitleC();
                 this.yxqkEdit = false;
                 this.$message({
                    message: "运行情况自评配置项修改成功",
                   type: "success",
                });
               }
            });
      }
    },
    edit(titleText) {
      if (titleText == "A 机房级别") {
        this.jiBieEdit = true;
      } else if (titleText == "B 机房功能") {
        this.jfGnEdit = true;
      } else if (titleText == "S 设备状态") {
        this.sbStatusEdit = true;
      } else if (titleText == "T 超龄时间") {
        this.clEdit = true;
      } else if (titleText == "C 运维情况") {
        this.ywEdit = true;
      } else if (titleText == "D 设备产权和运维部门") {
        this.sbgsEdit = true;
      } else if (titleText == "E 服务风险") {
        this.fwfxEdit = true;
      } else if (titleText == "H n-1满足情况") {
        this.otherEdit = true;
      } else if (titleText == "F 运行情况自评") {
        this.yxqkEdit = true;
      }
    },
    getList(code) {
      //加载数据
      getConfigureList({ configTypeCode: code }).then((res) => {
        if (res.code != 200) {
          throw res.msg;
        }
        if (code === "Z") {
          this.globalConfigList = res.data;
          this.globalConfigListOrigin = JSON.parse(JSON.stringify(res.data));
          this.radio = parseInt(this.globalConfigList[1].value) ;
          this.times = [];
          this.times.push(res.data[0].value);
        } else if (code === "A") {
          this.jibie = res.data;
          this.jibieOrigin = JSON.parse(JSON.stringify(res.data));
        } else if (code === "B") {
          this.jfGongN = res.data;
          this.jfGongNOrigin = JSON.parse(JSON.stringify(res.data));
        } else if (code === "S") {
          this.sbStatusList = res.data;
          this.sbStatusListOrigin = JSON.parse(JSON.stringify(res.data));
        } else if (code === "T") {
          this.clList = res.data;
          this.clListOrigin = JSON.parse(JSON.stringify(res.data));
        } else if (code === "C") {
          this.ywList = res.data;
          this.ywListOrigin = JSON.parse(JSON.stringify(res.data));
        } else if (code === "D") {
          this.sbgsList = res.data;
          this.sbgsListOrigin = JSON.parse(JSON.stringify(res.data));
        } else if (code === "E") {
          this.fwfxList = res.data;
          this.fwfxListOrigin = JSON.parse(JSON.stringify(res.data));
        } else if (code === "F") {
          this.yxqkList = res.data;
          this.yxqkListOrigin = JSON.parse(JSON.stringify(res.data));
        } else if (code === "H") {
          this.otherList = res.data;
          this.otherListOrigin = JSON.parse(JSON.stringify(res.data));
        }
      });
    },
  },
  mounted() {
    this.getList("Z");
    this.getList("A");
    this.getList("B");
    this.getList("S");
    this.getList("T");
    this.getList("C");
    this.getList("D");
    this.getList("E");
    this.getList("F");
    this.getList("H");
  },
};
</script>

<style lang="scss" scoped>
.description_title {
  p {
    font-size: 14px;
    color: orange;
  }
}

.table_box {
  margin-top: 5px;
}

.select_t {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  text-align: center;
  width: 100%;
  /deep/ .el-select {
    width: 100px;
  }
}

.page_c {
  height: calc(100vh - 200px);
  overflow-y: scroll;
  padding: 15px;
  margin-bottom: 15px;
  .edit_cl {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /deep/ .el-input__inner {
    width: 100px;
  }

  /deep/ .el-input {
    width: 100px;
  }
}
</style>