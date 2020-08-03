import Vue from 'vue'
import {
    Button, 
    Input, 
    Form, 
    FormItem, 
    Message,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    MenuItem,
    MenuItemGroup,
    Submenu,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox
}  from  'element-ui'


//  全局都可使用： this.$message
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm



Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)

Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)

Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)

Vue.use(Row)
Vue.use(Col)


Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)

Vue.use(Tooltip)

Vue.use(Pagination)

Vue.use(Dialog)







