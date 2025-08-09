<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'

import { Calendar, View } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { postlogin, postregister } from '@/api/user'
import { useUserStore } from '@/stores'

import { useRouter } from 'vue-router'

const ruleFormRef = ref<FormInstance>()

const checked1 = ref(false)

const pd = ref(true)
//登录

// 登录表单类型
interface LoginForm {
  account: string
  pass: string
}

const ruleForm: LoginForm = reactive({
  pass: '',
  account: ''
})

const rules = reactive<FormRules<LoginForm>>({
  account: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
  pass: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, max: 20, message: '长度应该在6到20之间', trigger: 'change' },
    {
      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/,
      trigger: 'blur',
      message: '密码格式不正确（需包含字母和数字）'
    }
  ]
})

const router = useRouter()

// 定义接口返回数据结构
interface ApiLoginResponse {
  token: string
}

const login = async () => {
  if (!ruleFormRef.value) return

  await ruleFormRef.value.validate()

  // 关键修复：使用双重类型断言彻底解决类型不兼容问题
  const data = (await postlogin({
    username: ruleForm.account,
    password: ruleForm.pass
  })) as unknown as ApiLoginResponse

  ElMessage({
    showClose: true,
    message: '登录成功',
    type: 'success'
  })

  const { settoken } = useUserStore()
  settoken(data.token) // 不再报错
  router.push({ name: 'home' })
}

//注册
const ruleForm2 = reactive({
  username: '',
  password: '',
  repassword: ''
})

const rules2 = reactive<FormRules<typeof ruleForm2>>({
  username: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, max: 20, message: 'Length should be 5 to 20', trigger: 'change' },
    {
      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/,
      trigger: 'blur',
      message: '密码格式不正确'
    }
  ],
  repassword: [
    {
      validator: (_, value: string, callback: (error?: Error) => void) => {
        if (value !== ruleForm2.password) {
          callback(new Error('两次密码不一致'))
        } else {
          callback() // 无错误
        }
      },
      trigger: 'blur'
    }
  ]
})

const register = async () => {
  await ruleFormRef.value?.validate()
  await postregister(ruleForm2)
  ElMessage({
    showClose: true,
    message: '注册成功',
    type: 'success'
  })
  pd.value = !pd.value
}

watch(pd, async (value) => {
  if (value) {
    // await nextTick()
    Object.assign(ruleForm, {
      pass: '',
      account: ''
    })
  }
})
</script>

<template>
  <el-row>
    <el-col :span="12">
      <div class="left">
        <img src="../../assets/logo2.png" alt="" />
      </div>
    </el-col>
    <!-- status-icon属性为输入框添加了表示校验结果的反馈图标。 -->
    <el-col :offset="3" :span="6">
      <el-form
        v-if="pd"
        ref="ruleFormRef"
        style="max-width: 600px"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="account">
          <el-input
            :prefix-icon="View"
            size="large"
            placeholder="请输入账号"
            v-model="ruleForm.account"
            type="text"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item prop="pass">
          <el-input
            :prefix-icon="Calendar"
            size="large"
            placeholder="请输入密码"
            v-model="ruleForm.pass"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item>
          <div class="jzw">
            <el-checkbox v-model="checked1" label="记住我" size="large" />
            <span class="wj">忘记密码</span>
          </div>
        </el-form-item>
        <el-form-item
          ><el-button size="large" type="primary" @click="login"
            >登录</el-button
          ></el-form-item
        >
        <el-form-item
          ><span class="zc" @click="pd = !pd">注册 →</span></el-form-item
        >
        <el-form-item>
          <div>
            仅用于IT培训教学使用，为保障您的个人信息安全，请勿向平台录入任何个人敏感信息（如手机号、身份证号等）！
          </div>
        </el-form-item>
      </el-form>
      <el-form
        v-else
        ref="ruleFormRef"
        style="max-width: 600px"
        :model="ruleForm2"
        :rules="rules2"
        label-width="auto"
        class="demo-ruleForm"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            size="large"
            placeholder="请输入账号"
            v-model="ruleForm2.username"
            type="text"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            size="large"
            v-model="ruleForm2.password"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            placeholder="请再次输入密码"
            size="large"
            type="password"
            v-model="ruleForm2.repassword"
          />
        </el-form-item>

        <el-form-item
          ><el-button @click="register" size="large" type="primary"
            >注册</el-button
          ></el-form-item
        >
        <el-form-item
          ><span class="zc" @click="pd = !pd">返回 →</span></el-form-item
        >
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="less" scoped>
.left {
  border-bottom-right-radius: 20px;
  border-top-right-radius: 20px;
  height: 100vh;
  background: antiquewhite url('../../assets/login_bg.jpg') center center;
  background-size: cover;
  text-align: center;
  img {
    width: 250px;
    margin-top: 250px;
  }
}
.el-form {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .el-button {
    width: 100%;
  }
  .zc {
    color: gray;
    cursor: pointer;
  }
  .el-form-item {
    margin-bottom: 25px;
  }
}
.jzw {
  width: 100%;
  display: flex;
  justify-content: space-between;
  .wj {
    line-height: 40px;
    color: #409eff;
    font-weight: 500;
    cursor: pointer;
  }
}
.el-row {
  background-color: #ffffff;
}
</style>
