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
    let limiter = keywords.length;
    if (count) {
      limiter = count;
    }
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < limiter; i++) {
      const name = keywords[i];
      if (this.getImagesFromStore(name)) {
        // eslint-disable-next-line no-continue
        continue;
      }
      // eslint-disable-next-line no-await-in-loop
      await this.fetchImages(name);
      this.storeKeywordAndImage(name, this.media[name]);
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

  // eslint-disable-next-line class-methods-use-this
  storeKeywordAndImage(keyword, images) {
    localStorage[keyword] = JSON.stringify(images);
  }

  // eslint-disable-next-line class-methods-use-this
  getImagesFromStore(keyword) {
    if (localStorage[keyword]) {
      try {
        return JSON.parse(localStorage[keyword]);
      } catch {
        return null;
      }
    }
    return null;
  }

  getImageFromStore(keyword, index) {
    const images = this.getImagesFromStore(keyword);
    if (!Array.isArray(images)) {
      return null;
    }
    return images[index];
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

  // eslint-disable-next-line class-methods-use-this
  getAudioFile(keyword) {
    try {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      const audioFile = require(`/sounds/${keyword}.wav`);
      return new Audio(audioFile);
    } catch (e) {
      return null;
    }
  }

  getItem(keyword) {
    console.log(keyword, ':', this.getImagesFromStore(keyword));
    if (!this.getImagesFromStore(keyword)) {
      return {};
    }

    const index = this.getRandomNumber(0, this.getMediaCount(keyword) - 1);
    const audioFile = this.getAudioFile(keyword);
    const image = this.getImageFromStore(keyword, index);
    return {
      image: new ImageModel(image),
      sound: audioFile,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

export default MediaService;
