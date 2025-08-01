<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
defineProps({
  avatar: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
})

</script>

<template>
    <div class="flex flex-row items-center justify-center gap-5 mt-10">
<img :src="avatar" alt="Avatar" class="w-10 h-10 rounded-full" />
<p class="font-bold text-black">{{ name }}</p>
</div>
<ul class="mt-15 gap-10 flex flex-col list-none p-0 text-center">
  <RouterLink to="/Home"><li class="cursor-pointer font-bold text-black">Domov</li></RouterLink>
  <RouterLink to="/settings"><li class="cursor-pointer font-bold text-black">Nastavení</li></RouterLink>
</ul>


</template>