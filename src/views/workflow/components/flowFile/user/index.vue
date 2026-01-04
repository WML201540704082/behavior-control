<template>
    <div
        class="svgDiv"
        :style="mystyle"
        @mouseenter="showList"
        @mouseleave="showList"
    >
        <svg
            :width="user.width"
            :height="user.height"
            :viewBox="'0 0 '+ user.width+' '+user.height"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            class="svg-relative"
            @mousemove="touchmove"
            @click.stop="filterTableData(user.id)"
        >
            <g
                :id="user.id+'_g'"
                pointer-events="fill"
                title="人工活动"
                transform="translate(1, 1)"
            >
                <use
                    v-if="user.type === 'userTask'"
                    :xlink:href="'#bpm-user-'+state"
                    :width="user.width"
                    :height="user.height"
                    x="0"
                    y="0"
                />
                <use
                    v-else-if="user.type === 'multiUserTask'"
                    :xlink:href="'#bpm-users-'+state"
                    :width="user.width"
                    :height="user.height"
                    x="0"
                    y="0"
                />
                <!--      <svg width="50" height="50"-->
                <!--              :viewBox="'100 100 '+ 1024+' '+1024">-->
                <!--      <path d="M128 230.4h768v563.2H128z" :fill="userContent"></path>-->
                <!--      <path d="M896 204.8H128a25.6 25.6 0 0 0-25.6 25.6v563.2a25.6 25.6 0 0 0 25.6 25.6h768a25.6 25.6 0 0 0 25.6-25.6V230.4a25.6 25.6 0 0 0-25.6-25.6z m0 588.8H128V230.4h768v563.2z" :fill="userBorder" ></path>-->
                <!--      <path d="M460.8 614.4l51.2-51.2 51.2 51.2-51.2 51.2z" :fill="userBorder" ></path>-->
                <!--      <path d="M512 563.2c98.816 0 179.2 80.384 179.2 179.2h51.2c0-105.1648-71.4752-194.2272-168.192-221.568C613.2736 498.9184 640 457.6 640 409.6a128 128 0 0 0-256 0c0 48 26.7264 89.3184 65.792 111.232C353.0752 548.1728 281.6 637.2352 281.6 742.4h51.2c0-98.816 80.384-179.2 179.2-179.2z m0-230.4c42.3424 0 76.8 34.4576 76.8 76.8s-34.4576 76.8-76.8 76.8-76.8-34.4576-76.8-76.8 34.4576-76.8 76.8-76.8z" :fill="userBorder" ></path>-->
                <!--      <use xlink:href="#bpm-user"></use>-->
                <!--        <rect-->
                <!--          :id="user.id+'bg_frame'"-->
                <!--          :width="user.width-2"-->
                <!--          :height="user.height-2"-->
                <!--          rx="5"-->
                <!--          ry="5"-->
                <!--          :stroke="userBorder"-->
                <!--          stroke-width="1"-->
                <!--          :fill="userContent"-->
                <!--        />-->
                <!--        <path-->
                <!--          v-if="this.user.state==='finish'"-->
                <!--          d="M50 12 L54 16 L60 8"-->
                <!--          fill="none"-->
                <!--          stroke="#27C3B0"-->
                <!--          stroke-linejoin="round"-->
                <!--        />-->
                <!--        <path-->
                <!--          v-else-if="this.user.state==='complete'"-->
                <!--          d="M50 10 L50 16 L55 13 Z"-->
                <!--          fill="#2794F8"-->
                <!--          stroke="#2794F8"-->
                <!--          stroke-linejoin="round"-->
                <!--        />-->
                <!--        <g-->
                <!--          v-else-if="this.user.state==='overtime'"-->
                <!--          id="流程图-改" transform="translate(-807, -225)" fill="#FF4040">-->
                <!--          <g id="编组-41" transform="translate(855.000000, 232.000000)">-->
                <!--            <path d="M9.5,5 C11.4329966,5 13,6.56700338 13,8.5 C13,10.4329966 11.4329966,12 9.5,12 C7.56700338,12 6,10.4329966 6,8.5 C6,6.56700338 7.56700338,5 9.5,5 Z M9.5,10 C9.22385763,10 9,10.2238576 9,10.5 C9,10.7761424 9.22385763,11 9.5,11 C9.77614237,11 10,10.7761424 10,10.5 C10,10.2238576 9.77614237,10 9.5,10 Z M10,6 L9,6 L9,9 L10,9 L10,6 Z" id="形状结合"></path>-->
                <!--            <g id="编组-40" transform="translate(3.000000, 3.000000)">-->
                <!--                <rect id="矩形" x="2.06066017" y="0" width="1" height="3"></rect>-->
                <!--              <polygon id="矩形" transform="translate(1.603553, 3.603553) rotate(45.000000) translate(-1.603553, -3.603553) " points="1.20710678 2.14644661 2.20710678 2.14644661 2 5.06066017 1 5.06066017"></polygon>-->
                <!--            </g>-->
                <!--            <path d="M5.5,0 C8.34445979,0 10.6845884,2.15929855 10.9706292,4.92813906 L9.90421088,4.57201938 C9.47652233,2.53195981 7.66716536,1 5.5,1 C3.01471863,1 1,3.01471863 1,5.5 C1,7.98528137 3.01471863,10 5.5,10 C5.61530353,10 5.7295942,9.99566341 5.84271779,9.98714443 C6.09675116,10.3772761 6.29590888,10.688262 6.44135009,10.9208002 C6.13520594,10.972533 5.8208106,11 5.5,11 C2.46243388,11 1.56585855e-12,8.53756612 1.56585855e-12,5.5 C1.56585855e-12,2.46243388 2.46243388,0 5.5,0 Z" id="形状结合"></path>-->
                <!--          </g>-->
                <!--        </g>-->
                <!--        <g v-else-if="this.user.state=='reject'" style="transform: translate(48px, 8px);" fill="#F77E5C" fill-rule="nonzero">-->
                <!--          <path d="M0.139003716,0.810120843 L8.18987916,8.86099628 C8.30976269,8.98087981 8.48449673,9.02769966 8.64826068,8.98381924 C8.81202462,8.93993883 8.93993883,8.81202462 8.98381924,8.64826068 C9.02769966,8.48449673 8.98087981,8.30976269 8.86099628,8.18987916 L0.810120843,0.139003716 C0.690237315,0.0191201884 0.515503266,-0.0276996589 0.351739321,0.0161807579 C0.187975376,0.0600611746 0.0600611746,0.187975376 0.0161807579,0.351739321 C-0.0276996589,0.515503266 0.0191201884,0.690237315 0.139003716,0.810120843 Z" id="路径"></path>-->
                <!--          <path d="M8.18988803,0.138993229 L0.138993229,8.18988803 C-0.0463310815,8.37521236 -0.0463310755,8.67568244 0.138993242,8.86100676 C0.32431756,9.04633108 0.624787644,9.04633108 0.810111969,8.86100677 L8.86100677,0.810111969 C9.04633108,0.624787644 9.04633108,0.32431756 8.86100676,0.138993242 C8.67568244,-0.0463310755 8.37521236,-0.0463310815 8.18988803,0.138993229 Z" id="路径"></path>-->
                <!--        </g>-->
                <!--        <g v-else-if="this.user.state=='suspend'" style="transform: translate(48px, 8px);" fill="#73D0FF" fill-rule="nonzero">-->
                <!--          <path d="M5,9.99421742 C7.75823012,9.99421742 9.99421742,7.75823012 9.99421742,5 C9.99421742,2.24176988 7.75823012,0.00578257812 5,0.00578257812 C2.24176988,0.00578257812 0.00578257813,2.24176988 0.00578257813,5 C0.00578257813,7.75823012 2.24176988,9.99421742 5,9.99421742 L5,9.99421742 Z M5,9.2540478 C2.65105728,9.25191917 0.748389257,7.34637555 0.749807229,4.9974323 C0.751226787,2.64848904 2.65619532,0.745245237 5.0051389,0.74595394 C7.35408248,0.746663038 9.25790285,2.65105632 9.25790285,5 C9.25713629,6.12849931 8.80810639,7.21047369 8.00959466,8.00790098 C7.21108292,8.80532827 6.12849931,9.25288735 5,9.25212027 L5,9.2540478 Z" id="形状"></path>-->
                <!--          <polygon points="2.18774094 4.61545875 7.81129529 4.61545875 7.81129529 5.38357749 2.18774094 5.38357749"></polygon>-->
                <!--        </g>-->
                <!--        <path v-else-if="this.user.state=='revoke'" style="transform: translate(48px, 8px);" fill="#FFC35D" fill-rule="nonzero" d="M0.0522114594,2.37243637 C0.0706849244,2.4078658 0.0938951789,2.4435238 0.126342155,2.47026729 L1.96895187,4.23488107 C2.13592358,4.3948849 2.4097098,4.39945645 2.58141829,4.23488107 C2.66371326,4.15793963 2.71016858,4.05208362 2.71016858,3.9415026 C2.71016858,3.83092159 2.66371326,3.72506558 2.58141829,3.64812414 L1.48153661,2.59461313 L5.74677546,2.59461313 C7.06478613,2.59461313 8.13222083,3.61703767 8.13222083,4.87946797 C8.13222083,6.14189826 7.06478613,7.1643228 5.74677546,7.1643228 L1.4074059,7.1643228 C1.29210447,7.163776 1.18131407,7.20752021 1.09947224,7.28590658 C1.01763041,7.36429294 0.971461044,7.47088145 0.971147918,7.5821614 C0.971147918,7.81325266 1.16606665,8 1.4074059,8 L5.74677546,8 C7.54272782,8 9,6.60430937 9,4.88403951 C9,3.16376965 7.54272782,1.76785044 5.74677546,1.76785044 L1.48153661,1.76785044 L2.58141829,0.709996479 C2.74862683,0.549992643 2.75312678,0.287586342 2.58141829,0.123239537 C2.50046727,0.0443708522 2.39021183,0 2.27518508,0 C2.16015833,0 2.0499029,0.0443708522 1.96895187,0.123239537 L0.126342155,1.88328178 C-0.00864871221,2.01212474 -0.0388907751,2.21167829 0.0522114594,2.37243637 Z"></path>-->
            </g>
        </svg>
        <!--    </svg>-->
        <p
            class="svgText flow-text"
        >
            {{ user.name }}
        </p>
        <!--    <svg @click.stop="filterTableData(user.id)" v-if="this.user.state=='finish'"  class="svgImg2" width="24px" height="26px" viewBox="0 0 24 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">-->
        <!--      <FinishIcon></FinishIcon>-->
        <!--    </svg>-->
        <!--    <img @click.stop="filterTableData(user.id)" src="../../assets/img/now.png" class="imgOnly" v-if="this.user.state=='complete' && this.IE">-->
        <!--    <svg @click.stop="filterTableData(user.id)" v-if="this.user.state=='complete' && !this.IE" class="svgImg1" width="24px" height="30px" viewBox="0 0 24 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">-->
        <!--      <iconNow1 v-if="this.iconNow===1"></iconNow1>-->
        <!--      <iconNow2 v-if="this.iconNow===2"></iconNow2>-->
        <!--      <iconNow3 v-if="this.iconNow===3"></iconNow3>-->
        <!--      <iconNow4 v-if="this.iconNow===4"></iconNow4>-->
        <!--      <iconNow5 v-if="this.iconNow===5"></iconNow5>-->
        <!--      <rect width="24px" height="32px" fill="transparent"></rect>-->
        <!--    </svg>-->
        <!--    <svg @click.stop="filterTableData(user.id)" v-if="this.user.state=='overtime'" class="svgImg1" width="24px" height="30px" viewBox="0 0 24 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">-->
        <!--      <overTime1 v-if="this.iconOverTime===1"></overTime1>-->
        <!--      <overTime2 v-if="this.iconOverTime===2"></overTime2>-->
        <!--      <overTime3 v-if="this.iconOverTime===3"></overTime3>-->
        <!--      <overTime4 v-if="this.iconOverTime===4"></overTime4>-->
        <!--      <overTime5 v-if="this.iconOverTime===5"></overTime5>-->
        <!--      <rect width="24px" height="32px" fill="transparent"></rect>-->
        <!--    </svg>-->
        <!--    <svg @click.stop="filterTableData(user.id)" v-if="this.user.state=='revoke'"  class="svgImg2" width="24px" height="26px" viewBox="0 0 24 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">-->
        <!--      <RevokeIcon></RevokeIcon>-->
        <!--    </svg>-->
        <!--    <svg @click.stop="filterTableData(user.id)" v-if="this.user.state=='suspend'"  class="svgImg2" width="24px" height="26px" viewBox="0 0 24 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">-->
        <!--      <SuspendIcon></SuspendIcon>-->
        <!--    </svg>-->
        <!--    <svg @click.stop="filterTableData(user.id)" v-if="this.user.state=='next'"  class="svgImg2" width="24px" height="26px" viewBox="0 0 24 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">-->
        <!--      <OtherIcon></OtherIcon>-->
        <!--    </svg>-->
        <!--    <svg @click.stop="filterTableData(user.id)" v-if="this.user.state=='reject'"  class="svgImg2" width="24px" height="26px" viewBox="0 0 24 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">-->
        <!--      <RejectIcon></RejectIcon>-->
        <!--    </svg>-->
        <!--  非当前状态显示在下方的提示栏  -->
        <div
            v-if="completeOrNot===0 && !noHover"
            class="triangle-up"
            :style="arrowlistStyle"
        />
        <div
            v-if="completeOrNot===0 && !noHover"
            class="triangelup-inside"
            :style="arrowinsidelistStyle"
        />
        <div
            v-if="completeOrNot===0 && !noHover"
            class="pop-win"
            :style="listStyle"
        >
            <div
                v-for="listItem in this.user.nodes.completeInfo"
                :key="listItem.id"
                class="ul-info"
            >
                <ul class="ul-body">
                    <li>
                        <span class="list-name">开始时间 </span>
                        <span>{{ listItem.startTime }}</span>
                    </li>
                    <li>
                        <span class="list-name"> 结束时间:</span>
                        <span>{{ listItem.endTime }}</span>
                    </li>
                    <li>
                        <span class="list-name">办理人： </span>
                        <span>{{ listItem.assignee }}</span>
                    </li>
                    <li>
                        <span class="list-name">办理意见:</span>
                        <span>{{ listItem.comments }}</span>
                    </li>
                </ul>
            </div>
        </div>
        <!--  当前状态显示在下方的提示栏  -->
        <div
            v-if="completeOrNot===1 && !noHover"
            class="triangle-up"
            :style="arrowlistStyle"
        />
        <div
            v-if="completeOrNot===1 && !noHover"
            class="triangelup-inside"
            :style="arrowinsidelistStyle"
        />
        <div
            v-if="completeOrNot===1 && !noHover"
            class="pop-win"
            :style="listStyle"
        >
            <div class="ul-info">
                <ul class="ul-body">
                    <li>
                        <span class="list-name">开始时间： </span>
                        <span>{{ this.user.nodes.startTime }}</span>
                    </li>
                    <li>
                        <span class="list-name">接收人：</span>
                        <span>{{ this.user.nodes.assignee }}</span>
                    </li>
                </ul>
                <div
                    v-for="listItem in this.user.nodes.completeInfo"
                    :key="listItem.id"
                    class="ul-info"
                    style="border-top: 1px solid #E8E8E8;"
                >
                    <ul class="ul-body">
                        <li>
                            <span class="list-name">开始时间：开始时间：</span>
                            <span>{{ listItem.startTime }}</span>
                        </li>
                        <li>
                            <span class="list-name">结束时间：</span>
                            <span>{{ listItem.endTime }}</span>
                        </li>
                        <li>
                            <span class="list-name">办理人：</span>
                            <span>{{ listItem.assignee }}</span>
                        </li>
                        <li>
                            <span class="list-name">办理意见：</span>
                            <span>{{ listItem.comments }}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!--  非当前状态显示在上方的提示栏  -->
        <div
            v-if="completeOrNot===2 && !noHover"
            class="triangle-down"
            :style="arrowtoplistStyle"
        />
        <div
            v-if="completeOrNot===2 && !noHover"
            class="triangeldown-inside"
            :style="arrowinsidetoplistStyle"
        />
        <div
            v-if="completeOrNot===2 && !noHover"
            class="pop-win"
            :style="toplistStyle"
        >
            <div
                v-for="listItem in this.user.nodes.completeInfo"
                :key="listItem.id"
                class="ul-info"
            >
                <ul class="ul-body">
                    <li>
                        <span class="list-name">开始时间：</span>
                        <span>{{ listItem.startTime }}</span>
                    </li>
                    <li>
                        <span class="list-name">结束时间：</span>
                        <span>{{ listItem.endTime }}</span>
                    </li>
                    <li>
                        <span class="list-name">办理人：</span>
                        <span>{{ listItem.assignee }}</span>
                    </li>
                    <li>
                        <span class="list-name">办理意见：</span>
                        <span>{{ listItem.comments }}</span>
                    </li>
                </ul>
            </div>
        </div>
        <!--  当前状态显示在上方的提示栏  -->
        <div
            v-if="completeOrNot===3 && !noHover"
            class="triangle-down"
            :style="arrowtoplistStyle"
        />
        <div
            v-if="completeOrNot===3 && !noHover"
            class="triangeldown-inside"
            :style="arrowinsidetoplistStyle"
        />
        <div
            v-if="completeOrNot===3 && !noHover"
            class="pop-win"
            :style="toplistStyle"
        >
            <div class="ul-info">
                <ul class="ul-body">
                    <li>
                        <span class="list-name">开始时间：</span>
                        <span>{{ this.user.nodes.startTime }}</span>
                    </li>
                    <li>
                        <span class="list-name">接收人：</span>
                        <span>{{ this.user.nodes.assignee }}</span>
                    </li>
                </ul>
                <div
                    v-for="listItem in this.user.nodes.completeInfo"
                    :key="listItem.id"
                    class="ul-info"
                    style="border-top: 1px solid #E8E8E8;"
                >
                    <ul class="ul-body">
                        <li>
                            <span class="list-name">开始时间：</span>
                            <span>{{ listItem.startTime }}</span>
                        </li>
                        <li>
                            <span class="list-name">结束时间：</span>
                            <span>{{ listItem.endTime }}</span>
                        </li>
                        <li>
                            <span class="list-name">办理人：</span>
                            <span>{{ listItem.assignee }}</span>
                        </li>
                        <li>
                            <span class="list-name">办理意见：</span>
                            <span>{{ listItem.comments }}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import '../showWorkFlow.css';

    let ani = '';
    export default {
        name: 'User',
        components: {},
        props: {
            noHover: {
                type: Boolean,
                default: false,
            },
            user: {
                type: Object,
                default() {
                    return null;
                }
            },
            scrollY: {
                type: Number,
                default: 0
            },
            height: {
                type: String,
                default() {
                    return '';
                }
            },
            flowHeight: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                show: false,
                IE: false,
                current: 0,
                iconNow: 1,
                // 动画切换时间
                iconOverTime: 1,
                clientWidth: undefined,
                clientHeight: undefined,
                top: false,
                offsetY: undefined
            };
        },
        computed: {
            // 会签节点开关状态改变时，切换子流程会签的图标
            isCountersign() {
                return false;
            },
            mystyle() {
                return {
                    'top': `${this.user.y}px`,
                    'left': `${this.user.x}px`,
                    'width': `${this.user.width}px`,
                    'height': `${this.user.height}px`
                };
            },
            pStyle() {
                return {
                    'top': `${this.user.height}px`,
                    'left': `${this.user.width / 2 - this.user.name.length * 6}px`
                };
            },
            state() {
                if (this.user.state === 'finish') {
                    return 'finish';
                } else if (this.user.state === 'complete') {
                    return 'complete';
                } else if (this.user.state === 'reject') {
                    return 'reject ';
                } else if (this.user.state === 'revoke') {
                    return 'complete';
                } else if (this.user.state === 'suspend') {
                    return 'suspend';
                } else if (this.user.state === 'overtime') {
                    return 'overtime';
                } else {
                    return 'todo';
                }
            },
            // userBorder() {
            //   if (this.user.state === 'finish') {
            //     return '#1F8AFF';
            //   } else if (this.user.state === 'complete') {
            //     return '#41CC8B';
            //   } else if (this.user.state === 'reject') {
            //     return '#FF5251 ';
            //   } else if (this.user.state === 'revoke') {
            //     return '#F77E5C';
            //   } else if (this.user.state === 'suspend') {
            //     return '#73D0FF';
            //   } else if (this.user.state === 'overtime') {
            //     return '#FF9F0D';
            //   } else {
            //     return '#CFDDEC';
            //   }
            // },
            // userContent() {
            //   if (this.user.state === 'finish') {
            //     return 'rgba(236,255,246,1)';
            //   } else if (this.user.state === 'complete') {
            //     return 'rgba(237,246,255,1)';
            //   } else if (this.user.state === 'reject') {
            //     return 'rgba(247, 126, 92, 0.1)';
            //   } else if (this.user.state === 'revoke') {
            //     return 'rgba(255,246,246,1)';
            //   } else if (this.user.state === 'suspend') {
            //     return 'rgba(115, 208, 255, 0.1)';
            //   } else if (this.user.state === 'overtime') {
            //     return 'rgba(255,246,233,1)';
            //   } else {
            //     return 'rgba(246,249,252,1)';
            //   }
            // },
            listStyle() {
                if (this.show) {
                    return {
                        'top': `${this.user.height + 10}px`,
                        'left': `${-this.user.width}px`,
                        'display': 'block'
                    }
                } else {
                    return {
                        'top': `${this.user.height + 10}px`,
                        'left': `${-this.user.width}px`,
                        'display': 'none'
                    }
                }
            },
            toplistStyle() {
                if (this.show) {
                    return {
                        'bottom': `${this.user.height + 10}px`,
                        'left': `${-this.user.width}px`,
                        'display': 'block'
                    }
                } else {
                    return {
                        'bottom': `${this.user.height + 10}px`,
                        'left': `${-this.user.width}px`,
                        'display': 'none'
                    }
                }
            },
            arrowlistStyle() {
                if (this.show) {
                    return {
                        'top': `${this.user.height}px`,
                        'left': `${this.user.width / 3}px`,
                        'display': 'block'
                    }
                } else {
                    return {
                        'top': `${this.user.height}px`,
                        'left': `${this.user.width / 3}px`,
                        'display': 'none'
                    }
                }
            },
            arrowinsidelistStyle() {
                if (this.show) {
                    return {
                        'top': `${this.user.height + 1}px`,
                        'left': `${this.user.width / 3}px`,
                        'display': 'block'
                    }
                } else {
                    return {
                        'top': `${this.user.height + 1}px`,
                        'left': `${this.user.width / 3}px`,
                        'display': 'none'
                    }
                }
            },
            arrowtoplistStyle() {
                if (this.show) {
                    return {
                        'bottom': `${this.user.height}px`,
                        'left': `${this.user.width / 3}px`,
                        'display': 'block'
                    };
                } else {
                    return {
                        'bottom': `${this.user.height}px`,
                        'left': `${this.user.width / 3}px`,
                        'display': 'none'
                    };
                }
            },
            arrowinsidetoplistStyle() {
                if (this.show) {
                    return {
                        'bottom': `${this.user.height + 1}px`,
                        'left': `${this.user.width / 3}px`,
                        'display': 'block'
                    };
                } else {
                    return {
                        'bottom': `${this.user.height + 1}px`,
                        'left': `${this.user.width / 3}px`,
                        'display': 'none'
                    };
                }
            },
            completeOrNot() {
                const forbidBottom = (this.flowHeight - this.user.height + this.scrollY) < 230;
                const forbidTop = (this.user.y - this.scrollY) < 230;
                let num = 4;
                if (this.user.nodes) {
                    if (this.user.nodes.state === 'complete') {
                        switch ((this.top || (!this.top && forbidBottom)) && !forbidTop) {
                            case true:
                                num = 3;
                                break;
                            case false:
                                num = 1;
                                break;
                        }
                    } else {
                        switch ((this.top || (!this.top && forbidBottom)) && !forbidTop) {
                            case true:
                                num = 2;
                                break;
                            case false:
                                num = 0;
                                break;
                        }
                    }
                }
                return num;
            }
        },

        mounted() {
            this.IE = false;
            if (this.user.state === 'overtime') {
                ani = setInterval(() => {
                    this.animation('overtime');
                }, 100);
            } else if (this.user.state === 'complete') {
                ani = setInterval(() => {
                    this.animation('complete');
                }, 100);
            }
            this.clientWidth = document.documentElement.clientWidth - 240;
            this.clientHeight = document.documentElement.clientHeight;
        },
        beforeUnmount() {
            if (ani !== '') {
                clearInterval(ani);
            }
        },
        methods: {
            filterTableData(id) {
                this.$emit('filterTableData', id);
            },
            touchmove(e) {
                // 获取起始坐标位置x
                const y = e.offsetY;
                if (y < this.user.height / 3) {
                    this.top = true;
                } else {
                    this.top = false;
                }
            },
            animation(data) {
                switch (data) {
                    case 'overtime':
                        if (this.iconOverTime === 5) {
                            this.iconOverTime = 1;
                        } else {
                            this.iconOverTime++;
                        }
                        break;
                    case 'complete':
                        if (this.iconNow === 5) {
                            this.iconNow = 1;
                        } else {
                            this.iconNow++;
                        }
                        break;
                }
            },
            showList() {
                if (this.show) {
                    this.show = false;
                } else {
                    this.show = true;
                }
            },
            changeCurrent(index) {
                if (this.current === index) {
                    this.current = -1;
                } else {
                    this.current = index;
                }
            }
        },
    };
</script>
<style scoped>
    .imgOnly {
        width: 36px;
        position: absolute;
        top: calc(50% - 16px);
        left: calc(50% - 18px);
    }
</style>
