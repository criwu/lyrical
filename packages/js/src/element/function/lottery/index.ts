/**
 * 抽奖
 *
 * const lottery = new Lottery([1, 2, 3])
 *
 * lottery.setChange((current) => null)
 * lottery.onFinish((current) => null)
 *
 * lottery.start()
 * lottery.end(2)
 */
export class Lottery<T> {
  /**
   * 当前选中
   */
  private current: T | null = null

  /**
   * 延时
   */
  private delay = 50

  /**
   * 开始时间
   */
  private startTime = 0

  /**
   * 运行锁
   */
  private lock = false

  /**
   * 运行程序句柄
   */
  private timeOut = 0

  /**
   * 结束标识
   */
  private finish = false

  /**
   * 抽奖结果
   */
  private finishCurrent: T | null = null

  /**
   * 循环回调
   */
  private onChange?: (current: T) => void

  /**
   * 完成回调
   */
  private onFinish?: (current: T) => void

  /**
   * @param runList 运行列表
   */
  constructor(private readonly runList: T[]) {}

  /**
   * 设置循环回调
   */
  setChange(onChange: (current: T) => void) {
    this.onChange = onChange
  }

  /**
   * 设置完成回调
   */
  setFinish(onFinish: (current: T) => void) {
    this.onFinish = onFinish
  }

  /**
   * 运行
   */
  private run() {
    /* 查找当前 index */
    const index = this.runList.findIndex(v => v === this.current)

    /* 计算下一选中 */
    this.current = this.runList[index + 1] || this.runList[0]

    /* 当前循环回调 */
    this.onChange?.(this.current)

    /* 计算运行时间 */
    const runTime = new Date().getTime() - this.startTime

    /* 是否可以结束 */
    const canEnd = runTime > 3000 && this.finish

    /* 循环至选中结束 */
    if (canEnd && this.finishCurrent === this.current) {
      /* 清除抽奖设置 */
      this.clear()

      /* 完成回调 */
      this.onFinish?.(this.finishCurrent)

      return
    }

    /* 减速 */
    if (canEnd) this.delay += 100

    /* 设置运行程序 */
    this.timeOut = (setTimeout(() => this.run(), this.delay) as unknown) as number
  }

  /**
   * 开始抽奖
   *
   * @param delay 循环频率
   * @returns
   */
  start(delay = 50) {
    /* 运行锁打开时 返回 */
    if (this.lock) return false

    /* 开启运行锁 */
    this.lock = true

    /* 清除结束设置 */
    this.finish = false
    this.finishCurrent = null

    /* 初始化开始设置 */
    this.delay = delay
    this.startTime = new Date().getTime()

    /* 开始运行 */
    this.run()

    return true
  }

  /**
   * 结束抽奖 - 不代表程序完成
   *
   * @param current 抽奖结果
   * @returns
   */
  end(current: T) {
    /* 运行锁关闭时 返回 */
    if (!this.lock) return false

    /* 初始化结束设置 */
    this.finish = true
    this.finishCurrent = current

    return true
  }

  /**
   * 清除抽奖设置
   */
  clear() {
    /* 关闭运行锁 */
    this.lock = false

    /* 清除结束设置 */
    this.finish = false
    this.finishCurrent = null

    /* 清除运行程序 */
    if (this.timeOut) clearTimeout(this.timeOut)
  }
}

export default Lottery
