import React, { CSSProperties, useState, useEffect, useRef } from 'react'

// TODO: 支持加入涟漪特效

export interface ButtonProps {
  /**
   * 类名
   */
  className?: string
  /**
   * 样式
   */
  style?: CSSProperties
  /**
   * 宽度
   */
  width?: number
  /**
   * 高度
   */
  height?: number
  /**
   * 是否根据 onClick 返回 Promise 进行 Loading
   */
  hasLoading?: boolean
  /**
   * 受控 Loading
   */
  loading?: boolean
  /**
   * 是否使用填充 Loading 模式，TODO: 后续改为多主题 loadingTheme
   */
  fillLoading?: boolean
  /**
   * 尺寸
   */
  size?: 'large' | 'middle' | 'small'
  /**
   * 类型
   */
  type?: 'button' | 'reset' | 'submit'
  /**
   * 主题
   */
  theme?: 'link' | 'primary' | 'minor'
  /**
   * 点击事件
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void | Promise<any>
}

export const Button: React.FC<ButtonProps> = props => {
  const {
    children,
    style = {},
    width,
    height,
    hasLoading = false,
    loading: controlledLoading,
    fillLoading = false,
    size = 'middle',
    type = 'button',
    onClick,
    theme = 'primary',
    className
  } = props

  const [loading, setLoading] = useState(false)
  const loadingRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    setLoading(!!controlledLoading)
  }, [controlledLoading])

  useEffect(() => {
    if (fillLoading) return

    if (!loadingRef.current) return

    if (loading) {
      loadingRef.current.style.width = '22px'
    } else {
      loadingRef.current.style.width = '0px'
    }
  }, [loading])

  const renderStyle: CSSProperties = {}
  if (width) renderStyle.width = width
  if (height) {
    renderStyle.height = height
    renderStyle.lineHeight = `${height}px`
  }

  const options: { onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void } = {}

  if (onClick)
    options.onClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (!hasLoading) {
        onClick(event)
        return
      }

      setLoading(true)

      try {
        await onClick(event)
      } catch (error) {}

      setLoading(false)
    }

  return (
    <button
      {...options}
      className={`lyric-button ${size} ${theme}${className ? ` ${className}` : ''}${
        loading ? ' lyric-button-loading' : ''
      }`}
      style={{ ...style, ...renderStyle }}
      type={type}
    >
      {hasLoading || controlledLoading !== undefined ? (
        <span ref={loadingRef} className={`lyric-button-loading-span${loading && fillLoading ? ' fill' : ''}`}>
          <svg
            className='lyric-button-loading-icon'
            viewBox='0 0 1024 1024'
            focusable='false'
            data-icon='loading'
            width='1em'
            height='1em'
            fill='currentColor'
            aria-hidden='true'
          >
            <path d='M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z' />
          </svg>
        </span>
      ) : null}
      <span className='span'>{children ?? '按钮'}</span>
    </button>
  )
}

export default Button
