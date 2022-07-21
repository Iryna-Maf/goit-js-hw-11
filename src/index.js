import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import templateCard from './templates/gallery-card.hbs';
import fetchPhotosByQuery from './js/pixabay-api';

const searchForm = document.querySelector('#search-form');
const loadMore = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

const fetchSearch = new fetchPhotosByQuery();

searchForm.addEventListener('submit', searchFormSubmit);
loadMore.addEventListener('click', clickLoadMore);

const lightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

async function searchFormSubmit(event) {
  event.preventDefault();
  loadMore.classList.add('is-hidden');
  fetchSearch.query = event.currentTarget.elements.searchQuery.value;
  fetchSearch.resetPage();

  try {
    const response = await fetchSearch.fetchPhotosByQuery();
    console.log('~ response', response);

    if (response.data.hits.length === 0) {
      gallery.innerHTML = '';
      loadMore.classList.add('is-hidden');
      event.target.reset();
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    let totalPhotos = response.data.totalHits;
    Notiflix.Notify.info(`Hooray! We found ${totalPhotos} images`);

    fetchSearch.totalHits = response.data.totalHits;

    gallery.innerHTML = templateCard(response.data.hits);
    if (fetchSearch.isNextDataExsist()) {
      loadMore.classList.remove('is-hidden');
    } else {
      loadMore.classList.add('is-hidden');
    }
    console.log(fetchSearch.isNextDataExsist());
    lightBox.refresh();
  } catch (error) {
    console.log(error);
  }
}

function renderCards(data) {
  const card = templateCard(data);
  gallery.insertAdjacentHTML('beforeend', card);
  lightBox.refresh();
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

async function clickLoadMore(event) {
  try {
    if (!fetchSearch.isNextDataExsist()) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results"
      );
      loadMore.classList.add('is-hidden');
      return;
    }

    const response = await fetchSearch.fetchPhotosByQuery();
    renderCards(response.data.hits);
    smoothScroll();
  } catch (error) {
    console.log(error);
  }
}
