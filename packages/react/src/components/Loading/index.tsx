import React, { useMemo, useRef } from 'react'
import './index.styl'

interface IProps {
  /**
   * 受控 Loading
   */
  loading: boolean
  /**
   * 自定义渲染 Loading
   */
  loadingRender?: React.ReactNode
  /**
   * 覆盖模式
   */
  cover?: boolean
}

const LoadingIcon = (
  <div className='lyric-loading'>
    <svg
      className='lyric-loading-icon'
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
  </div>
)

export const Loading: React.FC<IProps> = props => {
  const { loading, cover, loadingRender = LoadingIcon, children } = props
  const count = useRef(0)

  const render = useMemo(() => (loading ? <>{loadingRender}</> : <>{children}</>), [children, loading, loadingRender])

  const coverRender = useMemo(() => {
    const r = (
      <>
        {loading && loadingRender}
        {!loading || count.current > 1 ? children : null}
      </>
    )

    if (!loading) count.current += 1
    return r
  }, [children, loading, loadingRender])

  return cover ? <div className='lyric-loading-fill'>{coverRender}</div> : render
}
