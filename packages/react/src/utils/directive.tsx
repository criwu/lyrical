import React from 'react'
import ReactDOM from 'react-dom'

interface IOptions {
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
  props?: { [K: string]: any }
}

function reactDirectiveCore(Element: React.FC, options: IOptions = {}): HTMLElement {
  const { root = document.body, isAlive = false, props = {} } = options

  const mountDom = document.createElement('div')
  root.appendChild(mountDom)

  // 向组件注入方法，以便组件能调用关闭
  const Clone = React.cloneElement(<Element />, {
    visible: true,
    hide: () => {
      if (!isAlive) {
        ReactDOM.unmountComponentAtNode(mountDom)
        mountDom.parentNode?.removeChild(mountDom)
        return
      }

      mountDom.style.display = 'none'
    },
    ...props
  })

  ReactDOM.render(Clone, mountDom)

  return mountDom
}

interface IProps {
  visible: boolean
  hide: () => void
}

export type IDirective<T> = T & IProps

export class DirectiveElement<T extends IProps> {
  private mountDom: HTMLElement | undefined

  constructor(private element: React.FC<T>, private options: IOptions = { root: document.body }) {}

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
      return
    }

    // 不存在 DOM
    this.mountDom = reactDirectiveCore(this.element as any, this.options)
  }
}
