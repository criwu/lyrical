/**
 * 创建竞态锁
 * @description 请求过程中有其他请求 等待最先请求 Promise
 * @param service 请求
 * @returns 请求
 */
const createRaceLock = <T extends () => Promise<any>>(service: T) => {
  let promise: Promise<any> | null = null

  return (...args: []) => {
    if (promise) return promise

    promise = service(...args)

    promise.finally(() => (promise = null))

    return promise
  }
}
