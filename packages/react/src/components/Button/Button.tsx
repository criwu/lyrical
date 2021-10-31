import React, { CSSProperties, useState } from 'react'
import './Button.styl'

interface IProps {
  value?: string
  style?: CSSProperties
  width?: number
  height?: number
  hasLoading?: boolean
  size?: 'large' | 'middle' | 'small'
  type?: 'button' | 'reset' | 'submit'
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void | Promise<any>
  theme?: 'link' | 'primary' | 'minor'
  className?: string
}

const Loading = (
  <span className='cu-loading'>
    <svg
      className='cu-loading-icon'
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
)

export const Button: React.FC<IProps> = props => {
  const {
    children,
    value,
    style = {},
    width,
    height,
    hasLoading = false,
    size = 'middle',
    type = 'button',
    onClick,
    theme = 'primary',
    className
  } = props

  const [loading, setLoading] = useState(false)

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
      await onClick(event)
      setLoading(false)
    }

  return (
    <button
      {...options}
      className={`cu-button ${size} ${theme}${className ? ` ${className}` : ''}${loading ? ' cu-button-loading' : ''}`}
      style={{ ...style, ...renderStyle }}
      type={type}
    >
      {hasLoading && loading ? Loading : null}
      <span className='span'>{children ?? value ?? '按钮'}</span>
    </button>
  )
}
