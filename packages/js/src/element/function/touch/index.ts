/**
 * @author City
 * @description 触摸手势 Touch
 * @todo TODO: 1.链式挂载属性   2.兼容性
 */

/*
    单击：start() -- end()
    移动：start() -- move() -- end()

    cycle: 
    {    // element: 监听元素, event: 事件对象, coord: 当前坐标, move: 移动距离, direction: 移动方向
        start: ({element, event, coord:{x, y}}) => void,
        move: ({element, event, coord:{x, y}}, move: {x, y}) => void,
        end: ({element, event, coord:{x, y}, move: {x, y}, direction: "top"||"right"||"bottom"||"left"}) => void
    }
*/

interface ICycle {
  /**
   * 开始
   */
  start: (params: {
    /**
     * 监听元素
     */
    element: HTMLElement
    /**
     * 事件对象
     */
    event: TouchEvent
    /**
     * 当前坐标
     */
    coord: { x: number; y: number }
  }) => void
  /**
   * 移动
   */
  move: (params: {
    /**
     * 监听元素
     */
    element: HTMLElement
    /**
     * 事件对象
     */
    event: TouchEvent
    /**
     * 当前坐标
     */
    coord: { x: number; y: number }
    /**
     * 移动距离
     */
    move: { x: number; y: number }
  }) => void
  /**
   * 结束
   */
  end: (params: {
    /**
     * 监听元素
     */
    element: HTMLElement
    /**
     * 事件对象
     */
    event: TouchEvent
    /**
     * 当前坐标
     */
    coord: { x: number; y: number }
    /**
     * 移动距离
     */
    move: { x: number; y: number }
    /**
     * 移动方向
     */
    direction: 'top' | 'right' | 'bottom' | 'left'
  }) => void
}

/**
 * 移动手势
 */
export class Touch {
  element: HTMLElement

  cycle: Partial<ICycle>

  startCoord: { x: number; y: number }

  moveCoord: { x: number; y: number }

  endCoord: { x: number; y: number }

  isMove: boolean

  /* 监听元素 生命周期 */
  constructor(element: HTMLElement, cycle: Partial<ICycle> = {}) {
    // listen element
    this.element = element
    // cycle function {start, move, end}
    this.cycle = cycle

    // start coord {x, y}
    this.startCoord = { x: 0, y: 0 }
    // move coord {x, y}
    this.moveCoord = { x: 0, y: 0 }
    // end coord {x, y}
    this.endCoord = { x: 0, y: 0 }

    // is move ?
    this.isMove = false

    // init listen event
    this.init()
  }

  /* add touch event */
  private init() {
    // listen touch start
    this.element.addEventListener('touchstart', e => this.start(e), false)
    // listen touch move
    this.element.addEventListener('touchmove', e => this.move(e), false)
    // listen touch end
    this.element.addEventListener('touchend', e => this.end(e), false)
  }

  /* touch start callback */
  private start(event: TouchEvent) {
    // get start coord
    const x = Math.floor(event.touches[0].pageX)
    const y = Math.floor(event.touches[0].pageY)

    // set start coord
    this.startCoord = { x, y }

    // call start cycle function
    this.cycle.start?.({ element: this.element, event, coord: { x, y } })
  }

  /* touch move callback */
  private move(event: TouchEvent) {
    // get move coord
    const x = Math.floor(event.touches[0].pageX)
    const y = Math.floor(event.touches[0].pageY)

    // calc to last move reason isMove
    const moveX = this.isMove ? Math.floor(x - this.moveCoord.x) : 0
    const moveY = this.isMove ? Math.floor(y - this.moveCoord.y) : 0

    // move start
    this.isMove = true

    // set move coord
    this.moveCoord = { x, y }

    // call move cycle function
    this.cycle.move?.({ element: this.element, event, coord: { x, y }, move: { x: moveX, y: moveY } })
  }

  /* touch end callback */
  private end(event: TouchEvent) {
    // move start
    this.isMove = false

    // get end coord
    const x = Math.floor(event.changedTouches[0].pageX)
    const y = Math.floor(event.changedTouches[0].pageY)

    // set end coord
    this.endCoord = { x, y }

    // calc move distance
    const moveX = Math.floor(x - this.startCoord.x)
    const moveY = Math.floor(y - this.startCoord.y)

    /* calc direction */
    const direction = Touch.calcDirection(moveX, moveY)

    // call end cycle function
    this.cycle.end?.({
      element: this.element,
      event,
      coord: { x, y },
      move: { x: moveX, y: moveY },
      direction
    })
  }

  /* calc direction */
  private static calcDirection(moveX: number, moveY: number) {
    // calc move angle : Math.atan2(y, x) * 180 / Math.PI
    const angle = (Math.atan2(moveX, moveY) * 180) / Math.PI

    // 以 -y 轴为起点，顺时针为负，逆时针为正，至 +y 轴为中点，形成正负 180°

    // calc move direction and return
    if (angle < -135 || angle >= 135) return 'top'

    if (angle < 135 && angle >= 45) return 'right'

    if (angle < 45 && angle >= -45) return 'bottom'

    return 'left'
  }
}

export default Touch
