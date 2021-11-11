import React, { useEffect, useRef } from 'react'
import { IDirective } from '../../utils/directive'
import './Message.css'

const ICON_MAP = {
  warning: (
    <svg
      className='icon'
      viewBox='0 0 1024 1024'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      p-id='995'
      width='200'
      height='200'
      style={{ fill: '#faad14' }}
    >
      <path
        d='M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m-36 208a4 4 0 0 1 4-4h64a4 4 0 0 1 4 4v312a4 4 0 0 1-4 4h-64a4 4 0 0 1-4-4z m84 436a48 48 0 0 1-48 48 48 48 0 0 1-48-48 48 48 0 0 1 48-48 48 48 0 0 1 48 48z'
        p-id='996'
      />
    </svg>
  ),
  error: (
    <svg
      className='icon'
      viewBox='0 0 1024 1024'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      p-id='1267'
      width='200'
      height='200'
      style={{ fill: '#ff4d4f' }}
    >
      <path
        d='M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m186.3 583.5a4 4 0 0 1 0 5.7l-45.1 45.1a4 4 0 0 1-5.7 0L512 562.8 376.5 698.3a4 4 0 0 1-5.7 0l-45.1-45.1a4 4 0 0 1 0-5.7L461.2 512 325.7 376.5a4 4 0 0 1 0-5.7l45.1-45.1a4 4 0 0 1 5.7 0L512 461.2l135.5-135.5a4 4 0 0 1 5.7 0l45.1 45.1a4 4 0 0 1 0 5.7L562.8 512z'
        p-id='1268'
      />
    </svg>
  ),
  success: (
    <svg
      className='icon'
      viewBox='0 0 1024 1024'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      p-id='1131'
      width='200'
      height='200'
      style={{ fill: '#52c41a' }}
    >
      <path
        d='M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m244.3 316L440.9 694.8a3.9 3.9 0 0 1-5.6 0L267.7 527.5a3.9 3.9 0 0 1 0-5.6l45.2-45.2a4.2 4.2 0 0 1 5.7 0l116.7 116.5a3.9 3.9 0 0 0 5.6 0l264.5-264a4 4 0 0 1 5.7 0l45.2 45.1a4 4 0 0 1 0 5.7z'
        p-id='1132'
      />
    </svg>
  )
}

export type MessageProps = IDirective<{ type?: 'success' | 'warning' | 'error'; message: string }>

const MessageRender: React.FC<MessageProps> = props => {
  const { type = 'success', message } = props
  const element = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!element.current) return

    element.current.style.marginTop = '15px'
    element.current.style.opacity = '1'

    setTimeout(() => {
      if (!element.current) return
      element.current.style.marginTop = '-5px'
      element.current.style.opacity = '0'

      setTimeout(() => {
        props.hidden()
      }, 300)
    }, 2700)
  }, [props])

  return (
    <div ref={element} className='lyric-message'>
      <div className='lyric-message-content'>
        <span className={type}>{ICON_MAP[type]}</span>
        {message}
      </div>
    </div>
  )
}

export default MessageRender
