<script setup>
  import { onMounted, ref, computed } from "vue";
  import { useRouter } from "vue-router";
  import { useGoTo } from "src/composable/useGoTo";
  import { accessLevels } from "src/data/accessLevels";
  import { user } from "src/data/user";
  import ActionBtn from "components/Table/ActionBtn.vue";
  import VisualSlider from "components/projects/VisualSlider.vue";
  import SortedMobile from "components/Table/SortedMobile.vue";
  import EmptyData from "src/components/EmptyData.vue";

  const props = defineProps({
    project: Object,
    contractor: Object | undefined,
    designer: Object | undefined,
  });

  const emit = defineEmits(["back", "toggleDialog"]);

  const router = useRouter();

  const columns = [
    {
      name: "name",
      label: "Название",
      field: "name",
      align: "left",
      sortable: true,
    },
    {
      name: "created",
      label: "Создана",
      field: "created",
      align: "left",
      sortable: true,
    },
    {
      name: "changed",
      label: "Изменена",
      field: "changed",
      align: "left",
      sortable: true,
    },
    {
      name: "access",
      label: "Доступ",
      field: "access",
      align: "left",
      sortable: true,
    },
    { name: "action", label: "", field: "action", align: "left" },
    { name: "share", label: "", field: "share", align: "left" },
  ];

  const pagination = ref({
    sortBy: "id",
    rowsPerPage: 0,
    descending: false,
  });

  // const activatedText = ref(false);

  const actionMenu = ref([
    {
      title: "Открыть",
      emmit: "actionOpen",
    },
    {
      title: "Настройки доступа",
      emmit: "actionAccess",
    },
    {
      title: "Изменить",
      emmit: "actionChange",
    },
    {
      title: "Дублировать",
      emmit: "actionDuble",
    },
    {
      title: "Экспорт сметы",
      emmit: "actionExport",
    },
    {
      title: "Удалить",
      emmit: "actionDelete",
    },
  ]);

  const actionMenuOnlyOpen = ref([
    {
      title: "Открыть",
      emmit: "actionOpen",
    },
  ]);

  const ordererName = computed(() => {
    return props.project.orderer.data
      ? `${props.project.orderer.data.first_name} ${props.project.orderer.data.last_name}`
      : `${props.project.orderer.first_name} ${props.project.orderer.last_name}`;
  });

  const { goToAlbum } = useGoTo();

  const openDialogByPointer = (id, pointer) => {
    localStorage.setItem("open_dialog", pointer);
    router.push(`/estimates/${id}`);
  };

  async function onUpdateRows(name, descending) {
    pagination.value.sortBy = name;
    pagination.value.descending = descending;
  }

  // #TODO: Рефакторинг tab в localStorage
  const setTabLocalStorage = () => {
    const tabStr = JSON.stringify({
      name: "projects",
      contractor_id: props.contractor?.user_id,
      designer_id: props.designer?.user_id,
      project_id: props.project.id,
    });

    localStorage.setItem("tab", tabStr);
  };

  const openAlbum = (album) => {
    goToAlbum(
      `/album/${album.id}`,
      album,
      user.role === "designer" ? true : album.current_level === "edit"
    );
    setTabLocalStorage();
  };

  const openEstimate = (estimateId) => {
    router.push(`/estimates/${estimateId}`);
    setTabLocalStorage();
  };

  onMounted(() => {});
</script>

