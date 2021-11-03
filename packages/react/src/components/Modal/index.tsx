import './index.styl'

interface IProps {
  // 标题
  title?: string
  // 说明文本
  explain?: string | JSX.Element
}

export const Modal: React.FC<IProps> = props => {
  const { title, explain, children } = props

  return (
    <div className='lyric-modal-root'>
      <div className='lyric-modal'>
        <div className='lyric-modal-header'>
          <div className='left'>
            <h3>{title}</h3>
            {explain ? typeof explain === 'string' ? <span>{explain}</span> : explain : null}
          </div>
        </div>
        <div className='lyric-modal-body'>{children}</div>
        <div className='lyric-modal-footer'></div>
      </div>
    </div>
  )
}
