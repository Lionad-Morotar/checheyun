// nodemon .\projects\sort-playlist-songs\sort.test.js

const initSort = require('./sort')
const sortFn = initSort({
  // sort: 'name'
  // sort: 'name-dec'
  // sort: 'albumname'
  // sort: 'albumname-dec'
  // sort: 'pop'
  // sort: 'pop-dec'
  sort: ['alia', 'pop-dec', 'albumname', 'name-dec']
})

const songs = [
  { name: "Auger", al: { name: 'A' }, alia: null, pop: 88 },
  { name: "Dhocolate", al: { name: 'A' }, alia: null, pop: 64 },
  { name: "Chocolate", al: { name: 'B' }, alia: null, pop: 28 },
  { name: "Burger", al: { name: 'B' }, alia: null, pop: 31 },
  { name: "ShitA", al: { name: 'D' }, alia: ['c'], pop: 0 },
  { name: "ShitC", al: { name: 'D' }, alia: ['b'], pop: 0 },
  { name: "ShitB", al: { name: 'D' }, alia: ['a'], pop: 0 },
  { name: "ShitA", al: { name: 'B' }, alia: null, pop: 0 },
  { name: "ShitB", al: { name: 'B' }, alias: null, pop: 0 },
  { name: "ShitA", al: { name: 'A' }, alias: null, pop: 0 },
  { name: "ShitB", al: { name: 'A' }, alias: null, pop: 0 },
]

songs.sort(sortFn)

console.log(songs)