// nodemon .\projects\sort-playlist-songs\sort.test.js

const initSort = require('./sort')
const sortFn = initSort({
  sort: [
    'albumname',
    'albumsongs'
  ]
})

const songs = [
  { id: 'B1', name: "B1", al: { name: 'A1', songs: [{ id: 'A1' }, { id: 'B1' }, { id: 'C1' }] } },
  { id: 'C1', name: "C1", al: { name: 'A1', songs: [{ id: 'A1' }, { id: 'B1' }, { id: 'C1' }] } },
  { id: 'A1', name: "A1", al: { name: 'A1', songs: [{ id: 'A1' }, { id: 'B1' }, { id: 'C1' }] } },

  { id: 'C2', name: "C2", al: { name: 'A2', songs: [{ id: 'C2' }, { id: 'B2' }, { id: 'A2' }] } },
  { id: 'B2', name: "B2", al: { name: 'A2', songs: [{ id: 'C2' }, { id: 'B2' }, { id: 'A2' }] } },
  { id: 'A2', name: "A2", al: { name: 'A2', songs: [{ id: 'C2' }, { id: 'B2' }, { id: 'A2' }] } },
  { id: 'D2', name: "D2", al: { name: 'A2', songs: [{ id: 'C2' }, { id: 'B2' }, { id: 'A2' }] } },
]

songs.sort(sortFn)

console.log(songs)