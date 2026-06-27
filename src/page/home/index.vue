<template>
  <div id="app">
    <!-- 顶部用户信息 -->
    <div class="user-info">
      <!-- <span>游客</span>
      <el-dropdown>
        <span class="el-dropdown-link">
          <i class="el-icon-setting"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-if="!ticket" @click.native="login">ISC登录</el-dropdown-item>
          <el-dropdown-item v-else>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 时钟和日期 -->
      <div class="clock-section">
        <div class="time">{{ currentTime }}</div>
        <div class="date" v-html="currentDate"></div>
      </div>

      <!-- 搜索框 -->
      <div class="search-section">
        <el-input
          v-model="searchText"
          placeholder="输入搜索内容"
          prefix-icon="el-icon-search"
          style="width: 760px;"
          @keyup.enter="search">
        </el-input>
        <el-button class="search-button" @click="search">搜索</el-button>
      </div>

      <!-- 内容卡片区域 -->
      <div class="cards-section">
        <!-- 信息发布卡片 -->
        <el-card class="info-card">
          <div class="info-header">
            <el-tabs v-model="activeInfoTab" type="border-card" class="info-tabs">
              <el-tab-pane name="info">
                <template slot="label">
                  <span class="info-icon"></span>
                  <span>信息发布</span>
                </template>
                <div class="info-list">
                  <div class="info-item" v-for="(item, index) in infoList" :key="index" @click="navigateToUrl(item.url)">
                    <i class="el-icon-bell"></i>
                    <span class="info-title">{{ item.title }}</span>
                    <span class="info-date">{{ item.createTime }}</span>
                  </div>
                </div>
              </el-tab-pane>
              <div class="more-link">
                <span>>></span>
              </div>
            </el-tabs>
          </div>
        </el-card>

        <!-- 公司导航卡片 -->
        <el-card class="nav-card">
          <div class="nav-header">
            <el-input
              v-model="navSearch"
              placeholder="请输入"
              size="small"
              class="nav-input"
              clearable
              @keyup.enter.native="fetchNavItems(navSearch)">
            </el-input>
            <el-tabs v-model="activeNav" type="border-card" class="nav-tabs">
              <el-tab-pane name="company">
                <template slot="label">
                  <span class="tab-icon"></span>
                  <span>公司导航</span>
                </template>
                <div class="nav-items">
                  <div class="nav-item" v-for="(item, index) in navItems" :key="index">
                    <div class="nav-icon" @click="navigateToUrl(item.url)">
                      <img v-if="item.icon" :src="item.icon" />
                      <i v-else class="el-icon-office-building"></i>
                    </div>
                    <span class="nav-name">{{ item.name }}</span>
                  </div>
                </div>
                <div class="more-link" style="bottom: -20px;right: -16px;">
                  <span>>></span>
                </div>
              </el-tab-pane>
              <!-- <el-tab-pane name="favorites">
                <template slot="label">
                  <span class="tab-icon"></span>
                  <span>收藏夹导航</span>
                </template>
                <div class="nav-items">
                  <div class="nav-item" v-for="(item, index) in favoritesItems" :key="index">
                    <div class="nav-icon-container">
                      <div class="nav-icon" @click="navigateToUrl(item.url)">
                        <img v-if="item.icon" :src="item.icon" :alt="item.name" />
                        <i v-else class="el-icon-star-on"></i>
                      </div>
                      <div class="nav-item-actions">
                        <i class="el-icon-edit" @click.stop="editFavorite(item, index)"></i>
                        <i class="el-icon-delete" @click.stop="deleteFavorite(item, index)"></i>
                      </div>
                    </div>
                    <span class="nav-name">{{ item.name }}</span>
                  </div>
                  <div class="nav-item add-favorite">
                    <div class="nav-icon add-icon" @click="addFavorite">
                      <i class="el-icon-plus"></i>
                    </div>
                    <span class="nav-name"></span>
                  </div>
                </div>
              </el-tab-pane> -->
            </el-tabs>
          </div>
        </el-card>
      </div>
    </div>
    <!-- 新增/编辑收藏弹窗 -->
    <AddFavoriteDialog
      :visible="showAddFavoriteDialog"
      :edit-data="currentEditData"
      @close="handleCancelAddFavorite"
      @submit="handleAddFavorite"
    />
  </div>
</template>

<script>
import AddFavoriteDialog from './components/AddFavoriteDialog.vue';
import request from '@/router/axios';

