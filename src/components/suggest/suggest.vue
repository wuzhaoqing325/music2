<template>
  <scroll ref="suggest"
          class="suggest"
          :data="result"
          :pullup="pullup"
          @scrollToEnd="searchMore"
          :beforeScroll="beforeScroll"
          @beforeScroll="listScroll"
          >
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item, index) in result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore"></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>
<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {search} from 'api/search'
import {ERR_OK} from 'api/config'
import {getMusicSource} from 'api/song'
import {createSong} from 'common/js/song'
import Singer from 'common/js/singer'
import {mapMutations, mapActions} from 'vuex'
import NoResult from 'base/no-result/no-result'

const PERPAGE = 20
const TYPE_SINGER = 'singer'

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      page: 1,
      result: [],
      Lresult: [], // 避免因异步造成的数组为空清空
      pullup: true, // 需要下拉刷新
      hasMore: true, // 可以加载更多
      beforeScroll: true
    }
  },
  methods: {
    search () {
      this.page = 1
      this.hasMore = true
      this.result = []
      this.$refs.suggest.scrollTo(0, 0)

      search(this.query, this.page, this.showSinger, PERPAGE).then(res => {
        let num1 = res.indexOf('(')
        let num2 = res.lastIndexOf(')')
        let resultData = JSON.parse(res.substring(num1 + 1, num2))

        if (resultData.code === ERR_OK) {
          this._genResult(resultData.data)
          this._checkMore(resultData.data)
        }
      })
    },
    searchMore () {
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.showSinger, PERPAGE).then(res => {
        let num1 = res.indexOf('(')
        let num2 = res.lastIndexOf(')')
        let resultData = JSON.parse(res.substring(num1 + 1, num2))

        if (resultData.code === ERR_OK) {
          this._genResult(resultData.data)
          this._checkMore(resultData.data)
        }
      })
    },
    selectItem (item) {
      if (item.type === TYPE_SINGER) {
        let singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
      this.$emit('select')
    },
    refresh () {
      this.$refs.suggest.refresh()
    },
    listScroll () {
      this.$emit('listScroll')
    },
    getIconCls (item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName (item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    _checkMore (data) {
      const song = data.song
      if (!song.list.length || (song.curnum + song.curpage * PERPAGE) > song.totalnum) {
        // 如果所有结果全部显示出来就置为 false
        this.hasMore = false
      }
    },
    _genResult (data) {
      if (data.zhida && data.zhida.singerid) {
        this.result.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      if (data.song) {
        this.Lresult = this._normalizeSongs(data.song.list)
      }
    },
    _normalizeSongs (list) {
      let ret = []

      list.forEach(musicData => {
        if (musicData.songid && musicData.albummid) {
          getMusicSource(musicData.songmid).then(res => {
            if (res.code === ERR_OK) {
              const songVkey = res.data.items[0].vkey
              ret.push(createSong(musicData, songVkey))
            }
          })
        }
      })
      return ret
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query () {
      this.search()
    },
    Lresult (newValue) {
      let newV = newValue[newValue.length - 1]
      if (newV) {
        this.result.push(newV)
      }
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.suggest
  height: 100%
  overflow: hidden
  .suggest-list
    padding: 0 30px
    .suggest-item
      display: flex
      align-items: center
      padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^='icon-']
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
</style>
