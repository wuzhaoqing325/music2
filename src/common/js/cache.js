import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200

// 将数据插入数组的第一个位置，并删除本来存在的
function insertArray (arr, val, compare, maxLen) {
  // 在数组中找到该值的位置
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    // 删除该位置的值
    arr.splice(index, 1)
  }
  // 在数组开头插入这个值
  arr.unshift(val)
  if (maxLen && maxLen < arr.length) {
    arr.pop()
  }
}

// 从数组中删除符合要求的数据
function deleteFromArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

// 在storage中插入query值
export function saveSearch (query) {
  // 如果storage中有SEARCH_KEY，则返回，否则返回[]
  let searches = storage.get(SEARCH_KEY, [])

  insertArray(searches, query, item => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 从storage中删除插入query值
export function deleteSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])

  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 清空搜索历史
export function clearSearch () {
  storage.remove(SEARCH_KEY)
  return []
}

// 从storage中获取搜索历史
export function loadSearch () {
  return storage.get(SEARCH_KEY, [])
}

// 保存播放的歌曲
export function savePlay (song) {
  let songs = storage.get(PLAY_KEY, [])

  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, PLAY_MAX_LENGTH)

  storage.set(PLAY_KEY, songs)
  return songs
}

// 加载播放过的歌曲
export function loadPlay () {
  return storage.get(PLAY_KEY, [])
}

// 保存喜欢的歌曲
export function saveFavorite (song) {
  let songs = storage.get(FAVORITE_KEY, [])

  insertArray(songs, song, item => {
    return item.id === song.id
  }, FAVORITE_MAX_LENGTH)

  storage.set(FAVORITE_KEY, songs)
  return songs
}

// 删除喜欢的歌曲
export function deleteFavorite (song) {
  let songs = storage.get(FAVORITE_KEY, [])

  deleteFromArray(songs, item => {
    return item.id === song.id
  })

  storage.set(FAVORITE_KEY, songs)
  return songs
}

// 加载喜欢的歌曲
export function loadFavorite () {
  return storage.get(FAVORITE_KEY, [])
}
