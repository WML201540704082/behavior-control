<template>
  <div id="search-result">
    <!-- 搜索栏 -->
    <div class="search-header">
      <div class="logo">
        <img src="./assets/lr-soft.png" alt="鲁软" />
      </div>
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="输入搜索内容"
          style="width: 848px;height: 45px;border-radius: 22px;border-right: none;"
          @keyup.enter="performSearch"                            
        >
          <el-button 
            slot="append" 
            @click="performSearch"
            style="background: linear-gradient(135deg, #409EFF 0%, #80bbf5);
                  color: #ffffff;font-size: 15px;font-weight: 500;border-radius: 10px;height: 40px;padding: 13px;">
            智能搜索
          </el-button>
        </el-input>
      </div>
    </div>

    <!-- 导航标签 -->
    <div class="nav-tabs">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="信创知识库" name="knowledge"></el-tab-pane>
        <el-tab-pane label="软件商城" name="softMall"></el-tab-pane>
      </el-tabs>
    </div>

    <!-- 搜索结果 -->
    <div class="search-results">
      <div class="result-stats" v-if="searchTime">
        找到相关结果 {{ resultCount }} 个，用时 {{ searchTime }} 秒
      </div>
      
      <el-loading v-loading="loading" :fullscreen="false" text="搜索中..."></el-loading>
      <div v-if="activeTab === 'knowledge'">
        <div v-if="!loading && (knowledgeResults.length > 0 || resourceResults.length > 0)">
          <!-- 知识列表 -->
          <div v-if="knowledgeResults.length > 0" class="knowledge-section">
            <!-- <h3 class="section-title">知识列表</h3> -->
            <div class="knowledge-list">
              <div v-for="(item, index) in knowledgeResults" :key="'knowledge-' + index" class="knowledge-item">
                <h4 class="knowledge-title">{{ item.title || '无标题' }}</h4>
                <p class="knowledge-desc">问题描述：{{ item.problem || '暂无问题描述' }}</p>
                <p class="knowledge-desc">解答：{{ item.answer || '暂无解答' }}</p>
                <div class="knowledge-meta">
                  <span v-if="item.createTime" class="knowledge-time">创建时间: {{ item.createTime }}</span>
                  <span v-if="item.deptName" class="knowledge-time">单位: {{ item.deptName }}</span>
                </div>
              </div>
            </div> 
          </div>
          
          <!-- 资源列表 -->
          <div v-if="resourceResults.length > 0" class="resource-section">
            <!-- <h3 class="section-title">资源列表</h3> -->
            <div class="resource-list">
              <div v-for="(item, index) in resourceResults" :key="'resource-' + index" class="resource-item">
                <h4 class="resource-title">
                  <a v-if="item.path" :href="item.path" target="_blank">{{ item.title || '无标题' }}</a>
                  <span v-else>{{ item.title || '无标题' }}</span>
                </h4>
                <p class="resource-desc">{{ item.content || '暂无描述' }}</p>
                <div class="resource-meta">
                  <span v-if="item.createTime" class="resource-time">创建时间: {{ item.createTime }}</span>
                  <span v-if="item.viewCount" class="resource-time">浏览量: {{ item.viewCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="!loading && knowledgeResults.length === 0 && resourceResults.length === 0" class="no-results">
          暂无搜索结果
        </div>
      </div>
      <div class="app-grid" v-else>
        <div class="app-card" v-for="(app, index) in searchResults" :key="index">
          <div class="app-icon">
            <img :src="app.logoImage" :alt="app.showName" />
          </div>
          <div class="app-info">
            <div class="app-header">
              <h3 class="app-name" :title="app.showName">{{ app.showName }}</h3>
              <div class="app-score">{{ app.averageScore }}分</div>
            </div>
            <p class="app-desc" :title="app.recommend">{{ app.recommend }}</p>
            <div class="app-footer">
              <span class="app-download-count">下载量: {{ app.downNum }}</span>
              <el-button type="primary" size="small" class="download-button" plain @click="downloadApp(app)">下载</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import smCrypto from 'sm-crypto';
import request from '@/router/axios';
export default {
  data() {
    return {
      activeTab: 'knowledge',
      searchQuery: '',
      searchResults: [],
      knowledgeResults: [],
      // knowledgeResults: [
      //   {
      //     answer: '123',
      //     deptName: '国网青岛公司',
      //     title: '关闭免费登录',
      //     problem: '嗯嗯嗯嗯',
      //     createTime: '2025-12-25 14:15:17',
      //   },{
      //     answer: '123',
      //     deptName: '国网青岛公司',
      //     title: '关闭免费登录',
      //     problem: '嗯嗯嗯嗯',
      //     createTime: '2025-12-25 14:15:17',
      //   }
      // ],
      resourceResults: [],
      // resourceResults: [
      //   {
      //     answer: '123',
      //     title: '关闭免费登录',
      //     content: '看见啊点话费卡是否健康',
      //     viewCount: 9,
      //     createTime: '2025-12-25 14:15:17',
      //     path: 'https://docs.google.com/viewer?url=https://raw.githubusercontent.com/mozilla/pdf.js/master/test/pdfs/basic.pdf'
      //   },{
      //     answer: '123',
      //     title: '关闭免费登录',
      //     content: '看见啊点话费卡是否健康',
      //     viewCount: 9,
      //     createTime: '2025-12-25 14:15:17',
      //     path: 'https://docs.google.com/viewer?url=https://raw.githubusercontent.com/mozilla/pdf.js/master/test/pdfs/basic.pdf'
      //   }
      // ],
      resultCount: 0,
      searchTime: 0,
      loading: false,
      mallUrl: 'http://25.219.129.212:19010/prod-api/',
      suid: ''
    }
  },
  mounted() {
    // 从URL获取搜索参数
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) {
      this.searchQuery = query;
      this.knowledgeSearch();
    }
  },
  watch: {
    activeTab(newTab) {
      if (newTab === 'knowledge' && this.searchQuery) {
        this.knowledgeSearch();
      }
      if (newTab === 'softMall' && this.searchQuery) {
        this.mallSearch();
      }
    }
  },
  methods: {
    performSearch() {
      if (this.activeTab === 'knowledge') {
        this.knowledgeSearch();
      } else if (this.activeTab === 'softMall') {
        this.mallSearch();
      }
    },
    async knowledgeSearch() {
      if (!this.searchQuery) {
        return;
      }
      
      try {
        const startTime = Date.now();
        this.loading = true;
        
        // 1. 先获取spuk和kid
        // const spukUrl = 'http://25.41.34.27/api/idevelop-auth/k';
        const spukUrl = '/api/idevelop-auth/k';
        const spukResponse = await fetch(spukUrl, {
          method: 'GET'
        });
        
        if (!spukResponse.ok) {
          throw new Error('获取spuk失败');
        }
        
        const spukResult = await spukResponse.json();
        const spuk = spukResult.data && spukResult.data.idevelop_spuk;
        const kid = spukResult.data && spukResult.data.idevelop_kid;
        
        if (!spuk || !kid) {
          throw new Error('未获取到完整的spuk信息');
        }
        
        // 2. 生成SM2密钥对并加密cpuk
        const keyPair = this.createSM2Key();
        const cpuk = keyPair.publicKey;
        const enCpuk = this.encryptBySM2(cpuk, spuk);
        
        // 3. 加密密码
        const password = 'Asdzxc@123';
        // const password = 'Itump@LS+00';
        const encryptedPassword = this.encryptBySM2(password, spuk);
        
        // 3. 获取token
        // const tokenUrl = 'http://25.41.34.27/api/idevelop-auth/token';
        const tokenUrl = '/api/idevelop-auth/token';
        const formData = new FormData();
        formData.append('grantType', 'captcha');
        formData.append('account', 'ceshi_yunwei1');
        // formData.append('account', 'xtyth2');
        formData.append('password', encryptedPassword);
        formData.append('tenantId', '000000');
        
        const tokenResponse = await fetch(tokenUrl, {
          method: 'POST',
          headers: {
            'Authorization': 'Basic bmFydWk6bmFydWlfc2VjcmV0',
            'idevelop_enCpuk': enCpuk,
            'idevelop_kid': kid,
          },
          body: formData
        });
        
        if (!tokenResponse.ok) {
          throw new Error('获取token失败');
        }
        
        const tokenResult = await tokenResponse.json();
        const token = tokenResult.data.accessToken

        if (!token) {
          throw new Error('未获取到token');
        }
        
        // 2. 用token调用两个接口
        const headers = {
          'Authorization': 'Basic bmFydWk6bmFydWlfc2VjcmV0',
          'Idevelop-Auth': `bearer ${token}`
        };
        
        const encodedQuery = encodeURIComponent(this.searchQuery);
        
        // 并行调用两个接口
        const [knowledgeResponse, resourceResponse] = await Promise.all([
          // fetch(`http://25.41.34.27/api/idevelop-control/knowledge/page?current=1&size=20&tag=0&resourceCondition=${encodedQuery}&view=0`, {
          //   method: 'GET',
          //   headers: headers
          // }),
          // fetch(`http://25.41.34.27/api/idevelop-control/resource/list?current=1&size=20&resourceCondition=${encodedQuery}`, {
          //   method: 'GET',
          //   headers: headers
          // })
          fetch(`/api/idevelop-control/knowledge/page?current=1&size=20&tag=0&resourceCondition=${encodedQuery}&view=0`, {
            method: 'GET',
            headers: headers
          }),
          fetch(`/api/idevelop-control/resource/list?current=1&size=20&resourceCondition=${encodedQuery}`, {
            method: 'GET',
            headers: headers
          })
        ]);
        
        const knowledgeData = await knowledgeResponse.json();
        const resourceData = await resourceResponse.json();
        
        // 保存结果
        this.knowledgeResults = knowledgeData.data.records;
        this.resourceResults = resourceData.data.records;
        this.resultCount = this.knowledgeResults.length + this.resourceResults.length;
        
        const endTime = Date.now();
        this.searchTime = ((endTime - startTime) / 1000).toFixed(2);
        
      } catch (error) {
        console.error('知识搜索失败:', error);
        this.knowledgeResults = [];
        this.resourceResults = [];
        this.resultCount = 0;
      } finally {
        this.loading = false;
      }
    },
    mallSearch() {
      if (this.searchQuery) {
        this.loading = true;
        const startTime = Date.now();
        const apiUrl = `http://25.219.129.212:19010/prod-api/msdp-appstore/web/application/list?secondClassify=&sort=0&pageSize=20&pageNum=1&showName=${encodeURIComponent(this.searchQuery)}`;
        request({
          url: apiUrl,
          method: 'get',
          meta: {
            isToken: false
          }
        }).then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            if (data.code === 200) {
              this.searchResults = data.data.records;
              this.resultCount = data.data.total;
            } else {
              throw new Error(`API error! code: ${data.code}, message: ${data.msg}`);
            }
          })
          .catch(error => {
            console.error('API调用失败:', error);
          })
          .finally(() => {
            const endTime = Date.now();
            this.searchTime = ((endTime - startTime) / 1000).toFixed(2);
            this.loading = false;
          });
      }
      // this.searchResults = [{
      //   appId: "1213",
      //   packagePath: "234",
      //   appUrl: null,
      //   averageScore: "3.9",
      //   classify: "应用",
      //   downNum: 128548,
      //   logoImage: "chrome-extension://gogfcdlbjigmaaccpkigmikceimdpgam/images/lr-soft..png",
      //   recommend: "谷歌浏览器是一款...",
      //   showName: "谷歌浏览器64位"
      // },{
      //   appId: "1213",
      //   packagePath: "234",
      //   appUrl: null,
      //   averageScore: "3.9",
      //   classify: "应用",
      //   downNum: 128548,
      //   logoImage: "chrome-extension://gogfcdlbjigmaaccpkigmikceimdpgam/images/lr-soft..png",
      //   recommend: "谷歌浏览器是一款...",
      //   showName: "谷歌浏览器64位"
      // },{
      //   appId: "1213",
      //   packagePath: "234",
      //   appUrl: null,
      //   averageScore: "3.9",
      //   classify: "应用",
      //   downNum: 128548,
      //   logoImage: "chrome-extension://gogfcdlbjigmaaccpkigmikceimdpgam/images/lr-soft..png",
      //   recommend: "谷歌浏览器是一款...",
      //   showName: "谷歌浏览器64位"
      // },{
      //   appId: "1213",
      //   packagePath: "234",
      //   appUrl: null,
      //   averageScore: "3.9",
      //   classify: "应用",
      //   downNum: 128548,
      //   logoImage: "chrome-extension://gogfcdlbjigmaaccpkigmikceimdpgam/images/lr-soft..png",
      //   recommend: "谷歌浏览器是一款...",
      //   showName: "谷歌浏览器64位"
      // },{
      //   appId: "1213",
      //   packagePath: "234",
      //   appUrl: null,
      //   averageScore: "3.9",
      //   classify: "应用",
      //   downNum: 128548,
      //   logoImage: "chrome-extension://gogfcdlbjigmaaccpkigmikceimdpgam/images/lr-soft..png",
      //   recommend: "谷歌浏览器是一款...",
      //   showName: "谷歌浏览器64位"
      // },{
      //   appId: "1213",
      //   packagePath: "234",
      //   appUrl: null,
      //   averageScore: "3.9",
      //   classify: "应用",
      //   downNum: 128548,
      //   logoImage: "chrome-extension://gogfcdlbjigmaaccpkigmikceimdpgam/images/lr-soft..png",
      //   recommend: "谷歌浏览器是一款...",
      //   showName: "谷歌浏览器64位"
      // }];
      // this.resultCount = 1;
    },
    navigateToUrl(url) {
      window.open(url, '_blank');
    },
    async downloadApp(app) {
      if (!app.appId || !app.packagePath) {
        this.$message.warning('应用信息不完整，无法下载');
        return;
      }
      
      try {
        // 1. 获取suid
        if (!this.suid) {
          await this.getSuid();
        }
        
        // 2. 生成nonce
        const nonce = uuidv4();

        // 3. 计算timestamp
        const timestamp = parseInt((new Date()).getTime());
        
        // 4. 计算sign
        const sign = this.sm3Hash(timestamp + nonce + this.suid);
        
        // 5. 构建下载URL
        const appId = app.appId;
        const ossKey = app.packagePath;
        const downloadUrl = this.mallUrl + `msdp-fileserver/oss/secureDownload/${appId}?ossKey=${ossKey}&nonce=${nonce}&sign=${sign}&timestamp=${timestamp}`;
        
        // 6. 打开下载链接
        window.open(downloadUrl, '_blank');
      } catch (error) {
        console.error('下载失败:', error);
        this.$message.error('下载失败，请稍后重试');
      }
    },
    async getSuid() {
      try {
        const response = await fetch(this.mallUrl + 'security/suid');
        if (!response.ok) {
          throw new Error('获取suid失败');
        }
        const data = await response.json();
        if (data.code === 200) {
          this.suid = data.data.suid;
        } else {
          throw new Error('获取suid失败');
        }
      } catch (error) {
        console.error('获取suid失败:', error);
        throw error;
      }
    },
    sm3Hash(text) {
      const sm3 = smCrypto.sm3;
      return sm3(text);
    },
    encryptBySM2(data, puk) {
      const sm2 = smCrypto.sm2;
      return sm2.doEncrypt(data, puk, 1);
    },
    createSM2Key() {
      let sm2 = smCrypto.sm2;
      let keypari = sm2.generateKeyPairHex();
      return keypari;
    },
  }
}
</script>

