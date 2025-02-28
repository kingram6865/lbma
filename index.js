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
  let results, results2
  const SQL = "SELECT date_format(max(price_date), '%Y-%m-%d') as last_price_date FROM lbma_silver_prices"
  let SQL2 = "SELECT objid FROM lbma_silver_prices WHERE date_format(price_date, '%Y-%m-%d') = ?"
  try {
    results = await conn.promise().query(SQL)
    SQL2 = mysql.format(SQL2, results[0][0].last_price_date)
    results2 = await conn.promise().query(SQL2)
  } catch (err) {
    console.log(err)
  } finally {
    return {...results[0][0], ...results2[0][0]}
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
    //console.log(silverDataRecords)
    return silverDataRecords
  }
}

async function insertNewPrice(record) {
  let results
  let SQL = "INSERT INTO lbma_silver_prices (price_date, frn, gbp, eur) VALUES (date_format(?, '%Y-%m-%d'), ?, ?, ?)"
  const input = [record.price_date, record.frn, record.gbp, record.eur]
  SQL = mysql.format(SQL, input)
  console.log(SQL)
  try {
    results = await conn.promise().query(SQL)
    console.log(`Line 89: Added ${input} as objid: ${results.insertId}`)
  } catch (err) {
    console.log(`Line 91: ${JSON.stringify(err, null, 2)}`)
  }

  return results
}

async function updateSilverData() {
  let output
  const lastPriceData = await dbLatest()
  console.log("Line 101: ", lastPriceData)
  const silverdata = await getSilverData()

  let index = silverdata.map(record => record.price_date).indexOf(lastPriceData.last_price_date)
  // console.log(silverdata.slice(index+1))
  if (silverdata.slice(index+1).length > 0) {
    console.log(`Last price date saved: ${lastPriceData.last_price_date}, Last price date objid: ${lastPriceData.objid}, Current price data to save: ${JSON.stringify(silverdata.slice(index+1), null, 2)}`)
    // console.log(`Last price date saved: ${lastPriceData.lastPriceData}, Last price date objid: ${lastPriceData.objid}, Current price data to save: ${JSON.stringify(silverdata.slice(index+1), null, 2)}`)

    silverdata.slice(index + 1).forEach(async (entry, i) => {
      // console.log(i, entry)
      try {
        output = await insertNewPrice(entry)
        console.log(output)
      } catch (err) {
        console.log(`Line 116: ${JSON.stringify(err, null, 2)}`)
      }
    })
  } else {
    // console.log(`No data to store. Last price date saved: ${lastPriceData.last_price_date}`)
    output = `No new data. Last price date saved: ${lastPriceData.last_price_date}`
  }

  return output;
}

// populateSilver()
// getSilverData()
// await updateSilverData()
async function execute() {
  let results = await updateSilverData()
  console.log("Line 132: ", results)
}

execute()