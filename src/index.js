import notiflix from 'notiflix';
import simpleLightbox from 'simplelightbox';
import axios from 'axios';
import 'simplelightbox/dist/simple-lightbox.min.css';

{
  /* <div class="photo-card">
  <img src="" alt="" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
    </p>
    <p class="info-item">
      <b>Views</b>
    </p>
    <p class="info-item">
      <b>Comments</b>
    </p>
    <p class="info-item">
      <b>Downloads</b>
    </p>
  </div>
</div> */
}
const gallery = new simpleLightbox('.gallery a');
const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};
const options = {
  key: '35247851-438fd9775b2d9df55636ff8fe',
  page: 1,
  q: '',
  getLink: () => {
    return `https://pixabay.com/api/?key=${options.key}&q=${options.q}&image_type=photo&orientation=horizontal&safesearch=true&page=${options.page}&per_page=40`;
  },
  makeItEasy: response => {
    options.totalHits = response.data.totalHits;
    return response.data.hits
      .map(
        x => `<div class="photo-card">
  <a href="${x.largeImageURL}"><img src="${x.previewURL}" alt="${x.tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b> ${x.likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${x.views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${x.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${x.downloads}
    </p>
  </div>
</div>`
      )
      .join('');
  },
  totalHits: 0,
};

refs.btnLoadMore.hidden = true;

refs.form.addEventListener('submit', async e => {
  e.preventDefault();
  options.q = refs.form.elements.searchQuery.value;
  options.page = 1;
  const temp = await axios.get(options.getLink()).then(options.makeItEasy);

  if (!temp) {
    notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    refs.btnLoadMore.hidden = true;
    refs.gallery.innerHTML = '';
    gallery.refresh();
    return;
  }

  refs.gallery.innerHTML = temp;
  refs.btnLoadMore.hidden = false;
  notiflix.Notify.success('Good Boy!');
  gallery.refresh();
});

refs.btnLoadMore.addEventListener('click', async e => {
  if (options.totalHits < 40 * ++options.page) {
    notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    refs.btnLoadMore.hidden = true;
    return;
  }
  refs.gallery.insertAdjacentHTML(
    'beforeend',
    await axios.get(options.getLink()).then(options.makeItEasy)
  );
  gallery.refresh();
});
