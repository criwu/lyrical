import qs from 'querystring'
import { interceptorsFactory } from './interceptors'
import { DefaultConfig, IHttpInterceptors, IRequestOptional, IRequestOptions, REQUEST_TYPE } from './types'
// TODO: mock的延时和部分mock、插件系统、撤回请求

const request = async <T>(options: IRequestOptions<T> = { url: '', method: REQUEST_TYPE.POST }): Promise<T> => {
  if (options?.interceptors?.request?.length) {
    options.interceptors.request.forEach(cb => {
      options = cb(options)
    })
  }

  if (!options.headers && !(options?.body instanceof FormData)) {
    options.headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  // 附加参数
  if (options.parameters) {
    if (options.method === REQUEST_TYPE.GET) {
      options.query = options.query ? { ...options.query, ...options.parameters } : { ...options.parameters }
    } else if (options.body instanceof FormData) {
      Object.keys(options.parameters).forEach(key => options.body.set(key, options.parameters[key]))
    } else {
      options.body = options.body ? { ...options.body, ...options.parameters } : { ...options.parameters }
    }
  }

  let { url } = options
  const requestParams: RequestInit = { method: options.method || REQUEST_TYPE.POST }

  if (options.headers) requestParams.headers = options.headers

  if (options.params)
    Object.keys(options.params).forEach(key => {
      url = url.replace(':key', options.params[key])
    })

  if (options.query) url = `${url}?${qs.stringify(options.query)}`

  if (options.body) requestParams.body = options.body instanceof FormData ? options.body : qs.stringify(options.body)

  // request error

  try {
    const response = await fetch(url, { ...requestParams })

    let json: T = await response.json()
    if (options?.interceptors?.response?.length) {
      options.interceptors.response.forEach(cb => {
        json = cb(json)
      })
    }

    return json
  } catch (error) {
    // response error
    // adapter.error && (error = adapter.error(error, response, options))
    if (error !== null || error !== undefined) {
      throw error
    }
    return error
  }
}

/**
 * 请求工厂函数
 */
const requestFactory = <T>(config: DefaultConfig = {}, interceptors?: IHttpInterceptors<T>) => (
  options: IRequestOptions<T>
) => {
  // 模拟
  if (config.mock && config.mock[options.url]) {
    return config.mock[options.url]
  }

  // 基础路径
  if (config.baseUrl) options.url = config.baseUrl + options.url
  // 附带参数
  if (config.parameters) options.parameters = { ...config.parameters, ...options.parameters }
  // 拦截器
  if (interceptors) options.interceptors = interceptors

  // 请求
  return request<T>(options)
}

/**
 * HTTP 请求
 */
export class Http<T = any> {
  /**
   * 请求函数
   */
  request: (options: IRequestOptions<T>) => Promise<T>

  /**
   * 请求拦截器
   */
  interceptors = interceptorsFactory<T>()

  /**
   * 初始化
   */
  constructor(config: DefaultConfig = {}) {
    this.request = requestFactory<T>(config, this.interceptors.map())
  }

  /**
   * GET 请求
   */
  get = (url: string, options: IRequestOptional) => this.request({ ...options, url, method: REQUEST_TYPE.GET })

  /**
   * PUT 请求
   */
  put = (url: string, options: IRequestOptional) => this.request({ ...options, url, method: REQUEST_TYPE.PUT })

  /**
   * POST 请求
   */
  post = (url: string, options: IRequestOptional) => this.request({ ...options, url, method: REQUEST_TYPE.POST })

  /**
   * PATCH 请求
   */
  patch = (url: string, options: IRequestOptional) => this.request({ ...options, url, method: REQUEST_TYPE.PATCH })

  /**
   * DELETE 请求
   */
  delete = (url: string, options: IRequestOptional) => this.request({ ...options, url, method: REQUEST_TYPE.DELETE })
}