export default {
  name: 'HomePage',
  components: {
    AddFavoriteDialog
  },
  data() {
    return {
      currentTime: '',
      currentDate: '',
      searchText: '',
      navSearch: '',
      activeNav: 'company',
      activeInfoTab: 'info',
      navItems: [],
      favoritesItems: [],
      infoList: [],
      popup: null,
      ticket:'',
      // 新增/编辑收藏弹窗
      showAddFavoriteDialog: false,
      currentEditData: null
    }
  },
  mounted() {
    this.fetchNavItems();
    this.fetchFavoritesItems();
    this.fetchMessages();
    this.updateDateTime();
    setInterval(this.updateDateTime, 1000);
  },
  watch: {
    // activeNav(newVal) {
    //   if (newVal === 'favorites') {
    //     const w = 908;
    //     const h = 600;
    //     const left = (window.screen.width - w) / 2;
    //     const top = (window.screen.height - h) / 2;
        
    //     const popupUrl = `http://iscsso.sd.sgcc.com.cn/isc_sso/login?service=http://25.41.34.27/plugin/login`;
    //     this.popup = window.open(
    //       popupUrl,
    //       "_blank",
    //       `width=${w},height=${h},top=${top},left=${left},scrollbars=false`
    //     );
    //   }
    // }
  },
  methods: {
    updateDateTime() {
      const now = new Date();
      // 更新时间
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      this.currentTime = `${hours}:${minutes}`;
      
      // 更新日期
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      const weekDay = weekDays[now.getDay()];
      const lunarDate = this.getLunarDate(now);
      this.currentDate = `${year}-${month}-${day}&nbsp; ${weekDay}&nbsp; ${lunarDate}`;
    },
    getLunarDate(date) {
      // 简单的农历日期计算（实际项目中可能需要更复杂的农历库）
      const lunarMonths = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
      const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                        '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                        '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
      
      // 这里使用简化的计算，实际项目中建议使用专业的农历库
      const month = date.getMonth();
      const day = date.getDate();
      
      // 假设农历月份与公历月份相同（实际情况更复杂）
      const lunarMonth = lunarMonths[month];
      const lunarDay = lunarDays[day - 1] || lunarDays[lunarDays.length - 1];
      
      return `${lunarMonth}${lunarDay}`;
    },
    fetchNavItems(appName) {
      console.log('Fetching nav items...');
      request({
        url: '/api/idevelop-plugin/plugin/companyNav',
        method: 'get',
        params: appName ? { appName } : {},
        meta: {
          isToken: false
        }
      }).then(data => {
        if (data.code === 200 && data.data) {
          this.navItems = data.data.map((item) => {
            return {
              name: item.name || item.appName || '未知导航',
              url: item.url || item.appUrl || '',
              icon: item.icon || ''
            };
          });
        }
      }).catch(error => {
        console.error('Failed to fetch nav items:', error);
      });
    },
    fetchMessages() {
      console.log('Fetching messages...');
      request({
        url: '/api/idevelop-plugin/plugin/message/list',
        method: 'get',
        meta: {
          isToken: false
        }
      }).then(data => {
        if (data.code === 200 && data.data) {
          this.infoList = data.data.records.map(item => {
            return {
              ...item,
              createTime: item.createTime.split(' ')[0]
            };
          });
        }
      }).catch(error => {
        console.error('Failed to fetch messages:', error);
      });
    },
    fetchFavoritesItems() {
      console.log('Fetching favorites items...');
      request({
        url: '/api/idevelop-plugin/plugin/companyNav',
        method: 'get',
        meta: {
          isToken: false
        }
      }).then(data => {
        if (data.code === 200 && data.data) {
          this.favoritesItems = data.data.map((item) => {
            return {
              name: item.name || item.appName || '未知导航',
              url: item.url || item.appUrl || '',
              icon: item.icon || ''
            };
          });
        }
      }).catch(error => {
        console.error('Failed to fetch favorites items:', error);
      });
    },
    navigateToUrl(url) {
      if (url) {
        if (url) {
          // 确保URL包含协议头
          let fullUrl = url;
          if (!/^https?:\/\//i.test(url)) {
            fullUrl = 'http://' + url;
          }
          window.open(fullUrl, '_blank');
        }
      }
    },
    search() {
      if (this.searchText.trim()) {
        this.$router.push({
          path: '/search-result',
          query: {
            q: encodeURIComponent(this.searchText)
          }
        });
      }
    },
    login() {
      const w = 1440;
      const h = 680;
      const left = (window.screen.width - w) / 2;
      const top = (window.screen.height - h) / 2;
      
      const popupUrl = `http://iscxcsso.sd.sgcc.com.cn/isc_sso/login?service=http://25.41.34.27/plugin/login`;
      this.popup = window.open(
        popupUrl,
        "_blank",
        `width=${w},height=${h},top=${top},left=${left},scrollbars=false`
      );
    },
    handlePopupClose() {
      console.log('Handling popup close');
      // Since we can't access the popup's URL due to cross-origin restrictions,
      // we'll need to implement an alternative approach to get the authentication data
      // 
      // Option 1: Use a redirect back to the extension
      // The service provider should redirect back to a URL in the extension
      // with the authentication data as parameters
      // 
      // Option 2: Use postMessage to communicate between windows
      // This requires the popup to send a message to the parent window
      // before closing
      // 
      // For now, we'll just log that the popup was closed
      // and implement the actual authentication handling based on the chosen approach
    },
    addFavorite() {
      // 清除编辑数据，确保是新增模式
      this.currentEditData = null;
      // 打开弹窗
      this.showAddFavoriteDialog = true;
    },
    handleAddFavorite(formData) {
      console.log('Submit favorite:', formData, this.currentEditData ? 'Edit' : 'Add');
      // 实现新增或编辑收藏的逻辑
      // 这里可以调用API保存收藏信息
      // 保存成功后关闭弹窗并刷新收藏列表
      this.showAddFavoriteDialog = false;
      this.currentEditData = null;
      this.fetchFavoritesItems();
    },
    handleCancelAddFavorite() {
      // 关闭弹窗并清除编辑数据
      this.showAddFavoriteDialog = false;
      this.currentEditData = null;
    },
    editFavorite(item, index) {
      console.log('Edit favorite:', item, index);
      // 设置编辑数据
      this.currentEditData = item;
      // 打开弹窗
      this.showAddFavoriteDialog = true;
    },
    deleteFavorite(item, index) {
      console.log('Delete favorite:', item, index);
      // 实现删除收藏的逻辑
      // 这里可以显示确认对话框，然后删除收藏项
    }
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  background: url('./assets/background.png');
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
}

/* 背景装饰 */
#app::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(135deg, rgba(173, 216, 230, 0.3) 0%, transparent 50%),
    linear-gradient(45deg, rgba(144, 238, 144, 0.3) 0%, transparent 50%);
  pointer-events: none;
}

