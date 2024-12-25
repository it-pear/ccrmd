<script setup>
  import { ref, watch, computed, onMounted } from "vue";
  import { useQuasar } from "quasar";
  import { estimatesApi } from "src/api/estimates";
  import { dealsApi } from "src/api/deals";
  import { contractorApi } from "src/api/contractor";
  import { useFindElement } from "src/composable/useFindElement";

  import CardInfo from "src/components/CardInfo.vue";

  const props = defineProps({
    options: Array,
    options2: Array,
    estimate_item_id: String,
    status: String,
    proposals: Array || String,
    isSelectedProposal: Boolean,
    isSelectedProposalContractor: Boolean,
    selectedProposal: Array | String,
    deal: Object | String,
    userRole: String,
    projectDesigner: Object,
  });
  const $q = useQuasar();
  const emit = defineEmits(["updateStatus", "openEditModal"]);

  // Выбранный статус позиции
  const tab = ref(props.status);
  // Выбранный статус сделки
  const tabDealStatus = ref(
    props.userRole === "designer"
      ? props.deal.designer_status
      : props.deal.contractor_status
  );
  // Текущее предложение
  const currentProposal = ref();

  // Выбор статуса позиции
  const setStatusPosition = async (status) => {
    try {
      await estimatesApi.setStatus(props.estimate_item_id, status);
      emit("updateStatus");
      $q.notify({
        color: "positive",
        message: `Статус изменен на: "${status}"`,
        timeout: 1500,
      });
    } catch (err) {
      $q.notify({
        color: "negative",
        message: `${err}`,
      });
      console.error(err.response);
    }
  };

  // Выбор статуса сделки
  const setStatusDeal = async (dealId, status) => {
    try {
      await dealsApi.setStatus(dealId, status);
      emit("updateStatus");
      $q.notify({
        color: "positive",
        message: `Статус изменен на: "${status}"`,
        timeout: 1500,
      });
    } catch (err) {
      console.error(err.response);
    }
  };

  // Создание сделки
  const createDeal = async (estimateItemId, status) => {
    try {
      await dealsApi
        .create(estimateItemId, status)
        .then((res) => res);
      emit("updateStatus");
      tab.value = "";
      $q.notify({
        color: "positive",
        message: `Сделка создана, выбранный статус: "${status}"`,
        timeout: 2000,
      });
    } catch (err) {
      $q.notify({
        color: "negative",
        message: `${err}`,
      });
      console.error(err.response);
    }
  };

  // Удаление сделки
  const deleteDeal = async (dealId) => {
    try {
      await dealsApi.delete(dealId).then((res) => res);
      emit("updateStatus");
      tab.value = "В работе";
      tabDealStatus.value = "";
      $q.notify({
        color: "positive",
        message: "Сделка удалена",
        timeout: 2000,
      });
    } catch (err) {
      $q.notify({
        color: "negative",
        message: `${err}`,
      });
      console.error(err.response);
    }
  };

  const getFullInfoContractor = async (id) => {
    try {
      const resp = await contractorApi.getFullInfo(id);
      console.log("contractorInfo: ", resp);
      // contractorInfo.value = resp;
    } catch (err) {
      console.error(err.response);
    }
  };

  onMounted(async () => {
    // console.log(props.selectedProposal, props.proposals);
    currentProposal.value = useFindElement(
      props.selectedProposal,
      props.proposals
    );

    console.log(
      "selectStatus projectDesigner: ",
      props.projectDesigner
    );
    // console.log(props.proposals);

    if (currentProposal.value?.contractor?.id) {
      console.log(currentProposal.value.contractor.id);
      await getFullInfoContractor(
        // currentProposal.value.contractor.id
        "0ed2babc-cf45-4102-8b50-06cdc934e357"
      );
    }
  });
</script>

