<script setup>
  import { ref, watch, onMounted, computed } from "vue";
  import { useQuasar } from "quasar";
  import { estimatesApi } from "src/api/estimates";
  import { proposalsApi } from "src/api/proposals";
  import { dealsApi } from "src/api/deals";
  import { useFindElement } from "src/composable/useFindElement";
  import { goToLink } from "src/composable/useGoToLink";
  import useContextMenu from "src/composable/useContextMenu";
  import SelectStatus from "src/components/estimate/SelectStatus";

  const props = defineProps({
    columns: Array,
    rows: Array,
    level: Number,
    projectDesigner: Object,
  });

  const emit = defineEmits([
    "openSmeta",
    "editModal",
    "chooseSmeta",
    "unchooseSmeta",
    "updateItem",
    "dubleItem",
    "delItem",
    "deleteDeal",
    "updateList",
  ]);

  const $q = useQuasar();

  const activeSmeta = ref();

  const pagination = ref({
    sortBy: "id",
    rowsPerPage: 0,
    descending: false,
  });

  // const isFullscreen = ref(false);

  const {
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
    isMobile,
  } = useContextMenu();

  // Флаг отображения выбранного предложения
  const isSelectedProposal = ref(false);

  const optionsTab = ref([
    "В работе",
    "Скомплектовано",
    "Куплено заказчиком",
    "Отмена",
  ]);
  const optionsTab2 = ref([
    "Согласовано",
    "Оплачено",
    "Готово к выдаче",
    "Выполнено",
  ]);

  const user = JSON.parse(localStorage.getItem("userInfo"));
  const userRole = user.role;

  const visibleColumns = ref([
    "id",
    "name",
    "room",
    "desc",
    "quantity",
    "price",
    "term",
    "total_price",
    "rate",
    "fee",
    "status",
    "brand",
    "code",
    "color",
    "file",
  ]);

  const isLayoutPrint = () => {
    const layout = document.querySelector(".main-layout");
    return layout.classList.contains("main-layout--print");
  };

  const colorStatus = (statusId, deal) => {
    // Статусы позиции
    if (statusId === "В работе") return "grey-7";
    if (statusId === "Скомплектовано") return "primary";
    if (statusId === "Куплено заказчиком") return "positive";
    if (statusId === "Отмена") return "grey-5";

    // Статусы сделки
    if (deal) {
      if (
        deal.designer_status !== deal.contractor_status &&
        deal.turn !== userRole
      )
        return "grey-7";
      if (
        deal.designer_status !== deal.contractor_status &&
        deal.turn === userRole
      )
        return "negative";
      if (deal.designer_status === deal.contractor_status)
        return "positive";
    }
  };

  const customSort = (rowsVal, sortBy, descending) => {
    const data = [...props.rows];
    // console.log(data, sortBy, descending);

    const sortStr = (valueX, valueY) => {
      if (!valueX) valueX = "";
      if (!valueY) valueY = "";
      return valueX > valueY ? 1 : valueX < valueY ? -1 : 0;
    };

    const sortNum = (valueX, valueY) => {
      return parseFloat(valueX) - parseFloat(valueY);
    };

    const checkAndSort = (x, y, sortBy) => {
      if (x.selected_proposal.length && y.selected_proposal.length) {
        const valueX = x.proposals.find(
          (el) => x.selected_proposal === el.id
        );

        const valueY = y.proposals.find(
          (el) => y.selected_proposal === el.id
        );

        return sortNum(valueX[sortBy], valueY[sortBy]);
      }

      if (x.selected_proposal.length) {
        const valueX = x.proposals.find(
          (el) => x.selected_proposal === el.id
        );

        return sortNum(valueX[sortBy], y.forecast[sortBy]);
      }

      if (y.selected_proposal.length) {
        const valueY = y.proposals.find(
          (el) => y.selected_proposal === el.id
        );

        return sortNum(x.forecast[sortBy], valueY[sortBy]);
      }

      return sortNum(x.forecast[sortBy], y.forecast[sortBy]);
    };

    if (sortBy) {
      data.sort((a, b) => {
        const x = descending ? b : a;
        const y = descending ? a : b;

        if (sortBy === "id") {
          return sortNum(x.iterationId, y.iterationId);
        }

        if (sortBy === "name") {
          return sortStr(x.name, y.name);
        }

        if (sortBy === "room") {
          return sortStr(x.room_type, y.room_type);
        }

        if (sortBy === "desc") {
          return sortStr(x.description, y.description);
        }

        if (sortBy === "quantity") {
          return sortNum(x.quantity, y.quantity);
        }

        if (
          sortBy === "price" ||
          sortBy === "term" ||
          sortBy === "total_price" ||
          sortBy === "rate" ||
          sortBy === "fee"
        ) {
          return checkAndSort(x, y, sortBy);
        }

        if (sortBy === "status") {
          return sortStr(x.status, y.status);
        }

        if (sortBy === "brand") {
          return sortStr(x.manufacturer, y.manufacturer);
        }

        if (sortBy === "code") {
          return sortStr(x.article, y.article);
        }

        if (sortBy === "color") {
          return sortStr(x.color, y.color);
        }

        if (sortBy === "file") {
          return sortStr(x.file?.extension, y.file?.extension);
        }
      });
    }

    return data;
  };

  // Текущее выбранное предложение
  const checkSelectedProposal = (item, key) => {
    if (item.selected_proposal.length) {
      const currentProposalIndex = item.proposals.findIndex(
        (proposal) => proposal.id === item.selected_proposal
      );

      const currentProposal = item.proposals[currentProposalIndex];
      isSelectedProposal.value = true;
      return currentProposal[key];
    }

    return item.forecast[key];
  };

  async function openSmeta(val, proposals, smetaVal) {
    activeSmeta.value = val;
    emit("openSmeta", val);
    contextMenu.value.hide();
    const array = arrId(proposals);
    if (smetaVal && array.length) await markViewed(array);
  }

  function editModal(val, field) {
    emit("editModal", val, field);
  }

  async function chooseSmeta(item, proposals) {
    emit("chooseSmeta", item.estimate_item_id, item.id);
    const array = arrId(proposals);
    if (array.length) {
      await markViewed(array);
    }
  }

  async function unChooseSmeta(rowID, dealStatus, dealID, proposals) {
    emit("unchooseSmeta", rowID);
    if (dealStatus === "Согласовано") {
      deleteDeal(dealID);
    }

    const array = arrId(proposals);
    // console.log(array);
    if (array.length) {
      await markViewed(array);
    }
  }

  // function goToLink(link) {
  //   if (!/^https?:\/\//i.test(link)) {
  //     link = "https://" + link;
  //   }
  //   window.open(link, "_blank");
  // }

  // Удаление сделки
  const deleteDeal = async (dealId) => {
    try {
      await dealsApi.delete(dealId).then((res) => res);
    } catch (err) {
      $q.notify({
        color: "negative",
        message: `${err}`,
      });
      throw err;
    }
  };

  // Создание массива из ID
  const arrId = (arr) => {
    let newArr = [];
    arr.forEach((el) => {
      if (el.is_new) newArr.push(el.id);
    });
    // const newArr = arr.map((el) => {
    //   if(el.is_new) return el.id;
    // });
    return newArr;
  };

  // Отметка о просмотре предложения
  const markViewed = async (arr) => {
    try {
      await proposalsApi.markViewed(arr);
      emit("updateList");
    } catch (err) {
      console.error(err.response);
      $q.notify({
        timeout: 3000,
        color: "negative",
        message: `${err}`,
      });
    }
  };

  onMounted(() => {
    console.log("props.rows: ", props.rows);
  });
