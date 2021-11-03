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

  /* Loading */
  const [loading, setLoading] = useState(false)

  /* 结果集 */
  const [result, setResult] = useState<ReturnType<T>>()

  /* 错误 */
  const [error, setError] = useState<Error | null>(null)

  /* 取消请求 Ref */
  const cancel = useRef(false)

  /**
   * 请求
   */
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

  /**
   * 取消请求处理
   */
  const cancelHandle = useCallback(() => {
    cancel.current = true
  }, [])

  /**
   * 组件销毁
   */
  useEffect(() => cancelHandle(), [])

  /**
   * 立即执行
   */
  useEffect(() => {
    if (immediate && run) run()
  }, [immediate, run])

  return {
    loading,
    result,
    error,
    run: run as T,
    cancel: cancelHandle
  }
}

export default useRequest
