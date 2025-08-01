<script setup>
import { onMounted, ref } from 'vue'
import Input from '../components/Input.vue'
import Tweets from '../components/Tweets.vue'
import Sidebar from '../components/Sidebar.vue'
import axios from 'axios'

// Props z App.vue
const props = defineProps({
  name: String,
  avatar: String
})

// Tweet seznam
const tweets = ref([])

// Načíst tweety při načtení stránky
onMounted(async () => {
  try {
    const res = await axios.get('https://twitterrep.onrender.com/tweets')
    tweets.value = res.data
  } catch (error) {
    console.error('Chyba při načítání tweetů:', error)
  }
})

// Přidání tweetu
async function addTweet(text) {
  if (text.trim() === '') return

  const newTweet = {
    id: Date.now(), // můžeš nechat generovat backend
    text,
    user: {
      name: props.name,
      avatar: props.avatar
    }
  }

  try {
    const res = await axios.post('https://twitterrep.onrender.com/tweets', newTweet)
    tweets.value.push(res.data) // očekáváme, že backend vrátí uložený tweet
  } catch (error) {
    console.error('Chyba při ukládání tweetu:', error)
  }
}
</script>

<template>
  <h1 class="text-2xl font-bold mt-5 text-center">Twitter pro autisty</h1>
  <div class="mt-5 flex flex-row">
    <div class="w-1/4">
      <Sidebar :avatar="props.avatar" :name="props.name" />
    </div>
    <div class="w-1/2 mx-auto">
      <Input @add-tweet="addTweet" />
      <Tweets :tweets="tweets" />
    </div>
    <div class="w-1/4"></div>
  </div>
</template>