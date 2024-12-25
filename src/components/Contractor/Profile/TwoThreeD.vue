<template>
  <q-dialog
    v-model="dialog"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog contractor-dialog-share"
  >
    <DialogUploadFiles
      @modalFalse="modalFalse"
      @modalFalseUp="modalFalseUp"
      :updateActivated="updateActive"
      :updateObject="updateObj"
    />
  </q-dialog>
  <q-dialog
    v-model="dialogDelModal"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog"
  >
    <DialogDelite
      @modalFalse="modalOpenDel"
    />
  </q-dialog>
  <q-expansion-item
    expand-separator
    default-opened
    class="files23d q-expansion-my"
  >
    <template v-slot:header>
      <div class="title">
        2D/3D файлы
      </div>
    </template>

    <q-list class="contractor-list">

      <q-item
        v-for="file in files"
        :key="file"
      >
        <q-item-section>
          <div class="subtitle">
            {{file.name}}
          </div>
          <div class="size" v-if="file.type === 'link'"><span class="lg-visible">Ссылка</span></div>
          <span class="mb-visible format" v-if="file.type === 'link'">Ссылка</span>

          <div class="size" v-if="file.type === 'file'">
            <span class="lg-visible">{{file.mime}},</span> {{file.size}}
          </div>
          <span class="mb-visible format" v-if="file.type === 'file'">
            {{file.format}}
          </span>

          <div class="btn-sec">
            <q-btn
              unelevated
              no-caps
              flat
              class="my-btn my-effect h-opacity btn-add"
              padding="0"
              @click="updateFile(file)"
            >
              <q-icon name="svguse:icons/btnIcons.svg#edit" color="grey-8" size="16px" class="q-mr-sm" />
              <span class="block text-grey-5">Редактировать</span>
            </q-btn>
            <q-btn
              unelevated
              no-caps
              flat
              class="my-btn my-effect h-opacity btn-add"
              padding="0"
              @click="callDelDialog('delFile', file.id)"
            >
              <q-icon name="svguse:icons/btnIcons.svg#delete" color="grey-8" size="16px" class="q-mr-sm" />
              <span class="block text-grey-5">Удалить</span>
            </q-btn>
          </div>
          <q-icon
            name="svguse:icons/allIcons.svg#download"
            size="17px"
            @click="openLink(file.file)"
            style="cursor: pointer;"
          />
        </q-item-section>
      </q-item>

    </q-list>

    <q-btn
      unelevated
      no-caps
      class="my-btn-custom-big bg-grey-3 my-btn my-effect h-opacity btn-custom br-10"
      padding="5px 25px"
      @click="dialog = true"
    >
      <span class="block text-grey-5">Загрузить файл</span>
      <q-icon name="svguse:icons/allIcons.svg#plus" size="12px" style="margin-left: auto;" />
    </q-btn>
  </q-expansion-item>
</template>

<script>
import { ref, onMounted } from 'vue'
import DialogUploadFiles from 'components/Profile/DialogUploadFiles'
import DialogDelite from 'components/dialog/DialogDelite'
import { filesApi } from 'src/api/files'
import { useQuasar } from 'quasar'

export default {
  name: 'ProfileTwoThreeD',
  components: {
    DialogUploadFiles,
    DialogDelite
  },
  setup() {
    const dialog = ref(false)
    const files = ref([])
    const dialogName = ref()
    const delFileId = ref()
    const dialogDelModal = ref(false)
    const $q = useQuasar()
    const updateActive = ref(false)
    const updateObj = ref({})

    async function getAllFiles() {
      try {
        await filesApi.getAllFiles().then(resp => {
          files.value = resp
        })
      } catch (err) {
        console.log(123)
        $q.notify({
          color: 'negative',
          message: 'произошла ошибка 3'
        })
        console.log(err)
      }
    }

    function updateFile(file) {
      updateActive.value = true
      dialog.value = true
      updateObj.value = file
    }

    function callDelDialog(modal, id) {
      dialogName.value = modal
      dialogDelModal.value = true
      delFileId.value = id
    }
    function modalOpenDel(val) {
      dialogDelModal.value = false
      if (dialogName.value === 'delFile' && val) delFile(delFileId.value)
      delFileId.value = null
    }

    async function delFile(id) {
      try {
        await filesApi.delFile(id).then(resp => {
          files.value = files.value.filter((item) => item.id !== id)
          setTimeout(() => {
            $q.notify({
              color: 'positive',
              message: 'Файл удален'
            })
          }, 0)
        })
      } catch (err) {
        console.log(err)
        setTimeout(() => {
          $q.notify({
            color: 'red',
            message: 'Произошла ошибка, попробуйте позже'
          })
        }, 0)
      }
    }

    function openLink(link) {
      window.open(link, '_blank');
    }
    function modalFalseUp(obj) {
      dialog.value = false
      if (obj) {
        console.log(obj)
        let arr = []
        files.value.filter((el) => {
          if (el.id === obj.id) {
            el = obj
          }
          arr.push(el)
        })
        files.value = arr
      }
      updateActive.value = false
    }

    onMounted(() => {
      getAllFiles()
    })

    return {
      dialog,
      files,
      updateActive,
      updateObj,
      dialogName,
      openLink,
      getAllFiles,
      delFile,
      modalOpenDel,
      callDelDialog,
      dialogDelModal,
      delFileId,
      updateFile,
      modalFalse(obj) {
        dialog.value = false
        if (obj) {
          files.value.push(obj[0])
        }
        updateActive.value = false
      },
      modalFalseUp
    }
  },
}
</script>
