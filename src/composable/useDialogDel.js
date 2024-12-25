import { ref } from 'vue'

export default function useDialogDel(actionHandlers) {
  const dialogDelite = ref(false)
  const dialogDelId = ref()
  const dialogDelName = ref('')

  function onActionDel(value, id) {
    dialogDelName.value = value
    dialogDelId.value = id
    dialogDelite.value = true
  }

  async function modalCloseDel(val, condition, action) {
    dialogDelite.value = false
    if (condition && val) {
      await action(dialogDelId.value)
    }
  }

  function handleModalClose(val) {
    const actionHandler = actionHandlers[dialogDelName.value]
    if (actionHandler) {
      const condition = true
      modalCloseDel(val, condition, actionHandler)
    }
  }

  return {
    dialogDelite,
    dialogDelId,
    dialogDelName,
    onActionDel,
    modalCloseDel,
    handleModalClose,
  }
}