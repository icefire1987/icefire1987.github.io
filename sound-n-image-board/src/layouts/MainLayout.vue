<template>
  <q-layout view="lHh Lpr lFf" @keydown="keylistener">
    <q-page-container class="window-height bg-black">
      <div class="flex flex-center full-height">
        <div>
          <q-spinner-grid
            color="white"
            size="xl"
            v-if="loading"
          />
        </div>
      </div>

        <q-img
          class="fullscreen"
          :src="image"
          spinner-color="white"
          fit="contain"
        ></q-img>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue';
import MediaService from 'src/services/SoundService';

export default defineComponent({
  name: 'MainLayout',

  components: {
  },
  data() {
    return {
      mediaService: new MediaService(),
      pressedKeyword: null,
      loading: false,
    };
  },
  computed: {
    image() {
      if (!this.pressedKeyword) { return null; }
      const image = this.mediaService.getItem(this.pressedKeyword);
      console.log(image, this.pressedKeyword);
      return image ? image.getPath() : null;
    },
  },
  methods: {
    keylistener(event) {
      const { key } = event;
      this.pressedKeyword = this.mediaService.getKeywordFromKey(key);
    },
    async fetchData() {
      try {
        this.loading = true;
        console.log('load');
        await this.mediaService.loadMedia();
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
        console.log('done');
      }
    },
  },
  mounted() {
    this.fetchData();
  },
});
</script>
