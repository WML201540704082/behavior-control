<template>
  <div class="wel">
      <div class="system">
        <div class="system_item" @click="goDesk">
          <img src="../../assets/wel/left.png" alt="">
          进入系统
        </div>
        <div class="system_item">
         首页
        </div>
      </div>
      <Ledger></Ledger>
      <div class="mainm">
        <div class="mainm_l">
          <div class="mainm_tt">
            <div class="desk_title">
              信创设备区
              <img src="../../assets/desk/jiantou.png" alt="">
            </div>
            <!-- <div class="mainm_ttr">
              新创替代率：<span>{{ patentProbability }}%</span>
            </div> -->
          </div>
          <div class="mainm_l1 mainm_l122 kuai">
            <Xinchuang ref="xinchuang"></Xinchuang>
          </div>
          <div class="mainm_l1 kuai">
            <div class="wei_line">
              <div class="wei_line_l">
                <div class="fang"></div>
                芯片架构
              </div>
            </div>
            <Xinpian></Xinpian>
          </div>
          <div class="mainm_l1 kuai">
            <div class="wei_line">
              <div class="wei_line_l">
                <div class="fang"></div>
                实时在线分布趋势图
              </div>
              <div class="wei_line_r">
                <el-select size="mini" v-model="dates" @change="datesChange" placeholder="">
                  <el-option label="2024年7月" value="7"></el-option>
                  <el-option label="2024年6月" value="6"></el-option>
                  <el-option label="2024年5月" value="5"></el-option>
                  <el-option label="2024年4月" value="4"></el-option>
                  <el-option label="2024年3月" value="3"></el-option>
                </el-select>
              </div>
            </div>
            <Zaixian ref="zaixian" :dates="dates"></Zaixian>
          </div>
        </div>
        <div class="mainm_c">
          <div class="mainm_ct">
            <div class="navv">
              <div class="navv_item1">工具保鲜</div>
              <div class="navv_item"></div>
              <div class="navv_item"></div>
              <div class="navv_item"></div>
            </div>
            <Mainc></Mainc>
          </div>
          <div class="mainm_cb">
            <div class="mainm_cb_l">

                  <div class="mainm_tt">
                    <div class="desk_title">
                      告警处置一周统计
                      <img src="../../assets/desk/jiantou.png" alt="">
                    </div>
                  </div>
                <div class="mainm_cb_c kuai">
                  <WarningDispose></WarningDispose>
                </div>
            </div>
            <div class="mainm_cb_r">
              <div class="mainm_tt">
                <div class="desk_title">
                  实时告警管理
                  <img src="../../assets/desk/jiantou.png" alt="">
                </div>
              </div>
              <div class="mainm_cb_c kuai2">
                <WarningInfo></WarningInfo>
              </div>
            </div>
          </div>
        </div>
        <div class="mainm_l mainm_r">
          <div class="mainm_tt">
            <div class="desk_title">
              老旧设备管理统计分析
              <img src="../../assets/desk/jiantou.png" alt="">
            </div>
          </div>
          <div class="mainm_l1 mainm_l122 kuai">
            <div class="wei_line">
              <div class="wei_line_l">
                <div class="fang"></div>
                超龄分布图
              </div>
              <div class="wei_line_r">
                <el-select size="mini" v-model="type1" placeholder="">
                  <el-option label="基础设施和网络" value="1"></el-option>
                </el-select>
              </div>
            </div>
            <Overage></Overage>
          </div>
          <div class="mainm_l1 kuai">
            <div class="wei_line">
              <div class="wei_line_l">
                <div class="fang"></div>
                设备老旧趋势图
              </div>
            </div>
            <OldNew></OldNew>
          </div>
          <div class="mainm_l1 kuai">
            <div class="wei_line">
              <div class="wei_line_l">
                <div class="fang"></div>
                老旧设备识别模型
              </div>
              <div class="wei_line_r">
                <div class="tab_btns">
                  <!-- <div class="tab_btns_item tab_btns_item_active">基础设施和网络</div>
                  <div class="tab_btns_item">安全</div>
                  <div class="tab_btns_item">主机</div>
                  <div class="tab_btns_item">存储设备</div> -->

                  <div
                    v-for="(itemm, index) in menu"
                    :key="index"
                    :class="{tab_btns_item: true, tab_btns_item_active: index==currnetIndex}"
                    @click="oldClick(index)"
                  >{{ itemm }}</div>
                </div>
              </div>
            </div>
            <Model ref="model1"></Model>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import Ledger from './components/ledger'
  import Xinchuang from './components/xinchuang'
  import Xinpian from './components/xinpian'
  import Zaixian from './components/zaixian'
  import Mainc from './components/mainc'

  import WarningDispose from "./components/warningDispose"
  import WarningInfo from "./components/warningInfo"
  import Overage from "./components/overage"
  import OldNew from "./components/oldNew"
  import Model from "./components/model"

  export default {
    name: "wel",
    components: {
      Ledger,
      Xinchuang,
      Xinpian,
      Zaixian,
      Mainc,
      WarningDispose,
      WarningInfo,
      Overage,
      OldNew,
      Model
    },
    data() {
      return {
        dates: '7',
        currnetIndex: 0,
        menu: [
          "基础设施和网络",
          "安全",
          "主机",
          "存储设备"
        ],
        type1: '1'
      };
    },
    computed: {
      ...mapGetters(["userInfo"])
    },
    created() {
    },
    mounted(){

    },
    methods: {
      oldClick(index){
        this.currnetIndex = index;
        this.$refs.model1['init'+index]()
      },
      goDesk() {
        this.$router.push('/personalDesk/desk')
        //  this.$closePage('/personalDesk/desk');
      },
      datesChange(){
        setTimeout(() => {
          this.$refs.zaixian.getData()
        }, 100);

      }
    }
  };
