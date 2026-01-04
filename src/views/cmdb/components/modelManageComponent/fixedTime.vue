<template>
  <div class="fixedCon">
    <span style="margin-right: 6px">
      每 
      <el-popover
        ref="popover1"
        placement="top-start"
        trigger="click"
      >
        <div class="time-group">
          <div 
            :class="{ selected: isItemSelected('controller', item) }"
            class="time-group-item" 
            v-for="item in controller"
            :key="item.value"
            @click="selectItem('controller', item, 'mode')">
            {{ item.label }}
          </div>
        </div>
        <el-button slot="reference" size="mini"> {{ mode }} </el-button>
      </el-popover>
    </span>
    <!-- 星期 -->
    <span style="margin-right: 6px" v-if="showWeek">
      <el-popover
        ref="popover1"
        placement="top-start"
        trigger="click"
        width="450"
      >
        <div class="time-group">
          <div 
            :class="{ selected: isItemSelected('listDayofweek', item) }"
            class="time-group-item" 
            v-for="item in listDayofweek"
            :key="item"
            @click="selectItem('listDayofweek', item, 'dayofweek')">
            {{ formatWeek(item) }}

          </div>
        </div>
        <el-button slot="reference" size="mini"> {{ formatLabel(cronData.dayofweek, 'dayofweek') }} </el-button>
      </el-popover>
    </span>
    <!-- 几月 -->
    <span style="margin-right: 6px" v-if="showMonth">
      <!-- <el-input class="shukuang" v-model="month" placeholder="" size="mini" ></el-input> -->
      <el-popover
        ref="popover1"
        placement="top-start"
        trigger="click"
        width="450"
      >
        <div class="time-group">
          <div 
            :class="{ selected: isItemSelected('listMonth', item) }"
            class="time-group-item" 
            v-for="item in listMonth"
            :key="item"
            @click="selectItem('listMonth', item, 'month')">
            {{ formatMonth(item) }}
          </div>
        </div>
        <el-button slot="reference" size="mini"> {{ formatLabel(cronData.month, 'month') }} </el-button>
      </el-popover>
    </span>
    <span v-if="showDay">
      <!-- <el-input class="shukuang" v-model="date" placeholder="" size="mini" ></el-input> 日 -->
      <el-popover
        ref="popover1"
        placement="top-start"
        trigger="click"
        width="450"
      >
        <div class="time-group">
          <div 
            :class="{ selected: isItemSelected('listDayofmonth', item) }"
            class="time-group-item" 
            v-for="item in listDayofmonth"
            :key="item"
            @click="selectItem('listDayofmonth', item, 'dayofmonth')">
            {{ item }}
          </div>
        </div>
        <el-button slot="reference" size="mini"> {{ formatLabel(cronData.dayofmonth) }} </el-button>
      </el-popover>
      日
    </span>
    <span v-if="showHour">
      <!-- <el-input class="shukuang" v-model="hour" placeholder="" size="mini" ></el-input> 时 -->
      <el-popover
        ref="popover1"
        placement="top-start"
        trigger="click"
        width="450"
      >
        <div class="time-group">
          <div 
            :class="{ selected: isItemSelected('listHour', item) }"
            class="time-group-item" 
            v-for="item in listHour"
            :key="item"
            @click="selectItem('listHour', item, 'hour')">
            {{ item }}
          </div>
        </div>
        <el-button slot="reference" size="mini"> {{ formatLabel(cronData.hour) }} </el-button>
      </el-popover>
      时
    </span>
    <span v-if="showMinute">
      <!-- <el-input class="shukuang" v-model="mounte" placeholder="" size="mini" ></el-input> 分 -->
      <el-popover
        ref="popover1"
        placement="top-start"
        trigger="click"
        width="450"
      >
        <div class="time-group">
          <div 
            :class="{ selected: isItemSelected('listMinute', item) }"
            class="time-group-item" 
            v-for="item in listMinute"
            :key="item"
            @click="selectItem('listMinute', item, 'minute')">
            {{ item }}
          </div>
        </div>
        <el-button slot="reference" size="mini"> {{ formatLabel(cronData.minute) }} </el-button>
      </el-popover>
      分
    </span>
  </div>
</template>

<script>

import { attrtypeList, attrSave, attrDetail } from "@/api/system/ciModel";
import { validatorSearch } from "@/api/system/checkRulesManage";


