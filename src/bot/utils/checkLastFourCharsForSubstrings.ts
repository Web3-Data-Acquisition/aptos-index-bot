export function checkLastFourCharsForSubstrings(token: string, substrings: string[]) {
  const lastFourChars = token.slice(-4)

  // 检查是否包含任何一个子字符串
  const found = substrings.some(substring => lastFourChars.includes(substring))

  if (found) {
    // // eslint-disable-next-line no-console
    // console.log(`Token 字符串的最后四个字符中包含以下一个或多个指定子字符串: ${substrings.join(', ')}`)
    return true
  }
  else {
    // // eslint-disable-next-line no-console
    // console.log(`Token 字符串的最后四个字符中不包含任何以下指定子字符串: ${substrings.join(', ')}`)
    return false
  }
}
