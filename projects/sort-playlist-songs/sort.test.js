// nodemon .\projects\sort-playlist-songs\sort.test.js

console.log('\n')

const initSort = require('./sort')
const sortFn = initSort({
  sort: [
    'albumname-is(Ame)',
    'albumname'
  ]
})

const songs = [
  { id: 'B1', name: "B1", al: { name: 'A1', songs: [{ id: 'A1' }, { id: 'B1' }, { id: 'C1' }] } },
  { id: 'A1', name: "A1", al: { name: 'A1', songs: [{ id: 'A1' }, { id: 'B1' }, { id: 'C1' }] } },
  { id: 'D2', name: "D2", al: { name: 'America', songs: [{ id: 'C2' }, { id: 'B2' }, { id: 'A2' }] } },
  { id: 'B2', name: "B2", al: { name: 'A2', songs: [{ id: 'C2' }, { id: 'B2' }, { id: 'A2' }] } },
  { id: 'D2', name: "D2", al: { name: 'Ame', songs: [{ id: 'C2' }, { id: 'B2' }, { id: 'A2' }] } },
  { id: 'C2', name: "C2", al: { name: 'A2', songs: [{ id: 'C2' }, { id: 'B2' }, { id: 'A2' }] } },
  { id: 'D1', name: "D1", al: { name: 'Ame', songs: [{ id: 'C2' }, { id: 'B2' }, { id: 'A2' }] } },
  { id: 'C1', name: "C1", al: { name: 'A1', songs: [{ id: 'A1' }, { id: 'B1' }, { id: 'C1' }] } },
  { id: 'A2', name: "A2", al: { name: 'A2', songs: [{ id: 'C2' }, { id: 'B2' }, { id: 'A2' }] } },
]

songs.sort(sortFn)

console.log(songs)