const minCost = costs => {
  let n = costs.length
  if(n===0) return 0
  let res = new Array(n+1).fill(0).map(() => new Array(3).fill(0))
  // res[i][j] j=0,1,2 代表粉刷完前i座房子的最小花费，且第i-1座房子的颜色为红（绿、蓝）
  // 注意这里的定义是前i座房子，意思是粉刷的房子是0到i-1。
  for(let i=1; i<=n; i++) {
    for(let j=0; j<3; j++) {
      res[i][j] = Number.MAX_SAFE_INTEGER
      for(let k=0; k<3; k++) {
        // 相邻房子颜色不能相同
        if(j===k) continue
        // res[i-1][k]代表粉刷前(i-1)座房子的花费,加上costs[i-1][j]，即粉刷第(i-1)座房子的花费，结果为res[i][j]
        // 这里的j代表第(i-1)座房子的颜色，k=0,1,2,记录第(i-2)座房子的颜色，因此不能相等
        if(res[i-1][k] + costs[i-1][j] < res[i][j]) {
          res[i][j] = res[i-1][k] + costs[i-1][j]
        }
      }
    }
  }
  
  let result = res[n][0]
  if(res[n][1]<result) {
    result = res[n][1]
  }
  if(res[n][2] < result) {
    result = res[n][2]
  }
  return result
}