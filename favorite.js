const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const datapanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

//製作movies的容器
const movies = JSON.parse(localStorage.getItem('favoriteMovies'))

//movieModal製作
function showMovieModal(id) {
  const movieModdalTitle = document.querySelector('#movie-modal-title')
  const movieModalData = document.querySelector('#movie-modal-data')
  const movieModalDescription = document.querySelector('#movie-modal-description')
  const movieModdalimage = document.querySelector('#movie-modal-image')

  axios
    .get(INDEX_URL + id)
    .then((res) => {
      const data = res.data.results
      movieModdalTitle.innerText = data.title
      movieModalData.innerText = 'release data: ' + data.release_date
      movieModalDescription.innerText = data.description
      movieModdalimage.innerHTML = `
      <img
                src="${POSTER_URL + data.image}"
                class="card-img-top" alt="Movie Poster"  class="img-fluid" />
      `
    })

}

function renderMovieCardList(data) {
  let rawHTML = ''

  data.forEach((item) => {
    //title , image
    rawHTML += `
    <div class="col-sm-3">
        <div class="mb-2">
          <div class="card" style="width: 18rem;">
            <img
              src="${POSTER_URL + item.image}"
              class="card-img-top" alt="Movie Poster" />
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">More
              </button>
              <button type="button" class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
            </div>
          </div>
        </div>
      </div>
    `
    datapanel.innerHTML = rawHTML
  });

}

function removieFormfavorite(id) {
  if (!movies) return

  const movieIndex = movies.findIndex((movie) => movie.id === id)
  if (movieIndex === -1) return

  movies.splice(movieIndex, 1)

  localStorage.setItem('favoriteMovies', JSON.stringify(movies))

  renderMovieCardList(movies)
}

//監聽器
datapanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removieFormfavorite(Number(event.target.dataset.id))
  }
})

renderMovieCardList(movies)


