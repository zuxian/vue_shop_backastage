<template>
    <el-container   class='home-container'>
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/cookie.jpg" alt="">
                <span>cookie后台管理系统</span>
            </div>

            <el-button  type="info"  @click="logout" >退出</el-button>
        </el-header>
        
        <!-- 页面主体区域 -->
        <el-container>
        
        <!-- 侧边导航栏 -->
            <el-aside width=" isCollapse ? '64px' : '200px' ">
                <div class="toggle-button"  @click="toggleCollapse"  >| | |</div>
                <!-- 侧边栏菜单 -->
                <el-menu background-color="rgb(151, 119, 172)"  text-color="#fff"  
                active-text-color="black" :unique-opened="true"  
                :collapse="isCollapse"  :collapse-transition="false" 
                :router="true"    :default-active="activePath"  >
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id+''"   v-for="item in menulist"  :key="item.id" >
                        <template slot="title">
                            <i :class="iconsObj[item.id]"></i>
                            <span>{{item.authName}}</span>
                        </template>

                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/' + subitem.path"   v-for="subitem in item.children"  
                        :key="subitem.id"   @click="saveNavState('/' + subitem.path)"   >
                            <i class="el-icon-magic-stick"></i>
                            <span> {{subitem.authName}} </span>  
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>

        <!-- 右侧内容主体 -->
        <el-main>
            <!-- 路由占位符 -->
            <router-view></router-view>
        </el-main>
        </el-container>
    </el-container>

</template>

<script >
    export default {
        data(){
            return {
                menulist: [],
                iconsObj: {
                    '125': 'iconfont icon-user',
                    '103': 'iconfont  icon-tijikongjian',
                    '101': 'iconfont  icon-shangpin',
                    '102': 'iconfont  icon-danju',
                    '145': 'iconfont  icon-baobiao'
                },
                isCollapse: false,
                activePath: ''
            }
        },

        created(){
            this.getMenuList(),
            this.activePath = window.sessionStorage.getItem('activePath')
        },

        methods: {
            logout(){
                //  清空token
                window.sessionStorage.clear()
                //  跳转至登录页
                this.$router.push('/login')
            },

            async getMenuList(){
                const {data: res } = await this.$http.get('menus')
                if(res.meta.status !== 200)  return this.$message.error(res.meta.msg)
                this.menulist = res.data
                // console.log(res)
            },

            toggleCollapse(){
                this.isCollapse = ! this.isCollapse
            },
            saveNavState(activePath){
                window.sessionStorage.setItem('activePath', activePath)
                this.activePath = activePath
            }
        },
    }
</script>


<style  lang="less"  scoped>
.home-container{
    height: 100%;
}


.el-container{
    /* background-color:rgb(151, 119, 172); */
}

.el-header{
    background-color:rgb(241, 171, 209);
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #ffffff;
    font-size: 20px;


    > div{
        display: flex;
        align-items: center;
        img{   height: 40px; }
        span{  margin-left: 15px;  }
    } 
}




.toggle-button{
    text-align: center;
    background-color: rgb(171, 154, 206);
    color: #ffffff;
    line-height: 24px;
    font-size: 10px;
    letter-spacing: 0.2em;
    cursor: pointer;
}

.el-aside{
    background-color:rgb(151, 119, 172);
    .el-menu{
        border-right: none;
    }
}


.el-main{
    background-color: rgb(238, 235, 235);
}

.iconfont{
    margin-right: 10px;
}


</style>