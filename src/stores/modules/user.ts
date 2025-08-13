import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getuserinfo } from '@/api/user'

// 定义 API 响应类型
interface UserInfo {
  nickname: string
  user_pic: string
  username: string
}
export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const settoken = (value: string): void => {
      token.value = value
    }
    const removetoken = () => {
      token.value = ''
      user.value = { nickname: '', user_pic: '', username: '' }
    }
    const user = ref<UserInfo>()
    const getuser = async () => {
      const res = await getuserinfo()
      user.value = res.data
    }
    // 更新用户头像
    function updateUserAvatar(avatarUrl: string) {
      if (user.value) {
        user.value.user_pic = avatarUrl
      }
    }
    return { token, settoken, removetoken, getuser, user, updateUserAvatar }
  },
  {
    persist: {
      key: 'user-store' // 自定义存储键名
    }
  }
)
