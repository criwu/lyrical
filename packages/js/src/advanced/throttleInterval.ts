interface IOptions {
  /**
   * 立即执行 - 调用时
   *
   * default = true
   */
  immediate?: boolean
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
   * 调用时执行
   */
  const immediate = typeof options === 'number' ? false : options.immediate || true
  /**
   * 结束时执行
   */
  const delayed = typeof options === 'number' ? false : options.delayed || false
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

  // 创建执行
  if (creating) callback(...((options as any)?.creatingParams || []))

  /**
   * 节流函数
   */
  const throttled = (...args: any[]) => {
    if (timeout) return

    if (immediate) callback(...args)

    timeout = (setTimeout(() => {
      timeout = null
      if (delayed) callback(...args)
    }, interval) as unknown) as number
  }

  return throttled as T
}

export default createThrottleInterval
