<script setup>
  import { ref, onMounted, watch } from "vue";
  import { useRouter } from "vue-router";
  import { useQuasar } from "quasar";
  import { estimatesApi } from "src/api/estimates";
  import { accessApi } from "src/api/access";
  import { accessLevels } from "src/data/accessLevels";
  import { getFormatDate } from "src/composable/getFormatDate";
  import ActionBtn from "components/Table/ActionBtn.vue";
  import CardInfo from "src/components/CardInfo.vue";
  import CardInfoV2 from "src/components/CardInfoV2.vue";
  import useDialogDel from "src/composable/useDialogDel";

  import DialogAccessSettingsEstimates from "src/pages/Estimates/DialogAccessSettingsEstimates";
  import DialogCreate from "src/pages/Estimates/DialogCreate";
  import DialogDelite from "src/components/dialog/DialogDelite";

  const $q = useQuasar();
  const router = useRouter();

  const props = defineProps({
    data: Array,
    project_id: String,
    projectName: String,
    userRole: String,
  });

  const emit = defineEmits(["updateData"]);

  const actionfunc = ref([
    {
      title: "Открыть",
      emmit: "openEstimate",
    },
    {
      title: "Настройки доступа",
      emmit: "openDialogAccess",
    },
    {
      title: "Изменить",
      emmit: "",
    },
    {
      title: "Дублировать",
      emmit: "",
    },
    {
      title: "Экспорт сметы",
      emmit: "",
    },
    {
      title: "Удалить",
      emmit: "actionDel",
    },
  ]);

  const dialogAccess = ref(false);
  const dialog = ref(false);

  const estimates = ref();
  const accessContractors = ref([]);
  const currentEstimate = ref("");

  watch(
    () => props.data,
    () => (estimates.value = props.data)
  );

  // инициализация функционала окна удаления
  const actionHandlers = {
    del: delEstimate,
  };
  const {
    dialogDelite,
    dialogDelId,
    dialogDelName,
    onActionDel,
    modalCloseDel,
    handleModalClose,
  } = useDialogDel(actionHandlers);
  // useDate

  const trimArray = (arr) => {
    let newArr;

    if (arr.length) newArr = [...arr];
    else return;

    if (newArr.length <= 3) return newArr;
    if (newArr.length > 3) return newArr.slice(0, 2);
  };

  // создание сметы
  function modalCreate(obj) {
    dialog.value = false;

    if (obj) {
      // if (obj.created_at) obj.created_at = obj.created_at.split(' ')[1]
      // if (obj.updated_at) obj.updated_at = obj.updated_at.split(' ')[1]

      estimates.value.push(obj);
      $q.notify({
        color: "positive",
        message: "Смета добавлена",
      });
    }
  }

  async function delEstimate(id) {
    try {
      await estimatesApi.del(id);
      estimates.value = estimates.value.filter(
        (item) => item.id !== id
      );
      $q.notify({
        color: "positive",
        message: "Смета удалена",
      });
    } catch (err) {
      console.error(err);
    }
  }

  // Открытие модалки доступа
  const toggleDialogAccess = async (estimate) => {
    if (estimate) {
      currentEstimate.value = estimate;
      await getEstimateAccess(currentEstimate.value.id);
      dialogAccess.value = true;
    } else {
      currentEstimate.value = "";
      dialogAccess.value = false;
      emit("updateData");
    }
  };

  // Получить доступы по смете
  const getEstimateAccess = async (idEstimate) => {
    try {
      const resp = await accessApi.getEstimate(idEstimate);
      accessContractors.value = resp;
      if (accessContractors.value?.shared_to?.length)
        accessContractors.value.shared_to.forEach(
          (el) => (el.shared = true)
        );
    } catch (err) {
      console.error(err);
      $q.notify({
        color: "negative",
        message: "Произошла ошибка получения доступов сметы",
      });
    }
  };

  onMounted(() => {
    estimates.value = props.data.map((el) => {
      return {
        ...el,
        updated_at: getFormatDate(el.updated_at),
        created_at: getFormatDate(el.created_at),
      };
    });
  });
</script>

