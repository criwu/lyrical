import React, { useState, useCallback, useMemo, useEffect } from 'react'
import ReactDOM from 'react-dom'

interface IProps {
  visible: boolean
  hidden: () => void
}

export type IDirective<T> = T & IProps

interface IOptions<T = Record<string, any>> {
  /**
   * 根 DOM
   */
  root?: HTMLElement
  /**
   * 是否存活
   */
  isAlive?: boolean
  /**
   * 参数
   */
  props?: T
  /**
   * 转换参数
   */
  transformProps?: (props: T & IProps) => Partial<T & IProps>
  hiddenTimeout?: number
}

function reactDirectiveCore<T>(Element: React.FC<IDirective<T>>, options: IOptions<T>): HTMLElement {
  const { root = document.body, isAlive = false, transformProps, hiddenTimeout, props } = options

  const mountDom = document.createElement('div')
  root.appendChild(mountDom)

  let params = {
    visible: true,
    hidden: () => {
      if (!isAlive) {
        ReactDOM.unmountComponentAtNode(mountDom)
        mountDom.parentNode?.removeChild(mountDom)

        return
      }

      mountDom.style.display = 'none'
    },
    ...(props || {})
  }

  const show: any = {}

  // IDirective<T>
  const MountElement: React.FC = (props: any) => {
    const [visible, setVisible] = useState(props.visible || false)

    useEffect(() => {
      show.current = () => setVisible(true)
    }, [])

    const hidden = useCallback(() => {
      setVisible(false)

      if (hiddenTimeout) {
        setTimeout(() => props.hidden(), hiddenTimeout)
      } else {
        props.hidden()
      }
    }, [])

    const params = useMemo(() => ({ ...props, visible, hidden }), [props, hidden, visible])

    return Element(transformProps ? { ...params, ...transformProps(params) } : params)
  }

  // 向组件注入方法，以便组件能调用关闭
  const Clone = React.cloneElement(<MountElement />, params)

  ReactDOM.render(Clone, mountDom)
  ;(mountDom as any).show = show

  return mountDom
}

export class DirectiveElement<T extends IProps> {
  private mountDom: HTMLElement | undefined

  constructor(
    private element: React.FC<T>,
    private options: IOptions<Omit<T, keyof IProps>> = { root: document.body }
  ) {}

  open(props: Omit<T, keyof IProps>) {
    /* 不存活 */
    if (!this.options.isAlive) {
      reactDirectiveCore(this.element as any, {
        ...this.options,
        props: this.options.props && props ? { ...this.options.props, ...props } : props
      })

      return
    }

    /* 存活 */

    // 存在 DOM
    if (this.mountDom) {
      this.mountDom.style.display = 'block'
      console.log(111111111, (this.mountDom as any).show)
      ;(this.mountDom as any).show.current()
      return
    }

    // 不存在 DOM
    this.mountDom = reactDirectiveCore(this.element as any, {
      ...this.options,
      props: this.options.props && props ? { ...this.options.props, ...props } : props
    })
  }
}
