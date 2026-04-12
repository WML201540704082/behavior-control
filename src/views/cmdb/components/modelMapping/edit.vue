<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="编辑关联关系"
      width="1000px"
      top="10vh"
      v-el-drag-dialog
    >
      <div class="shang">
        <div class="shang-l">
          <!-- <el-form
              ref="searchForm"
              :model="searchForm"
              label-suffix=":"
              label-width="90px"
              class="xt_search_form1">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="设备分类" prop="deviceCategory"  >
                  <el-select v-model="searchForm.deviceCategory" placeholder="请选择设备分类" size="mini" clearable @change="deviceCategoryCodeChange" >
                    <el-option  v-for="dict in deviceCategoryList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备类型" prop="deviceType" >
                  <el-select v-model="searchForm.deviceType" :disabled="!searchForm.deviceCategory" placeholder="请输入设备类型" size="mini" clearable >
                    <el-option  v-for="dict in deviceTypeList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form> -->
          <div class="middle">
            <div class="middle_t">
              信通一体化系统字段
            </div>
            <el-input v-model="model1" @input="onInput1" placeholder="请输入搜索内容" size="mini"></el-input>
            <el-radio-group v-model="radioVal1">
              <el-radio v-for="item in optCom1" :key="item.label" :label="item.label">{{ item.name }}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <i class="el-icon-sort" style="margin: 45px 20px 0;"></i>
        <div class="shang-r">
          <!-- <el-form
              ref="searchForm"
              :model="searchForm"
              label-suffix=":"
              label-width="85px"
              class="xt_search_form1">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="设备分类" prop="deviceCategory"  >
                  <el-select v-model="searchForm.deviceCategory" placeholder="请选择设备分类" size="mini" clearable @change="deviceCategoryCodeChange" >
                    <el-option  v-for="dict in deviceCategoryList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备类型" prop="deviceType" >
                  <el-select v-model="searchForm.deviceType" :disabled="!searchForm.deviceCategory" placeholder="请输入设备类型" size="mini" clearable >
                    <el-option  v-for="dict in deviceTypeList" :key="dict.dictKey"  :label="dict.dictValue" :value="dict.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form> -->
          <div class="middle">
            <div class="middle_t">
              I6000系统字段
            </div>
                
            <el-link @click.native="handleAdd" type="primary" :underline="false" style="position: absolute;top: 15px;right: 16px;">新增</el-link>

            <el-input v-model="model2" placeholder="请输入搜索内容" size="mini"></el-input>
            <el-radio-group v-model="radioVal2">
              <el-radio v-for="item in optCom2" :key="item.label" :label="item.label">{{ item.name }}</el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
      <div class="zhong">
        <div class="zhong-c" v-for="item in relationship" :key="item.id">
          <!-- <div class="zhong-l">
            <div class="zhong-c-l">
              信通一体化 - 终端设备 - 台式机 - 内存容量(GB)
            </div>
            <span> = </span>
            <div class="zhong-c-l">
              I6000系统 - 终端设备 - 台式机 - 内存容量(GB)
            </div>
          </div> -->
          <div class="zhong-l">
            <div class="zhong-c-l">
              信通一体化 - {{ currentItem.cmdbCiName }} - {{ item.cmdbAttrLabel }}
            </div>
            <span> = </span>
            <div class="zhong-c-l">
              I6000系统 - {{ currentItem.i6000CiId }} - {{ item.i6000Expan }}
            </div>
          </div>
          <div class="zhong-r">
            <el-link @click.native="handleDel(item)" type="primary" :underline="false">删除</el-link>
          </div>
        </div>
      </div>   
        
      

      <div class="submit_btn">
          <el-button type="primary" size="small" @click="handleSave" :loading="saveLoading">保 存</el-button>
          <el-button size="small" @click="$emit('close')">取 消</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
  import {globalattrDetail, globalattrSave, cmdbciattrList, i6000ciattrList, i6000Mapping} from "@/api/system/modelMapping";
  import {
    cmdbGetAttrListCmdb,
    cmdbInsertRelation,
    cmdbGetMappingList
  } from "@/api/system/modelMapping";
  import {getDictList,getDictCmdbList} from "@/api/dict";

  export default {
    props: ['isShow', 'arrtId', 'showType', 'currentItem'],
    data() {
      return {
        relationship: [],

        model1: undefined,
        model2: undefined,
        radioVal1: undefined,
        radioVal2: undefined,
        option1: [
          // { label: 1, name: "单选1" },
          // { label: 2, name: "单选2" },
          // { label: 3, name: "单选3" },
        ],
        option2: [
          // { label: "1", name: "单选1" },
          // { label: "2", name: "单选2" },
          // { label: "3", name: "单选3" },
        ],


        deviceCategoryList: [],
        deviceTypeList: [],
        searchForm: {
          deviceCategory: undefined,
          deviceCategoryCode: undefined,
          deviceType: undefined,
          deviceTypeCode: undefined,
        },


        i6000AttrCodeList: [],
        submitForm: {
          i6000AttrCode: undefined,
          i6000Datatype: undefined,
          i6000Expan: undefined,
          i6000OriType: undefined,
          i6000Origin: undefined,
          cmdbAttrCode: undefined,
          cmdbAttrLabel: undefined,
          cmdbAttrType: undefined,
        },
        
        pageLoading: false,
        saveLoading: false
      }
    },
    computed:{
      optCom1(){
        return this.option1.filter(ele=> {
          if(this.model1){
            return ele.name.includes(this.model1)
          }else{
            return true
          }
          
        })
      },
      optCom2(){
        return this.option2.filter(ele=> {
          if(this.model2){
            return ele.name.includes(this.model2)
          }else{
            return true
          }
          
        })
      }
    },
    mounted() {
      // this.getDict()
      this.getDetail()
      // this.getCmdbDictList('1097745625841664')

      // console.log(90, this.currentItem)
      cmdbGetAttrListCmdb( { deviceType: this.currentItem.cmdbCiId } ).then(res=>{
        let cmdbCiAttrList = res.data.cmdbCiAttrList
        let i6000CiAttrList = res.data.i6000CiAttrList
        cmdbCiAttrList.forEach(ele => {
          ele.label = ele.attrId
          ele.name = ele.attrLabel
        });
        i6000CiAttrList.forEach(ele => {
          ele.label = ele.id
          ele.name = ele.attrName
        });
        this.option1 = cmdbCiAttrList
        this.option2 = i6000CiAttrList
      })

    },
    methods: {
      onInput1(val){
        // console.log(898, val)
      },
      handleAdd(){
        if( !this.radioVal1 || !this.radioVal2 ){
          this.$message.warning('请选择对应字段!')
          return
        }

        let cmdbCur = this.option1.filter(ele=> ele.attrId == this.radioVal1)[0]
        let i6000Cur = this.option2.filter(ele=> ele.id == this.radioVal2)[0]
        const timestamp = parseInt((new Date()).getTime())
        let newObj = {
          cmdbAttrCode: cmdbCur.attrName,
          cmdbAttrLabel: cmdbCur.attrLabel,
          cmdbAttrType: cmdbCur.attrTypeText,
          cmdbCiId: cmdbCur.attrCiId.split('-')[0],
          cmdbCiName: this.currentItem.cmdbCiName,
         
          i6000AttrCode: i6000Cur.attrCode,
          i6000CiId: i6000Cur.ciCode,
          i6000Datatype: i6000Cur.datatypeName,
          i6000Expan: i6000Cur.attrName,
          i6000OriType: i6000Cur.oriType,
          i6000Origin: i6000Cur.origin,
          id: timestamp,
          isDeleted: 0,
 
        }
        // console.log( cmdbCur, i6000Cur, newObj )

        let findIndex1 = this.relationship.findIndex(ele=> ele.cmdbAttrLabel == cmdbCur.attrLabel)
        let findIndex2 = this.relationship.findIndex(ele=> ele.i6000Expan == i6000Cur.attrName)
        // console.log(9090, this.relationship, cmdbCur, i6000Cur, findIndex1, findIndex2)
        
        if(findIndex1 !== -1 || findIndex2 !== -1){ // 代表在关联关系中
          this.$confirm("该字段已存在关联关系,请确认是否替换!","提示",{
            confirmButtonText:"确认",
            cancelButtonText:"取消",
            type:"warning"
          }).then(()=>{
            if(findIndex1 !== -1)this.relationship.splice(findIndex1, 1)
            findIndex2 = this.relationship.findIndex(ele=> ele.i6000Expan == i6000Cur.attrName)
            if(findIndex2 !== -1)this.relationship.splice(findIndex2, 1)
            this.relationship.push(newObj)
          })
        }else{
          this.relationship.push(newObj)
        }

        


        
      },
      handleDel(row){
        this.$confirm("是否确认删除!","提示",{
          confirmButtonText:"确认",
          cancelButtonText:"取消",
          type:"warning"
        }).then(()=>{
            this.relationship.splice(
              this.relationship.findIndex( v=>v.id == row.id ),
              1
            )
            this.$message.success('删除成功!')
        })
        
      },
      getCmdbDictList(code){
        //加载cmdb字典
        let query = {}
        query.ciId = code
        getDictCmdbList( query ).then(res => {
          if(code==='1097745625841664'){
            let data = res.data
            this.deviceCategoryList = data;
          }
        });
      },
      getDictCmdbListPid(ciId, pid){
        getDictCmdbListPid({ ciId: ciId, pid: pid }).then(res => {
          if(ciId==='1097745969774592'){ // 设备类型
            this.deviceTypeList = res.data
          }
        });
      },
      deviceCategoryCodeChange(code){
        //设备分类选择
        this.searchForm.deviceType = undefined
        this.searchForm.deviceTypeCode = undefined
        this.getDictCmdbListPid('1097745969774592', code) // 设备类型
      },




      // 详情
      getDetail() {
        this.pageLoading = true
        cmdbGetMappingList({ ciId: this.currentItem.cmdbCiId }).then(res => {
          this.pageLoading = false
          this.relationship = res.data
        }).catch(() => {
          this.pageLoading = false
        })


        // if (this.showType != '新增') {
        //   this.pageLoading = true
        //   cmdbGetMappingList({id: this.arrtId}).then(res => {
        //     this.pageLoading = false
        //     this.submitForm = res.data
        //     this.submitForm.cmdbCiId = this.submitForm.cmdbCiId.toString()

        //     this.getCmdbList(this.submitForm)
        //   }).catch(() => {
        //     this.pageLoading = false
        //   })
        // }
      },
      // 保存
      handleSave() {
        // this.$refs.submitForm.validate((valid) => {
        //   if (valid) {
            this.saveLoading = true
            cmdbInsertRelation(this.relationship).then(res => {
              this.saveLoading = false
              this.$message({
                type: 'success',
                message: '保存成功！'
              });
              this.$emit('saveGlobalArrt')
            }).catch(() => {
              this.saveLoading = false
            })
        //   }
        // })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-radio-group{
    height: 300px;
    overflow: auto;
    margin-top: 5px;
  }
  .shang{
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .el-form-item {
      margin-bottom: 5px;
    }
    .shang-l{
      flex: 1;
    }
    .el-icon-sort{
      transform: rotate(90deg);
      font-size: 21px;
      font-weight: bold;
    }
    .shang-r{
      flex: 1;
    }
    .middle{
      border: 1px solid rgb(217,217,217);
      border-radius: 5px;
      padding: 10px 15px;
      position: relative;

      .middle_t{
        border-bottom: 1px solid #d9d9d9;
        padding-bottom: 8px;
        margin-bottom: 5px;
        font-size: 15px;
      }

      .el-radio{
        display: block;
        margin-top: 9px;
      }
      
    }
  }

  .zhong{
    border: 1px solid rgb(217,217,217);
    border-radius: 5px;
    padding: 10px 15px;
    margin-top: 20px;
    height: 200px;
    overflow: auto;
    .zhong-l{
      display: flex;
    }
    .zhong-r{
      margin-right: 20px;
    }
    .zhong-c{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 5px 0;

      span{
        color: #409EFF;
        margin: 0 15px;
      }
    }
  }
</style>
