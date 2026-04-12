<template>
    <div class="selected-user-main">
        <div class="user-select-input">
            <div class="user-select-input-show">
                <template v-if="showUser && showUser.length">
                      <span class="user-select-item">
                        <span class="user-select-item-user-name">{{
                          showUser[0].label
                        }}</span>
                        <i
                            v-if="showUser.length > 1"
                            class="el-icon-close user-select-delete-icon"
                            @click="deleteUser"
                        />
                      </span>
                    <span
                        v-if="showUser.length > 1"
                        class="user-select-item user-select-item-show-more"
                    >{{ `+${showUser.length - 1}...` }}</span>
                </template>
            </div>
            <div class="user-select-btn" style="font-size:20px;line-height: 30px;" @click="clickShowDialog">
                <i class="el-icon-user"></i>
            </div>
        </div>
        <el-dialog
            :title="`请选择${title}`"
            id="select-user-dialog"
            :visible.sync="showDialog"
            :append-to-body="true"
            :close-on-click-modal="false"
            width="970px"
            @close="handleClose"
        >
            <div class="search-user-content">
                <div class="select-part">
                    <div class="dept">
                        <div class="cont-inp-box">
                            <el-popover
                                v-model="searchPopoverShow"
                                placement="bottom"
                                width="200"
                                popper-class="popCls"
                                trigger="manual"
                            >
                                <template #reference>
                                    <div style="position: relative">
                                        <!-- <el-input
                                          :class="{ 'no-bg': isSearchInputBG }"
                                          v-model="searchKey"
                                          class="tree-inp"
                                          prefix-icon="el-icon-search"
                                          placeholder="按Enter键搜索"
                                        /> -->
                                        <el-input
                                            v-model="searchKey"
                                            prefix-icon="el-icon-search"
                                            placeholder="按Enter键搜索"
                                            clearable
                                            class="tree-inp copy-inp"
                                            @focus="inpFocus"
                                            @blur="inpBlur"
                                            @input="searchPopoverShow = false"
                                            @keyup.enter.native="changeFilter"
                                        />
                                    </div>
                                </template>

                                <div class="pop-box">
                                    <div v-for="(group, index) in searchResult" :key="index">
                                        <div class="div-label">
                                            <span>{{ group.label }}</span>
                                            <span
                                                v-if="group.options.length > 5"
                                                class="label-btn"
                                                @click="group.show = !group.show"
                                            >
                                            {{ group.show ? '收起' : '更多' }}
                                          </span>
                                        </div>
                                        <div v-if="group.show">
                                            <div v-for="item in group.options" :key="item.id">
                                                <div
                                                    class="div-label div-pop"
                                                    @click="changeInput(item)"
                                                >
                                                  <span
                                                      v-for="(it, ind) in item.label"
                                                      :key="'span' + ind"
                                                      :style="{
                                                      color: searchKey.indexOf(it) > -1 ? '#0D8EFF' : ''
                                                    }"
                                                  >{{ it }}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-else>
                                            <div
                                                v-for="item in group.options.slice(0, 5)"
                                                :key="item.id"
                                            >
                                                <div
                                                    class="div-label div-pop"
                                                    @click="changeInput(item)"
                                                >
                                                  <span
                                                      v-for="(it, ind) in item.label"
                                                      :key="'span' + ind"
                                                      :style="{
                                                      color: searchKey.indexOf(it) > -1 ? '#0D8EFF' : ''
                                                    }"
                                                  >{{ it }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </el-popover>
                        </div>
                        <el-tree
                            v-if="!isExpand"
                            style="height: 400px;    overflow: scroll;"
                            ref="lazy-tree"
                            :render-content="renderContent"
                            :lazy="true"
                            :indent="indent"
                            :load="initDepts"
                            :props="defaultProps"
                            :key="lazyTreeKey"
                            class="roleTree lcdp-tree work-tree work-tree1"
                            highlight-current
                            node-key="id"
                            @node-click="deptNodeClick"
                        />
                        <el-tree
                            v-if="isExpand"
                            ref="custom-tree"
                            :data="depts"
                            :render-content="renderContent"
                            :default-expand-all="true"
                            :indent="indent"
                            :props="defaultProps"
                            class="roleTree lcdp-tree work-tree work-tree1"
                            highlight-current
                            node-key="id"
                            @node-click="deptNodeClick"
                        />
                    </div>
                    <div class="user">
                        <div class="table-tit">
                          <span class="organ-name">
                            {{
                              tableItem.label && tableItem.label !== ''
                                ? tableItem.label
                                : ''
                            }}
                          </span>
                            <span
                                v-if="users.length && tableItem.label && tableItem.label !== ''"
                            >（{{ totalCount }}）</span>
                            <span
                                v-if="!users.length && tableItem.label && tableItem.label !== '' "
                            >（0）</span>
                        </div>
                        <div class="table_box">
                            <el-table
                                v-loading="tableLoading"
                                v-show="!isRadio"
                                ref="multipleTable"
                                :data="users"
                                highlight-current-row
                                height="400"
                                tooltip-effect="dark"
                                style="width: 100%"
                                class="lcdp-table workflow-table"
                                @selection-change="handleSelectionChange"
                                @select="handleSelect"
                                @select-all="selectAll"
                                @row-click="clickUsersRow"
                            >
                                <el-table-column type="selection" width="75" align="center"/>
                                <el-table-column
                                    :show-overflow-tooltip="true"
                                    prop="label"
                                    min-width="150"
                                    label="用户名称"
                                />
                                <el-table-column
                                    :show-overflow-tooltip="true"
                                    :formatter="showEmptyDeptName"
                                    prop="parentName"
                                    min-width="150"
                                    label="部门"
                                />
                            </el-table>
                            <el-table
                                v-loading="tableLoading"
                                v-show="isRadio"
                                :data="users"
                                highlight-current-row
                                height="400"
                                tooltip-effect="dark"
                                style="width: 100%"
                                class="lcdp-table workflow-table"
                                @row-click="clickUsersRow"
                            >
                                <el-table-column align="center" width="75">
                                    <template #default="scope">
                                        <el-radio
                                            :label="scope.row.id"
                                            v-model="radioTypeSelectedUser.id"
                                            @change="clickUsersRow(scope.row)"
                                        ><span
                                        /></el-radio>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    :show-overflow-tooltip="true"
                                    prop="label"
                                    min-width="150"
                                    label="用户名称"
                                />
                                <el-table-column
                                    :show-overflow-tooltip="true"
                                    :formatter="showEmptyDeptName"
                                    prop="parentName"
                                    min-width="150"
                                    label="部门"
                                />
                            </el-table>
                        </div>
                        <div class="page-box">
                            <el-pagination
                                :current-page="currentPage"
                                :page-size="PageSize"
                                :total="totalCount"
                                background
                                prev-text="上页"
                                next-text="下页"
                                layout="prev, pager, next, jumper"
                                @current-change="handleCurrentChange"
                            />
                        </div>
                    </div>
                </div>
                <div class="selected-part">
                    <div
                        class="list-tit"
                        style="
              display: flex;
              justify-content: space-around !important;
              align-items: center !important;
            "
                    >
                        <span>已选</span>
                        <el-button type="text" @click="deleteAll">删除</el-button>
                        <!-- <img src="../../../assets/img/clear.png" @click="deleteAll" /> -->
                    </div>
                    <ul class="node-ul">
                        <li
                            v-for="(item, index) in selected"
                            :key="item.id + index"
                            style="list-style: none"
                        >
                            <div class="item-name" style="display: inline-block;width:60%;">{{ item.label }}</div>
                            <i class="el-icon-delete" @click="deleteItem(item, index)"/>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- 底部按钮 -->
            <template #footer>
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="confirm">确认</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import * as Api from '@/api/workflow/selectUser';


    import * as _ from 'lodash';

    export default {
        name: 'SelectUser',
        components: {},
        props: {
            value: {
                type: Array,
                default: () => {
                    return [];
                }
            }, // 选中的值
            isRadio: {type: Boolean, default: false}, // 单选
            title: {type: String, default: '参与者'} // 默认选择参与者
        },
        data() {
            return {
                searchKey: '',
                users: [], // 用户列表
                depts: [], // 部门组织机构
                selected: [], // 选中的值
                showUser: [], // 单行文本显示的选项
                showDialog: false, // 弹框的状态 true - 打开； false - 关闭
                defaultProps: {
                    label: 'label',
                    children: 'childrenList',
                    isLeaf: 'isLeaf'
                }, // tree的配置项
                indent: 10, // 树结构的层级
                searchPopoverShow: false, // 搜索popover
                isSearchInputBG: false, // 搜索框背景改变
                searchResult: [], // 搜索结果
                // filterText: '', // 过滤树的关键字
                tableItem: {}, // 表格搜索条件
                tableLoading: false, // 表格加载状态
                multipleSelection: [], // 表格多选状态
                currentPage: 1, // 默认每页显示的条数（可修改）
                PageSize: 10, // 选项
                totalCount: 0, // 总条数
                radioTypeSelectedUser: {}, // 单选的时候选择的用户
                isExpand: true, // 是否懒加载
                lazyTreeKey: new Date() + 'tree' // 懒加载树的key值
            };
        },
        watch: {
            searchKey: {
                handler(n) {
                    // const this = this;
                    if (n === '') {
                        this.isExpand = false;
                        this.search();
                    }
                },
                deep: true
            },
            // 用户名称和部门列表
            users: {
                handler(n) {
                    if (n.length) {
                        // const this = this;
                        this.$nextTick(() => {
                            this.$refs.multipleTable.clearSelection();
                            this.selected.forEach(item => {
                                n.findIndex(it => {
                                    const index = it.id === item.id;
                                    if (index) {
                                        this.$refs.multipleTable.toggleRowSelection(it, true);
                                    }
                                });
                            });
                        });
                    }
                },
                deep: true
            },
            // 监听被选中表格数据
            multipleSelection: {
                handler(n) {
                    // const this = this;
                    n.forEach(item => {
                        const index = this.selected.findIndex(it => it.id === item.id);
                        if (index < 0) {
                            this.selected.push(item);
                        }
                    });
                },
                deep: true
            },
            // 弹框的显示与隐藏
            showDialog: {
                handler(n) {
                    // const this = this;
                    if (n) {
                        this.selected = _.cloneDeep(this.value) || [];
                        if (this.value.length && this.isRadio)
                            this.radioTypeSelectedUser = _.cloneDeep(this.value[0]);
                        this.showUser = _.cloneDeep(this.selected);
                    } else {
                        this.cancel();
                    }
                },
                deep: true
            },
            // 选中的用户 props传递过来的值
            value: {
                handler(n) {
                    // const this = this;
                    this.selected = _.cloneDeep(n) || [];
                    if (n.length && this.isRadio)
                        this.radioTypeSelectedUser = _.cloneDeep(n[0]);
                    this.showUser = _.cloneDeep(n) || [];
                },
                deep: true,
            },
            // 选择的用户 单选的时候
            radioTypeSelectedUser: {
                handler(n) {
                    // const this = this;
                    if (this.isRadio) {
                        this.selected = Object.keys(n).length ? [n] : [];
                    }
                },
                deep: true
            }
        },
        mounted() {
            // const this = this;
            this.selected = this.value || [];
            this.showUser = _.cloneDeep(this.selected);
        },
        methods: {
            cloneDeep(obj) {
                if (typeof obj !== 'object' || obj == null) {
                    return obj;
                }
                let res;
                if (obj instanceof Array) {
                    res = [];
                } else {
                    res = {};
                }
                for (let key in obj) {
                    if (obj.hasOwnProperty.call(key)) {
                        res[key] = _.cloneDeep(obj[key]);
                    }
                }
                return res;
            },
            // 点击搜索打开弹框
            clickShowDialog() {
                // const this = this;
                this.showDialog = true;
                this.lazyTreeKey = `${new Date()}tree`; // 改变el-tree的key值会触发load事件
                this.isExpand = false;
            },
            // 初始化部门组织结构
            initDepts(node, resolve) {
                // const this = this;
                const params = {
                    id: node && node.data && node.data.id ? node.data.id : '-1'
                };
                Api.getDepts(params)
                    .then(res => {
                        if (res && res.code && res.code === 10000) {
                            if (params.id === '11') {
                                this.deptNodeClick({type: 'organ', id: ''});
                            }
                            resolve(res.data || []);
                            this.isExpand = false;
                        } else {
                            this.$message({
                                message: '',
                                type: 'error'
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: '获取部门组织机构异常',
                            type: 'error'
                        });
                    });
            },
            // 点击部门组织节点, 获取部门下用户
            deptNodeClick(data) {
                // const this = this;
                this.tableItem = data;
                const params = {
                    id: data.id,
                    type: data.type,
                    size: this.PageSize,
                    current: this.currentPage,
                    label: this.searchKey
                };
                this.tableLoading = true;
                Api.getUsers(params)
                    .then(res => {
                        if (res && res.code && res.code === 10000) {
                            this.users = res.data.records || [];
                            this.totalCount = res.data.total || 0;
                            this.tableLoading = false;
                        } else {
                            this.$message({
                                message: '获取部门下用户失败',
                                type: 'error'
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: '获取部门下用户异常',
                            type: 'error'
                        });
                    });
            },
            // 删除所有的用户
            deleteAll() {
                // const this = this;
                this.$refs.multipleTable.clearSelection();
                this.selected = [];
                this.radioTypeSelectedUser = {};
            },
            // 点击项后的删除按钮，删除某一项
            deleteItem(item, index) {
                // const this = this;
                this.multipleSelection.findIndex(it => {
                    const findIndex = it.id === item.id;
                    if (findIndex) {
                        this.$refs.multipleTable.toggleRowSelection(it, false);
                    }
                });
                this.selected.splice(index, 1);
                this.radioTypeSelectedUser = {};
            },
            // 点击搜索用户
            search() {
                // const this = this;
                this.searchResult = [];
                this.searchPopoverShow = false;
                if (this.searchKey && this.searchKey !== '') {
                    const params = {
                        organName: this.searchKey
                    };
                    Api.searchUsers(params)
                        .then(res => {
                            if (res && res.code && res.code === 10000) {
                                const user = [];
                                const organ = [];
                                res.data.forEach(item => {
                                    if (item.type === 'user') {
                                        user.push(item);
                                    } else {
                                        organ.push(item);
                                    }
                                });
                                this.searchResult.push({
                                    label: `用户（${hussar-user.length}）`,
                                    options: user,
                                    show: false
                                });
                                this.searchResult.push({
                                    label: `部门（${organ.length}）`,
                                    options: organ,
                                    show: false
                                });
                            } else {
                                this.$message({
                                    message: '关键字查询用户列表失败',
                                    type: 'error'
                                });
                            }
                            this.searchPopoverShow = true;
                        })
                        .catch(() => {
                            this.$message({
                                message: '关键字查询用户列表异常',
                                type: 'error'
                            });
                        });
                } else {
                    this.deptNodeClick({type: 'organ', id: ''});
                }
            },
            // 点击确定，保存当前选中的的用户
            confirm() {
                // const this = this;
                if (this.isRadio && this.selected.length !== 1) {
                    this.$message({
                        message: `请选择${this.title}`,
                        type: 'warning'
                    });
                    this.showDialog = true;
                    return;
                }
                if (this.selected.length > 20) {
                    this.$message({
                        message: `选择的${this.title}数量不能超过20`,
                        type: 'warning'
                    });
                    this.showDialog = true;
                    return;
                }
                if (this.selected.length === 0) {
                    this.$message({
                        message: `至少选择一名${this.title}`,
                        type: 'warning'
                    });
                    this.showDialog = true;
                    return;
                }
                this.$emit('update:value', this.selected);
                this.showUser = _.cloneDeep(this.selected);
                this.cancel();
            },
            // 点击取消，不保存当前选中的用户
            cancel() {
                // const this = this;
                this.showDialog = false;
                this.depts = [];
                this.searchResult = [];
                this.searchKey = '';
                // this.filterText = '';
                this.tableItem = {};
                this.currentPage = 1;
                this.users = [];
                this.isExpand = true;
            },
            // 点击×关闭弹框
            handleClose() {
                // const this = this;
                this.cancel();
            },
            // 组织机构树的渲染
            renderContent(h, {node}) {
                let iconType = '';
                if (node.level === 1) {
                    iconType = 'tree-com';
                } else if (node.level === 2) {
                    iconType = 'tree-department';
                } else {
                    iconType = 'unit';
                }
                return (  <div class="tree-div">
                <span class="staff-tree">
                <span className="svg-icon">
                <svg-icon icon-class={iconType}/>
              </span>
              {node.label}
            </span>
              </div>
            );
            },
            // 获取焦点
            inpFocus() {
                this.isSearchInputBG = true;
                if (this.searchResult.length) {
                    this.searchPopoverShow = true;
                }
            },
            // 失去焦点
            inpBlur() {
                // const this = this;
                this.isSearchInputBG = false;
                this.searchPopoverShow = false;
            },
            // 搜索
            changeFilter() {
                // const this = this;
                this.search();
            },
            // 点击查询到的列表数据
            changeInput(data) {
                // const this = this;
                this.searchKey = data.label;
                if (data.type === 'organ') {
                    // 部门 -- 搜索部门 查询部门下的用户
                    this.deptNodeClick(data);
                } else {
                    // 用户 -- 搜索用户
                    this.deptNodeClick(data);
                }
                this.searchOrganTree(data);
                this.searchPopoverShow = false;
            },
            // table多选
            handleSelectionChange(val) {
                // const this = this;
                this.multipleSelection = val;
            },
            // 表格多选切换
            handleSelect(selection, row) {
                // 相当于取消选中
                // const this = this;
                if (selection.indexOf(row) < 0) {
                    const index = this.selected.findIndex(it => it.id === row.id);
                    this.selected.splice(index, 1);
                }
            },
            // table点击全选复选框
            selectAll(val) {
                // const this = this;
                if (val.length === 0) {
                    this.selected = [];
                }
            },
            // 显示第几页
            handleCurrentChange(val) {
                // 改变默认的页数
                // const this = this;
                this.currentPage = val;
                this.deptNodeClick(this.tableItem);
            },
            // 点击当前行，选中当前行
            clickUsersRow(row) {
                // const this = this;
                this.radioTypeSelectedUser = {id: row.id, label: row.label};
                this.$refs.multipleTable.toggleRowSelection(row);
                this.handleSelect(this.multipleSelection, row);
            },
            // 选择用户或者部门的时候
            searchOrganTree(data) {
                // const this = this;
                Api.searchOrganTree(data)
                    .then(res => {
                        if (res && res.code && res.code === 10000) {
                            this.isExpand = true;
                            this.depts = res.data || [];
                        } else {
                            this.$message({
                                message: '搜索组织机构失败',
                                type: 'error'
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: '搜索组织机构异常',
                            type: 'error'
                        });
                    });
            },
            // 删除选择的用户，在文本框中
            deleteUser() {
                // const this = this;
                this.showUser.splice(0, 1);
                this.$emit('input', this.showUser);
            },
            // 部门名称为空时，显示-
            showEmptyDeptName(row, column, cellValue) {
                return cellValue && cellValue !== '' ? cellValue : '-';
            }
        }
    };
</script>

<style lang="scss" scoped>
    ::v-deep .el-dialog__body {
        padding: 0px !important;
    }

    .user-select-input {
        width: 200px;
        height: 32px;
        background: #ffffff;
        border: 1px solid #d9d9d9;
        border-radius: 3px;
        cursor: default;
        user-select: none;
        font-size: 0;
        overflow: hidden;
        text-align: left;
    }

    .user-select-input-show {
        width: 168px;
        border-right: 1px solid #d9d9d9;
        height: 30px;
        display: inline-block;
        vertical-align: middle;
        white-space: nowrap;
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    .user-select-input-show::-webkit-scrollbar {
        display: none;
    }

    .user-select-item {
        line-height: 24px;
        font-weight: 400;
        font-size: 14px;
        color: #4a4c66;
        display: inline-block;
        margin: 3px 5px;
        background: rgba(231, 231, 231, 0.5);
        border-radius: 4px;
        padding: 0 8px;
    }

    .user-select-item-user-name {
        display: inline-block;
        max-width: 70px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: break-all;
        vertical-align: middle;
    }

    .user-select-delete-icon {
        color: #969696;
        font-size: 16px;
        display: inline-block;
        vertical-align: middle;
        margin-left: 14px;
        line-height: 24px;
        cursor: pointer;
    }

    .user-select-item.user-select-item-show-more {
        margin-left: 0;
        margin-right: 0;
    }

    .user-select-btn {
        width: 30px;
        height: 30px;
        display: inline-block;
        vertical-align: middle;
        text-align: center;
        cursor: pointer;
    }

    .icon-qingqibing_gerenxinxi {
        font-size: 14px;
        color: #878787;
        line-height: 30px;
    }

    .search-user-content {
        width: 100%;
        height: 100%;
        display: flex;
    }

    .select-part {
        width: 80%;
        border: 1px solid #eaeaea;
        display: flex;
        padding: 10px 10px 10px 0;
    }

    .selected-part {
        width: 20%;
        border: 1px solid #eaeaea;
        border-left: 0;
        padding: 10px 0;
    }

    .dept {
        width: 35%;
        height: 100%;
    }

    .user {
        width: 65%;
        height: 100%;
    }

    ::v-deep .el-checkbox__inner {
        margin: 0 !important;
    }

    ::v-deep .el-table th.is-leaf {
        border-bottom: 1px solid #eaeaea;
    }

    .div-label {
        height: 32px;
        display: flex;
        align-items: center;
        padding: 0 12px;

        &.div-pop {
            cursor: pointer;

            &:hover {
                background: #e9f4fe;
                color: #0d8eff;
            }
        }
    }

    ::v-deep .workFlow-dialog {
        height: 544px;

        .el-table .cell:empty::before {
            content: '';
        }

        .el-table .el-table__row .cell {
            padding: 0 5px;
        }


        .cont-inp-box {
            margin-bottom: 10px;
            padding-left: 16px;
            position: relative;
        }

        .table-tit {
            margin: 9px 7px;

            span {
                color: #bcbdbf;
                font-weight: normal;
            }

            .organ-name {
                display: inline-block;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                max-width: calc(100% - 65px);
                color: #4a4c66 !important;
                font-weight: bold !important;
            }
        }

        .table_box {
            height: calc(100% - 106px);
        }

        .page-box {
            margin-right: 16px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }

        .list-tit {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;

        }

        .node-ul {
            li {
                cursor: default;

                i {
                    display: none;
                    cursor: pointer;
                }

                &:hover {
                    i {
                        display: block;
                    }

                    color: #4a4c66;

                    .item-name {
                        color: inherit;
                    }
                }
            }
        }
    }


    .selected-user-main {
        margin-left: 10px;
    }
</style>
