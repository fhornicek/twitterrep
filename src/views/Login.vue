<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const mode = ref('login') // 'login' nebo 'register'
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const emit = defineEmits(['login-success'])

async function login() {
  error.value = ''
  if (!username.value || !password.value) {
    error.value = 'Vyplňte uživatelské jméno a heslo'
    return
  }
  
  loading.value = true
  try {
    const res = await axios.post('https://twitterrep.onrender.com/login', {
      username: username.value,
      password: password.value
    })
    emit('login-success', res.data.username)
    router.push('/Home')  
  } catch (err) {
    error.value = 'Přihlášení selhalo. Zkontrolujte údaje.'
  } finally {
    loading.value = false
  }
}

async function register() {
  error.value = ''
  if (!username.value || !password.value) {
    error.value = 'Vyplňte uživatelské jméno a heslo'
    return
  }

  loading.value = true
  try {
    await axios.post('https://twitterrep.onrender.com/register', {
      username: username.value,
      password: password.value
    })
    alert('Registrace proběhla úspěšně, můžete se přihlásit.')
    mode.value = 'login'
  } catch (err) {
    error.value = err.response?.data?.message || 'Registrace selhala.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-sm mx-auto mt-10 p-6 border rounded">
    <div class="flex justify-center mb-5">
      <button
        :class="{'font-bold underline': mode === 'login'}"
        @click="mode = 'login'"
        class="px-4"
      >Login</button>
      <button
        :class="{'font-bold underline': mode === 'register'}"
        @click="mode = 'register'"
        class="px-4"
      >Registrace</button>
    </div>

    <input v-model="username" placeholder="Uživatel" class="w-full p-2 mb-3 border rounded" />
    <input v-model="password" type="password" placeholder="Heslo" class="w-full p-2 mb-3 border rounded" />

    <button 
      @click="mode === 'login' ? login() : register()"
      :disabled="loading"
      class="bg-blue-600 text-white py-2 px-4 rounded w-full"
    >
      {{ loading ? (mode === 'login' ? 'Probíhá přihlášení...' : 'Probíhá registrace...') : (mode === 'login' ? 'Přihlásit se' : 'Registrovat se') }}
    </button>

    <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
  </div>
</template>