import { directive } from 'vue'

export default ({ app }) => {
  app.directive('number-only', {
    beforeMount(el) {
      el.type = 'text';
      el.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/[^0-9]/g, '')
      });
    },
  });
}
