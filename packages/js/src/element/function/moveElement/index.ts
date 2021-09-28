import { elementGetRectByView } from '../../calc'

type ICycle<C extends string> = { [K in C]: () => void }

class Cycle<C extends string> {
  private cycles: Array<ICycle<C>> = []

  /**
   * 添加
   */
  add(cycle: ICycle<C>) {
    this.cycles.push(cycle)
  }

  /**
   * 移除
   */
  remove(cycle: ICycle<C>) {
    const index = this.cycles.findIndex(c => c === cycle)
    if (index === -1) return false
    this.cycles.splice(index, 1)

    return true
  }

  /**
   * 获取
   */
  get(current: C) {
    return this.cycles.map(cycle => cycle[current])
  }
}

/**
 * 选项
 */
interface IOptions {
  /**
   * 是否自动吸附
   */
  adsorb: boolean
}

class Move extends Cycle<'mousedown' | 'mousemove' | 'mouseup'> {
  /**
   * 锁
   */
  private lock = false

  /**
   * 事件处理
   */
  private eventHandle = (e: MouseEvent) => this.eventDistribute(e)

  constructor(readonly element: HTMLElement) {
    super()
    this.mount()
  }

  private mount() {
    // 元素初始样式
    this.element.style.position = 'fixed'
    this.element.style.userSelect = 'none'
    this.element.style.top = '0'
    this.element.style.left = '0'

    // 元素入口事件
    this.element.addEventListener('mousedown', this.eventHandle)
  }

  /**
   * 事件分发
   */
  private eventDistribute(e: MouseEvent) {
    const { type } = e

    switch (type) {
      case 'mousedown':
        this.mousedown(e)
        break

      case 'mousemove':
        this.mousemove(e)
        break

      case 'mouseup':
        this.mouseup(e)
        break

      default:
        break
    }
  }

  /**
   * 添加活动事件
   */
  private addActionEvent() {
    document.body.addEventListener('mousemove', this.eventHandle)
    document.body.addEventListener('mouseup', this.eventHandle)

    return this
  }

  /**
   * 移除活动事件
   */
  private removeActionEvent() {
    document.body.addEventListener('mousemove', this.eventHandle)
    document.body.addEventListener('mouseup', this.eventHandle)

    return this
  }

  /**
   * 鼠标按下事件
   */
  private mousedown(_e: MouseEvent) {
    this.setLock().addActionEvent()

    this.get('mousedown').forEach(current => current())
  }

  /**
   * 鼠标移动事件
   */
  private mousemove(e: MouseEvent) {
    if (!this.lock) return

    this.setCursor('move')

    const { movementX, movementY } = e

    this.element.style.top = `${parseFloat(this.element.style.top) + movementY}px`
    this.element.style.left = `${parseFloat(this.element.style.left) + movementX}px`

    this.get('mousemove').forEach(current => current())
  }

  /**
   * 鼠标弹起事件
   */
  private mouseup(_e: MouseEvent) {
    this.setLock(false).removeActionEvent().setCursor()

    this.get('mouseup').forEach(current => current())
  }

  /**
   * 设置锁状态
   *
   * @param lock 锁状态
   */
  private setLock(lock = true) {
    this.lock = lock

    return this
  }

  /**
   * 设置光标状态
   *
   * @param cursor 光标状态
   */
  private setCursor(cursor: 'default' | 'move' = 'default') {
    if (document.body.style.cursor !== cursor) document.body.style.cursor = cursor

    return this
  }
}

/**
 * 元素移动
 */
export class MoveElement extends Move {
  constructor(element: HTMLElement, options?: IOptions) {
    super(element)

    if (options?.adsorb)
      this.add({
        mousedown: () => {
          // 移除过度
          this.element.style.transition = 'none'
        },
        mousemove: () => null,
        mouseup: () => {
          const rect = elementGetRectByView(this.element)
          const min = Math.min(...Object.values(rect))
          const key = Object.keys(rect).find(dir => rect[dir as keyof typeof rect] === min)

          // 添加过度
          this.element.style.transition = 'all .5s'

          switch (key) {
            case 'top':
              this.element.style[key] = `${-this.element.getBoundingClientRect().height * 0.4}px`
              break
            case 'bottom':
              this.element.style.top = `${
                document.documentElement.clientHeight - this.element.getBoundingClientRect().height * 0.4
              }px`
              break
            case 'left':
              this.element.style[key] = `${-this.element.getBoundingClientRect().width * 0.4}px`
              break
            case 'right':
              this.element.style.left = `${
                document.documentElement.clientWidth - this.element.getBoundingClientRect().width * 0.4
              }px`
              break
            default:
              break
          }
        }
      })
  }
}

export default MoveElement