</script>

<style lang="scss" scoped>
  .wel{
    width: 100%;
    height: calc(100% - 1px);
    overflow: hidden;
    padding: 10px;
    background: #eff6fe;
    .system{
      width: 100%;
      .system_item{
        color: #14287B;
        font-size: 18px;
        font-weight: 600;
        line-height: 24px;
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        cursor: pointer;
        img{
          width: 16px;
          height: 16px;
          margin-right: 3px;
        }
      }
    }
    .mainm{
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-top: 12px;

      .mainm_l{
        width: 25%;
        .mainm_tt{
          position: relative;

          // .mainm_ttr{
          //   position: absolute;
          //   top: 15px;
          //   right: 0;
          //   color: #192C7D;
          //   font-size: 12px;

          //   span{
          //     color: #21c190;
          //     font-size: 14px;
          //   }
          // }
        }

        .mainm_l1{
          width: 100%;
          height: 240px;
        }
        .mainm_l122{
          height: 235px;
        }
        .mainm_l2{
          width: 100%;
          height: 245px;
        }
        .mainm_l3{
          width: 100%;
          height: 245px;
        }
      }
      .mainm_c{
        width: 48%;
      }
      .mainm_r{
        width: 25%;
      }
    }
    .wei_line{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      .wei_line_l{
        font-size: 14px;
        display: flex;
        align-items: center;
        font-weight: 500;
        color: #192C7D;
      }
      .wei_line_r{
        ::v-deep .el-select .el-input__inner{
          border-radius: 20px;
          background: #DDDEFF;
          color: #0750cf;
        }
        ::v-deep .el-select .el-input .el-select__caret{
          color: #0750cf;
        }
        .tab_btns{
          display: flex;


          .tab_btns_item{
            margin-left: 8px;
            font-size: 12px;
            color: #405466;
            background: #FBFBFD;
            border-radius: 8px;
            font-weight: 600;
            padding: 6px 8px;
            cursor: pointer;
          }
          .tab_btns_item_active{
            background: #192C7D;
            color: #fff;
          }
        }
      }
      .fang{
        width: 6px;
        height: 6px;
        background: #9EC2FF;
        margin-right: 5px;
      }
    }

    .kuai{
      background: linear-gradient(88deg, #cadefe 0%, #cadefe 100%);
      // background: linear-gradient(88deg, #E6F0FE 0%, #ECF4FE 100%);
      // background: linear-gradient(88deg,#bcd7fe  0%, #E6F0FE 100%);#bcd7fe
      box-shadow: 0px 2px 8px 0px rgba(1,51,100,0.04);
      border-radius: 8px;
      margin-top: 10px;
      // border: 1px solid #333;
      padding: 10px 10px;
      box-sizing: border-box;
    }




    .mainm_ct{
      width: 100%;
      height: 510px;

      .navv{
        display: flex;
        justify-content: center;
        font-size: 12px;
        margin-top: 5px;
        .navv_item1{
          height: 30px;
          line-height: 30px;
          padding: 0 15px;
          background: #192C7D;
          color: #fff;
          border-radius: 8px;
          margin-right: 5px;
        }
        .navv_item{
          width: 40px;
          height: 30px;
          line-height: 30px;
          background: #FBFBFD;
          border-radius: 8px;
          margin-right: 5px;
        }
      }
    }
    .mainm_cb{
      width: 100%;
      display: flex;
      justify-content: space-between;
      .mainm_cb_l{
        width: 49%;
        height: 245px;
      }
      .mainm_cb_r{
        width: 49%;
        height: 245px;
      }
      .mainm_cb_c{
        width: 100%;
        height: 225px;
      }
      .kuai{
        margin-top: 0 !important;
      }
      .kuai2{
        border-radius: 6px;
        box-shadow: 1px 2px 10px #ccc;
      }
    }


  }

  .desk_title{
    color: #192C7D;
    font-weight: 600;
    line-height: 30px;
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    font-size: 18px;
    // background: url('../../assets/desk/jiantou.png') no-repeat 100px center;
    img{
      width: 18px;
      height: 18px;
      margin-left: 10px;
    }
  }
</style>

