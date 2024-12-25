import { ref } from 'vue'
import { filesApi } from 'src/api/files'
import { useQuasar } from 'quasar'

export default function useFiles(initialData) {
  const $q = useQuasar()
  const dialog = ref(false)
  const files = ref(initialData)
  const updateActive = ref(false)
  const updateObj = ref(null)

  // создание файла
  const modalFalse = obj => {
    dialog.value = false
    if (obj) {
      files.value.push(obj[0])
    }
    updateActive.value = false
  }

  // обновление файла
  const modalFalseUp = obj => {
    dialog.value = false
    if (obj) {
      let arr = []
      files.value.filter(el => {
        if (el.id === obj.id) {
          el = obj
        }
        arr.push(el)
      })
      files.value = arr
    }
    updateActive.value = false
  }

  // удаление файла (необходимо использовать composable удаления в родителе)
  const delFile = async id => {
    try {
      await filesApi.delFile(id).then(resp => {
        files.value = files.value.filter(item => item.id !== id)
        setTimeout(() => {
          $q.notify({
            color: 'positive',
            message: 'Файл удален',
          })
        }, 0)
      })
    } catch (err) {
      console.log(err)
      setTimeout(() => {
        $q.notify({
          color: 'red',
          message: 'Произошла ошибка, попробуйте позже',
        })
      }, 0)
    }
  }

  // открытие обновления файла с передачей параметров
  const updateFile = file => {
    updateActive.value = true
    dialog.value = true
    updateObj.value = file
  }

  const openLink = link => {
    window.open(link, '_blank')
  }

  return {
    dialog,
    files,
    updateActive,
    updateObj,
    modalFalse,
    modalFalseUp,
    delFile,
    updateFile,
    openLink
  }
}
