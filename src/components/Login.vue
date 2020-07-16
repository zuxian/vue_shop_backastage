
<template>
    <div class="login_container">
        <!-- login -->
        <div  class="login_box">
            <!-- 头像区域 -->
            <div  class="avatar_box">
                <img src="../assets/cookie.jpg" alt="">

            </div>

            <!-- 登录表单区域  -->
            <el-form  ref="loginFormRef"   :model="loginForm" :rules="loginFormRules" label-width="0px"  class="login_form">

                <!-- 用户名 -->
                <el-form-item  prop="username"   >
                    <el-input  v-model="loginForm.username"  prefix-icon="iconfont icon-user"  ></el-input>
                </el-form-item>

                <!-- 密码区域 -->
                <el-form-item  prop='password'>
                    <el-input  v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"   type="password"></el-input>
                </el-form-item>


                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <el-button type="success" @click="login"  >登录</el-button>
                    <el-button type="info"  @click="resetLoginForm" >重置</el-button>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>




<script>
export default {

data(){
    return{
        loginForm: {
            username: 'admin',
            password: '123456'
        },
        loginFormRules:{
            username: [
            { required: true, message: '请输入登录名称', trigger: 'blur' },
            { min: 3, max: 11, message: '长度在 3 到 11 个字符', trigger: 'blur' }
            ],
            password: [
            { required: true, message: '请输入用户密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
            ]
        }
    }
},

methods: {
    resetLoginForm(){
        this.$refs.loginFormRef.resetFields();
    },
    login(){
        this.$refs.loginFormRef.validate(async valid=>{
            console.log(valid)   // true 
            if(!valid)   return;

            // const result = this.$http.post("login", this.loginForm) 
            //console.log(result)     // result 是一个promise 

            // const result =await this.$http.post("login", this.loginForm)
            // console.log(result)   // result 含有 config、data、header、request、status
            
            const { data: res} =await this.$http.post("login", this.loginForm)
            if (res.meta.status !== 200)  return this.$message.error('登录失败')
            this.$message.success('登录成功')
        
            // 登录成功之后，需要将后台返回的token保存到sessionStorage中
            //  token 只在当前网页打开期间生效，所以保存在sessionstorage中
            window.sessionStorage.setItem("token", res.data.token)        
            // 操作完毕之后，需要跳转到/home--- 编程式导航跳转至后台主页
            this.$router.push("/home");


        });
    }
}

}
</script>



<style lang="less"  scoped>
.login_container{
    background-color:rgb(151, 119, 172);
    height: 100%;
}

.login_box{
    width: 450px;
    height: 300px;
    background-color:#e2b5cc;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .avatar_box{
        height: 130px;
        width: 130px;
        background-color: #ffffff;
        border-radius: 50%;
        border: 1px solid #eee;
        box-shadow: 0 0 10px  #ddd;

        padding: 10px;

        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);

        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}

.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0  20px;

    // 改变盒模型:  width=content+padding+border, content会随着实际的宽度进行自动缩放
    box-sizing: border-box;

}


.btns{
    display: flex;
    justify-content: flex-end;
}


</style>