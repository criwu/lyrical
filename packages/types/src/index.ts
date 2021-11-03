/**
 * 推断 Promise 返回类型
 */
export type PromiseType<T extends Promise<any>> = T extends Promise<infer R> ? R : any
