import { DirectiveElement } from '../../utils/directive'
import MessageRender, { IMessageProps } from './Message'

class Message {
  private directive: DirectiveElement<IMessageProps>

  constructor() {
    let messagePlate: HTMLDivElement | null = document.querySelector('.aui-message-plate')

    if (!messagePlate) {
      messagePlate = document.createElement('div')
      messagePlate.classList.add('aui-message-plate')
    }

    document.body.append(messagePlate)

    this.directive = new DirectiveElement<IMessageProps>(MessageRender, { root: messagePlate })
  }

  success(message: string) {
    this.directive.open({ message, type: 'success' })
  }

  warning(message: string) {
    this.directive.open({ message, type: 'warning' })
  }

  error(message: string) {
    this.directive.open({ message, type: 'error' })
  }
}

export const message = new Message()
