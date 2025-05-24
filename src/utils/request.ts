import axios from "axios";
import { ElMessage } from "element-plus";

//创建axios实例
const request = axios.create({

  timeout:5000,
})
//请求拦截器
request.interceptors.request.use((config)=>{
  //config:配置对象，对象里面有一个属性很重要，headers请求头
  return config;
},(err)=>{
  return Promise.reject(err);
})
//响应拦截器
request.interceptors.response.use((res)=>{
  //成功的回调函数
  return res.data;
},(error)=>{
  //处理网络错误
  let message = ''
  const status = error.response.status
  switch (status) {
    case 401:
      message = 'token过期'
      break
    case 403:
      message = '无权访问'
      break
    case 404:
      message = '请求地址错误'
      break
    case 500:
      message = '服务器出现问题'
      break
    default:
      message = '无网络'
      break
  }
  ElMessage({
    type: 'error',
    message,
  })
  return Promise.reject(error)
})

export default request;