<template>
  <q-dialog
    v-model="dialogAccess"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog estimates-dialog-security"
  >
    <DialogAccessSettingsEstimates
      :projectId="props.project_id"
      :estimate="currentEstimate"
      :sharedContractors="accessContractors?.shared_to"
      @modalFalse="toggleDialogAccess"
      @updateData="getEstimateAccess(currentEstimate.id)"
    />
  </q-dialog>

  <q-dialog
    v-model="dialog"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog estimates-dialog estimates-dialog-create"
  >
    <DialogCreate
      @add="modalCreate"
      :project_id="project_id"
    />
  </q-dialog>
  <q-dialog
    v-model="dialogDelite"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog"
  >
    <DialogDelite @modalFalse="handleModalClose" />
  </q-dialog>

  <q-expansion-item
    expand-separator
    default-opened
    class="q-expansion-my estimates hidden-settings-icon"
    disable
  >
    <template v-slot:header>
      <div class="title">Сметы</div>
    </template>

    <q-card>
      <q-card-section
        @click="router.push(`/estimates/project/${props.project_id}`)"
        class="cursor-pointer"
      >
        <div class="title">Общая смета проекта</div>
        <div class="text">
          Сумма всех<br />
          отдельных смет
        </div>
      </q-card-section>

      <q-card-section
        v-for="item in estimates"
        :key="item"
        @click="router.push(`/estimates/${item.id}`)"
        class="cursor-pointer"
      >
        <div class="title">{{ item.name }}</div>
        <q-btn
          rounded
          unelevated
          no-caps
          padding="4.5px 10px"
          class="bg-negative text-white my-btn my-btn-14 my-effect h-dark btn-news no-cursor"
          :label="`Новых предложений: ${item.new_proposals_count}`"
          :class="{ 'btn-hide': !item.new_proposals_count }"
        />

        <div class="text">
          Изменена: {{ item.updated_at }}
          <span>Создана: {{ item.created_at }}</span>
        </div>
        <div class="access q-pr-xs">
          <div class="text">
            {{ accessLevels[item.current_level] }}
          </div>
        </div>
        <q-list class="q-list-share">
          <template v-if="item?.access?.shared_to?.length">
            <q-item v-for="el in trimArray(item.access.shared_to)">
              <q-btn
                @click.stop="
                  () => {
                    console.log('EstimateProjects ClickStop');
                  }
                "
              >
                <img
                  :src="
                    el.contractor.image.thumbnail ||
                    el.contractor.image.placeholder
                  "
                  alt="ava"
                />
                <CardInfoV2
                  :anchor="['bottom', 'middle']"
                  :self="['top', 'right']"
                  :offsetXY="[0, -15]"
                  :user="el.contractor"
                />
              </q-btn>
            </q-item>

            <q-item v-if="item.access.total_count > 3">
              <q-btn
                class="q-td-share__btn__limit"
                :label="`+${item.access.total_count - 2}`"
              />
            </q-item>
          </template>

          <q-item
            class="q-item-add"
            v-if="userRole === 'designer'"
          >
            <q-btn
              class="q-td-share__btn__add"
              icon="svguse:icons/allIcons.svg#plus"
              @click.stop="toggleDialogAccess(item)"
            />
          </q-item>

          <q-item
            class="q-item-action"
            v-if="userRole === 'designer'"
          >
            <ActionBtn
              @click.stop
              :propsEl="item.id"
              :offsetYX="[55, -266]"
              :actionfunc="actionfunc"
              @openEstimate="router.push(`/estimates/${item.id}`)"
              @openDialogAccess="toggleDialogAccess(item)"
              @actionDel="onActionDel('del', item.id)"
            />
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-section
        v-if="userRole === 'designer'"
        class="q-card-add"
        @click="dialog = true"
      >
        <q-btn
          rounded
          unelevated
          no-caps
          icon="svguse:icons/btnIcons.svg#plus"
          class="bg-grey-3 text-grey-5 my-btn my-effect h-dark-lite lg-visible"
          @click="dialog = true"
        />
        <div class="text lg-visible">
          Добавить<br />
          смету
        </div>
        <q-btn
          unelevated
          no-caps
          outline
          class="bg-white text-grey-3 my-btn my-effect my-btn--outline mb-visible"
          style="border-radius: 10px"
          padding="24px 24px 24px 19px"
        >
          <div class="block text-grey-5">Добавить</div>
          <q-icon
            name="svguse:icons/allIcons.svg#plus"
            size="12px"
            color="black"
            style="opacity: 0.3; margin-left: auto"
          />
        </q-btn>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<style lang="scss" scoped>
  .q-expansion-my:deep() {
    border-top: none;
    .disabled.q-item {
      opacity: 1 !important;
      cursor: default !important;
      .title {
        cursor: default !important;
      }
    }
  }
</style>
