import { elementCalcMouseBaseCoord } from '@lyrical/js'
import './index.css'
// TODO: 打包 css

// TODO: 使用后单例 mount

export const effectRippleMount = () => {
  window.addEventListener('click', e => {
    const element = e.target as HTMLElement
    if (!element) return

    /* 判断是否触发 */
    const is = element.className?.includes?.('lyrical-effect-touch-ripple-root')
    if (!is) return

    /* 计算鼠标在元素位置 */
    const coord = elementCalcMouseBaseCoord(e, element)

    /* 创建波浪元素 */
    const ripple = document.createElement('span')

    ripple.className = 'lyrical-effect-touch-ripple'
    ripple.style.left = `${coord.x}px`
    ripple.style.top = `${coord.y}px`

    element.appendChild(ripple)

    setTimeout(() => element.removeChild(ripple), 1000)
  })
}

export default effectRippleMount
