import { createApi } from 'unsplash-js';
import ImageModel from 'src/services/ImageModel';
import keywords from 'src/assets/keywords.json';
import keymap from 'src/assets/keymap.json';

class MediaService {
  constructor() {
    if (MediaService.instance) {
      // eslint-disable-next-line no-constructor-return
      return MediaService.instance;
    }
    MediaService.instance = this;
    this.apiKeyImage = 'astxCAepblSMvAuAhLX_EKInuPRA_7P_O8tdscx1uQg';
    this.media = {};
    this.keymap = keymap;

    this.unsplash = createApi({
      accessKey: this.apiKeyImage,
    });
  }

  async loadMedia(count = 0) {
    if (count) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < count; i++) {
        const name = keywords[i];
        // eslint-disable-next-line no-await-in-loop
        await this.fetchImages(name);
      }
      return;
    }
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < keywords.length; i++) {
      const name = keywords[i];
      // eslint-disable-next-line no-await-in-loop
      await this.fetchImages(name);
    }
  }

  getKeywordFromKey(key) {
    if (!key) {
      return null;
    }
    return this.keymap[key];
  }

  // eslint-disable-next-line class-methods-use-this
  getRandomKeyword() {
    return keywords[Math.floor(Math.random() * keywords.length)];
  }

  async fetchImages(keyword = '', page = 1) {
    const { response = {} } = await this.unsplash.search.getPhotos({
      query: keyword,
      page,
      perPage: 15,
    });
    const { results = [], total_pages: totalPages } = response;

    this.media[keyword] = results.map(
      (image) => {
        const i = new ImageModel(image);
        if (i.getLikes() > 6) {
          return i;
        }
        return null;
      },
    ).filter((e) => e);

    if (this.getMediaCount(keyword) < 7 && page < totalPages) {
      this.fetchImages(keyword, (page + 1));
    }
  }

  getMediaCount(keyword) {
    if (!this.media[keyword]) { return 0; }
    return Object.keys(this.media[keyword]).length;
  }

  getItem(keyword) {
    console.log(keyword, ':', this.media[keyword]);
    if (!this.media[keyword]) {
      return {};
    }

    const index = this.getRandomNumber(0, this.getMediaCount(keyword) - 1);

    let audioFile = null;
    try {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      audioFile = require(`/sounds/${keyword}.wav`);
    } catch (e) {
      audioFile = null;
      console.error(e);
    }

    return {
      image: this.media[keyword][index] ? new ImageModel(this.media[keyword][index]) : null,
      sound: audioFile ? new Audio(audioFile) : null,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

export default MediaService;
