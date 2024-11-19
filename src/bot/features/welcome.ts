import { Composer } from 'grammy'
import { getAptPrice } from '../utils/aptos_price.js'
import type { Context } from '#root/bot/context.js'
import { logHandle } from '#root/bot/helpers/logging.js'
import { calculateCoinPrice } from '#root/bot/utils/calculate_coin_price.js'
// import { databaseMonitoring } from '#root/bot/utils/database_monitoring.js'
import { fetchData } from '#root/bot/utils/events_info.js'
import { checkLastFourCharsForSubstrings } from '#root/bot/utils/checkLastFourCharsForSubstrings.js'

const composer = new Composer<Context>()

const feature = composer.chatType('private')

feature.command('start', logHandle('command-start'), async (ctx) => {
  await ctx.reply(ctx.t('welcome'))
  // eslint-disable-next-line no-console
  console.log(111111111111111)
  setInterval(async () => {
    // eslint-disable-next-line no-console
    console.log(111111111111111)
    const eventInfo = await fetchData()

    if (eventInfo !== undefined) {
      for (const [_key, value] of Object.entries(eventInfo)) {
        let shouldBreak = false // 控制变量

        for (const [key_into, value_into] of Object.entries(value)) {
          if (key_into === 'data') {
            if ('x_in' in (value_into as object) && 'y_in' in (value_into as object)) {
              // eslint-disable-next-line no-console
              console.log(`this is value type; ${value.type}`)

              // 使用正则表达式分割字符串
              const splitTypes = value.type.split(/[<,>]+/)

              const pool_trimmedItem = splitTypes[0].trim()
              const pool_parts = pool_trimmedItem.split('::')
              const amount_in_trimmedItem = splitTypes[1].trim()
              const amount_in_parts = amount_in_trimmedItem.split('::')
              const amount_out_trimmedItem = splitTypes[2].trim()
              const amount_out_parts = amount_out_trimmedItem.split('::')

              const pool = pool_parts[0]
              const amount_in_token = amount_in_parts[2]
              const amount_out_token = amount_out_parts[2]
              const amount_in = amount_in_parts[0]
              const amount_out = amount_out_parts[0]

              if (amount_in_trimmedItem !== undefined || amount_out_trimmedItem !== undefined) {
                const result_in = checkLastFourCharsForSubstrings(amount_in_trimmedItem, ['USDC', 'USDT', 'WBTC', 'WETH', 'USDA'])
                const result_out = checkLastFourCharsForSubstrings(amount_out_trimmedItem, ['USDC', 'USDT', 'WBTC', 'WETH', 'USDA'])

                if (result_in || result_out) {
                  shouldBreak = true // 设置控制变量
                  break // 退出当前循环
                }
                else {
                  if (amount_in !== undefined && amount_out !== undefined && pool !== undefined) {
                    const in_token = processString(amount_in_token)
                    const out_token = processString(amount_out_token)

                    let symbol_in: number = 0
                    let symbol_out: number = 0
                    let unrealizedProfit: string = ''
                    // eslint-disable-next-line no-console
                    console.log(`11111111111111111111`)
                    // eslint-disable-next-line no-console
                    console.log(`Current APT Price: `, in_token, out_token, value.data.x_in, value.data.y_out, value.data.y_in, value.data.x_out)

                    if (in_token.toLowerCase() === 'aptos') {
                      if (value.data.x_in === '0' && value.data.y_out === '0') {
                        symbol_in = value.data.x_out
                        symbol_out = value.data.y_in
                        unrealizedProfit = out_token
                      }
                      else if (value.data.y_in === '0' && value.data.x_out === '0') {
                        symbol_in = value.data.y_out
                        symbol_out = value.data.x_in
                        unrealizedProfit = out_token
                      }
                    }
                    else if (out_token.toLowerCase() === 'aptos') {
                      if (value.data.x_in === '0' && value.data.y_out === '0') {
                        symbol_in = value.data.x_out
                        symbol_out = value.data.y_in
                        unrealizedProfit = in_token
                      }
                      else if (value.data.y_in === '0' && value.data.x_out === '0') {
                        symbol_in = value.data.y_out
                        symbol_out = value.data.x_in
                        unrealizedProfit = in_token
                      }
                    }

                    // eslint-disable-next-line no-console
                    console.log(`Current APT Price: `, value.data.x_in, value.data.y_out, value.data.y_in, value.data.x_out, symbol_in, symbol_out)

                    // eslint-disable-next-line no-console
                    console.log(in_token, out_token)

                    // 获取aptos的价格
                    const aptPrice = await getAptPrice()
                    if (aptPrice !== undefined) {
                      // eslint-disable-next-line no-console
                      console.log(`Current APT Price: $${aptPrice}`, symbol_in, symbol_out)
                      const finalPrice = await calculateCoinPrice(symbol_in, symbol_out, aptPrice)

                      const tokenMessage
                      = `|--- The current prices of aptos are: $${aptPrice} \n`
                      + `|--- The current currency pair is: ${unrealizedProfit} \n`
                      + `|--- The current currency pair pool is: ${pool}\n`
                      + `|--- The current price of the currency pair is: $${finalPrice}\n`

                      await ctx.reply(tokenMessage)
                    }
                  }
                }
              }

              if (shouldBreak) {
                break // 根据控制变量决定是否退出外层循环
              }
            }
            else if ('pool' in (value_into as object)) {
              interface SwapEventData {
                pool?: string
                to_token?: string
                amount_in?: number
                amount_out?: number
                from_token?: string
              }
              const eventData = value_into as SwapEventData

              // eslint-disable-next-line no-console
              console.log(`eventData: ${eventData}`)

              if (eventData.from_token !== undefined && eventData.to_token !== undefined) {
                const result_from = checkLastFourCharsForSubstrings(eventData.from_token, ['USDC', 'USDT', 'WBTC', 'WETH'])
                const result_to = checkLastFourCharsForSubstrings(eventData.to_token, ['USDC', 'USDT', 'WBTC', 'WETH'])

                if (result_from || result_to) {
                  shouldBreak = true // 设置控制变量
                  break // 退出当前循环
                }
                else {
                  if (eventData.amount_in !== undefined && eventData.amount_out !== undefined && eventData.pool !== undefined) {
                    // 获取aptos的价格
                    const aptPrice = await getAptPrice()
                    if (aptPrice !== undefined) {
                      // eslint-disable-next-line no-console
                      console.log(`Current APT Price: $${aptPrice}`)
                      const unrealizedProfit = 'gui'
                      const finalPrice = await calculateCoinPrice(eventData.amount_in, eventData.amount_out, aptPrice)

                      const tokenMessage
                      = `|--- The current prices of aptos are: $${aptPrice} \n`
                      + `|--- The current currency pair is: ${unrealizedProfit} \n`
                      + `|--- The current currency pair pool is: ${eventData.pool}\n`
                      + `|--- The current price of the currency pair is: $${finalPrice}\n`

                      await ctx.reply(tokenMessage)
                    }
                  }
                }
              }

              if (shouldBreak) {
                // eslint-disable-next-line no-console
                console.log(`222222222222222222`)
                break // 根据控制变量决定是否退出外层循环
              }
            }
          }
        }

        // await ctx.reply(eventInfo)
        // try {
        // await databaseMonitoring()
        // }
        // catch (error) {
        // console.error('Error running database monitoring:', error)
        // }
      }
    // else {
    //   // eslint-disable-next-line no-console
    //   console.log('Failed to fetch APT price.')
    }
  }, 1000 * 60 * 2)
})

function processString(str: string) {
  // 检查字符串是否以 "Coin" 结尾
  if (str.toLowerCase().endsWith('coin')) {
    // 如果是，去掉 "Coin" 后缀
    return str.slice(0, -4) // "-4" 因为 "Coin" 有四个字符
  }
  else {
    // 如果不是，返回原字符串
    return str
  }
}

export { composer as welcomeFeature }
