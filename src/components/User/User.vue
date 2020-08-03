<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>        
        </el-breadcrumb>
       
        <el-card> 
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-input placeholder="请输入内容"  v-model="queryInfo.query"   
                     clearable   @clear="getUserList"  >
                        <el-button   @click="getUserList"   slot="append"  icon="el-icon-search">         
                        </el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary"  @click="addDialogVisible = true"  >添加用户</el-button>
                </el-col>
            </el-row>

            <el-table :data="userlist"   stripe    border  >
                <el-table-column  type="index"></el-table-column>
                <el-table-column  prop="username"  label="姓名"></el-table-column>
                <el-table-column  prop="email"  label="邮箱"></el-table-column>    
                <el-table-column  prop="mobile"  label="电话"></el-table-column>    
                <el-table-column  prop="role_name"  label="角色"></el-table-column>  
                <el-table-column  label="状态">
                    <!-- 使用插槽接收到当前行的数据 -->
                    <template   slot-scope="scope">
                        <!-- {{scope.row}} -->
                        <el-switch  v-model="scope.row.mg_state" 
                         @change="userStateChanged(scope.row)"> 
                        </el-switch>
                    </template>
                </el-table-column>    
                <el-table-column   label="操作"  width="180px">
                    <template   slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit"  
                        size="mini" @click="showEditDialog(scope.row.id)"></el-button>                  
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete"   
                        size="mini"  @click="removeUserById(scope.row.id)"  ></el-button>
                        <!-- 分配角色按钮 -->
                        <el-tooltip   class="item"   effect="dark"   content="分配角色"   placement="top"  :enterable="false">
                            <el-button type="warning" icon="el-icon-setting"  size="mini"></el-button>
                        </el-tooltip> 
                     </template>
                </el-table-column>  
            </el-table>

            <el-pagination   @size-change="handleSizeChange"  @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"  :page-sizes="[5, 10, 15, 20]"  :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"   :total="total">
            </el-pagination>

        </el-card>

        <!-- 添加用户的对话框 -->
        <el-dialog  title="添加用户"   :visible.sync="addDialogVisible"  @close="addDialogClosed"     width="50%">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer"  class="dialog-footer" >
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改用户的对话框 -->
        <el-dialog
        title="提示"
        :visible.sync="editDialogVisible"
        width="30%"
        @close="editDialogClosed"
        >
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
            <el-form-item label="用户名">
                <el-input v-model="editForm.username"  disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱"   prop="email">
                <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机"   prop="mobile">
                <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
    data() {
        var checkEmail = (rule, value, cb) =>{
            const  regEmail = /^\w+@([0-9a-zA-Z]+[.])+[a-z]{2,4}$/
            if(regEmail.test(value)){
                return  cb()
            }
            cb(new Error('请输入合法的邮箱'))
        }
        var checkMobile = (relu, value, cb) => {
            const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if(regMobile.test(value)){
                return cb()
            }
            cb(new Error('请输入合法的手机号码'))
        }

        return {
            // 获取用户列表的参数对象
            queryInfo :{
                query: '',             
                pagenum: 1,    // 当前页码
                pagesize: 5    // 每页显示条数
            },
            userlist: [],
            total: 0,
            addDialogVisible: false,
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            addFormRules: {
                username: [
                { required: true, message: '请输入用户名', trigger: 'blur' },
                { min: 3, max: 11, message: '长度在 3 到 11 个字符', trigger: 'blur' }
                ],
                password: [
                { required: true, message: '请输入用户密码', trigger: 'blur' },
                { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ],
                email: [
                { required: true, message: '请输入用户邮箱', trigger: 'blur' },
                {validator: checkEmail, trigger: 'blur'}
                ],               
                mobile: [
                { required: true, message: '请输入用户手机号码', trigger: 'blur' },
                {validator: checkMobile, trigger: 'blur'}
                ],
            },
            editDialogVisible : false,
            editForm: { },
            editFormRules: {
                email: [
                { required: true, message: '请输入用户邮箱', trigger: 'blur' },
                { validator: checkEmail, trigger: 'blur'}
                ],               
                mobile: [
                { required: true, message: '请输入用户手机号码', trigger: 'blur' },
                { validator: checkMobile, trigger: 'blur'}
                ]
            }
        }
    }, 
    // create(){
    //     this.getUserList()
    // },
    mounted() {
      this.initData()
    },
    computed: {},
    methods: {
        initData() {         
          this.getUserList()
        },
        async getUserList (){
            const {data: res} = await this.$http.get('users', { params: this.queryInfo })
            if(res.meta.status !== 200) {
                return this.$message.error('获取用户列表失败！')
            }
            this.userlist = res.data.users
            this.total = res.data.total
            // console.log(res)
        },
        // 监听  pagesize  的改变
        handleSizeChange (newSize) {
            this.queryInfo.pagesize = newSize
            this.getUserList()                   // 发生改变，立马发起新的请求
            console.log(`当前页: ${newSize}`);
        },
        // 监听  pagenum  的改变
        handleCurrentChange (newPage) {
            this.queryInfo.pagenum = newPage
            this.getUserList()                  // 发生改变，立马发起新的请求
            console.log(`当前页: ${newPage}`);
        },
        //  修改用户状态---  switch   请求路径：users/:uId/state/:type
        async userStateChanged (userinfo){
            // console.log(userinfo)
            const {data: res}  = await  this.$http.put( `users/${userinfo.id}/state/${userinfo.mg_state}`)
            if(res.meta.status !== 200) {
                //   更新失败，那么页面状态发生改变，数据库状态不变，则需要改变页面状态使得保持同步
                userinfo.mg_state =  !userinfo.mg_state         
                return this.$message.error('更新用户状态失败！')
            }
            this.$message.success('更新用户状态成功！')
        },

        // 监听添加用户对话框的关闭事件
        addDialogClosed (){
            this.$refs.addFormRef.resetFields()
        },
        // 添加用户——关闭对话框之前进行表单验证
        addUser(){
            this.$refs.addFormRef.validate( async valid => {
                if(!valid)   return
                //  验证成功，则可发起添加用户的网络请求
                const {data: res} = await this.$http.post('users', this.addForm)
                if(res.meta.status !== 201) {
                    this.$message.error("添加用户失败！")
                }
                this.$message.success('添加用户成功！')
                // 隐藏添加用户的对话框
                this.addDialogVisible = false
                // 重新获取用户列表的数据
                this.getUserList()
            })
        },
        //  修改用户信息---请求路径：users/:id
        async showEditDialog(id){
            const {data: res} = await this.$http.get('users/' + id)
            if(res.meta.status !== 200) {
                this.$message.error("获取管理员列表失败！")
            }
            this.editForm = res.data
            this.editDialogVisible = true
            // console.log(res.data)
        },
        // 修改用户信息---监听修改对话框的关闭事件
        editDialogClosed (){
            this.$refs.editFormRef.resetFields()
        },
        // 修改用户信息--- 关闭对话框之前进行表单验证
        editUserInfo(){
            this.$refs.editFormRef.validate( async valid => {
                if(!valid)   return
                const {data: res} = await this.$http.put('users/' + this.editForm.id, 
                                     {email:this.editForm.email,  mobile: this.editForm.mobile})
                if(res.meta.status !== 200) {
                    this.$message.error("获取管理员列表失败！")
                }
                // 隐藏对话框
                this.editDialogVisible = false
                // 重新获取用户列表的数据
                this.getUserList()
                // 提示消息
                this.$message.success('更新用户信息成功！')
            })
        },

        async removeUserById(id){
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'              
                }).catch(err =>  err )
                // .catch((err) => {  return err})

                if(confirmResult !== 'confirm'){
                    return this.$message.info('已取消删除')
                }
                const {data: res} = await this.$http.delete('users/' + id)
                if(res.meta.status !== 200) {
                    this.$message.error("删除用户失败！")
                }
                this.$message.success('删除用户成功！')
                this.getUserList()
        },

    }, 

}
</script>




<style lang="less" scoped>

</style>