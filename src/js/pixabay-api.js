import axios from 'axios';

export default class FetchPhotosByQuery {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '28740603-d15f442ccc7ffe81eab69b930';

  constructor() {
    this.page = 1;
    this.searchQuery = '';
    this.dataPerPage = 40;
    this.totalHits = null;
  }

  async fetchPhotosByQuery() {
    const request = await axios.get(`${this.#BASE_URL}`, {
      params: {
        image_type: this.photo,
        orientation: this.horizontal,
        safesearch: this.true,
        page: this.page,
        per_page: this.dataPerPage,
        q: this.searchQuery,
        key: this.#API_KEY,
      },
    });
    this.incrementPage();
    return request;
  }
  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
  isNextDataExsist() {
    return this.page * this.dataPerPage <= this.totalHits;
  }

  get query() {
    return this.searchQuery;
  }
  set query(newquery) {
    this.searchQuery = newquery;
  }
}
