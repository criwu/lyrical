import { DirectiveElement } from '../../utils/directive'
import MessageRender, { IMessageProps } from './Message'

const lyricMessagePlateClassName = 'lyric-message-plate'

class Message {
  private directive: DirectiveElement<IMessageProps>

  constructor() {
    let messagePlate: HTMLDivElement | null = document.querySelector(`.${lyricMessagePlateClassName}`)

    if (!messagePlate) {
      messagePlate = document.createElement('div')
      messagePlate.classList.add(lyricMessagePlateClassName)
    }

    document.body.append(messagePlate)

    this.directive = new DirectiveElement<IMessageProps>(MessageRender, { root: messagePlate })
  }

  /**
   * 成功消息
   */
  success(message: string) {
    this.directive.open({ message, type: 'success' })
  }

  /**
   * 警告消息
   */
  warning(message: string) {
    this.directive.open({ message, type: 'warning' })
  }

  /**
   * 错误消息
   */
  error(message: string) {
    this.directive.open({ message, type: 'error' })
  }
}

/**
 * 通知消息
 */
export const message = new Message()
