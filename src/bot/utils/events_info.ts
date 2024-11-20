import pgLib from 'pg'

import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pgLib

// const pool = new Pool({
// user: 'postgres',
// host: '127.0.0.1',
// database: 'postgres',
// password: 'postgres',
// port: 5432,
// })
const pool = new Pool({
  // eslint-disable-next-line node/prefer-global/process
  host: process.env.DB_HOST,
  port: 5432,
  // eslint-disable-next-line node/prefer-global/process
  user: process.env.DB_USER,
  // eslint-disable-next-line node/prefer-global/process
  password: process.env.DB_PASSWORD,
  // eslint-disable-next-line node/prefer-global/process
  database: process.env.DB_NAME,
})

export async function fetchData(): Promise< object | undefined> {
  try {
    const now = new Date() // 当前时间
    const oneMinuteAgo = new Date(now.getTime() - 60000) // 当前时间减去一分钟（60,000毫秒）

    const formatForPostgres = (date: Date) => {
      return date.toISOString().replace('T', ' ').slice(0, 26)
    }

    const nowFormatted = formatForPostgres(now)
    const oneMinuteAgoFormatted = formatForPostgres(oneMinuteAgo)

    // eslint-disable-next-line no-console
    console.log(oneMinuteAgoFormatted, nowFormatted)

    const queryText = `
SELECT * FROM events 
WHERE inserted_at >= $1
  AND inserted_at < $2;
`
    const result = await pool.query(queryText, [oneMinuteAgoFormatted, nowFormatted])

    // console.log(`-----------this is result -----------:${result.rows}`)
    return result.rows

    //     if (result.rows.length > 0) {
    //       return result) // 将对象转换为字符串
    //     }
    //     else {
    //       return 'No data found.'
    //     }
  }
  catch (err) {
    console.error('Error executing query', err)
  }
}
