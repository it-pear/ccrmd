import { ref, computed } from 'vue'

export default function useContextMenu() {
  const contextMenu = ref(null)
  const contextMenuActiveTrId = ref(null)

  const touchStartTimestamp = ref(null)
  const touchMoveTimestamp = ref(null)
  const touchStartTimeout = ref(null)
  const touchMoveTimeout = ref(null)
  const touchEndTimeout = ref(null)
  const touchCancelTimeout = ref(null)

  const mouseX = ref(0)
  const mouseY = ref(0)

  const menuStyle = computed(() => {
    return {
      transform: `translateX(${mouseX.value}px) translateY(${mouseY.value}px)`
    }
  })

  const showContextMenu = (event, row) => {
    contextMenu.value.hide()
    event.preventDefault()
    mouseX.value = event.clientX 
    mouseY.value = event.clientY
    contextMenuActiveTrId.value = row.id
    contextMenu.value.show(event, { row });
  }

  const handleTouchStart = (event, row) => {
    contextMenu.value.hide()
    touchStartTimeout.value = Date.now()
    mouseX.value = event.touches[0].clientX
    mouseY.value = event.touches[0].clientY
    contextMenuActiveTrId.value = row.id
    touchMoveTimeout.value = setTimeout(() => {
      contextMenu.value.show(event, { row });
    }, 500);  
  }

  const handleTouchMove = () => {
    contextMenu.value.hide()
  }

  const handleTouchEnd = () => {
    clearTimeout(touchStartTimeout.value)
    clearTimeout(touchMoveTimeout.value)
    touchEndTimeout.value = setTimeout(() => {
      touchStartTimestamp.value = null
      touchMoveTimestamp.value = null
    }, 100);
  }

  const handleTouchCancel = () => {
    clearTimeout(touchStartTimeout.value)
    clearTimeout(touchMoveTimeout.value)
    clearTimeout(touchEndTimeout.value)
    touchCancelTimeout.value = setTimeout(() => {
      touchStartTimestamp.value = null
      touchMoveTimestamp.value = null
    }, 100);
  }

  const isMobile = () => {
    const userAgent = navigator.userAgent.toLowerCase()
    return /iphone|ipod|ipad|android/.test(userAgent)
  } 

  return {
    contextMenu,
    contextMenuActiveTrId,
    touchStartTimestamp,
    touchMoveTimestamp,
    touchStartTimeout,
    touchMoveTimeout,
    touchEndTimeout,
    touchCancelTimeout,
    mouseX,
    mouseY,
    menuStyle,
    showContextMenu,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleTouchCancel,
    isMobile
  }
}