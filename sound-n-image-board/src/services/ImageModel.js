class ImageModel {
  constructor(props = {}) {
    this.likes = props.likes;
    this.urls = props.urls;
  }

  getPath() {
    return this.urls?.small ?? '';
  }

  getLikes() {
    return this.likes;
  }
}

export default ImageModel;