<template>
  <div class="select-status--wrapper">
    <div
      v-if="userRole === 'designer'"
      class="item item-position"
    >
      <div class="title">
        Позиция
        <q-btn
          flat
          class="circle-warning-15"
        >
          <q-icon
            name="svguse:icons/allIcons.svg#tooltip"
            color="grey-4"
            size="7px"
          />
          <q-menu
            :offset="[10, 10]"
            anchor="top middle"
            self="bottom middle"
            class="circle-warning-tooltip mb-visible"
            ref="menu"
            width="300px"
          >
            Статус позиции не требует согласования второй стороной, вы
            можете выбрать любой. «Отмена» и «Куплено заказчиком»
            ставят запрет подрядчикам на подачу новых предложений.
          </q-menu>
          <q-tooltip
            max-width="300px"
            anchor="bottom middle"
            self="top middle"
            class="my-tooltip-bottom lg-visible"
          >
            Статус позиции не требует согласования второй стороной, вы
            можете выбрать любой. «Отмена» и «Куплено заказчиком»
            ставят запрет подрядчикам на подачу новых предложений.
          </q-tooltip>
        </q-btn>
      </div>
      <q-tabs
        v-model="tab"
        no-caps
        class="q-tabs-null"
      >
        <q-tab
          v-for="tab in props.options"
          :key="tab"
          :name="tab"
          :label="tab"
          :disable="deal.length !== 0 ? true : false"
          @click="setStatusPosition(tab)"
        />
      </q-tabs>
    </div>

    <div class="item item-deal">
      <div class="title">
        Сделка
        <q-btn
          flat
          class="circle-warning-15"
        >
          <q-icon
            name="svguse:icons/allIcons.svg#tooltip"
            color="grey-4"
            size="7px"
          />
          <q-menu
            :offset="[10, 10]"
            anchor="top middle"
            self="bottom middle"
            class="circle-warning-tooltip mb-visible"
            ref="menu"
            width="300px"
          >
            Заключение сделки это фиксация договоренностей дизайнера и
            подрядчика по данной позиции сметы. Переход в статус
            «Оплачено» будет считать сумму агентских как долг
            подрядчика перед дизайнером.
          </q-menu>
          <q-tooltip
            max-width="300px"
            anchor="bottom middle"
            self="top middle"
            class="my-tooltip-bottom lg-visible"
          >
            Заключение сделки это фиксация договоренностей дизайнера и
            подрядчика по данной позиции сметы. Переход в статус
            «Оплачено» будет считать сумму агентских как долг
            подрядчика перед дизайнером.
          </q-tooltip>
        </q-btn>
        <q-btn
          v-if="deal?.id && deal.status === 'Согласовано'"
          flat
          class="text-grey-5 btn-flat btn-remove"
          padding="0"
          no-caps
          label="Отменить сделку"
          @click="deleteDeal(deal.id)"
        />

        <q-avatar
          v-if="currentProposal"
          class="cursor-pointer estimate-status__img"
        >
          <img
            :src="
              currentProposal.contractor?.image?.url ||
              currentProposal.contractor?.image?.placeholder
            "
            alt="ava"
          />

          <CardInfo
            :anchor="['bottom', 'middle']"
            :self="['top', 'right']"
            :offsetXY="[0, -15]"
            :user="currentProposal.contractor"
          />
        </q-avatar>

        <q-avatar
          v-if="
            userRole === 'contractor' &&
            props.isSelectedProposalContractor
          "
          class="cursor-pointer estimate-status__img"
        >
          <img
            :src="
              props.projectDesigner?.image?.thumbnail ||
              props.projectDesigner?.image?.placeholder
            "
            alt="ava"
          />

          <CardInfo
            :anchor="['bottom', 'middle']"
            :self="['top', 'right']"
            :offsetXY="[0, -15]"
            :user="projectDesigner"
          />
        </q-avatar>
      </div>

      <q-tabs
        v-if="
          isSelectedProposal ||
          (isSelectedProposalContractor &&
            !(userRole === 'contractor' && deal.length === 0))
        "
        v-model="tabDealStatus"
        no-caps
        class="q-tabs-null"
        :disable="tab === 'Отмена'"
      >
        <template v-if="deal.length === 0 && userRole === 'designer'">
          <q-tab
            v-for="el in props.options2"
            :key="el"
            :name="el"
            :label="el"
            @click="createDeal(estimate_item_id, el)"
            :disable="
              tab === 'Отмена' ||
              tab === 'Куплено заказчиком' ||
              userRole === 'contractor'
            "
          >
            <q-btn
              rounded
              unelevated
              no-caps
              padding="4px 18px"
              class="bg-positive my-btn my-btn-14 no-cursor q-ml-xs btn-flat text-white"
              label="подтвердить"
            />
          </q-tab>
        </template>

        <template
          v-else-if="!!deal?.id && props.userRole === 'designer'"
        >
          <q-tab
            v-for="(el, index) in props.options2"
            :key="index"
            :name="el"
            :label="el"
            :disable="!el"
            :class="[
              el === props.deal.contractor_status &&
              el === props.deal.designer_status
                ? 'full-green'
                : el === deal.contractor_status &&
                  deal.turn === props.userRole
                ? 'check-turn'
                : el === deal.contractor_status
                ? 'check'
                : '',
            ]"
            @click="setStatusDeal(deal.id, el)"
          >
            <q-btn
              rounded
              unelevated
              no-caps
              padding="4px 18px"
              class="bg-positive my-btn my-btn-14 no-cursor q-ml-xs btn-flat text-white"
              label="подтвердить"
            />
          </q-tab>
        </template>

        <template
          v-else-if="!!deal?.id && props.userRole === 'contractor'"
        >
          <q-tab
            v-for="(el, index) in props.options2"
            :key="index"
            :name="el"
            :label="el"
            :disable="!el"
            :class="
              el === deal.contractor_status &&
              el === deal.designer_status
                ? 'full-green'
                : el === deal.designer_status &&
                  deal.turn === props.userRole
                ? 'check-turn'
                : el === deal.designer_status
                ? 'check'
                : ''
            "
            @click="setStatusDeal(deal.id, el)"
          >
            <q-btn
              rounded
              unelevated
              no-caps
              padding="4px 18px"
              class="bg-positive my-btn my-btn-14 no-cursor q-ml-xs btn-flat text-white"
              label="подтвердить"
            />
          </q-tab>
        </template>
      </q-tabs>

      <!-- <div
        v-else-if="
          userRole === 'contractor' &&
          isSelectedProposalContractor &&
          deal.length === 0
        "
        class="item-deal-empty"
      >
        <p>
          Чтобы дизайнер мог создать сделку с вами по этой позиции,
          вам нужно подать предложение по цене, сроку и ставке
          агентских. Проверьте, указали ли вы все три эти значения.
        </p>
      </div> -->

      <div
        v-else-if="userRole === 'designer'"
        class="item-deal-empty"
      >
        <p>
          Создать сделку можно с подрядчиком, который подал вам свое
          предложение по цене, сроку и проценту агентских. Чтобы
          подрядчик смог подать вам предложение нужно расшарить ему
          смету.
        </p>
        <p v-if="props.proposals.length">
          Предложений: {{ props.proposals.length }}, выберите одно для
          сделки.
        </p>
        <p v-else>Пока предложений от подрядчиков нет.</p>
      </div>

      <div
        v-else
        class="item-deal-empty"
      >
        <p>
          Чтобы дизайнер мог создать сделку с вами по этой позиции,
          вам нужно подать предложение по цене, сроку и ставке
          агентских. Проверьте, указали ли вы все три эти значения.
        </p>
        <p
          v-if="isSelectedProposalContractor && deal.length === 0"
          class="submit-offer"
          @click="emit('openEditModal')"
        >
          Изменить предложение по цене
        </p>

        <p
          v-else
          class="submit-offer"
          @click="emit('openEditModal')"
        >
          Подать предложение по цене
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .select-status--wrapper {
    display: flex;
    gap: 20px;
    @media (max-width: 770px) {
      flex-wrap: wrap;
      .item-position {
        margin-bottom: 0;
      }
    }
  }

  .submit-offer {
    cursor: pointer;
    color: #6c5dd3;
    font-weight: 400;
    font-size: 12px;
  }
</style>