</script>

<template>
  <q-table
    v-model:pagination="pagination"
    :columns="columns"
    :rows="rows"
    :sort-method="customSort"
    row-key="id"
    :class="{
      'estimates-table': true,
      'estimates-table-version-contractor': userRole === 'contractor',
      'estimate-table-general': true,
    }"
    :visible-columns="visibleColumns"
    flat
    hide-pagination
    binary-state-sort
  >
    <!-- <template #top>
      <q-btn
        flat
        round
        dense
        :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
        @click="toggleFullscreen"
        class="fullscreen-btn"
      />
    </template> -->
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

    <template v-slot:header-cell-id="props">
      <q-th
        :props="props"
        class="th-id --id --id__th"
      >
        <span>
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

    <template v-slot:header-cell-name="props">
      <q-th
        :props="props"
        class="th-name --name --name__th"
      >
        <div class="th-name th-content-name">
          <q-icon
            name="svguse:icons/financeTable.svg#photo"
            size="16px"
            color="grey-5"
            style="opacity: 0.3"
            class="icon-photo"
          />
          <span>
            {{ props.col.label }}
          </span>
          <i
            class="notranslate material-icons q-icon q-table__sort-icon q-table__sort-icon--left q-table__sort-icon--right"
            aria-hidden="true"
            role="presentation"
          >
            <q-icon
              size="7px"
              color="grey-5"
              name="svguse:icons/financeTable.svg#tableArrrow"
            />
          </i>
          <q-icon
            name="svguse:icons/financeTable.svg#share"
            size="13px"
            color="grey-5"
            style="opacity: 0.3"
            class="icon-share"
          />
        </div>
      </q-th>
    </template>

    <template v-slot:header-cell-room="props">
      <q-th
        :props="props"
        class="--room --room__th"
      >
        <span>
          {{ props.col.label }}
        </span>
        <i
          class="notranslate material-icons q-icon q-table__sort-icon q-table__sort-icon--left q-table__sort-icon--right"
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

    <template v-slot:header-cell-desc="props">
      <q-th
        :props="props"
        class="--desc --desc__th"
      >
        <span>
          {{ props.col.label }}
        </span>
        <i
          class="notranslate material-icons q-icon q-table__sort-icon q-table__sort-icon--left q-table__sort-icon--right"
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

    <template v-slot:header-cell-quantity="props">
      <q-th
        :props="props"
        class="--quantity --quantity__th"
      >
        <span>
          {{ props.col.label }}
        </span>
        <i
          class="notranslate material-icons q-icon q-table__sort-icon q-table__sort-icon--left q-table__sort-icon--right"
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

    <template v-slot:header-cell-price="props">
      <q-th
        :props="props"
        class="--price --price__th"
      >
        <span>
          {{ !isLayoutPrint() ? props.col.label : 'Цена, р.' }}
        </span>
        <i
          class="notranslate material-icons q-icon q-table__sort-icon q-table__sort-icon--left q-table__sort-icon--right"
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

    <template v-slot:header-cell-term="props">
      <q-th
        :props="props"
        class="--term --term__th"
      >
        <span>
          {{ !isLayoutPrint() ? props.col.label : "Срок, д." }}
        </span>
        <i
          class="notranslate material-icons q-icon q-table__sort-icon q-table__sort-icon--left q-table__sort-icon--right"
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

    <template v-slot:header-cell-total_price="props">
      <q-th
        :props="props"
        class="--total_price --total_price__th"
      >
        <span>
          {{ props.col.label }}
        </span>
        <i
          class="notranslate material-icons q-icon q-table__sort-icon q-table__sort-icon--left q-table__sort-icon--right"
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

    <template v-slot:header-cell-rate="props">
      <q-th
        :props="props"
        class="--rate --rate__th"
      >
        <span class="text">
          {{ !isLayoutPrint() ? props.col.label : "" }} %
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

    <template v-slot:header-cell-fee="props">
      <q-th
        :props="props"
        class="--fee --fee__th"
      >
        <span>
          {{ !isLayoutPrint() ? props.col.label : "Аген., р." }}
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

    <template v-slot:header-cell-status="props">
      <q-th
        :props="props"
        class="--status --status__th"
      >
        <span> {{ props.col.label }} </span>
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

    <template v-slot:header-cell-brand="props">
      <q-th
        :props="props"
        class="--brand --brand__th"
      >
        <span>
          {{ !isLayoutPrint() ? props.col.label : "Произв." }}
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

    <template v-slot:header-cell-code="props">
      <q-th
        :props="props"
        class="--article --article__th"
      >
        <span>
          {{ !isLayoutPrint() ? props.col.label : "Арт." }}
        </span>
        <i
          class="notranslate material-icons q-icon q-table__sort-icon q-table__sort-icon--left q-table__sort-icon--right"
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

    <template v-slot:header-cell-color="props">
      <q-th
        :props="props"
        class="--color --color__th"
      >
        <span>
          {{ props.col.label }}
        </span>
        <i
          class="notranslate material-icons q-icon q-table__sort-icon q-table__sort-icon--left q-table__sort-icon--right"
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

    <template v-slot:header-cell-file="props">
      <q-th
        :props="props"
        class="--file --file__th"
      >
        <span>
          {{ props.col.label }}
        </span>
        <i
          class="notranslate material-icons q-icon q-table__sort-icon q-table__sort-icon--left q-table__sort-icon--right"
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

    <template
      #header
      v-if="userRole === 'contractor'"
    >
      <q-tr class="tr-colspan">
        <q-th colspan="5"></q-th>
        <q-th
          v-if="level !== 1 && level !== 3"
          colspan="5"
        >
          <div class="text-center">Прогноз</div>
        </q-th>
        <q-th
          v-if="level !== 1 && level !== 2"
          colspan="5"
        >
          <div class="text-center">Мое предложение</div>
        </q-th>
        <q-th colspan="5"></q-th>
      </q-tr>
      <q-tr>
        <q-th>№</q-th>
        <q-th class="--name">Название</q-th>
        <q-th class="--room">Помещение</q-th>
        <q-th class="--desc">Описание</q-th>
        <q-th>м2/шт</q-th>
        <q-th v-if="level !== 1 && level !== 3">Цена, руб.</q-th>
        <q-th v-if="level !== 1 && level !== 3">Срок, дн</q-th>
        <q-th v-if="level !== 1 && level !== 3">Итого</q-th>
        <q-th v-if="level !== 1 && level !== 3">Ставка</q-th>
        <q-th v-if="level !== 1 && level !== 3">Агентские, руб.</q-th>
        <q-th v-if="level !== 1 && level !== 2">Цена, руб.</q-th>
        <q-th v-if="level !== 1 && level !== 2">Срок, дн</q-th>
        <q-th v-if="level !== 1 && level !== 2">Итого</q-th>
        <q-th v-if="level !== 1 && level !== 2">Ставка</q-th>
        <q-th v-if="level !== 1 && level !== 2">Агентские, руб</q-th>
        <q-th>Статус</q-th>
        <q-th>Производитель</q-th>
        <q-th class="--article">Артикул</q-th>
        <q-th>Цвет</q-th>
        <q-th>Файл</q-th>
      </q-tr>
    </template>

    <template #body="props">
      <q-menu
        ref="contextMenu"
        :style="menuStyle"
        class="q-menu-edit"
      >
        <q-list v-if="userRole === 'designer'">
          <q-item v-close-popup>
            <q-item-section>
              <q-item-label
                @click="$emit('updateItem', contextMenuActiveTrId)"
              >
                Изменить
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-close-popup>
            <q-item-section>
              <q-item-label
                @click="$emit('dubleItem', contextMenuActiveTrId)"
              >
                Дублировать
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-close-popup>
            <q-item-section>
              <q-item-label
                @click="$emit('delItem', contextMenuActiveTrId)"
              >
                Удалить
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <q-list v-if="userRole === 'contractor'">
          <q-item
            v-if="level === 6 || level === 5"
            v-close-popup
          >
            <q-item-section>
              <q-item-label
                @click="$emit('updateItem', contextMenuActiveTrId)"
              >
                Изменить
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            v-if="level === 6"
            v-close-popup
          >
            <q-item-section>
              <q-item-label
                @click="$emit('dubleItem', contextMenuActiveTrId)"
              >
                Дублировать
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            v-if="level === 6"
            v-close-popup
          >
            <q-item-section>
              <q-item-label
                @click="$emit('delItem', contextMenuActiveTrId)"
              >
                Удалить
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            v-if="level === 3 || level === 4"
            v-close-popup
          >
            <q-item-section>
              <q-item-label
                @click="$emit('updateItem', contextMenuActiveTrId)"
              >
                Подать предложение
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            v-if="level === 1 || level === 2"
            v-close-popup
          >
            <q-item-section>
              <q-item-label
                @click="$emit('updateItem', contextMenuActiveTrId)"
              >
                Просмотр
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>

      <q-tr
        :props="props"
        @contextmenu.prevent="
          !isMobile() && showContextMenu($event, props.row)
        "
        @touchstart.passive="
          isMobile() && handleTouchStart($event, props.row)
        "
        @touchmove.passive="handleTouchMove"
        @touchend.passive="handleTouchEnd"
        @click.stop
      >
        <q-td
          key="id"
          class="--id --id__td"
          :props="props"
          @dblclick="editModal(props.row, null)"
        >
          <div
            class="status-new"
            v-if="props.row.new_proposals_count"
          ></div>
          <div class="td-content-section">
            <div class="text">
              {{ props.row.iterationId }}
              <!-- {{ arrId(props.row.proposals) }} -->
            </div>
          </div>
        </q-td>

        <q-td
          key="name"
          class="--name --name__td"
          :props="props"
          @dblclick="editModal(props.row, 'name')"
          @click.stop=""
        >
          <div class="td-content-section td-content-name">
            <q-icon
              v-if="props.row.image.thumbnail"
              class="q-icon-tooltip"
            >
              <!-- size="30px" -->
              <!-- name="svguse:icons/financeTable.svg#image" -->
              <img :src="props.row?.image?.thumbnail" />

              <q-tooltip
                v-if="!!props.row.image.thumbnail"
                anchor="center left"
                self="center right"
                class="q-tooltip-estimates-img"
              >
                <div class="img">
                  <img
                    :src="props.row.image.thumbnail"
                    alt=""
                    style=""
                  />
                </div>
              </q-tooltip>
            </q-icon>

            <!-- :style="{
              'margin-left': !props.row.image.thumbnail
                ? '0 !important'
                : '15px',
            }" -->
            <div class="text">
              {{ props.row.name }}
            </div>
            <q-icon
              v-if="props.row.link"
              color="black"
              style="opacity: 0.2"
              name="svguse:icons/financeTable.svg#copy2"
              size="17px"
              class="td-content-name__copy cursor-pointer"
              :class="{ hide: !props.row.link }"
              @click="goToLink(props.row.link)"
            >
              <q-tooltip
                anchor="bottom middle"
                self="top middle"
                class="q-tooltip-estimates-text"
              >
                <div class="text flex items-center">
                  <q-icon
                    size="10px"
                    name="svguse:icons/allIcons.svg#copyico"
                  />
                  <span class="desc">{{ props.row.link }}</span>
                </div>
              </q-tooltip>
            </q-icon>
          </div>
        </q-td>

        <q-td
          key="room"
          class="--room --room__td"
          :props="props"
          @dblclick="editModal(props.row, 'room_type')"
          @click.stop=""
        >
          <div class="td-content-section">
            <div class="text">
              {{ props.row.room_type }}
            </div>
          </div>
        </q-td>

        <q-td
          key="desc"
          class="--desc --desc__td"
          :props="props"
          @dblclick="editModal(props.row, 'description')"
          @click.stop=""
        >
          <!-- <div class="td-content-section"> -->
          <div class="text">
            {{ props.row.description }}
          </div>
          <!-- </div> -->
        </q-td>

        <q-td
          key="quantity"
          class="--quantity --quantity__td"
          :props="props"
          @dblclick="editModal(props.row, 'quantity')"
          @click.stop=""
        >
          <!-- <div class="td-content-section"> -->
          <div class="text">
            {{ props.row.quantity }}
          </div>
          <!-- </div> -->
        </q-td>

        <q-td
          v-if="level !== 1 && level !== 3"
          key="price"
          class="--price --price__td"
          :props="props"
          @dblclick="editModal(props.row, 'forecast_price')"
          @click.stop=""
        >
          <!-- <div class="td-content-section"> -->
          <div class="text">
            {{ checkSelectedProposal(props.row, "price") }}
          </div>
          <!-- </div> -->
        </q-td>

        <q-td
          v-if="level !== 1 && level !== 3"
          key="term"
          class="--term --term__td"
          :props="props"
          @dblclick="editModal(props.row, 'term_forecast')"
          @click.stop=""
        >
          <!-- <div class="td-content-section"> -->
          <div class="text">
            {{ checkSelectedProposal(props.row, "term") }}
          </div>
          <!-- </div> -->
        </q-td>

        <q-td
          v-if="level !== 1 && level !== 3"
          key="total_price"
          ref="total"
          :props="props"
          class="td-total --total_price --total_price__td"
          @dblclick="editModal(props.row, null)"
          :class="{ open: props.row.smetaVal }"
          @click.stop="
            () =>
              !!props.row?.proposals?.length &&
              !props.row?.deal?.id &&
              openSmeta(
                props.row.id,
                props.row.proposals,
                props.row.smetaVal
              )
          "
        >
          <div class="td-content-section">
            <div class="text">
              {{ checkSelectedProposal(props.row, "total_price") }}
            </div>
            <!-- <div class="total-img"> -->
            <!-- <img v-if="props.row.status.imageUrl && props.row.smeta" :src="props.row.status.imageUrl" alt=""> -->
            <!-- </div> -->
            <q-icon
              v-if="
                !!props.row?.proposals?.length &&
                userRole === 'designer' &&
                !props.row?.deal?.id
              "
              name="svguse:icons/financeTable.svg#miniArrowe"
            />
            <!-- size="12px" -->
          </div>
        </q-td>

        <q-td
          v-if="level !== 1 && level !== 3"
          key="rate"
          class="--rate --rate__td"
          :props="props"
          @dblclick="editModal(props.row, 'rate')"
          @click.stop=""
        >
          <!-- <div class="td-content-section"> -->
          <div class="text">
            {{ checkSelectedProposal(props.row, "rate") }}
          </div>
          <!-- </div> -->
        </q-td>

        <q-td
          v-if="level !== 1 && level !== 3"
          key="fee"
          class="--fee --fee__td"
          :props="props"
          @click.stop=""
          @dblclick="editModal(props.row, null)"
        >
          <!-- <div class="td-content-section"> -->
          <div class="text">
            {{ checkSelectedProposal(props.row, "fee") }}
          </div>
          <!-- </div> -->
        </q-td>

        <q-td
          v-if="userRole !== 'designer' && level !== 1 && level !== 2"
          key="price"
          :props="props"
          @dblclick="editModal(props.row, 'offerprice')"
        >
          <div class="td-content-section">
            <div class="text">
              {{ props.row.my_proposal?.price }}
            </div>
          </div>
        </q-td>

        <q-td
          v-if="userRole !== 'designer' && level !== 1 && level !== 2"
          key="term"
          :props="props"
          @dblclick="editModal(props.row, 'offerprice')"
        >
          <div class="td-content-section">
            <div class="text">
              {{ props.row.my_proposal?.term }}
            </div>
          </div>
        </q-td>

        <q-td
          v-if="userRole !== 'designer' && level !== 1 && level !== 2"
          key="total_price"
          :props="props"
          class="td-total"
          @dblclick="editModal(props.row, 'offerprice')"
        >
          <div class="td-content-section">
            <div class="text">
              {{ props.row.my_proposal?.total_price }}
            </div>
          </div>
        </q-td>

        <q-td
          v-if="userRole !== 'designer' && level !== 1 && level !== 2"
          key="rate"
          :props="props"
          @dblclick="editModal(props.row, 'offerprice')"
        >
          <div class="td-content-section">
            <div class="text">
              {{ props.row.my_proposal?.rate }}
            </div>
          </div>
        </q-td>

        <q-td
          v-if="userRole !== 'designer' && level !== 1 && level !== 2"
          key="fee"
          :props="props"
          @dblclick="editModal(props.row, 'offerprice')"
        >
          <div class="td-content-section">
            <div class="text">
              {{ props.row.my_proposal?.fee }}
            </div>
          </div>
        </q-td>

        <q-td
          key="status"
          class="cursor-pointer --status --status__td"
          :props="props"
          @click.stop=""
        >
          <div class="td-content-section td-content-status">
            <div
              v-if="!props.row?.deal?.status"
              class="status"
            >
              <div
                :class="`circle bg-${colorStatus(props.row.status)}`"
              ></div>
              <div class="desc">{{ props.row.status }}</div>
            </div>

            <div
              v-else
              class="status"
            >
              <div
                :class="`circle bg-${colorStatus(
                  userRole === 'designer'
                    ? props.row.deal.designer_status
                    : props.row.deal.contractor_status,
                  props.row?.deal
                )}`"
              ></div>
              <div class="desc">
                {{
                  userRole === "designer"
                    ? props.row.deal.designer_status
                    : props.row.deal.contractor_status
                }}
                <!-- {{ props.row.deal }} -->
              </div>
            </div>

            <q-avatar
              v-if="
                props.row.selected_proposal.length > 0 &&
                userRole === 'designer'
              "
              class="q-ml-auto"
              size="24px"
            >
              <img
                :src="
                  {
                    ...useFindElement(
                      props.row.selected_proposal,
                      props.row.proposals
                    ),
                  }?.contractor?.image?.url ||
                  {
                    ...useFindElement(
                      props.row.selected_proposal,
                      props.row.proposals
                    ),
                  }?.contractor?.image?.placeholder
                "
              />
            </q-avatar>

            <q-avatar
              v-if="
                userRole === 'contractor' &&
                props.row?.my_proposal?.selected
              "
              class="q-ml-auto"
              size="24px"
            >
              <img
                :src="
                  projectDesigner.image.thumbnail ||
                  projectDesigner.image.placeholder
                "
              />
            </q-avatar>
          </div>
          <q-menu
            anchor="bottom middle"
            self="top middle"
            class="menu-estimate-status"
          >
            <SelectStatus
              v-if="optionsTab"
              :estimate_item_id="props.row.id"
              :status="props.row.status"
              :options="optionsTab"
              :options2="optionsTab2"
              :proposals="props.row.proposals"
              :isSelectedProposal="
                !!props.row.selected_proposal.length
              "
              :isSelectedProposalContractor="!!props.row.my_proposal"
              :selectedProposal="props.row.selected_proposal"
              :deal="props.row.deal"
              :userRole="userRole"
              :projectDesigner="projectDesigner"
              @updateStatus="$emit('updateList')"
              @openEditModal="editModal(props.row, 'offerprice')"
            />
          </q-menu>
        </q-td>

        <q-td
          key="brand"
          :props="props"
          class="td-brand --brand --brand__td"
          @dblclick="editModal(props.row, 'brand')"
          @click.stop=""
        >
          <!-- <div class="td-content-section"> -->
          <div class="text">
            {{ props.row.manufacturer }}
          </div>
          <!-- </div> -->
        </q-td>

        <q-td
          key="code"
          :props="props"
          class="td-code --article --article__td"
          @dblclick="editModal(props.row, 'article')"
          @click.stop=""
        >
          <!-- <div class="td-content-section"> -->
          <div class="text">
            {{ props.row.article }}
          </div>
          <!-- </div> -->
        </q-td>

        <q-td
          key="color"
          :props="props"
          class="td-color --color --color__td"
          @dblclick="editModal(props.row, 'color')"
          @click.stop=""
        >
          <!-- <div class="td-content-section"> -->
          <div class="text">
            {{ props.row.color }}
          </div>
          <!-- </div> -->
        </q-td>

        <q-td
          key="file"
          :props="props"
          class="td-file --file --file__td"
          @click.stop=""
          @dblclick="editModal(props.row, null)"
        >
          <div class="td-content-section">
            <a
              :href="props.row.file?.file"
              target="_blank"
              class="text link"
              v-if="props.row.file.file"
            >
              {{ props.row.file?.extension }},
              {{ props.row.file?.size }}
            </a>
          </div>
        </q-td>
      </q-tr>

      <!-- ___Строка предложения___  -->
      <q-tr
        v-for="smeta in props.row.proposals"
        :key="smeta"
        class="q-tr-smeta"
        v-show="props.row.smetaVal && userRole === 'designer'"
        @click.stop="chooseSmeta(smeta, props.row.proposals)"
        @contextmenu.prevent.stop
        @touchstart.stop
        @touchmove.stop
        @touchend.stop
      >
        <q-td
          key="id"
          class="td-id"
        />
        <q-td
          key="name"
          :props="props"
          class="td-name --name --name__td"
        >
          <div class="td-content-section">
            <div class="name-img">
              <img
                v-if="smeta.contractor?.image"
                :src="
                  smeta.contractor?.image?.url ||
                  smeta.contractor?.image?.placeholder
                "
                alt=""
              />
            </div>
            <div class="text">{{ smeta.contractor?.name }}</div>
          </div>
        </q-td>
        <q-td
          key="room"
          class="td-room"
        />
        <q-td
          key="desc"
          class="td-desc"
        />
        <q-td
          key="quantity"
          :props="props"
        >
          <div class="td-content-section">
            <div class="text">
              {{ props.row.quantity }}
            </div>
          </div>
        </q-td>

        <q-td
          key="price"
          :props="props"
        >
          <div class="td-content-section">
            <div class="text">
              {{ smeta.price }}
            </div>
          </div>
        </q-td>

        <q-td
          key="term"
          :props="props"
        >
          <div class="td-content-section">
            <div class="text">
              {{ smeta.term }}
            </div>
          </div>
        </q-td>

        <q-td
          key="total_price"
          :props="props"
        >
          <div class="td-content-section">
            <div class="text">
              {{ smeta.total_price }}
            </div>
          </div>
        </q-td>

        <q-td
          key="rate"
          :props="props"
        >
          <div class="td-content-section">
            <div class="text">
              {{ smeta.rate }}
            </div>
          </div>
        </q-td>

        <q-td
          key="fee"
          :props="props"
          class="td-agent --fee"
        >
          <div class="td-content-section">
            <div class="text">
              {{ smeta.fee }}
            </div>
          </div>
        </q-td>

        <q-td key="status" />
        <q-td
          key="brand"
          class="td-brand"
        />
        <q-td
          key="code"
          class="td-code --article"
        />
        <q-td
          key="color"
          class="td-color"
        />
        <q-td
          key="file"
          class="td-file"
        />
      </q-tr>

      <q-tr
        class="q-tr-smeta q-tr-smeta-null"
        v-show="props.row.smetaVal"
        v-if="props.row.proposals && userRole === 'designer'"
        @click.stop="
          unChooseSmeta(
            props.row.id,
            props.row?.deal?.status,
            props.row?.deal?.id,
            props.row.proposals
          )
        "
        @contextmenu.prevent.stop
        @touchstart.stop
        @touchmove.stop
        @touchend.stop
      >
        <q-td
          key="id"
          class="td-id"
        />
        <q-td class="td-name --name --name__td">
          <div class="td-content-section">
            <div class="name-img"></div>
            <div class="text">Не выбрано</div>
          </div>
        </q-td>
        <q-td
          key="room"
          class="td-room"
        />
        <q-td
          key="desc"
          class="td-desc"
        />
        <q-td>
          <div class="td-content-section">
            <div class="text">—</div>
          </div>
        </q-td>
        <q-td>
          <div class="td-content-section">
            <div class="text">—</div>
          </div>
        </q-td>
        <q-td>
          <div class="td-content-section">
            <div class="text">—</div>
          </div>
        </q-td>
        <q-td>
          <div class="td-content-section">
            <div class="text">—</div>
          </div>
        </q-td>
        <q-td>
          <div class="td-content-section">
            <div class="text">—</div>
          </div>
        </q-td>
        <q-td>
          <div class="td-content-section">
            <div class="text">—</div>
          </div>
        </q-td>
        <q-td class="td-agent --fee">
          <div class="td-content-section">
            <div class="text">—</div>
          </div>
        </q-td>
        <q-td
          key="brand"
          class="td-brand"
        />
        <q-td
          key="code"
          class="td-code"
        />
        <q-td
          key="color"
          class="td-color"
        />
        <q-td
          key="file"
          class="td-file"
        />
      </q-tr>

      <div class="q-tr-separator"></div>
    </template>
  </q-table>
</template>

<style lang="scss" scoped>
  .estimates-table:deep() {
    th.sort-desc .q-table__sort-icon {
      transform: rotate(-180deg) !important;
    }

    .sorted {
      color: #444444;
      .q-icon {
        opacity: 1;
      }
    }

    .--name {
      max-width: 250px;
      // min-width: 250px;

      .q-icon {
        font-size: 30px;
      }

      .td-content-name {
        gap: 15px;
        width: 100%;
      }

      .text {
        max-width: 250px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .--room {
      max-width: 140px;
      min-width: 140px;
      .text {
        max-width: 140px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .--desc {
      max-width: 350px;
      .text {
        max-width: 350px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .--article {
      max-width: 140px;
      width: 100%;
      .text {
        max-width: 140px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .--total_price {
      // &__th {}
      &__td {
        .q-icon {
          font-size: 12px;
        }
      }
    }
  }

  .th-text--min {
    display: none;
  }

  .th-text {
    background-color: orange;
  }

  // .estimates-table.fullscreen:deep() {
  //   position: fixed;
  //   top: 0;
  //   left: 0;
  //   bottom: 0;
  //   right: 0;
  //   width: 100vw;
  //   height: 100vh;
  //   margin-top: 0;
  //   .q-table__top,
  //   .q-table__middle {
  //     width: auto;
  //     margin: 0 auto;
  //   }

  //   .q-table__middle {
  //     margin: 0 auto;
  //   }

  //   @media print {
  //     margin: 0;
  //     .fullscreen-btn {
  //       display: none;
  //     }
  //   }
  // }

  .sorted:deep() {
    @media (max-width: 772px) {
      margin-top: 0;
    }
  }
</style>