<template>
  <div class="contractor-project-info">
    <div class="head --custom-border-bottom">
      <div class="top-info row">
        <div class="title">
          {{ props.project.name }}
        </div>

        <q-btn
          @click="emit('back')"
          rounded
          unelevated
          no-caps
          class="bg-grey-3 text-grey-5 my-btn my-effect h-dark-lite q-mr-xs lg-visible"
          label="Назад"
        />
      </div>

      <div
        v-if="user.role === 'designer'"
        class="desc-sec bg-grey-9"
      >
        <div class="text">
          Внимание, здесь отображаются только те данные проекта и
          сметы, к которым вы дали доступ данному подрядчику.
        </div>
        <q-btn
          @click="emit('toggleDialog', props.project)"
          rounded
          unelevated
          no-caps
          class="bg-positive text-white q-mr-xs my-btn my-effect h-dark q-ml-xs"
          label="Настройки доступа"
        />
      </div>

      <div
        v-else
        class="desc-sec bg-grey-9"
      >
        <div class="text">
          Внимание, здесь отображаются только те данные проекта и
          сметы, к которым вам дал доступ данный дизайнер.
        </div>
      </div>

      <div class="data">
        <div class="params">
          <div class="cell">
            <strong>Адрес:</strong>
            {{ props.project.address }}
          </div>
          <div class="cell">
            <strong>Тип:</strong>
            {{ props.project.project_type.name }}
          </div>
          <div class="cell">
            <strong>Заказчик:</strong>
            {{ ordererName }}
          </div>
        </div>
        <div class="square">
          <div class="cell">Общая площадь</div>
          <div class="number">
            {{ props.project.square }} м<sup>2</sup>
          </div>
        </div>
      </div>
    </div>

    <q-expansion-item
      expand-separator
      default-opened
      class="visual q-expansion-my title-custom q-expansion-my-contactor-explication --custom-border-bottom"
      disable
    >
      <template v-slot:header>
        <div class="title">Экспликация помещений</div>
        <q-space />
        <!-- <div
          class="custom"
          @click.stop="true"
        >
          Изменить
        </div> -->
      </template>

      <q-list
        v-if="props.project.explications.length"
        class="contractor-list-project"
      >
        <q-item v-for="item in props.project.explications">
          <q-item-section>
            <div class="subtitle">{{ item.name }}</div>
            <div class="metrs">{{ item.square }} м2</div>
          </q-item-section>
        </q-item>
      </q-list>

      <div v-else>
        <EmptyData
          style="margin: 40px 0"
          text="Список пуст"
        />
      </div>
      <!-- <q-btn
        rounded
        unelevated
        no-caps
        class="bg-grey-3 text-grey-5 q-mr-xs my-btn my-effect h-dark q-ml-xs mb-visible btn-custom"
        label="Изменить"
      /> -->
    </q-expansion-item>

    <q-expansion-item
      expand-separator
      default-opened
      class="visual q-expansion-my title-custom --custom-border-bottom"
      style="overflow: visible"
      disable
    >
      <template v-slot:header>
        <div class="title">Расшаренные сметы</div>
        <q-space />
        <!-- <div
          class="custom"
          @click.stop="true"
        >
          Изменить
        </div> -->
      </template>

      <SortedMobile
        :columns="columns"
        :pagination="pagination"
        @updateRows="onUpdateRows"
      />

      <q-table
        v-if="props.project.estimates.length"
        flat
        :rows="props.project.estimates"
        :columns="columns"
        row-key="id"
        hide-pagination
        class="my-table projects-table projects-table-cubes projects-table-cubes-contractor"
        v-model:pagination="pagination"
      >
        <template v-slot:header-cell-action="props">
          <q-th
            :props="props"
            class="q-th__action"
          >
          </q-th>
        </template>

        <template v-slot:header-cell-share="props">
          <q-th
            :props="props"
            class="q-th__share"
          >
          </q-th>
        </template>

        <template v-slot:header-cell="props">
          <q-th :props="props">
            <span class="q-th__title">
              {{ props.col.label }}
            </span>
            <i
              class="notranslate material-icons q-icon q-table__sort-icon q-table__sort-icon--left"
              aria-hidden="true"
              role="presentation"
            >
              <q-icon
                size="7px"
                color="grey-5"
                name="svguse:icons/financeTable.svg#tableArrrow"
              />
            </i>
          </q-th>
        </template>

        <template #body="props">
          <q-tr
            :props="props"
            class="q-tr-tiles cursor-pointer"
            @click="openEstimate(props.row.id)"
          >
            <q-td
              key="image"
              :props="props"
              class="q-td-image"
            >
              <q-item>
                <img
                  :src="props.row?.image?.thumbnail"
                  alt="123"
                />
              </q-item>
            </q-td>

            <q-td
              key="name"
              :props="props"
              class="q-td-name"
            >
              <div class="text-h3">
                <!-- <span class="name-ico">{{ props.row.iconName }}</span> -->
                {{ props.row.name }}
              </div>
            </q-td>

            <q-td
              key="action"
              :props="props"
              class="q-td-action"
            >
              <ActionBtn
                @click.stop
                :actionfunc="
                  user.role === 'designer'
                    ? actionMenu
                    : actionMenuOnlyOpen
                "
                :propsEl="props.row.id"
                :offsetYX="[55, -160]"
                class="q-ml-auto action-list--custom"
                width="215px"
                @actionOpen="openEstimate(props.row.id)"
                @actionAccess="
                  openDialogByPointer(props.row.id, 'access')
                "
                @actionChange="
                  openDialogByPointer(props.row.id, 'edit')
                "
                @actionDuble="
                  openDialogByPointer(props.row.id, 'duble')
                "
                @actionDelete="
                  openDialogByPointer(props.row.id, 'del')
                "
              />
            </q-td>

            <q-td
              key="changed"
              :props="props"
              class="q-td-changed"
            >
              <div class="text">
                Изменен: {{ props.row.updated_at }}
              </div>
            </q-td>

            <q-td
              key="created"
              :props="props"
              class="q-td-created"
            >
              <div class="text">
                Создан: {{ props.row.created_at }}
              </div>
            </q-td>

            <q-td
              key="access"
              :props="props"
              class="q-td-created q-td-access"
            >
              <div class="text">
                {{ accessLevels[props.row.current_level] }}
              </div>
            </q-td>

            <q-td
              key="share"
              :props="props"
              class="q-td-share"
            >
              <q-avatar
                v-if="user.role === 'designer'"
                size="30px"
              >
                <img
                  :src="
                    contractor?.image?.thumbnail ||
                    contractor?.image?.placeholder
                  "
                />
              </q-avatar>
            </q-td>
          </q-tr>
        </template>
      </q-table>

      <div v-else>
        <EmptyData
          style="margin: 40px 0"
          text="Список пуст"
        />
      </div>
      <!-- <q-btn
        rounded
        unelevated
        no-caps
        class="bg-grey-3 text-grey-5 q-mr-xs my-btn my-effect h-dark q-ml-xs mb-visible btn-custom"
        label="Изменить"
      /> -->
    </q-expansion-item>

    <q-expansion-item
      expand-separator
      default-opened
      class="visual q-expansion-my title-custom q-expansion-my-contractor-attached-files --custom-border-bottom"
      disable
    >
      <template v-slot:header>
        <div class="title">Приложенные файлы</div>
        <q-space />
        <!-- <div
          class="custom"
          @click.stop="true"
        >
          Изменить
        </div> -->
      </template>

      <q-list
        v-if="props.project.files.length"
        class="contractor-list contractor-list-project"
      >
        <q-item v-for="file in props.project.files">
          <q-item-section>
            <div class="subtitle">{{ file.name }}</div>
            <div class="size">
              <span class="lg-visible">{{ file.mime }}, </span
              >{{ file.size }}
            </div>
            <span class="mb-visible format">{{ file.type }}</span>
            <a
              :href="file.file"
              target="_blank"
              download
            >
              <q-icon
                name="svguse:icons/allIcons.svg#download"
                size="17px"
              />
            </a>
          </q-item-section>
        </q-item>
      </q-list>

      <div v-else>
        <EmptyData
          style="margin: 40px 0"
          text="Список пуст"
        />
      </div>
    </q-expansion-item>

    <!-- <q-expansion-item
      expand-separator
      default-opened
      class="visual q-expansion-my title-custom q-expansion-my-contractor-more-data"
    >
      <template v-slot:header>
        <div class="title">Прочие данные</div>
        <q-space />
      </template>
      <div class="requisites">
        <div class="item">
          <div class="cell">
            <div class="title">
              Общество с ограниченной ответственностью
            </div>
            <div class="text">Тип</div>
          </div>

          <div class="cell">
            <div class="title">Название компании</div>
            <div class="text">Название</div>
          </div>

          <div class="cell">
            <div class="title">
              350000 г. Краснодар, ул. Красная 17, кв. 9
            </div>
            <div class="text">Юридический адрес</div>
          </div>
          <div class="cell">
            <div class="title">
              350000 г. Краснодар, ул. Красная 17, кв. 9
            </div>
            <div class="text">Фактический адрес</div>
          </div>

          <div class="cell cell-text-hidden">
            <div
              class="text"
              :class="{ activated: activatedText }"
            >
              Добрый день! Приглашаю вас в CRMD — здесь подрядчичи и
              дизайнеры находят друг друга и продуктивно работают. Вам
              понравится! Добрый день! Приглашаю вас в CRMD — здесь
              подрядчичи и дизайнеры находят друг друга и продуктивно
              работают. Добрый день! Приглашаю вас в CRMD — здесь
              подрядчичи и дизайнеры находят друг друга и продуктивно
              работают. Вам понравится! Добрый день! Приглашаю вас в
              CRMD — здесь подрядчичи и дизайнеры находят друг друга и
              продуктивно работают. Вам понравится! Добрый день!
              Приглашаю вас в CRMD — здесь подрядчичи и дизайнеры
              находят друг друга и продуктивно работают. Вам
              понравится! Добрый день! Приглашаю вас в CRMD — здесь
              подрядчичи и дизайнеры находят
            </div>
            <q-btn
              flat
              style="color: #000"
              padding="0"
              class="q-btn-activated"
              :class="{ activated: activatedText }"
              @click="activatedText = !activatedText"
            >
              <span
                class="block"
                v-if="!activatedText"
                >Показать полностью</span
              >
              <span
                class="block"
                v-if="activatedText"
                >Скрыть</span
              >
              <q-icon
                name="svguse:icons/allIcons.svg#select-arrow"
                size="11px"
              />
            </q-btn>
          </div>
        </div>
      </div>

      <q-btn
        rounded
        unelevated
        no-caps
        class="bg-grey-3 text-grey-5 q-mr-xs my-btn my-effect h-dark q-ml-xs mb-visible btn-custom"
        label="Изменить"
      />
    </q-expansion-item> -->

    <!-- <q-separator color="#f0f0f0"/> -->

    <q-expansion-item
      expand-separator
      default-opened
      class="visual q-expansion-my title-custom q-expansion-my-contractor-visual"
      disable
    >
      <template v-slot:header>
        <div class="title">Визуал</div>
        <q-space />
      </template>

      <q-card
        v-if="props.project.albums.length"
        class="q-card-visual-slider"
      >
        <q-card-section
          v-for="(album, index) in props.project.albums"
          :key="index"
          @click="openAlbum(album)"
          class="cursor-pointer"
        >
          <VisualSlider :images="album.images" />
          <div class="row desc">
            <div class="title">{{ album.name }}</div>
            <ActionBtn
              :actionfunc="actionMenuOnlyOpen"
              :propsEl="album.id"
              :offsetYX="[55, -160]"
              class="security__menu mb-visible"
              width="215px"
              @actionOpen="openAlbum(album)"
            />
          </div>

          <div class="row security">
            <span
              class="security__info"
              style="font-size: 16px; text-transform: uppercase"
            >
              {{
                album.current_level === "view"
                  ? "Только просмотр"
                  : "Можно смотреть, загружать и удалять"
              }}
            </span>
          </div>
        </q-card-section>
      </q-card>

      <div v-else>
        <EmptyData
          style="margin: 40px 0"
          text="Список пуст"
        />
      </div>
    </q-expansion-item>

    <div class="contractor-project-info-q-card-prev q-card-prev">
      <q-btn
        unelevated
        no-caps
        outline
        class="bg-white text-grey-3 my-btn my-effect"
        style="border-radius: 10px; width: 100%"
        padding="24px 24px 24px 19px"
        @click="emit('back')"
      >
        <div class="block text-grey-5">Назад к списку проектов</div>
        <q-icon
          size="18px"
          name="svguse:icons/allIcons.svg#back"
          style="margin-left: auto"
        />
      </q-btn>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .contractor-project-info:deep() {
    .--custom-border-bottom {
      border-bottom: 1px solid #f0f0f0;
    }

    .q-list.contractor-list-project .q-item.q-item-type {
      border-radius: 0;
    }

    .contractor-list-project .q-item:last-child {
      border-bottom: none;
    }

    .q-expansion-item.q-item-type.q-expansion-my {
      padding-bottom: 0px;
    }

    .q-td__action__list.visible {
      &:before {
        right: 23px;
        top: -19px;
        @media (max-width: 772px) {
          top: -18px;
        }
      }
    }

    .q-card-visual-slider .q-card__section .security {
      padding: 25px 25px 0 25px;
      justify-content: space-between;
      align-items: center;
      column-gap: 10px;
      row-gap: 20px;
      flex-wrap: nowrap;

      .btn-sec {
        display: flex;
        gap: 10px;
      }
    }
  }

  .q-expansion-my:deep() {
    .disabled.q-item {
      opacity: 1 !important;
      cursor: default !important;
      .title {
        cursor: default !important;
      }
    }
  }
</style>
