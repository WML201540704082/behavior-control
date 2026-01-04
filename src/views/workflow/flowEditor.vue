<template>
    <div v-loading="loading" style="width: 100%;height: calc(100% - 15px);">
      <iframe  style="width:100%;height: 100%;" :src="editerPath" id="flowEditorIframe"></iframe>
    </div>
</template>
<script>
  export default {
    name: 'flowEditor',
    data() {
       return {
         loading:false,
        //  editerPath: 'http://localhost:19091/'
         editerPath: ''
       };
    },
    mounted() {
      // if(process.env.NODE_ENV === 'development') {
      //   this.init();
      // }
      //this.init();
    },
    methods: {
      init(){
        let iframe = document.getElementById('flowEditorIframe');
        iframe.onload = ()=>{
          this.loading = false;
          if(iframe ){
            //console.log('已发送token信息')
            let data = {safeData:[
                {name:'td',value:localStorage.getItem('td')},
                {name:'aes-iv',value:localStorage.getItem('aes-iv')},
                {name:'pubKey_client',value:localStorage.getItem('pubKey_client')},
                {name:'Tms-Token',value:localStorage.getItem('Tms-Token')},
                {name:'sm4-ak',value:localStorage.getItem('sm4-ak')},
                {name:'uid',value:localStorage.getItem('uid')},
                {name:'aes-ak',value:localStorage.getItem('aes-ak')},
                {name:'sm4-iv',value:localStorage.getItem('sm4-iv')},
                {name:'keyUuid',value:localStorage.getItem('keyUuid')},
                {name:'pubKey_server',value:localStorage.getItem('pubKey_server')},
                {name:'priKey_client',value:localStorage.getItem('priKey_client')}
              ]};
            iframe.contentWindow.postMessage(JSON.stringify(data),this.editerPath);
          }
        }
      }
    }
  };
</script>

