<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    >
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import MediaService from 'src/services/SoundService';

export default defineComponent({
  name: 'IndexPage',
  data() {
    return {
      mediaService: new MediaService(),
    };
  },
  mounted() {
    try {
      // this.mediaService.loadMedia()
      this.mediaService.fetchImages('dog');
    } catch (e) {
      console.error(e);
    }
  },
});
</script>
