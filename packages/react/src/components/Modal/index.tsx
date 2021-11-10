import { Button } from '@lyrical/react'
import React, { ReactNode, useCallback } from 'react'
import './index.styl'

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox='64 64 896 896'
    focusable='false'
    data-icon='close'
    width='1em'
    height='1em'
    fill='currentColor'
    aria-hidden='true'
    {...props}
  >
    <path d='M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z' />
  </svg>
)

interface IProps {
  /**
   * 标题
   */
  title?: string
  /**
   * 标题说明文本
   */
  explain?: ReactNode
  /**
   * 底部自定义内容
   */
  footer?: ReactNode | false
  /**
   * 是否可见
   */
  visible?: boolean
  /**
   * 确认回调
   */
  onOk?: () => void
  /**
   * 取消回调
   */
  onCancel?: () => void
}

export const Modal: React.FC<IProps> = props => {
  const { title, explain: Explain, footer: Footer, visible, onOk, onCancel, children } = props

  const close = useCallback(() => {
    onCancel?.()
  }, [onCancel])

  const ok = useCallback(() => {
    onOk?.()
  }, [onOk])

  return (
    <div className={`lyric-modal-root ${visible ? 'open' : 'close'}`} onClick={close}>
      <div className='lyric-modal' onClick={e => e.stopPropagation()}>
        <div className='lyric-modal-close' onClick={close}>
          <CloseIcon className='lyric-modal-x' />
        </div>
        {title && (
          <div className='lyric-modal-header'>
            <div className='lyric-modal-header-dev'>
              <h3 className='title'>{title}</h3>
              <div className='explain'>{Explain && <>{typeof Explain === 'function' ? <Explain /> : Explain}</>}</div>
            </div>
          </div>
        )}
        <div className='lyric-modal-body'>{children}</div>
        {Footer !== false && (
          <div className='lyric-modal-footer'>
            {Footer ? (
              <>{typeof Footer === 'function' ? <Footer /> : Footer}</>
            ) : (
              <>
                <Button onClick={ok}>确认</Button>
                <Button theme='minor' style={{ marginLeft: 12 }} onClick={close}>
                  取消
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
