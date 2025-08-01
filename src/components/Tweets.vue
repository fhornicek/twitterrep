<script setup>
defineProps({
  tweets: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <ul class="list-none p-0">
    <li v-for="tweet in tweets" :key="tweet.id" class="border-b border-gray-200 p-4">
      <div class="flex items-center mb-2" v-if="tweet.user">
        <img :src="tweet.user.avatar" alt="Avatar" class="w-10 h-10 rounded-full mr-3" />
        <span class="font-bold">{{ tweet.user.name }}</span>
      </div>
      <p>{{ tweet.text }}</p>
    </li>
  </ul>
</template>