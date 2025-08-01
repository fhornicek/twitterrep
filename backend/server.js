const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')
const app = express()

const PORT = process.env.PORT || 3001

const corsOptions = {
  origin: '*', // pro vývoj, později můžeš zpřísnit
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}
app.use(cors(corsOptions))
app.use(express.json())

const USERS_BIN_ID = '688c63c4ae596e708fbf3971'
const TWEETS_BIN_ID = '688c650e7b4b8670d8aad1da'
const BASE_URL_USERS = `https://api.jsonbin.io/v3/b/${USERS_BIN_ID}`
const BASE_URL_TWEETS = `https://api.jsonbin.io/v3/b/${TWEETS_BIN_ID}`

const MASTER_KEY = '$2a$10$5QGUCbSuKovBlRFj409BQuGr/opjAU7/LU.i8HJ7D.6CvIYKlkAWq'

const HEADERS = {
  'X-Master-Key': MASTER_KEY,
  'Content-Type': 'application/json'
}

async function getJsonFromBin(url) {
  const res = await fetch(url, { headers: HEADERS })
  if (!res.ok) throw new Error('Chyba při načítání dat')
  const data = await res.json()
  return data.record || []
}

async function putJsonToBin(url, data) {
  const res = await fetch(url, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify({ record: data }) // JSONBin vyžaduje objekt s klíčem record
  })
  if (!res.ok) throw new Error('Chyba při ukládání dat')
  return await res.json()
}

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
    console.error('Chyba při loginu:', err.message)
    res.status(500).json({ success: false, message: 'Chyba serveru' })
  }
})

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
    console.error('Chyba při registraci:', err.message)
    res.status(500).json({ success: false, message: 'Chyba serveru' })
  }
})

app.get('/tweets', async (req, res) => {
  try {
    const tweets = await getJsonFromBin(BASE_URL_TWEETS)
    res.json(tweets)
  } catch (err) {
    console.error('Chyba při získávání tweetů:', err.message)
    res.status(500).send('Nepodařilo se načíst tweety.')
  }
})

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
  } catch (err) {
    console.error('Chyba při přidávání tweetu:', err.message)
    res.status(500).send('Chyba při zápisu.')
  }
})

app.listen(PORT, () => {
  console.log(`✅ Server běží na http://localhost:${PORT}`)
})