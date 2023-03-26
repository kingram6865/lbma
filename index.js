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

async function populateSilver() {
  let result, sql
  const data = await getSilverData()
  const conn = mysql.createConnection(DATABASE);
  sql = "INSERT INTO lbma_silver_prices (price_date, frn, gbp, eur) VALUES (date_format(?, '%Y-%m-%d'), ?, ?, ?)"
  try {
    data.forEach(record => {
      conn.query(sql, [record.price_date, record.frn, record.gbp, (record.eur) ? record.eur : 0 ])
      console.log(`INSERTED ${JSON.stringify(record)}`)  
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
    // conn.end()
    return results[0][0].last_price_date
  }
}

async function getSilverData() {
  let results
  const silverDataRecords = []

  try {
    results = await axios(silverUrl)
  } catch (err) {
    console.log(err)
  } finally {
    results.data.sort((a, b) => {
      (a < b) ? -1 : (a > b) ? 1 : 0
    })

    results.data.forEach(element => {
      let newEntry = {
        price_date: element.d,
        frn: element.v[0],
        gbp: element.v[1],
        eur: element.v[2]
      }
      silverDataRecords.push(newEntry)
    })
    return silverDataRecords
  }
}

async function insertNewPrice(record) {
  let results
  let SQL = "INSERT INTO lbma_silver_prices (price_date, frn, gbp, eur) VALUES (date_format(?, '%Y-%m-%d'), ?, ?, ?)"
  const input = [record.price_date, record.frn, record.gbp, record.eur]
  SQL = mysql.format(SQL, input)

  try {
    results = await conn.promise().query(SQL)
  } catch (err) {
    console.log(`Line 85: ${JSON.stringify(err, null, 2)}`)
  } 
  // finally {
  //   console.log(results)
  // }
}

async function updateSilverData() {
  const lastPriceDate = await dbLatest()
  const silverdata = await getSilverData()
  let index = silverdata.map(record => record.price_date).indexOf(lastPriceDate+1)
  console.log(silverdata.slice(index))
  silverdata.slice(index).forEach(entry => {
    try {
      insertNewPrice(entry)
    } catch (err) {
      console.log(`Line 102: ${JSON.stringify(err, null, 2)}`)
    }
  })

}

// populateSilver()
// getSilverData()
updateSilverData()