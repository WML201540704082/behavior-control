<template>
    <div class="tree-right-box">
        <div class="tree-wrap">
            <div style="padding: 15px">
                <label class="listName">流程列表</label>
                <div style="margin-top: 15px">
                    <el-input
                        v-model="processName"
                        placeholder="搜索"
                        prefix-icon="el-icon-search"
                        @input="searchProcess"
                    />
                </div>
            </div>
            <div v-if="notValue" class="is-empty">暂无数据</div>
            <div v-else class="checkGroup">
                <el-checkbox
                    v-show="!notValue"
                    :indeterminate="isIndeterminate"
                    v-model="checkAll"
                    class="el-checkbox process-list allChecked"
                    @change="handleCheckAllChange"
                >全选
                </el-checkbox>
                <el-checkbox-group v-model="checkboxGroup" @change="isChange">
                    <el-checkbox
                        v-for="item in searchValue"
                        :key="item.processKey"
                        :class="
              checkedPro === item.processKey
                ? 'process-list-checked'
                : 'process-list'
            "
                        :label="item.processKey"
                        @change="checkedProcess(item, $event)"
                    >{{ item.processName }}
                    </el-checkbox>
                </el-checkbox-group>
            </div>

            <div class="tree-toggle-box">
                <div class="icon-box flex flex-up-down">
                    <div
                        v-if="isFlod && !isSpread"
                        class="icon-item flex flex-center mouseover"
                        @click="defaultTree"
                        @mouseover="mouseOver"
                    >
                        <i class="font_family icon-qingqibing_zhankai"/>
                    </div>
                    <div
                        v-if="!isFlod && !isSpread"
                        class="icon-item flex flex-center"
                        @click="stowList"
                    >
                        <i class="font_family icon-qingqibing_shouqi"/>
                    </div>
                    <div
                        v-if="!isFlod && !isSpread"
                        class="icon-item flex flex-center"
                        @click="openList"
                    >
                        <i class="font_family icon-qingqibing_zhankai"/>
                    </div>
                    <div
                        v-if="!isFlod && isSpread"
                        class="icon-item flex flex-center"
                        @click="defaultTree"
                    >
                        <i class="font_family icon-qingqibing_shouqi"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {queryProcessTree} from '@/api/workflow/analyse/processStatus';

    export default {
        name: 'ProcessList',
        data() {
            return {
                checkedPro: '',
                checkboxGroup: [],
                list: [],
                // 查询条件
                processName: '',
                searchValue: [],
                checkboxKey: [],
                notValue: true,
                isFlod: false,
                isSpread: false,
                isIndeterminate: true,
                checkAll: false
            };
        },
        mounted() {
            this.queryProcessList();
        },
        methods: {
            handleCheckAllChange(val) {
                // const this = this;
                let keys = '';
                if (val) {
                    this.checkboxGroup = [];
                    this.searchValue.forEach(item => {
                        this.checkboxGroup.push(item.processKey);
                    });
                    this.checkboxGroup.forEach(item => {
                        keys = item + ',' + keys;
                    });
                    this.$emit('input', keys.slice(0, -1));
                } else {
                    this.checkedPro = '';
                    this.checkboxGroup = [];
                    this.$emit('input', '');
                }
                this.isIndeterminate = false;
            },
            mouseOver() {
                document.getElementsByClassName('pageLeft')[0].classList.add('over-tree');
                document
                    .getElementsByClassName('pageLeft')[0]
                    .classList.remove('leave-tree');
            },
            mouseLeave() {
                document
                    .getElementsByClassName('pageLeft')[0]
                    .classList.add('leave-tree');
            },
            defaultTree() {
                // const this = this;
                this.isSpread = false;
                this.isFlod = false;
                this.$nextTick(() => {
                    document
                        .getElementsByClassName('pageLeft')[0]
                        .classList.remove('flod-tree');
                    document
                        .getElementsByClassName('pageRight')[0]
                        .classList.remove('flod-tree');
                    document
                        .getElementsByClassName('pageLeft')[0]
                        .classList.remove('spread-tree');
                    document
                        .getElementsByClassName('pageRight')[0]
                        .classList.remove('spread-tree');
                    document
                        .getElementsByClassName('pageLeft')[0]
                        .classList.remove('over-tree');
                    document
                        .getElementsByClassName('pageLeft')[0]
                        .classList.remove('leave-tree');
                    this.$emit('processListSize', false);
                });
            },
            stowList() {
                // const this = this;
                this.isFlod = true;
                this.isSpread = false;
                this.$nextTick(() => {
                    document
                        .getElementsByClassName('pageLeft')[0]
                        .classList.add('spread-tree');
                    document
                        .getElementsByClassName('pageRight')[0]
                        .classList.add('spread-tree');
                });
                this.$emit('processListSize', false);
            },
            openList() {
                // const this = this;
                this.isFlod = false;
                this.isSpread = true;
                this.$nextTick(() => {
                    document
                        .getElementsByClassName('pageLeft')[0]
                        .classList.add('flod-tree');
                    document
                        .getElementsByClassName('pageRight')[0]
                        .classList.add('flod-tree');
                });
                this.$emit('processListSize', false);
            },
            searchProcess(value) {
                // const this = this;
                let arr = this.list;
                Object.keys(value).forEach(e => {
                    arr = this.filterFunc(this.list[e], value, arr);
                });
                this.searchValue = arr;
            },
            filterFunc(filter, value, filterArr) {
                if (filter === undefined || filter === '') {
                    return filterArr;
                }
                return filterArr.filter(p => p.processName.indexOf(value) > -1);
            },
            isChange(value) {
                // const this = this;
                let keys = '';
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.searchValue.length;
                this.isIndeterminate =
                    checkedCount > 0 && checkedCount < this.searchValue.length;
                this.checkboxGroup.forEach(item => {
                    keys = item + ',' + keys;
                });
                this.$emit('input', keys.slice(0, -1));
            },
            checkedProcess(data, event) {
                if (event) {
                    this.checkedPro = data.processKey;
                } else {
                    this.checkedPro = '';
                }
            },
            queryProcessList() {
                // const this = this;
                queryProcessTree()
                    .then(res => {
                        if (res.code === 10000 && res.data && res.data.length > 0) {
                            this.list = res.data;
                            this.searchValue = res.data;
                            this.notValue = false;
                        } else {
                            this.notValue = true;
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: '流程列表查询失败',
                            type: 'error'
                        });
                    });
            }
        }
    };
