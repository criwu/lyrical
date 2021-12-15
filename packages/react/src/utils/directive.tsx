import React, { useState, useMemo } from 'react'
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
  /**
   * 关闭延时 配合动效
   */
  hiddenTimeout?: number
}

const createMountElement = () => {
  const mountElement = document.createElement('div')
  mountElement.className = 'lyric-directive-element'

  return {
    element: mountElement,
    show() {
      mountElement.style.display = 'block'

      return this
    },
    hide() {
      mountElement.style.display = 'none'

      return this
    },
    mount(root: HTMLElement) {
      root.appendChild(mountElement)

      return this
    },
    unMount() {
      mountElement.parentNode?.removeChild(mountElement)

      return this
    }
  }
}

const createMountComponent = (Element: React.FC<any>) => {
  let changeVisible: React.Dispatch<React.SetStateAction<boolean>> | null = null

  const MountComponent: React.FC = (props: any) => {
    const [visible, setVisible] = useState(props.visible || false)
    changeVisible = setVisible

    const params = useMemo(() => ({ ...props, visible }), [props, visible])

    return Element(params)
  }

  return {
    show() {
      changeVisible?.(true)

      return this
    },
    hide() {
      changeVisible?.(false)

      return this
    },
    mount(mountElement: HTMLElement, defaultProps: any) {
      const Clone = React.cloneElement(<MountComponent />, defaultProps)
      ReactDOM.render(Clone, mountElement)

      return this
    },
    unMount(mountElement: HTMLElement) {
      ReactDOM.unmountComponentAtNode(mountElement)

      return this
    }
  }
}

function createReactDirectiveCore<T>(Element: React.FC<T>) {
  const mountElement = createMountElement()

  const mountComponent = createMountComponent(Element)

  return {
    mountElement,
    mountComponent
  }
}

export class DirectiveElement<T extends IProps> {
  private core: ReturnType<typeof createReactDirectiveCore>

  private mounted = false

  constructor(element: React.FC<T>, private options: IOptions<Omit<T, keyof IProps>> = {}) {
    this.core = createReactDirectiveCore(element)
  }

  open(props: Omit<T, keyof IProps>) {
    if (this.options.isAlive && this.mounted) {
      this.core.mountComponent.show()
      return
    }

    this.mounted = true

    this.core.mountElement.mount(this.options.root || document.body).show()

    let defaultProps = { ...props, hidden: () => this.close(), visible: true }
    if (this.options.transformProps) defaultProps = { ...defaultProps, ...this.options.transformProps(defaultProps) }
    this.core.mountComponent.mount(this.core.mountElement.element, defaultProps).show()
  }

  close() {
    if (!this.mounted) return

    if (this.options.isAlive) {
      this.core.mountComponent.hide()
      return
    }

    this.mounted = false

    this.core.mountComponent.hide()

    if (!this.options.hiddenTimeout) {
      this.core.mountComponent.unMount(this.core.mountElement.element)
      this.core.mountElement.hide().unMount()
      return
    }

    setTimeout(() => {
      this.core.mountComponent.unMount(this.core.mountElement.element)
      this.core.mountElement.hide().unMount()
    }, this.options.hiddenTimeout)
  }
}

// TODO: 分开暴露单例和工厂
