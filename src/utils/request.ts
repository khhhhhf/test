import axios from 'axios'
import { useUserStore } from '@/stores/index'
import router from '@/router'

const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 10000
})
// 添加请求拦截器

instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // TODO 2,携带token
    const UserStore = useUserStore()
    if (UserStore.token) {
      config.headers.Authorization = UserStore.token
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    // TODO 4,核心响应数据
    if (response.data.code === 0) {
      return response.data
    }
    // TODO 3
    //处理业务失败，给错误提示，并且抛出错误
    ElMessage.error(response.data.message || '身份认证失败')
    console.log(response.data.message)
    return Promise.reject(response.data)
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    // TODO 5
    //错误的特殊情况 =>401 权限不足或者token过期 => 拦截到
    if (error.response?.status === 401) {
      // const router = useRouter()
      router.push('/login')
    }
    ElMessage.error(error.response.data.message || '服务异常')
    return Promise.reject(error)
  }
)

export default instance
export { baseURL }
