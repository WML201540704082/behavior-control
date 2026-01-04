<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="() => $emit('close')"
      :show-close="true"
      append-to-body
      :visible.sync="isShow"
      title="新增"
      width="700px"
      top="10vh"
      v-el-drag-dialog
    >
      <div id="container"></div>
    </el-dialog>
  </div>
</template>

<script>
  import { Graph } from "@antv/g6";
  import {globalattrDetail, globalattrSave, cmdbciattrList, i6000ciattrList, i6000Mapping} from "@/api/system/modelMapping";

  export default {
    props: ['isShow', 'arrtId', 'showType'],
    data() {
      return {

      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init(){
        const data = {
          nodes: [
            { id: '0', label: 'A', cluster: 'part1' },
            { id: '1', label: 'B', cluster: 'part1' },
            { id: '2', label: 'C', cluster: 'part1' },
            { id: '3', label: 'a', cluster: 'part2' },
            { id: '4', label: 'b', cluster: 'part2' },
            { id: '5', label: 'c', cluster: 'part3' },

          ],
          edges: [
            { source: '0', target: '6' },
            { source: '1', target: '7' },
            { source: '2', target: '8' },
            { source: '3', target: '9' },
            { source: '4', target: '5' },
          ]
        }

        const graph = new Graph ({
          container: 'container',
          data,
          animation: false,
          autoFit: 'center',
          node: {
            style: {
              labelFill: '#fff',
              labelPlacement: 'center',
              labelText: (d)=>{
                // console.log(90, d)
                return d.id
              }
            },
            palette: {
              type: 'group',
              field: 'cluster',
              color: ['red', 'blue']
            }
          },
          // layout: {
          //   type: 'bi',
          //   sep: 300,
          //   nodeSep: 20,
          //   nodeSize: 32
          // },
          behaviors: ['drag-canvas', 'drag-element', 'zoom-canvas']
        })
        graph.render()


      }
    }
  }
</script>

<style lang="scss" scoped>
#container{
  width: 500px;
  height: 500px;
}
</style>
