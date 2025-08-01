const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')
const app = express()

const PORT = 3001

// ID tvých JSON binů (vyměň za své skutečné!)
const USERS_BIN_ID = '688c63c4ae596e708fbf3971'   // tvůj bin s tweety
const TWEETS_BIN_ID = '688c650e7b4b8670d8aad1da'            // tvůj bin s uživateli

// Základní URL pro jsonbin.io API
const BASE_URL_TWEETS = `https://api.jsonbin.io/v3/b/688c650e7b4b8670d8aad1da`
const BASE_URL_USERS = `https://api.jsonbin.io/v3/b/688c63c4ae596e708fbf3971`

// Vlož svůj X-Master-Key (tajný klíč pro zápis)
const MASTER_KEY = 'TVŮJ_MASTEŘ_KLÍČ'

const HEADERS = {
  'X-Master-Key': '$2a$10$5QGUCbSuKovBlRFj409BQuGr/opjAU7/LU.i8HJ7D.6CvIYKlkAWq',
  'Content-Type': 'application/json'
}

app.use(cors())
app.use(express.json())

// Pomocná funkce pro GET z jsonbin
async function getJsonFromBin(url) {
  const res = await fetch(url, { headers: HEADERS })
  if (!res.ok) throw new Error('Chyba při načítání dat')
  const data = await res.json()
  return data.record || []
}

// Pomocná funkce pro PUT do jsonbin
async function putJsonToBin(url, data) {
  const res = await fetch(url, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Chyba při ukládání dat')
  return await res.json()
}

// LOGIN
app.post('/login', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Chybí username nebo password' })
  }
  try {
    const users = await getJsonFromBin(BASE_URL_USERS)
    const user = users.find(u => u.username === username && u.password === password)
    if (user) {
      res.json({ success: true, username })
    } else {
      res.status(401).json({ success: false, message: 'Neplatné přihlášení' })
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Chyba serveru' })
  }
})

// REGISTRACE
app.post('/register', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Chybí username nebo password' })
  }
  try {
    const users = await getJsonFromBin(BASE_URL_USERS)
    if (users.some(u => u.username === username)) {
      return res.status(400).json({ success: false, message: 'Uživatel již existuje' })
    }
    users.push({ username, password })
    await putJsonToBin(BASE_URL_USERS, users)
    res.json({ success: true, message: 'Registrace proběhla úspěšně' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Chyba serveru' })
  }
})

// Získání všech tweetů
app.get('/tweets', async (req, res) => {
  try {
    const tweets = await getJsonFromBin(BASE_URL_TWEETS)
    res.json(tweets)
  } catch {
    res.status(500).send('Nepodařilo se načíst tweety.')
  }
})

// Přidání tweetu
app.post('/tweets', async (req, res) => {
  const newTweet = req.body
  if (!newTweet || !newTweet.text || !newTweet.user) {
    return res.status(400).send('Neplatná data tweetu.')
  }
  try {
    const tweets = await getJsonFromBin(BASE_URL_TWEETS)
    tweets.push(newTweet)
    await putJsonToBin(BASE_URL_TWEETS, tweets)
    res.status(201).json(newTweet)
  } catch {
    res.status(500).send('Chyba při zápisu.')
  }
})

app.listen(PORT, () => {
  console.log(`Server běží na http://localhost:${PORT}`)
})