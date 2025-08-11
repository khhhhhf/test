import request from '@/utils/request'

//分类: 获取文章分类
export const getarticleclass = () => request.get('/my/cate/list')

//修改分类
export const changearticleclass = (obj: object) =>
  request.put('/my/cate/info', obj)

//增加分类
export const addearticleclass = (obj: object) =>
  request.post('/my/cate/add', obj)

//删除分类
export const deleteearticleclass = (id: string) =>
  request.delete('/my/cate/del', {
    params: {
      id
    }
  })

//获取文章列表
export const getarticlelist = (obj: object) =>
  request.get('/my/article/list', {
    params: obj
  })
