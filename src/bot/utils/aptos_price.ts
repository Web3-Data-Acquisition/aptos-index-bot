import axios from 'axios'

export async function getAptPrice(): Promise<number | undefined> {
  const url = 'https://api.binance.com/api/v3/ticker/price?symbol=APTUSDT'

  const proxyConfig = {
    host: '205.198.65.182',
    port: 38080,
    protocol: 'http', // 如果你的代理支持 https，这里也可以是 'https'
  }
  try {
    const response = await axios.get(url, { proxy: proxyConfig })
    return Number.parseFloat(response.data.price)
  }
  catch (error) {
    console.error('Error fetching APT price:', error)
    return undefined
  }
}
