import { IRequestInterceptor, IResponseInterceptor } from './types'

export class Interceptors<T> {
  private _list: T[] = []

  public get list(): T[] {
    return this._list
  }

  use(cb: T) {
    this._list.push(cb)

    return this
  }
}

export const interceptorsFactory = <T>() => {
  const request = new Interceptors<IRequestInterceptor>()
  const response = new Interceptors<IResponseInterceptor<T>>()

  return {
    request,
    response,
    map: () => ({ request: request.list, response: response.list })
  }
}
