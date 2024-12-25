<template>
  <div class="nodate-section">
    <div class="nodate">
      <div class="circle">
        <img src="~/assets/no-date.svg" alt="no data">
      </div>
      <div class="text">
        {{text || 'Нет данных'}}
      </div>
    </div>
  </div>

</template>

<script>

export default {
  props: {
    text: String
  },
  setup() {

  },
}
</script>
