/**
 * 请求类型
 */
export enum REQUEST_TYPE {
  GET = 'GET',
  PUT = 'PUT',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

export type IRequestType = keyof typeof REQUEST_TYPE

export type IRequestInterceptor = <T>(options: IRequestOptions<T>) => IRequestOptions<T>

export type IResponseInterceptor<T> = (response: T) => any

export interface IHttpInterceptors<T> {
  request: IRequestInterceptor[]
  response: IResponseInterceptor<T>[]
}

/**
 * 请求可选项
 */
export interface IRequestOptional {
  /**
   * 请求头
   */
  headers?: HeadersInit
  /**
   * 路由参数
   */
  params?: any
  /**
   * 查询参数
   */
  query?: any
  /**
   * 主体参数
   */
  body?: any
  /**
   * 附带参数 - 根据请求方法放入相应位置 query | body 以及相应的数据结构
   */
  parameters?: any
}

/**
 * 请求参数
 */
export interface IRequestOptions<T> extends IRequestOptional {
  /**
   * 地址
   */
  url: string
  /**
   * 方法
   */
  method: IRequestType
  /**
   * 拦截器
   */
  interceptors?: IHttpInterceptors<T>
  /**
   * 模拟数据
   */
  mock?: { [path: string]: any }
}

/**
 * 工厂模式配置
 */
export interface DefaultConfig {
  /**
   * 前缀 url
   */
  baseUrl?: string
  /**
   * 附带参数
   */
  parameters?: any
  /**
   * 模拟数据
   */
  mock?: { [path: string]: any }
}
