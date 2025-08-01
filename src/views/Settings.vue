<script setup>
import { ref } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import NameAvatar from '../components/NameAvatar.vue'

const props = defineProps({
  avatar: String,
  name: String
})

const emit = defineEmits(['update-settings'])

const newName = ref(props.name)
const newAvatar = ref(props.avatar)

function saveSettings(data) {
  newName.value = data.name
  newAvatar.value = data.avatar
  emit('update-settings', data)
}
</script>

<template>
  <h1 class="text-2xl font-bold mt-5 text-center">Twitter pro autisty</h1>
  <div class="mt-5 flex flex-row gap-10">
    <div class="w-1/4">
      <Sidebar :avatar="newAvatar" :name="newName" />
    </div>

    <div class="w-1/2">
      <NameAvatar 
        :name="newName"
        :avatar="newAvatar"
        @update-settings="saveSettings"
      />
    </div>
  </div>
</template>