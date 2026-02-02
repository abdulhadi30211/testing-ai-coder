export function getGuestId(): string {
  const GUEST_ID_KEY = 'ai_tools_guest_id'
  let guestId = localStorage.getItem(GUEST_ID_KEY)
  
  if (!guestId) {
    guestId = `guest_${Math.random().toString(36).substring(2, 15)}`
    localStorage.setItem(GUEST_ID_KEY, guestId)
  }
  
  return guestId
}
