import React, { useEffect, useRef, useState } from 'react'
import { createDebounceInterval, elementWhetherPartInView } from '@lyrical/js'

interface IProps {
  /**
   * 动态组件
   */
  Component?: React.ElementType
  /**
   * 加载状态渲染
   */
  loadingRender?: React.ReactNode
  /**
   * 加载偏移
   */
  skew?: number
  /**
   * 滚动挂载元素
   */
  mountElement?: HTMLElement
  /**
   * 间隔
   */
  interval?: number
}

export const LazyView: React.FC<IProps> = props => {
  const { children, Component = 'div', loadingRender, skew = 0, mountElement = window, interval = 500 } = props
  const ref = useRef<HTMLDivElement>(null)
  const skewRef = useRef(skew)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (show) return () => null

    const callback = createDebounceInterval(
      () => {
        if (!ref.current) return
        const partIn = elementWhetherPartInView(ref.current, skewRef.current)

        if (partIn) {
          mountElement.removeEventListener('scroll', callback)
          window.removeEventListener('resize', callback)
          setShow(true)
        }
      },
      { interval, creating: true }
    )

    mountElement.addEventListener('scroll', callback)
    window.addEventListener('resize', callback)

    return () => {
      mountElement.removeEventListener('scroll', callback)
      window.removeEventListener('resize', callback)
    }
  }, [show])

  return <Component ref={ref}>{show ? children : loadingRender || '加载中...'}</Component>
}

export default LazyView
