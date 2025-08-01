<script setup>
import { ref } from 'vue'

const tweetText = ref('')

const emit = defineEmits(['add-tweet'])

function handleTweet() {
  emit('add-tweet', tweetText.value)
  tweetText.value = ''
}
</script>

<template>
  <h1 class="text-2xl font-bold mt-5 ml-3 font-bold text-black">Domov</h1>
  <div class="flex flex-row gap-3 w-full mt-5">
    <input
      v-model="tweetText"
      type="text"
      class="border border-gray-300 rounded-full p-2 w-full"
      placeholder="Co máte na mysli?"
    />
    <button
      @click="handleTweet"
      class="cursor-pointer flex justify-center items-center bg-blue-500 text-white rounded-full w-30 shadow-lg"
    >
      Tweet
    </button>
  </div>
</template>