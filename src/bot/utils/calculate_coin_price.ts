export async function calculateCoinPrice(inputNum: number, outputNum: number, aptos_price: number): Promise<number | undefined> {
  const finalPrice = inputNum * aptos_price / outputNum
  if (finalPrice !== undefined) {
    return finalPrice
  }
  else {
    return undefined
  }
}