/* 用户信息 */
.user-info {
  position: absolute;
  top: 20px;
  right: 20px;
  color: #666;
  font-size: 14px;
  z-index: 10;
}

.user-info span {
  margin-right: 10px;
}

.el-dropdown-link {
  color: #666;
  cursor: pointer;
}

/* 主内容区域 */
.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 60px;
  position: relative;
  z-index: 1;
}

/* 时钟区域 */
.clock-section {
  text-align: center;
  margin-bottom: 40px;
}

.time {
  font-size: 8em;
  font-family: 'Lao Sans Pro';
  font-weight: Regular;
  color: rgb(10, 95, 88);
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: 5px;
}

.date {
  font-size: 1.2em;
  color: #666;
}

/* 搜索区域 */
.search-section {
  margin-bottom: 40px;
}

.search-button {
  background: linear-gradient(135deg, rgb(0, 197, 134) 0%, rgb(97, 224, 181) 100%);
  color: #ffffff;
  border: none;
  margin-left: 10px;
}
/* 卡片区域 */
.cards-section {
  display: flex;
  gap: 30px;
  width: 90%;
}
:deep .el-card__header {
    padding: 0 30px 0 20px;
    border-bottom: none;
}
:deep .el-card__body {
    padding: 20px 20px 0;
}
/* 信息发布卡片 */
.info-card {
  flex: 1;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
.el-tabs--border-card {
  background: none;
  box-shadow: none;
}
:deep .el-tabs__nav-scroll {
  background: #f4fdfb;
}
:deep .el-tabs--border-card>.el-tabs__header .el-tabs__item {
  border: none;
  color: rgb(153, 153, 153);
}
:deep .el-tabs--border-card>.el-tabs__header .el-tabs__item:hover {
  color: rgb(51, 51, 51) !important;
}
:deep .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
  background: #f4fdfb;
  color: rgb(51, 51, 51)!important;
}
.info-card {
  flex: 1;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.info-card .el-card__body {
  /* padding: 20px; */
  position: relative;
}

.info-header {
  margin-bottom: 10px;
  width: 100%;
}

.info-tabs {
  border: none !important;
}

.info-tabs .el-tabs__header {
  margin: 0 !important;
  border: none !important;
}

.info-tabs .el-tabs__nav {
  border: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

.info-tabs .el-tabs__active-bar {
  background-color: #409EFF !important;
}

.info-tabs .el-tabs__item {
  color: #666 !important;
  font-size: 14px;
  padding: 0 20px;
  height: 36px;
  line-height: 36px;
}

.info-tabs .el-tabs__item.is-active {
  color: #409EFF !important;
  font-weight: bold;
}

.info-list {
  padding: 0;
  height: 340px;
}

.info-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}

.info-item i {
  color: #409EFF;
  margin-right: 10px;
  font-size: 14px;
}

.info-title {
  flex: 1;
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info-date {
  font-size: 12px;
  color: #999;
  margin-left: 10px;
}

.el-tab-pane {
  position: relative;
  min-height: 360px; /* Ensure enough space for positioning */
}

.more-link {
  position: absolute;
  bottom: 0;
  right: 0;
  color: #409EFF;
  cursor: pointer;
  font-size: 14px;
  padding: 10px;
}

/* Ensure nav-tabs tab panes also have relative positioning */
.nav-tabs .el-tab-pane {
  position: relative;
  min-height: 350px;
}

/* 公司导航卡片 */
.nav-card {
  flex: 2;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.nav-card .el-card__body {
  padding: 20px;
  position: relative;
}

.nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  width: 100%;
  position: relative;
}

.nav-input {
  position: absolute; 
  width: 200px; 
  z-index: 10; 
  right: 25px; 
  top: 4px;
  .el-input__inner {
    border-radius: 16px;
  }
}


.nav-tabs {
  flex: 1;
  border: none !important;
}

.nav-tabs .el-tabs__header {
  margin: 0 !important;
  border: none !important;
}

.nav-tabs .el-tabs__nav {
  border: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

.nav-tabs .el-tabs__active-bar {
  background-color: #409EFF !important;
}

.nav-tabs .el-tabs__item {
  color: #666 !important;
  font-size: 14px;
  padding: 0 20px;
  height: 36px;
  line-height: 36px;
}

.nav-tabs .el-tabs__item.is-active {
  color: #409EFF !important;
  font-weight: bold;
}
.info-icon {
  display: inline-block;
  width: 25px;
  height: 20px;
  margin: -2px 4px 0 0;
  vertical-align: middle;
  background-image: url('./assets/1.png');
  background-size: cover;
  background-position: center;
}

.tab-icon {
  display: inline-block;
  width: 25px;
  height: 20px;
  margin: -2px 4px 0 0;
  vertical-align: middle;
  background-image: url('./assets/2.png');
  background-size: cover;
  background-position: center;
}

.nav-tabs .el-tabs__item.is-active .tab-icon {
  background-image: url('./assets/1.png');
}

.nav-items {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  row-gap: 30px;
  padding: 20px 0;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  padding: 10px;
  position: relative;
}

.nav-item:hover {
  /* background-color: rgba(64, 158, 255, 0.1); */
  border-radius: 8px;
}

.nav-icon-container {
  position: relative;
  margin-bottom: 10px;
}

.nav-item-actions {
  position: absolute;
  /* top: -5px;
  right: -5px; */
  top: 0;
  right: 0;
  display: flex;
  gap: 5px;
  opacity: 0;
  transition: opacity 0.3s;
}

.nav-item:hover .nav-item-actions {
  opacity: 1;
}

.nav-item-actions i {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-item-actions i:hover {
  background-color: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
}

.nav-icon {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
img {
    width: 100px;
    height: 100px;
    border-radius: 8px;
    object-fit: cover;
  }
.add-icon {
  background-color: white;
  color: #999;
  border: 1px dashed #ddd;
  box-shadow: none;
}

.add-favorite:hover {
  /* background-color: rgba(64, 158, 255, 0.05); */
  border-radius: 8px;
}

/* 图标上传区域样式 */
.icon-upload-area {
  width: 100px;
  height: 100px;
  border: 1px dashed #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 10px 0;
  font-size: 24px;
  color: #999;
}

.icon-upload-area:hover {
  border-color: #409EFF;
  color: #409EFF;
}

.icon-upload-tip {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.icon-blue {
  background: linear-gradient(135deg, #409EFF, #66b1ff);
}

.icon-orange {
  background: linear-gradient(135deg, #f7ba2a, #ffc53d);
}

.icon-green {
  background: linear-gradient(135deg, #67c23a, #85ce61);
}

.nav-name {
  font-size: 12px;
  color: #333;
  text-align: center;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .cards-section {
    width: 95%;
  }
  
  .nav-items {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (max-width: 1024px) {
  .cards-section {
    flex-direction: column;
  }
  
  .nav-items {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .main-content {
    padding-top: 80px;
  }
  
  .time {
    font-size: 3.5em;
  }
}

@media (max-width: 768px) {
  .time {
    font-size: 3em;
  }
  
  .search-section {
    width: 90%;
  }
  
  .nav-items {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .main-content {
    padding-top: 60px;
  }
  
  .cards-section {
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .time {
    font-size: 2.5em;
  }
  
  .date {
    font-size: 1em;
  }
  
  .nav-items {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .main-content {
    padding-top: 40px;
  }
  
  .user-info {
    font-size: 12px;
  }
}

/* 确保页面在不同屏幕尺寸下等比例缩放 */
@media (max-width: 360px) {
  .time {
    font-size: 2em;
  }
  
  .nav-items {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .nav-icon {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  
  .nav-name {
    font-size: 10px;
  }
}
</style>