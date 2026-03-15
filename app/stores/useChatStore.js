import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', {
  state: () => ({
    sessions: [],
    activeSessionId: null
  }),
  getters: {
    activeSession: (state) => {
      var sid = state.activeSessionId
      var list = state.sessions
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === sid) {
          return list[i]
        }
      }
      return undefined
    }
  },
  actions: {
    addMessage(message) {
      var session = this.activeSession
      if (session) {
        session.messages.push(message)
      }
    },
    createNewSession() {
      var id = crypto.randomUUID()
      var newSession = {
        id: id,
        messages: []
      }
      this.sessions.push(newSession)
      this.activeSessionId = id
      return id
    }
  },
  persist: true
})
