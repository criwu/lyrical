import { elementCalcOffsetToBody, elementWhetherAllInView, elementWhetherPartInView } from '../../calc'
import Scroll from '../scroll'

const scrollTask = new Scroll()

/**
 * 锚点
 */
export interface IAnchor {
  /**
   * 锚点 ID
   */
  id: string

  /**
   * 锚点标题
   */
  title: string

  /**
   * 锚点导航 ID
   */
  navId: string
}

/**
 * 锚点列表
 */
export type IAnchorList = IAnchor[]

/**
 * 锚点导航
 */
export class Anchor {
  /**
   * 锚点元素
   */
  private anchorMap: { [key: string]: HTMLElement } = {}

  /**
   * 锚点导航元素
   */
  private anchorNavMap: { [key: string]: HTMLElement } = {}

  constructor(
    /**
     * 锚点列表
     */
    private readonly anchorList: IAnchorList,
    /**
     * 选项
     */
    private readonly options?: {
      /**
       * 选中类名
       */
      readonly activateClassName?: string
      /**
       * 滚动偏移
       */
      readonly topSkew?: number
      /**
       * 回调
       */
      readonly callback?: (top: number) => string
    }
  ) {}

  /**
   * 选中类名
   */
  private get activateClassName() {
    return this.options?.activateClassName || 'current'
  }

  /**
   * 滚动偏移
   */
  private get topSkew() {
    return this.options?.topSkew || 0
  }

  /**
   * 选中回调
   */
  private callback(top: number) {
    this.options?.callback?.(top)
  }

  /**
   * 设置选中
   */
  private setCurrent(anchor: IAnchor, top: number) {
    // Object.values(this.anchorMap).forEach(anchor => anchor.classList.remove(this.activateClassName))
    // this.anchorMap[anchor.id].classList.add(this.activateClassName)

    Object.values(this.anchorNavMap).forEach(anchor => anchor.classList.remove(this.activateClassName))
    this.anchorNavMap[anchor.navId].classList.add(this.activateClassName)

    this.callback(top)
  }

  /**
   * 运行
   */
  private test(top: number) {
    const anchor = this.anchorList.find(anchor => elementWhetherAllInView(this.anchorMap[anchor.id]))

    if (anchor) {
      this.setCurrent(anchor, top)
      return
    }

    for (const anchor of this.anchorList) {
      if (!elementWhetherPartInView(this.anchorMap[anchor.id])) return

      this.setCurrent(anchor, top)
      break
    }
  }

  /**
   * 挂载
   */
  mount() {
    // 锚点元素
    this.anchorList.forEach(anchor => {
      const element = document.getElementById(anchor.id) as HTMLElement
      this.anchorMap[anchor.id] = element
    })

    // 锚点导航元素
    this.anchorList.forEach((anchor, index) => {
      const element = document.getElementById(anchor.navId) as HTMLElement

      // 默认选中
      if (!index) element.classList.add(this.activateClassName)

      // 单击选中
      element.addEventListener('click', () => {
        // 计算滚动目标值
        const top = elementCalcOffsetToBody(this.anchorMap[anchor.id], 'offsetTop') - this.topSkew

        // 设置选中
        this.setCurrent(anchor, top)

        // 滚动到选中元素
        window.scrollTo({ top, behavior: 'smooth' })
      })

      // 保存元素
      this.anchorNavMap[anchor.navId] = element
    })

    // 添加任务
    scrollTask.add(this.test)
  }

  /**
   * 卸载
   */
  unMount() {
    scrollTask.remove(this.test)
  }
}

export default Anchor
