<script setup>
  import { computed } from "vue";
  import { useDefineDevice } from "src/composable/useDefineDevice";

  const { isMobile } = useDefineDevice();
  // const isMobile = computed(() => {
  // return !!navigator.userAgent.toLowerCase().match(/mobile/i);
  // });
</script>

<template>
  <footer
    class="footer"
    :style="isMobile ? 'border-top: 1px solid #EAEAEA;' : ''"
  >
    <div class="container">
      <div class="wrapper">
        <!-- <q-separator
        class="separator"
        color="grey-3"
      /> -->
        <div class="title">Партнеры проекта</div>
        <div class="partners-list">
          <a
            class="partner"
            href="https://bomondceramica.ru/"
            target="_blank"
          >
            <img
              src="~assets/partners/partner-bomond-x2.png"
              alt="Bomond"
            />
            <span>открыть сайт</span>
          </a>

          <a
            class="partner"
            href="https://www.vseinstrumenti.ru/"
            target="_blank"
          >
            <img
              src="~assets/partners/partner-vse-instrumenti-x2.png"
              alt="Все инструменты"
            />
            <span>открыть сайт</span>
          </a>

          <a
            class="partner"
            href="https://www.centersvet.ru/"
            target="_blank"
          >
            <img
              src="~assets/partners/partner-centersvet-x2.png"
              alt="Centersvet"
            />
            <span>открыть сайт</span>
          </a>

          <a
            class="partner"
            href="https://www.nobilia-russia.ru/"
            target="_blank"
          >
            <img
              src="~assets/partners/partner-nobilia-x2.png"
              alt="Nobilia"
            />
            <span>открыть сайт</span>
          </a>
        </div>

        <div class="box --border-bottom">
          <div class="license">
            2024 © ООО «ЦРМД», лицензия №8156321-24
          </div>

          <div class="support lg-visible">
            техподдержка:
            <a
              href="mailto:support@crmd24.ru"
              target="_blank"
              >support@crmd24.ru</a
            >
          </div>
        </div>

        <div class="box --box-two">
          <div class="social-list">
            <a
              class="social-item"
              href=""
              target="_blank"
            >
              <img
                src="~assets/telegram.svg"
                alt="Telegram"
              />
            </a>

            <a
              class="social-item"
              href=""
              target="_blank"
            >
              <img
                src="~assets/h-icon.svg"
                alt=""
              />
            </a>

            <a
              class="social-item"
              href=""
              target="_blank"
            >
              <img
                src="~assets/vk.svg"
                alt=""
              />
            </a>

            <a
              class="social-item"
              href=""
              target="_blank"
            >
              <img
                src="~assets/vc-icon.svg"
                alt=""
              />
            </a>
          </div>

          <div class="policy">
            <a href="#">политика обработки персональных данных </a>
          </div>

          <div class="support mb-visible">
            техподдержка:
            <a
              href="mailto:support@crmd24.ru"
              target="_blank"
            >
              support@crmd24.ru
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
  @import "src/css/components/footer.scss";
</style>
