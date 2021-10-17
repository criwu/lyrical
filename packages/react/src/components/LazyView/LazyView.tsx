import React, { useEffect, useRef, useState } from 'react'
import { createThrottleInterval, elementWhetherPartInView } from '@lyrical/js'

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
}

export const LazyView: React.FC<IProps> = props => {
  const { children, Component = 'div', loadingRender, skew = 0 } = props
  const ref = useRef<HTMLDivElement>(null)
  const skewRef = useRef(skew)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (show) return () => null

    const callback = createThrottleInterval(
      () => {
        if (!ref.current) return
        const partIn = elementWhetherPartInView(ref.current, skewRef.current)

        if (partIn) setShow(true)
      },
      { interval: 500, creating: true }
    )

    window.addEventListener('scroll', callback)

    return () => window.removeEventListener('scroll', callback)
  }, [show])

  return <Component ref={ref}>{show ? children : loadingRender || '加载中...'}</Component>
}

export default LazyView
