import request from '@/utils/request'

//注册接口
export const postregister = (obj: object) => request.post('/api/reg', obj)

//登录接口
export const postlogin = (obj: object) => request.post('/api/login', obj)
