import axios from 'axios'
import {commonParams} from './config'

export function getMusicSource (mid) {
  const url = '/api/getSongVkey'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    filename: 'C400' + mid + '.m4a',
    guid: 2180150330,
    platform: 'yqq',
    loginUin: 0,
    hostUin: 0,
    needNewCode: 0,
    format: 'json',
    cid: 205361747,
    uin: 0
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getLyric (mid) {
  const url = '/api/lyric'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    pcachetime: +new Date(),
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    g_tk: 67232076,
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
