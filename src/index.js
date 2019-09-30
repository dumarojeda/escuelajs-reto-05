const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://rickandmortyapi.com/api/character/';

window.localStorage.clear()

const getData = api => {
  fetch(api)
    .then(response => response.json())
    .then(response => {
      const characters = response.results;
      let output = characters.map(character => {
        return `
      <article class="Card">
        <img src="${character.image}" />
        <h2>${character.name}<span>${character.species}</span></h2>
      </article>
    `
      }).join('');
      let newItem = document.createElement('section');
      newItem.classList.add('Items');
      newItem.innerHTML = output;
      $app.appendChild(newItem);
      const nextFetch = response.info.next;
      localStorage.setItem('next_fetch', nextFetch);
    })
    .catch(error => console.log(error));
}

const loadData = async () => {
  try {
    const nextFetch = localStorage.getItem('next_fetch');
    const urlAPI = nextFetch != null ? nextFetch : API;
    if (localStorage.getItem('next_fetch') == "") {
      localStorage.removeItem('next_fetch');
    }
    await getData(urlAPI);
  } catch(error) {
    console.log(error);
  }
}

const intersectionObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    loadData();
  }
}, {
  rootMargin: '0px 0px 100% 0px',
});

intersectionObserver.observe($observe);