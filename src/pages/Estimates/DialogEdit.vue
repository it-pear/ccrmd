<template>
  <q-card>
    <div class="q-card-background" @click="$emit('modalFalse')"></div>
    <div class="dialog-section">
      <q-card-section class="row items-center justify-between head">
        <div class="title">Изменить</div>
        <q-icon class="close rotate" v-close-popup name="svguse:icons/allIcons.svg#close-modal" />
      </q-card-section>

      <q-card-section class="form-section">
        <label class="lable-title">Статус</label>
        <q-card-section class="form-section form-section-upload">
          <q-select
            filled
            v-model="select2"
            :options="typeEdit"
            stack-label
            placeholder="Выбрать"
            dropdown-icon="svguse:icons/allIcons.svg#select-arrow"
            class="my-select"
            behavior="menu"
            ref="status"
            @popup-hide="focusSelect"
            popup-content-class="my-select-menu"
            :label="select2 ? undefined : 'Выбрать'"
            style="width: 100%"
          />
        </q-card-section>
      </q-card-section>

      <q-card-section class="form-section">
        <label class="lable-title">Название</label>
        <q-input
          v-model="text2"
          class="my-input bg-grey-3"
          placeholder="Введите название"
          ref="title"
        />
      </q-card-section>

      <q-card-section class="form-section">
        <label class="lable-title">Описание</label>
        <q-card-section class="form-section form-section-upload">
          <q-input
            filled
            type="textarea"
            v-model="textarea"
            class="my-textarea bg-grey-3"
            placeholder="Введите примечание"
            ref="desc"
          />
          <div class="my-file-upload lg-visible">
            <label class="lable-title">Изображение</label>
            <q-uploader
              url="http://localhost:8080/upload"
              style="max-width: 300px"
              @added="onFileChange"
            />
          </div>
        </q-card-section>
      </q-card-section>

      <q-card-section class="form-section form-section-row">
        <div class="form-col">
          <label class="lable-title">
            Помещение
          </label>
          <q-select
            filled
            v-model="select1"
            :options="type"
            stack-label
            placeholder="Выбрать"
            dropdown-icon="svguse:icons/allIcons.svg#select-arrow"
            class="my-select"
            behavior="menu"
            ref="room"
            @popup-hide="focusSelect"
            popup-content-class="my-select-menu"
            :label="select1 ? undefined : 'Выбрать'"
          />
        </div>
        <div class="form-col lg-visible">
          <label class="lable-title">Кол-во</label>
          <q-input v-model="text3" class="my-input bg-grey-3" ref="metrics" />
        </div>
      </q-card-section>

      <q-card-section class="form-section form-section-row">
        <div class="form-col">
          <label class="lable-title">Цена за единицу (прогноз цены)<sup style="font-size: 10px;font-weight: bold;">2</sup></label>
          <q-input v-model="edinic" class="my-input bg-grey-3" placeholder="Укажите прогноз цены" ref="price" />
        </div>
        <div class="form-col lg-visible">
          <label class="lable-title">Ставка</label>
          <q-input v-model="stavka" class="my-input bg-grey-3" ref="procent" />
        </div>
      </q-card-section>

      <q-card-section class="form-section mb-visible">
        <q-card-section class="form-section form-section-upload form-section-upload-mb">
          <div class="my-file-upload">
            <div
              class="mb-visible"
            >
              <div class="form-col">
                <label class="lable-title">Кол-во</label>
                <q-input v-model="edinic" class="my-input bg-grey-3" ref="price1mb" />
              </div>
              <div class="form-col">
                <label class="lable-title">Ставка</label>
                <q-input v-model="stavka" class="my-input bg-grey-3" ref="procentmb" />
              </div>
            </div>
            <q-uploader
              url="http://localhost:8080/upload"
              style="max-width: 300px"
            />
          </div>
        </q-card-section>
      </q-card-section>

      <q-card-section class="form-section form-section-link">
        <label class="lable-title">Ссылка</label>
        <q-input v-model="link" class="my-input bg-grey-3" placeholder="Укажите ссылку на товар" />
      </q-card-section>

      <div class="section-btn">
        <q-btn
          unelevated
          no-caps
          padding="20px 10px"
          class="full-width bg-positive text-white my-btn my-effect h-dark q-btn-actions"
          label="Сохранить"
        />
      </div>

    </div>
  </q-card>

</template>

<script>
import { ref, onMounted } from 'vue'
import BtnDate from 'components/BtnDate'

export default ({
  name: 'DialogPosition',
  props: {
    editValue: Array,
    activeField: String
  },
  emits: ['modalFalse'],
  components: {
    BtnDate
  },
  setup (props) {
    const status = ref()

    const title = ref()
    const room = ref()
    const desc = ref()
    const metrics = ref()
    const price = ref()
    const deadline = ref()
    const procent = ref()

    const pricemb = ref()
    const procentmb = ref()

    const image = ref('')
    function onFileChange(file) {
      let uploadFile = file[0]
      image.value = uploadFile
    }

    onMounted(() => {
      setTimeout(function() {
        if (props.activeField === 'status') status.value.focus()
        if (props.activeField === 'title') title.value.focus()
        if (props.activeField === 'room') room.value.focus()
        if (props.activeField === 'desc') desc.value.focus()
        if (props.activeField === 'metrics') metrics.value.focus()
        if (props.activeField === 'price') {
          price.value.focus()
          pricemb.value.focus()
        }

        if (props.activeField === 'deadline') deadline.value.focus()
        if (props.activeField === 'procent') {
          procent.value.focus()
          procentmb.value.focus()
        }

        // props.activeField.value.focus()
      }, 100);
    })
    return {
      select1: ref(
        {
          label: props.editValue.room || 'Квартира',
          value: 1
        },
      ),
      image,
      select2: ref(
        // {
        //   label: props.editValue.status || 'Не согласовано',
        //   value: props.editValue.status.id || 3
        // },
      ),
      val: ref(false),

      type: [
        {
          label: 'Квартира',
          value: 1
        },
        {
          label: 'Офис',
          value: 2
        },
        {
          label: 'Коттедж',
          value: 3
        },
        {
          label: 'Бар',
          value: 4
        }
      ],

      typeEdit: [
        {
          label: 'Оплачено',
          value: 1
        },
        {
          label: 'Не оплачено',
          value: 2
        },
        {
          label: 'Не согласовано',
          value: 3
        },
      ],

      status,
      title,
      room,
      desc,
      metrics,
      price,
      deadline,
      procent,
      pricemb,
      procentmb,

      text: ref(''),
      text2: ref(),
      link: ref(),
      edinic: ref(),
      stavka: ref(),
      show: ref(false),
      text3: ref(),

      textarea: ref(),

      file: ref(),
      focusSelect() {
        function func() {
          status.value.blur()
        }
        setTimeout(func, 100);
      },
      beforeHide() {
        show.value = true;
      },
      onFileChange: function(e) {
        // let files = e.target.file;
        console.log(e.target)
        // if (!files.length)
        //     return;
        // file.value = files;
      },
      onFileChange
    }
  }
})
</script>