<style scoped>
#search-result {
  font-family: Arial, sans-serif;
}

.search-header {
  background-color: #ffffff;
  padding: 10px 20px 0;
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo img {
  width: 100px;
  height: 60px;
}

.search-bar {
  flex: 1;
  max-width: 600px;
}

:deep .el-input__inner {
  height: 45px;
  /* border: 1px solid rgb(0, 197, 134); */
  border: 1px solid #409EFF;
  border-right: 0;
}

:deep .el-input__inner.hover {
  border: 1px solid red;
}

:deep .el-input-group__append, .el-input-group__prepend {
  background-color: #ffffff;
  color: #ffffff;
  padding-right: 23px;
  /* border: 1px solid rgb(0, 197, 134); */
  border: 1px solid #409EFF;
  border-left: 0;
}
.nav-tabs {
  background-color: #ffffff;
  padding: 0 150px;
}

:deep .el-tabs__nav-wrap::after {
  height: 0;
}

.nav-tabs .el-tabs__nav {
  border-bottom: none;
}

.nav-tabs .el-tabs__active-bar {
  background-color: #00c853;
}

.nav-tabs .el-tabs__item {
  font-size: 14px;
  color: #333;
}

.nav-tabs .el-tabs__item.is-active {
  color: #00c853;
  font-weight: 500;
}

.search-results {
  max-width: 900px;
  margin-left: 130px;
}

.result-stats {
  color: #666;
  font-size: 13px;
  margin-bottom: -15px;
  position: relative;
  left: 650px;
  top: -35px;
}

.app-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(233px, 1fr));
  gap: 20px;
  padding: 0 20px;
}

