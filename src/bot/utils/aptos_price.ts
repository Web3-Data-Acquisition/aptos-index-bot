import axios from 'axios'

export async function getAptPrice(): Promise<number | undefined> {
  // const url = 'https://api.binance.com/api/v3/ticker/price?symbol=APTUSDT'
  const url = 'https://demo.deagent.ai/api/v1/plug/apt_gas_price'

  try {
    const response = await axios.get(url)
    return Number.parseFloat(response.data)
  }
  catch (error) {
    console.error('Error fetching APT price:', error)
    return undefined
  }
}
