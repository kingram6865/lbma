require('dotenv').config()
const axios = require('axios')
const mysql = require('mysql2')
const silverUrl = 'https://prices.lbma.org.uk/json/silver.json?r=209961065'
const goldAmUrl = 'https://prices.lbma.org.uk/json/gold_am.json?r=1656110'
const goldPmUrl = 'https://prices.lbma.org.uk/json/gold_pm.json?r=153094971'
const platamUrl = 'https://prices.lbma.org.uk/json/platinum_am.json?r=528039287'
const platpmUrl = 'https://prices.lbma.org.uk/json/platinum_pm.json?r=452772946'
const pallamUrl = 'https://prices.lbma.org.uk/json/palladium_am.json?r=860541124'
const pallpmUrl = 'https://prices.lbma.org.uk/json/palladium_pm.json?r=74853627'

const DATABASE = {
  host:process.env.DBHOST, 
  user: process.env.DBUSER, 
  database: process.env.DB, 
  password: process.env.DBPW, 
  port: process.env.DBPORT
}

const conn = mysql.createPool({...DATABASE, waitForConnections: true});

async function populateSilver(data) {
  let result, sql
  const conn = mysql.createConnection(DATABASE);
  sql = "INSERT INTO lbma_silver_prices (price_date, frn, gbp, eur) VALUES (date_format(?, '%Y-%m-%d'), ?, ?, ?)"
  try {
    data.forEach(record => {
      conn.query(sql, [record.price_date, record.frn, record.gbp, (record.euro) ? record.euro : 0 ])
      console.log(`INSERTED ${record}`)  
    })
  } catch (err) {
    console.log(err)
  } finally {
    conn.end()
  }
}

async function dbLatest() {
  let results
  const SQL = "SELECT date_format(max(price_date), '%Y-%m-%d') as last_price_date FROM lbma_silver_prices"
  try {
    results = await conn.promise().query(SQL)
  } catch (err) {
    console.log(err)
  } finally {
    conn.end()
    return results[0][0].last_price_date
  }
}

async function silverData() {
  let results
  const silverData = []

  try {
    results = await axios(silverUrl)
  } catch (err) {
    console.log(err)
  } finally {
    results.data.sort((a, b) => {
      (a < b) ? -1 : (a > b) ? 1 : 0
    })

    results.data.forEach(element => {
      silverData.push({
        price_date: element.d,
        frn: element.v[0],
        gbp: element.v[1],
        encodeURIr: element.v[2]
      })
    })
    return silverData
  }
}

async function updateSilverData() {
  const lastPriceDate = await dbLatest()
  const silverdata = await silverData()
  let index = silverdata.map(record => record.price_date).indexOf(lastPriceDate)
  console.log(index)
}

async function execute() {
  let result = await dbLatest()
  console.log(`Line 82: ${result}`)
}

// silverData()
//   .then(x => {
//     populateSilver(x)
//   })

// execute()

updateSilverData()