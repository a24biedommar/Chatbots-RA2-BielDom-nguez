import { ref } from 'vue'

export const useLocation = () => {
  const coords = ref(null)
  const error = ref(null)

  const getLocation = () => {
    if (!process.client) return

    if (!navigator.geolocation) {
      error.value = 'Geolocation is not supported by your browser'
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        coords.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      },
      (err) => {
        error.value = err.message
      }
    )
  }

  return { coords, error, getLocation }
}