</script>
<style scoped>
    .tree-right-box {
        /*position: relative;*/
        width: 100%;
        height: 100%;
    }

    .tree-wrap {
        width: 100%;
        border-right: 1px solid;
        border-image: linear-gradient(#fafafa, #eaeaea, #fafafa) 50 50;
        z-index: 79;
        padding: 0;
    }

    .tree-wrap .listName {
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        font-size: 14px;
        color: #333651;
        padding: 12px 28px;
        white-space: nowrap;
        position: relative;
        overflow: hidden;
        width: 100%;
    }

    .tree-wrap .tree-filter {
        display: flex;
        flex-direction: column;
    }

    .is-empty {
        line-height: 60px;
        color: #909399;
        width: 100%;
        text-align: center;
        position: relative;
        top: 35%;
    }

    .tree-wrap .tree-filter ::v-deep .el-input__inner:hover {
        border: 1px solid #2794f8;
        background: #e8eff6;
    }

    .checkGroup {
        width: 100%;
        height: calc(100% - 135px);
        overflow: auto;
    }

    .el-checkbox-group {
        width: 100%;
        height: calc(100% - 55px);
    }

    .process-list {
        width: auto;
        min-width: calc(100% - 48px);
        height: 36px;
        line-height: 36px;
        text-align: left;
        margin: 0 24px !important;
        padding: 0 20px;
    }

    .allChecked {
        padding: 0 8px;
    }

    .process-list:hover {
        background: #f5f5f5;
        border-radius: 4px;
        color: #2695f9;
    }

    .process-list-checked {
        width: auto;
        min-width: calc(100% - 48px);
        height: 36px;
        line-height: 36px;
        text-align: left;
        margin: 0 24px !important;
        border-radius: 8px;
        background: #d9edff;
        padding: 0 20px;
    }

    .el-checkbox__inner {
        margin-left: 28px !important;
    }

    .mouseover {
        z-index: 111;
    }
</style>
<style lang="scss" scoped>
    @media screen and (max-width: 1600px) {
        ::v-deep .tree-right-box .checkGroup .el-checkbox__label {
            font-size: 12px !important;
        }
    }
</style>
