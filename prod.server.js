const express = require('express')
const config = require('./config/index')
const axios = require('axios')

let app = express()

const ReqHeader = {
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
      }

// 获取推荐页面的歌单
      app.get('/api/getDiscList', function(req, res){
        const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'

        //修改请求头获取数据
        axios.get(url, {
          headers: {
            referer: ReqHeader.referer,
            host: ReqHeader.host
          },
          params: req.query
        }).then((response) => {
          // 获取到数据并以json格式返回
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })

      // 获取推荐页面的歌单
      app.get('/api/getSongVkey', function(req, res){
        const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
        //修改请求头获取数据
        axios.get(url, {
          headers: {
            referer: ReqHeader.referer,
            host: ReqHeader.host
          },
          params: req.query
        }).then((response) => {
          // 获取到数据并以json格式返回
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })

      // 获取歌词
      app.get('/api/lyric', function(req, res){
        const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
        //修改请求头获取数据
        axios.get(url, {
          headers: {
            referer: ReqHeader.referer,
            host: ReqHeader.host
          },
          params: req.query
        }).then(response => {
          var ret = response.data
          if (typeof ret === 'string') {
            var reg = /^\w+\(({[^()]+})\)$/
            var matches = ret.match(reg)
            if (matches) {
              ret = JSON.parse(matches[1])
            }
          }
          res.json(ret)
        }).catch(e => {
          console.log(e)
        })
      })

      // 热门推荐歌单的详情
      app.get('/api/getSongList', function(req, res){
        const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'

        //修改请求头获取数据
        axios.get(url, {
          headers: {
            referer: ReqHeader.referer,
            host: ReqHeader.host
          },
          params: req.query
        }).then((response) => {
          // 获取到数据并以json格式返回
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })

      // 获取搜索结果
      app.get('/api/getSearch', function(req, res){
        const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

        //修改请求头获取数据
        axios.get(url, {
          headers: {
            referer: ReqHeader.referer,
            host: ReqHeader.host
          },
          params: req.query
        }).then((response) => {
          // 获取到数据并以json格式返回
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })

app.use(express.static('./dist'))

var port = process.env.PORT || config.build.port

module.exports = app.listen(port, function(err){
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost' + port + '\n')
})
