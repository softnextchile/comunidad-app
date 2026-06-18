<template>
  <div class="chat-widget">
    <div v-if="isOpen" class="chat-window">
      <div class="chat-header">
        <span>💬 Asistente IA</span>
        <button @click="isOpen = false" style="float: right; background: none; border: none; color: white; cursor: pointer;">
          ✕
        </button>
      </div>
      
      <div ref="messagesContainer" class="chat-messages">
        <div v-if="messages.length === 0" class="chat-message assistant">
          ¡Hola! Soy el asistente virtual de la comunidad. ¿En qué puedo ayudarte hoy?
        </div>
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['chat-message', msg.role]"
        >
          {{ msg.content }}
        </div>
        <div v-if="isTyping" class="chat-message assistant">
          Escribiendo...
        </div>
      </div>
      
      <div class="chat-input-area">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          type="text"
          class="chat-input"
          placeholder="Escribe tu mensaje..."
          :disabled="isTyping"
        />
        <button @click="sendMessage" class="btn btn-primary" :disabled="isTyping || !newMessage.trim()">
          →
        </button>
      </div>
    </div>
    
    <button @click="isOpen = !isOpen" class="chat-toggle">
      {{ isOpen ? '✕' : '💬' }}
    </button>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false)
const messages = ref<Array<{ role: string; content: string }>>([])
const newMessage = ref('')
const isTyping = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || isTyping.value) return
  
  const userMessage = newMessage.value.trim()
  newMessage.value = ''
  
  messages.value.push({ role: 'user', content: userMessage })
  isTyping.value = true
  scrollToBottom()
  
  try {
    const history = messages.value.slice(-10).map(m => ({
      role: m.role,
      content: m.content
    }))
    
    const response = await $fetch<{ reply: string }>('/api/chat/message', {
      method: 'POST',
      body: { message: userMessage, history }
    })
    
    messages.value.push({ role: 'assistant', content: response.reply })
  } catch (error) {
    messages.value.push({ 
      role: 'assistant', 
      content: 'Disculpa, tuve un problema. ¿Podrías intentar de nuevo?' 
    })
  } finally {
    isTyping.value = false
    scrollToBottom()
  }
}
</script>
