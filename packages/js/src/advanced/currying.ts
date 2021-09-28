// 函数柯里化: 不是固定的，是一种思维。先传一定参数，返回函数，解决重复传参问题。

// 不限参数版
const currying = (callback: (...args: any[]) => any) => {
  const params: any[] = []

  const fn = (...args: any[]) => {
    params.push(...args)

    fn.toString = () => callback(...params)
    fn.valueOf = () => callback(...params)

    return fn
  }

  return fn
}

// 指定参数版

export default currying
