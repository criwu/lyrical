import { DirectiveElement } from '../../utils/directive'
import MessageRender, { IMessageProps } from './Message'

class Message {
  private directive: DirectiveElement<IMessageProps>

  constructor() {
    this.directive = new DirectiveElement<IMessageProps>(MessageRender)
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
