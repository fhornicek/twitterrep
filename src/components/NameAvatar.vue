<script setup>
import { ref } from 'vue'

const props = defineProps({
  avatar: String,
  name: String
})

const emit = defineEmits(['update-settings'])

const newName = ref(props.name)
const newAvatar = ref(props.avatar)

function saveSettings() {
  emit('update-settings', {
    name: newName.value,
    avatar: newAvatar.value
  })
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mt-5">Nastavení</h1>
    <p class="mt-3">Zde můžete upravit své jméno(nn) a avatar.</p>
    <!-- <input v-model="newName" placeholder="Zadejte své jméno" class="w-full p-2 border rounded-lg mt-3" /> -->
    <input v-model="newAvatar" placeholder="Zadejte URL avatara" class="w-full p-2 border rounded-lg mt-3" />
    <div class="mt-5">
      <img :src="newAvatar" alt="Avatar" class="mx-auto w-32 h-32 rounded-full" />
    </div>
    <button @click="saveSettings" class="cursor-pointer bg-blue-500 text-white p-2 mt-4 rounded-lg w-full">
      Uložit změny
    </button>
  </div>
</template>