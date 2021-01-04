const config = {
  MUSIC_U: `1e3c825fa822e0963d487d9a1da0b01a35b02604a2d2a074ff362cf95085abdf33a649814e309366`,
  CSRF: `AiKOa7_2EpWEeg_1teN0488I`
}

const Expires = `Thu, 12-Jan-2021 18:10:43 GMT`
const cookie = [
  {MUSIC_U: config.MUSIC_U},
  {Expires},
  {Path: `/;__remember_me=true`},
  {Expires},
  {Path: `/;__csrf=${config.CSRF}`},
  {Expires},
  {Path: `/`},
].reduce((s, c) => {
  const [k, v] = Object.entries(c)[0]
  s.push(`${k}=${v}`)
  return s
}, []).join('; ')

module.exports = cookie