.app-card {
  background-color: #ffffff;
  padding: 25px 15px 0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  margin-top: 30px;
  width: 225px;
  height: 215px;
  border: 1px solid #ccc;
}

.app-icon {
  width: 60px;
  height: 60px;
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-icon img {
  width: 100%;
  height: 100%;
  object-fit: fill;
  border-radius: 8px;
}

.app-info {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.app-name {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 70%;
}

.app-score {
  font-size: 12px;
  color: #ff6700;
  font-weight: 500;
}

.app-desc {
  margin: 0 0 10px 0;
  font-size: 12px;
  color: #999;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-align: left;
}

.app-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.app-download-count {
  font-size: 11px;
  color: #999;
}

.download-button {
  font-size: 11px;
  padding: 3px 12px;
  border-radius: 4px;
}

.el-button--primary.is-plain {
  color: #409EFF;
  background: #ffffff;
  border-color: #b3d8ff;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #409EFF;
}

.knowledge-section{
  /* margin-bottom: 30px; */
}
.resource-section {
  margin-bottom: 30px;
}

.knowledge-item,
.resource-item {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 15px;
  border: 1px solid #e0e0e0;
}

.knowledge-title,
.resource-title {
  font-size: 16px;
  font-weight: 600;
  color: #409EFF;
  margin: 0 0 10px 0;
  cursor: pointer;
}

.resource-title a {
  color: #409EFF;
  text-decoration: none;
}

.resource-title a:hover {
  text-decoration: none;
}

.knowledge-title:hover {
  text-decoration: underline;
}

.knowledge-desc,
.resource-desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.knowledge-meta,
.resource-meta {
  display: flex;
  gap: 20px;
  font-size: 12px;
  color: #999;
}

.knowledge-time,
.resource-time {
  display: inline-block;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 16px;
}

</style>
