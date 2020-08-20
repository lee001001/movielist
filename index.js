const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const MOVIES_PER_PAGE = 12
let filterMoves = []
const movies = []
let nowPage = 1
let mode = 'card'

const changeMode = document.querySelector('#change-mode')

const datapanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

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
              <button type="button" class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>
    `
    datapanel.innerHTML = rawHTML
  });

}

//產生一頁12不電影的函式
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML +=
      `
    <li class="page-item"><a class="page-link" href="javascript:" data-page="${page}">${page}</a></li>
    `
  }
  paginator.innerHTML = rawHTML

}
//page函式產生
function getMoviesByPage(page) {
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  const data = filterMoves.length ? filterMoves : movies


  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

//mode模式選擇
function displaydataList() {
  const movieList = getMoviesByPage(nowPage)
  mode === 'card' ? renderMovieCardList(movieList) : renderListMode(movieList)
}
//movieModal製作
function showMovieModal(id) {

  const modalTitle = document.querySelector('#movie-modal-title')
  const modalData = document.querySelector('#movie-modal-data')
  const modalDescription = document.querySelector('#movie-modal-description')
  const modalImage = document.querySelector('#movie-modal-image')

  axios
    .get(INDEX_URL + id)
    .then((res) => {
      const data = res.data.results
      modalTitle.innerText = data.title
      modalData.innerText = 'Release Data: ' + data.release_date
      modalDescription.innerText = data.description
      modalImage.innerHTML = `
      <img
                src="${POSTER_URL + data.image}"
                class="card-img-top" alt="Movie Poster"  class="img-fluid" />
      `
    })
}

//增加收藏電影清單函式
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)

  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

//增設list模式的渲染畫面
function renderListMode(data) {
  let rawHTML = `<table class="table"><tbody>`
  data.forEach((item) => {
    rawHTML += ` <tr>
    <td>  
        <h5 class="card-title">${item.title} </h5>
    </td>
    <td>
       <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
    </td>
    </tr>
    `
  })
  rawHTML += `</tbody></table>`
  datapanel.innerHTML = rawHTML
}
//datapanel監聽器
datapanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})
//paginator監聽器
paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return

  nowPage = Number(event.target.dataset.page)
  displaydataList()
})



//searchbar的監聽器
searchForm.addEventListener('submit', function onSearchFormSubmited(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  filterMoves = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )
  if (filterMoves.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }

  //renderPaginator(filterMoves.length)
  //renderMovieCardList(getMoviesByPage(1))
  nowPage = 1
  displaydataList()

})

//list add listener
changeMode.addEventListener('click', function onModeClick(event) {
  if (event.target.matches('#list-Mode')) {
    mode = 'list'
  } else if (event.target.matches('#card-Mode')) {
    mode = 'card'
  }
  displaydataList()
})




axios
  .get(INDEX_URL)
  .then((res) => {
    movies.push(...res.data.results)
    renderPaginator(movies.length)
    displaydataList()
  })
  .catch((err) =>
    console.log(err))

