const express = require('express')
const fs = require('fs')
const cors = require('cors')
const app = express()

const PORT = 3001
const TWEETS_FILE = './tweets.json'
const USERS_FILE = './users.json'

app.use(cors())
app.use(express.json())

// Pomocná funkce pro načtení JSON souboru (uživatelů nebo tweetů)
function readJsonFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') return resolve([]) // pokud soubor neexistuje, vrátíme prázdné pole
        return reject(err)
      }
      try {
        const json = JSON.parse(data)
        resolve(json)
      } catch (e) {
        resolve([])
      }
    })
  })
}

// Pomocná funkce pro zápis JSON do souboru
function writeJsonFile(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, JSON.stringify(data, null, 2), err => {
      if (err) reject(err)
      else resolve()
    })
  })
}

// LOGIN endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Chybí username nebo password' })
  }

  try {
    const users = await readJsonFile(USERS_FILE)
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

// REGISTRACE endpoint
app.post('/register', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Chybí username nebo password' })
  }

  try {
    const users = await readJsonFile(USERS_FILE)
    if (users.some(u => u.username === username)) {
      return res.status(400).json({ success: false, message: 'Uživatel již existuje' })
    }

    users.push({ username, password })
    await writeJsonFile(USERS_FILE, users)
    res.json({ success: true, message: 'Registrace proběhla úspěšně' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Chyba serveru' })
  }
})

// GET všechny tweety
app.get('/tweets', async (req, res) => {
  try {
    const tweets = await readJsonFile(TWEETS_FILE)
    res.json(tweets)
  } catch {
    res.status(500).send('Nepodařilo se načíst tweety.')
  }
})

// POST nový tweet
app.post('/tweets', async (req, res) => {
  const newTweet = req.body
  if (!newTweet || !newTweet.text || !newTweet.user) {
    return res.status(400).send('Neplatná data tweetu.')
  }

  try {
    const tweets = await readJsonFile(TWEETS_FILE)
    tweets.push(newTweet)
    await writeJsonFile(TWEETS_FILE, tweets)
    res.status(201).json(newTweet)
  } catch {
    res.status(500).send('Chyba při zápisu.')
  }
})

app.listen(PORT, () => {
  console.log(`Server běží na http://localhost:${PORT}`)
})