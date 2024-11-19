// import { Client } from 'pg'

// export async function databaseMonitoring() {
//   const client = new Client ({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'postgres',
//     password: 'mm123123',
//     port: 5432,
//   })

//   await client.connect()

//   client.on('notification', (msg) => {
//     if (msg.channel === 'new_insert') {
//       if (msg.payload !== undefined) {
//         const data = JSON.parse(msg.payload) // 解析 JSON 数据
//         // eslint-disable-next-line no-console
//         console.log('New Insert:', data)
//       }
//     }
//   })

//   await client.query('LISTEN new_insert')
//   // eslint-disable-next-line no-console
//   console.log('Listening for new inserts...')
// }
