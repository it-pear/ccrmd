<template>
  <div class="choise-category-bcg" :class="{'choise-category-bcg-active': btnActive}"></div>
  <div class="choise-category">
    <q-btn
      unelevated
      no-caps
      class="my-btn-custom-big bg-grey-3 my-btn my-effect h-opacity btn-custom br-10"
      padding="5px 25.5px"
      :class="{'btn-active': btnActive}"
      @click="btnActive = !btnActive"
    >
      <span class="block text-grey-5">
        <span v-show="!btnActive">Добавить</span>
        <span v-show="btnActive">Выберите категорию</span>
      </span>
      <q-icon name="svguse:icons/allIcons.svg#plus" size="12px" color="black" style="margin-left: auto;" />
    </q-btn>
    <div class="choice-place choice-place-no-active-check" v-show="btnActive && !checkActive">
      <q-checkbox
        v-for="check in checklist"
        :key="check"
        v-model="check.value"
        :label="check.name"
        class="q-checkbox-choice no-shadow"
        @click.stop="openListTags(check)"
      />
    </div>
    <div class="choice-place choice-place-2" v-show="btnActive && checkActive">
      <div class="head">
        <div class="title">
          {{activeList.name}}
        </div>
        <q-btn
          class="btn-close"
          @click="checkActive = false"
        >
          <q-icon
            name="svguse:icons/allIcons.svg#arrowe-btn-left"
            size="10px"
            style="opacity: 0.3"
          />
        </q-btn>
      </div>
      <div class="sec-btn">
        <q-btn
          flat
          no-caps
          label="Включить все"
          class="my-effect h-opacity"
          @click="customCheckList('add', activeList)"
        />
        <q-btn
          flat
          no-caps
          label="Убрать все"
          class="my-effect h-opacity"
          @click="customCheckList('clear', activeList)"
        />
      </div>
      <div class="sec-check">
        <q-checkbox
          v-for="check in activeList.tags"
          :key="check"
          v-model="check.value"
          :label="check.name"
          class="q-checkbox-choice no-shadow"
          @click="addTagInCategory(check.id, check.value)"
        />
      </div>

    </div>
  </div>

  <div
    v-for="item in gotActiveListTags"
    :key="item"
  >
    <q-expansion-item
      expand-separator
      default-opened
      class="q-expansion-my-2"
    >
      <template v-slot:header>
        <div class="title">
          {{item.name}}
        </div>
      </template>

      <q-btn
        unelevated
        outline
        no-caps
        class="my-btn-custom-big my-btn my-effect  btn-custom br-10"
        padding="5px 25.5px"
        color="grey-7"
        v-for="el in item.tags"
        :key="el"
      >
        <span class="block text-grey-5">{{el.name}}</span>
        <q-icon
          name="svguse:icons/btnIcons.svg#delete"
          size="16px"
          style="margin-left: auto;"
          @click="addTagInCategory(el.id, false, el.category_id)"
        />
      </q-btn>
    </q-expansion-item>
  </div>
</template>

<script>
import { ref, defineComponent, onMounted } from 'vue'
import { contractorApi } from 'src/api/contractor'
import { useQuasar } from 'quasar'

export default defineComponent({
  setup(props, { emit }) {
    const $q = useQuasar()

    const checklist = ref([])
    const checkActive = ref(false)
    const btnActive = ref(false)

    const activeList = ref({})
    const activeTagsList = ref([])
    const gotActiveListTags = ref([])

    // api tags
    async function getListTags() {
      try {
        await contractorApi.getListTags().then(resp => {
          checklist.value = resp
          // console.log(resp)
        })
      } catch (err) {
        $q.notify({
          color: 'negative',
          message: 'произошла ошибка'
        })
        console.log(err)
      }
    }
    async function getActiveListTags() {
      try {
        await contractorApi.getActiveListTags().then(resp => {
          gotActiveListTags.value = resp
          // console.log(activeTagsList.value)
        })
      } catch (err) {
        $q.notify({
          color: 'negative',
          message: 'произошла ошибка'
        })
        console.log(err)
      }
    }

    // custom tags
    async function openListTags(check) {
      check.value = false
      checkActive.value = true
      activeList.value = check

      activeList.value.tags.map((element) => {
        activeTagsList.value.forEach((el) => {
          if(element.id === el) {
            return element.value = true
          }
        })
      })
    }

    async function customCheckList(val, list) {
      let arr = []
      if (val === 'add') {
        activeList.value.tags.filter((item) => {
          activeTagsList.value.push(item.id)
          item.value = true
        })
        console.log(activeTagsList.value)
      }
      if (val === 'clear') {
        activeList.value.tags.filter((item) => {
          item.value = false
          activeTagsList.value = activeTagsList.value.filter((name) => name !== item.id)
        })
      }
      await addTagInCategory(null,null,null)
    }

    async function addTagInCategory(checkId, val, catId) {

      if (checkId !== null && val !== null) {
        if (val === true) {
          activeTagsList.value.push(checkId)
        } else {
          activeTagsList.value = activeTagsList.value.filter((name) => name !== checkId)
        }
      }

      if (activeTagsList.value.length === 0) {
        activeTagsList.value = [0]
      }

      if (catId !== null && catId !== undefined) {
        if (activeList.value.id === catId) {
          activeList.value.tags.filter((item) => {
            if (item.id === checkId) {
              item.value = false
            }
          })
        }
      }

      try {
        await contractorApi.addTagInCategory(activeTagsList.value).then(resp => {
          activeTagsList.value = resp.arr
          gotActiveListTags.value = resp.arr2

          $q.notify({
            color: 'positive',
            message: `Тег обновлен`
          })
        })
      } catch (err) {
        $q.notify({
          color: 'negative',
          message: 'произошла ошибка'
        })
        console.log(err)
      }
    }

    // start
    async function start() {
      await getListTags()
      await getActiveListTags()
      gotActiveListTags.value.forEach(element => {
        element.tags.forEach(el => {
          activeTagsList.value.push(el.id)
        })
      });
    }
    onMounted(() => {
      start()

      const btn = document.querySelector( '.choise-category');
      document.addEventListener( 'click', (e) => {
        const withinBoundaries = e.composedPath().includes(btn);
        if ( ! withinBoundaries ) {
          btnActive.value = false
        }
      })

    })

    return {
      checklist,
      checkActive,
      btnActive,
      activeList,
      activeTagsList,
      gotActiveListTags,

      openListTags,
      customCheckList,

      getListTags,
      getActiveListTags,
      addTagInCategory,
      start
    }
  },
})
</script>
