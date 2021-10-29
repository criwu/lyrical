import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * 选项
 */
interface IOptions {
  /**
   * 立即执行 - 如果启用则不能传参，有需求再支持
   *
   * default = false
   */
  immediate?: boolean

  /**
   * 组件卸载后取消请求
   *
   * default = true
   */
  isUnmountCancel?: boolean
}

/**
 * 推断 Promise 返回类型
 */
type PromiseType<T extends Promise<any>> = T extends Promise<infer R> ? R : any

/**
 * 返回
 */
interface IReturn<T extends (...args: any[]) => any> {
  /**
   * 加载状态
   */
  loading: boolean
  /**
   * 结果
   */
  result: PromiseType<ReturnType<T>> | undefined
  /**
   * 错误
   */
  error: Error | null
  /**
   * 执行请求
   */
  run: T
  /**
   * 取消请求
   */
  cancel: () => void
}

export const useRequest = <T extends (...args: any[]) => any>(service: T, options: IOptions = {}): IReturn<T> => {
  const { immediate = false, isUnmountCancel = true } = options

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ReturnType<T>>()
  const [error, setError] = useState<Error | null>(null)
  const cancel = useRef(false)

  const run = useCallback(
    async (...args: any[]) => {
      setLoading(true)
      setError(null)

      try {
        const res = await service(...args)

        if (isUnmountCancel && cancel.current) return

        setResult(res)
      } catch (err: any) {
        setError(err)
      }

      setLoading(false)
    },
    [isUnmountCancel, service]
  )

  useEffect(
    () => () => {
      cancel.current = true
    },
    []
  )

  useEffect(() => {
    if (immediate && run) run()
  }, [immediate, run])

  return {
    loading,
    result,
    error,
    run: run as T,
    cancel: () => {
      cancel.current = true
    }
  }
}

export default useRequest
