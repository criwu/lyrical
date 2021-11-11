import React from 'react'
import './index.styl'

interface IProps {
  active?: boolean
  block?: boolean
  height?: number
  style?: React.CSSProperties
  backgroundColor?: string
  activeColor?: string
}

export const Skeleton = (props: IProps) => {
  const {
    active = false,
    block = false,
    height = 32,
    backgroundColor = 'rgba(190,190,190,.2)',
    activeColor = 'rgba(129,129,129,.24)',
    style = {}
  } = props

  return (
    <div
      className={`lyric-skeleton${active ? ' active' : ''}${block ? ' block' : ''}`}
      style={{
        height,
        backgroundImage: active
          ? `linear-gradient(90deg, ${backgroundColor} 25%, ${activeColor} 37%, ${backgroundColor} 63%)`
          : backgroundColor,
        ...style
      }}
    />
  )
}
