interface IOptions {
  /**
   * 初始执行 - 一轮中最开始调用时
   */
  initial?: boolean
  /**
   * 延时执行 - 结束时
   *
   * default = false
   */
  delayed?: boolean
  /**
   * 创建执行 - 创建时
   *
   * default = false
   */
  creating?: boolean
  /**
   * 创建执行参数
   */
  creatingParams?: any[]
  /**
   * 间隔
   *
   * default = 1000
   */
  interval?: number
}

/**
 * 创建节流函数
 * @param callback 执行函数
 * @param interval
 * @returns 执行函数
 */
export const createThrottleInterval = <T extends (...args: any[]) => void>(
  callback: T,
  options: IOptions | number = 1000
): T => {
  /**
   * 每轮初始时执行
   */
  const initial = typeof options === 'number' ? false : options.initial || false
  /**
   * 延时执行
   */
  const delayed = typeof options === 'number' ? false : options.delayed || false
  /**
   * 立即执行
   */
  const immediate = !delayed
  /**
   * 创建时执行
   */
  const creating = typeof options === 'number' ? false : options.creating || false
  /**
   * 间隔
   */
  const interval = typeof options === 'number' ? options : options.interval || 1000
  /**
   * 延时器标记
   */
  let timeout: number | null = null
  /**
   * 执行时间标记
   */
  let runTime = 0

  // 创建执行
  if (creating) callback(...((options as any)?.creatingParams || []))

  /**
   * 节流函数
   */
  const throttled = (...args: any[]) => {
    if (timeout) return

    if (immediate) callback(...args)
    else {
      const nowTime = +new Date()
      const intervalTime = nowTime - runTime
      if (initial && intervalTime > interval) callback(...args)
    }

    timeout = (setTimeout(() => {
      timeout = null
      if (delayed) {
        runTime = +new Date()
        callback(...args)
      }
    }, interval) as unknown) as number
  }

  return throttled as T
}

export default createThrottleInterval
