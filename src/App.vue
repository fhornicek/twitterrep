<script setup>
import { ref } from 'vue'
import router from './router'

const username = ref('')   
const avatar = ref('https://baconmockup.com/250/250/')  

function setUser(name) {
  username.value = name
}
</script>

<template>
  <router-view v-slot="{ Component }">
    <component
      :is="Component"
      :name="username"
      :avatar="avatar"
      @update-settings="(data) => {

        username.value = data.name
        avatar.value = data.avatar
      }"
      @login-success="setUser" 
    />
  </router-view>
</template>