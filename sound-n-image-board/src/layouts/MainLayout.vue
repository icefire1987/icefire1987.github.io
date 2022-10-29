<template>
  <q-layout view="lHh Lpr lFf"
            @keydown="keylistener"
            @click.stop="getRandomKeyword"
  >
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
      image: null,
    };
  },
  computed: {
  },
  methods: {
    getImage() {
      if (!this.pressedKeyword) { return null; }
      const image = this.mediaService.getItem(this.pressedKeyword);
      if (image) {
        this.image = image.getPath();
      }
      return true;
    },
    keylistener(event) {
      const { key } = event;
      this.pressedKeyword = this.mediaService.getKeywordFromKey(key);
    },
    getRandomKeyword() {
      this.pressedKeyword = this.mediaService.getRandomKeyword();
    },
    async fetchData() {
      try {
        this.loading = true;
        console.log('load');
        await this.mediaService.loadMedia(3);
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
  watch: {
    pressedKeyword() {
      this.getImage();
    },
  },
});
</script>
