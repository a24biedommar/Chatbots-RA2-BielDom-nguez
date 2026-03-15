import { defineStore } from 'pinia'
import localforage from 'localforage'

export const useTravelStore = defineStore('travel', {
  state: () => ({
    routes: [],
    currentRouteId: null,
    isLoaded: false
  }),
  getters: {
    getRouteById: (state) => (id) => {
      var list = state.routes
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === id) {
          return list[i]
        }
      }
      return undefined
    },
    recentRoutes: (state) => {
      var copy = []
      for (var j = 0; j < state.routes.length; j++) {
        copy.push(state.routes[j])
      }
      copy.sort(function (a, b) {
        return b.timestamp - a.timestamp
      })
      return copy
    }
  },
  actions: {
    async initStore() {
      if (this.isLoaded) return
      const savedRoutes = await localforage.getItem('travel-routes')
      if (savedRoutes) {
        this.routes = savedRoutes
      }
      this.isLoaded = true
    },
    async addRoute(route) {
      this.routes.push(route)
      if (this.routes.length > 50) {
        var recent = this.recentRoutes
        var trimmed = []
        for (var k = 0; k < 50 && k < recent.length; k++) {
          trimmed.push(recent[k])
        }
        this.routes = trimmed
      }
      await this.saveToDisk()
    },
    async updateRouteRating(id, rating) {
      var rutes = this.routes
      for (var i = 0; i < rutes.length; i++) {
        if (rutes[i].id === id) {
          rutes[i].rating = rating
          break
        }
      }
      await this.saveToDisk()
    },
    async deleteRoute(id) {
      var out = []
      for (var j = 0; j < this.routes.length; j++) {
        if (this.routes[j].id !== id) {
          out.push(this.routes[j])
        }
      }
      this.routes = out
      await this.saveToDisk()
    },
    async saveToDisk() {
      await localforage.setItem('travel-routes', JSON.parse(JSON.stringify(this.routes)))
    }
  }
})
