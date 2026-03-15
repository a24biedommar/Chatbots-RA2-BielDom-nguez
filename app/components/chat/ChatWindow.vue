<template>
  <div class="chat-wrapper d-flex flex-column h-100">
    <!-- Messages Area -->
    <div class="messages-container flex-grow-1 p-3" ref="messagesRef">
      <div v-for="(msg, index) in messages" :key="index" 
           :class="['message-bubble mb-3 animate-fade-in', msg.role]">
        <div class="bubble-content shadow-sm">
          <div v-if="msg.route" class="route-card mb-3 p-3 border rounded-3 bg-light-emerald">
            <h6 class="mb-2 fw-bold text-emerald">
              <i class="bi bi-map-fill me-2"></i> {{ msg.route.title }}
            </h6>
            <div class="d-flex justify-content-between align-items-center">
              <span class="small text-secondary"><i class="bi bi-clock me-1"></i> {{ msg.route.estimatedTime ? msg.route.estimatedTime : 'Calculant...' }}</span>
              <button @click="$emit('view-route', msg.route)" class="btn btn-emerald btn-sm px-3">
                <i class="bi bi-eye-fill me-1"></i> Ver
              </button>
            </div>
          </div>
          <div v-if="msg.content">{{ msg.content }}</div>
        </div>
        <small class="message-time">{{ formatTime(msg.timestamp) }}</small>
      </div>
      <div v-if="loading" class="message-bubble assistant mb-3">
        <div class="bubble-content typing-dots shadow-sm">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>
    
    <!-- Input Area -->
    <div class="p-3 bg-white border-top shadow-sm sticky-bottom">
      <div class="container-fluid px-0">
        <div class="d-flex align-items-center gap-2">
          <div class="flex-grow-1 position-relative">
            <input 
              v-model="input" 
              @keyup.enter="sendMessage" 
              class="form-control border-0 bg-light py-2 px-3 rounded-pill" 
              placeholder="Escriu un missatge..." 
              :disabled="loading"
            />
          </div>
          <button 
            @click="sendMessage" 
            class="btn btn-emerald-round shadow-sm" 
            :disabled="loading || !input.trim()"
          >
            <i class="bi bi-send-fill text-white"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref, watch, nextTick } from 'vue'

const props = defineProps({ messages: Array, loading: Boolean })
const emit = defineEmits(['send', 'view-route'])
const input = ref('')
const messagesRef = ref(null)

function sendMessage() {
  if (input.value.trim() && !props.loading) {
    emit('send', input.value)
    input.value = ''
  }
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' })
}

watch(() => props.messages, () => {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTo({
        top: messagesRef.value.scrollHeight,
        behavior: 'smooth'
      });
    }
  })
}, { deep: true })
</script>

<style scoped>
.messages-container { 
  overflow-y: auto; 
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
}

.message-bubble { display: flex; flex-direction: column; max-width: 85%; margin-bottom: 12px !important; }
.message-bubble.user { align-self: flex-end; align-items: flex-end; }
.message-bubble.assistant { align-self: flex-start; align-items: flex-start; }

.bubble-content {
  padding: 10px 16px;
  border-radius: 15px;
  font-size: 0.95rem;
  line-height: 1.4;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.user .bubble-content { 
  background: var(--primary-emerald); 
  color: white; 
  border-bottom-right-radius: 2px;
}

.assistant .bubble-content { 
  background: white; 
  color: #333; 
  border-bottom-left-radius: 2px;
  border: 1px solid #eee;
}

.message-time { 
  font-size: 0.7rem; 
  color: #999; 
  margin-top: 4px;
}

.btn-emerald-round {
  width: 42px;
  height: 42px;
  background: var(--primary-emerald);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  transition: all 0.2s;
}

.btn-emerald-round:hover {
  background: var(--secondary-emerald);
}

.sticky-bottom {
  position: sticky;
  bottom: 0;
  z-index: 10;
  background: white;
}
</style>