export default {
  props: ["isShow", "ciId", "showType", "arrtId"],
  data() {
    return{
      showWeek: false,
      showMonth: false,
      showDay: false,
      showHour: false,
      showMinute: false,
      mode: '分钟',
      cronData: {
        second: '0',
        minute: '*',
        hour: '*',
        dayofmonth: '?',
        month: '*',
        dayofweek: '*',
        year: '*'
      },

      controller: [
        {
          label: '分钟',
          value: 'minute'
        },
        {
          label: '小时',
          value: 'hour'
        },
        {
          label: '天',
          value: 'dayofmonth'
        },
        {
          label: '星期',
          value: 'dayofweek'
        },
        {
          label: '月',
          value: 'month'
        },
        {
          label: '年',
          value: 'year'
        }
      ],
      listSecond: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'],
      listMinute: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'],
      listHour: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
      listDayofmonth: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
      listMonth: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
      listDayofweek: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
      // listMonth: [
      //   {
      //     label: '1月',
      //     value: 'JAN'
      //   },
      //   {
      //     label: '2月',
      //     value: 'FEB'
      //   },
      //   {
      //     label: '3月',
      //     value: 'MAR'
      //   },
      //   {
      //     label: '4月',
      //     value: 'APR'
      //   },
      //   {
      //     label: '5月',
      //     value: 'MAY'
      //   },
      //   {
      //     label: '6月',
      //     value: 'JUN'
      //   },
      //   {
      //     label: '7月',
      //     value: 'JUL'
      //   },
      //   {
      //     label: '8月',
      //     value: 'AUG'
      //   },
      //   {
      //     label: '9月',
      //     value: 'SEP'
      //   },
      //   {
      //     label: '10月',
      //     value: 'OCT'
      //   },
      //   {
      //     label: '11月',
      //     value: 'NOV'
      //   },
      //   {
      //     label: '12月',
      //     value: 'DEC'
      //   }
      // ],
      // listDayofweek: [
      //   {
      //     label: '星期日',
      //     value: 'SUN'
      //   },
      //   {
      //     label: '星期一',
      //     value: 'MON'
      //   },
      //   {
      //     label: '星期二',
      //     value: 'TUE'
      //   },
      //   {
      //     label: '星期三',
      //     value: 'WED'
      //   },
      //   {
      //     label: '星期四',
      //     value: 'THU'
      //   },
      //   {
      //     label: '星期五',
      //     value: 'FRI'
      //   },
      //   {
      //     label: '星期六',
      //     value: 'SAT'
      //   }
      // ],

      monthObj: {
        'JAN':'1月',
        'FEB':'2月',
        'MAR':'3月',
        'APR':'4月',
        'MAY':'5月',
        'JUN':'6月',
        'JUL':'7月',
        'AUG':'8月',
        'SEP':'9月',
        'OCT':'10月',
        'NOV':'11月',
        'DEC':'12月',
      },
      dayofweekObj: {
        'SUN': '星期日',
        'MON': '星期一',
        'TUE': '星期二',
        'WED': '星期三',
        'THU': '星期四',
        'FRI': '星期五',
        'SAT': '星期六',
      },
      // controller: ['minute', 'hour', 'dayofmonth', 'dayofweek', 'month', 'year'],
      // listMonth: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
      // listDayofweek: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],


     
    }
  },
  computed: {
    cronType() {
      if (this.cronData.month != '*') {
        // return 'year';
        return '年'
      } else if (this.cronData.dayofmonth != '*' && this.cronData.dayofmonth != '?') {
        // return 'month';
        return '月';
      } else if (this.cronData.dayofweek != '*' && this.cronData.dayofweek != '?') {
        // return 'dayofweek';
        return '星期';
      } else if (this.cronData.hour != '*') {
        // return 'dayofmonth';
        return '天';
      } else if (this.cronData.minute != '*') {
        // return 'hour';
        return '小时';
      } else {
        // return 'minute';
        return '分钟';
      }
    }
  },
  mounted() {
    
  },
  methods: {
    formatMonth(val){
      return this.monthObj[val]
    },
    formatWeek(val){
      return this.dayofweekObj[val]
    },
    getData(cornArr){

      if( cornArr ){
        cornArr = cornArr.split(' ')
        let index = 0;
        for (let key in this.cronData) {
          // console.log(10, key, this.cronData[key])
          this.$set(this.cronData, key, cornArr[index]);
          index++
        }
        // console.log(20, this.cronData, this.cronType)

        this.showOrHide(this.cronType)
      }else{  // 当点击 新建规则时
        this.cronData = {
          second: '0',
          minute: '*',
          hour: '*',
          dayofmonth: '?',
          month: '*',
          dayofweek: '*',
          year: '*'
        }

        this.showOrHide('分钟')
      }
      
    },
    showOrHide(label){
      // 控制显示/隐藏
      if(label == '分钟'){
        this.showWeek = false
        this.showMonth = false
        this.showDay = false
        this.showHour = false
        this.showMinute = false
      }else if(label == '小时'){
        this.showWeek = false
        this.showMonth = false
        this.showDay = false
        this.showHour = false
        this.showMinute = true
      }else if(label == '天'){
        this.showWeek = false
        this.showMonth = false
        this.showDay = false
        this.showHour = true
        this.showMinute = true
      }else if(label == '星期'){
        this.showWeek = true
        this.showMonth = false
        this.showDay = false
        this.showHour = true
        this.showMinute = true
      }else if(label == '月'){
        this.showWeek = false
        this.showMonth = false
        this.showDay = true
        this.showHour = true
        this.showMinute = true
      }else if(label == '年'){
        this.showWeek = false
        this.showMonth = true
        this.showDay = true
        this.showHour = true
        this.showMinute = true
      }
    },

    selectItem(type, item, namen){

      if( type == 'controller' ){
        this.mode = item.label
        if( item.label == '星期' ){
          // this.cronData.dayofmonth = '*'
          // this.cronData.dayofweek = '?'
          this.cronData = {
            second: '0',
            minute: '*',
            hour: '*',
            dayofmonth: '*',
            month: '*',
            dayofweek: '?',
            year: '*'
          }
        }else{
          // this.cronData.dayofmonth = '?'
          // this.cronData.dayofweek = '*'
          this.cronData = {
            second: '0',
            minute: '*',
            hour: '*',
            dayofmonth: '?',
            month: '*',
            dayofweek: '*',
            year: '*'
          }
        }
        // 控制显示/隐藏
        this.showOrHide(item.label)
      } 

      // else if( type == 'listMonth' || type == 'listDayofweek' ){
        
      //   let labell = item.label
      //   const vList = this.cronData[namen] == '*' || this.cronData[namen] == '?' ? [] : this.cronData[namen].split(',');
      //   const index = vList.findIndex(d => d === labell);
      //   if (index > -1) {
      //     vList.splice(index, 1);
      //   } else {
      //     vList.push(labell);
      //   }
      //   if (vList.length > 0) {
      //     this.cronData[namen] = vList.join(',');
      //   } else {
      //     this.cronData[namen] = '*';
      //   }
      // } 
      
      else {
        let labell = item
        const vList = this.cronData[namen] == '*' || this.cronData[namen] == '?' ? [] : this.cronData[namen].split(',');
        const index = vList.findIndex(d => d === labell);
        if (index > -1) {
          vList.splice(index, 1);
        } else {
          vList.push(labell);
        }
        if (vList.length > 0) {
          this.cronData[namen] = vList.join(',');
        } else {
          this.cronData[namen] = '*';
        }
      }

      if( this.cronData.dayofmonth != '*' && this.cronData.dayofmonth != '?' ){
        this.cronData.dayofweek = '?'
      }
      if( this.cronData.dayofweek != '*' && this.cronData.dayofweek != '?' ){
        this.cronData.dayofmonth = '?'
      }   

      let paramsCron = JSON.parse(JSON.stringify(this.cronData))

      // if( paramsCron.month != '*' && paramsCron.month != '?' ){
      //   let kkk = paramsCron.month.split(',')
      //   let strr = kkk.map(el=>{
      //     return this.monthObj[el]
      //   }).join(',')
      //   paramsCron.month = strr
      // }

      // if( paramsCron.dayofweek != '*' && paramsCron.dayofweek != '?' ){
      //   let kkk = paramsCron.dayofweek.split(',')
      //   let strr = kkk.map(el=>{
      //     return this.dayofweekObj[el]
      //   }).join(',')
      //   paramsCron.dayofweek = strr
      // }
      this.$emit("onCron", paramsCron)
    },
    isItemSelected(type, item){
      if( type == 'controller' ){
        if(this.mode){
          return item.label == this.mode
        }
      } else if( type == 'listDayofweek' ){
        let selectWeekArr = this.cronData.dayofweek.split(',')
        return selectWeekArr.includes(item)
      } else if( type == 'listMonth' ){
        let selectMonthArr = this.cronData.month.split(',')
        return selectMonthArr.includes(item)
      } else if( type == 'listDayofmonth' ){
        let selectDayArr = this.cronData.dayofmonth.split(',')
        return selectDayArr.includes(item)
      } else if( type == 'listHour' ){
        let selectHourArr = this.cronData.hour.split(',')
        return selectHourArr.includes(item)
      } else if( type == 'listMinute' ){
        let selectMinuteArr = this.cronData.minute.split(',')
        return selectMinuteArr.includes(item)
      }
    },
    formatLabel(value, type){
      if(value == '*'){
        return '所有'
      }else if(value == '?'){
        return '不指定'
      }else{
        if(type == 'dayofweek'){
          let kkk = value.split(',')
          let strr = kkk.map(el=>{
            return this.dayofweekObj[el]
          }).join(',')
          return strr
        }

        if(type == 'month'){
          let kkk = value.split(',')
          let strr = kkk.map(el=>{
            return this.monthObj[el]
          }).join(',')
          return strr 
        }

        return value
      }
    },
    getDeatil() {
      
    }
      
  }
}
</script>
<style lang='scss' scoped>
  .time-group{
    .time-group-item{
      float: left;
      text-align: center;
      white-space: nowrap;
      padding: 3px;
      margin: 2px;
      min-width: 40px;
      border-radius: 3px;
      user-select: none;
      box-sizing: border-box;
      font-size: 13px;
      cursor: pointer;

      &:hover{
        background: #409EFF;
        color: #ffffff;
      }
    }
    .selected {
      background: #409EFF;
      color: #ffffff;
    }
  }
  ::v-deep .shukuang{
    width: 45px;
    margin-left: 10px;
    // &:first-child{
    //   margin-left: 0;
    // }
    >input{
      padding: 0 10px;
    }
  }
  .mal0{
    margin-left: 0;
  }
</style>
