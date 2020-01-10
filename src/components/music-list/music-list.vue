<template>
  <div class="music-list">
    <!-- 返回按钮 -->
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <!-- 标题 -->
    <h1 class="title" v-html="title"></h1>
    <!-- 背景图片 -->
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <!-- 随机播放按钮 -->
      <div class="play-wrapper">
        <div class="play" v-show="songs.length>0" ref="playBtn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <!-- 浮层 -->
      <div class="filter" ref="filter"></div>
    </div>
    <!-- 歌单向上推的时候，黑色的背景 -->
    <div class="bg-layer" ref="layer"></div>
    <scroll class="list"
            ref="list"
            :data="songs"
            :probeType="probeType"
            :listenScroll="listenScroll"
            @scroll="scroll">
      <div class="song-list-wrapper">
        <song-list @select="seletItem" :rank="rank" :songs="songs"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>
<script>
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import Loading from 'base/loading/loading'
import {prefixStyle} from 'common/js/dom'
import {mapActions} from 'vuex'
import {playlistMixin} from 'common/js/mixin'

const transform = prefixStyle('transform')
// const backdrop = prefixStyle('backdrop-filter')

const RESERVED_HEIGHT = 40

export default {
  mixins: [playlistMixin],
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      scrollY: 0
    }
  },
  computed: {
    bgStyle () {
      return `background-image:url(${this.bgImage})`
    }
  },
  mounted () {
    this.imageHeight = this.$refs.bgImage.clientHeight
    // 高度为280
    // console.log(this.imageHeight)
    // this.minTranslateY表示向上移动的距离，是负值
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  },
  created () {
    this.probeType = 3
    this.listenScroll = true
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : 0
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    random () {
      this.randomPlay({
        list: this.songs
      })
    },
    seletItem (item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    back () {
      this.$router.back()
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  watch: {
    scrollY (newY) {
      // 黑色背景,最小不能小于this.minTranslateY
      let translateY = Math.max(this.minTranslateY, newY)
      let zIndex = 0
      let scale = 1
      let blur = 0
      // 歌单滚动多少，黑色背景就滚动多少
      this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`

      const percent = Math.abs(newY / this.imageHeight)
      // 往下拉，图片放大，图片z-index变大
      if (newY > 0) {
        scale = 1 + percent
        zIndex = 10
      } else {
        // 往上推，最大的模糊效果是20px，不能太模糊
        blur = Math.min(20 * percent, 20)
      }
      // 这个方法不行
      // this.$refs.filter.style[backdrop] = `blur(${blur}px)`
      this.$refs.filter.style['backdrop-filter'] = `blur(${blur}px)`
      this.$refs.filter.style['webkitBackdrop-filter'] = `blur(${blur}px)`
      if (newY < this.minTranslateY) {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`

        this.$refs.playBtn.style.display = 'none'
      } else {
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0

        this.$refs.playBtn.style.display = ''
      }
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style[transform] = `scale(${scale})`
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
  }
}
</script>
<style scoped lang="stylus" ref="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.music-list
  position: fixed
  z-index: 100
  top: 0
  left: 0
  bottom: 0
  right: 0
  background: $color-background
  .back
    position: absolute
    top: 0
    left: 6px
    z-index: 50
    .icon-back
      display: block
      padding: 10px
      font-size: $font-size-large
      color: $color-theme
  .title
    position: absolute
    top: 0
    left: 10%
    z-index: 40
    width: 80%
    no-wrap()
    text-align: center
    line-height: 40px
    font-size: $font-size-large
    color: $color-text
  .bg-image
    position: relative
    width: 100%
    height: 0
    padding-top: 70%
    transform-origin: top
    background-size: cover
    .play-wrapper
      position: absolute
      bottom: 20px
      z-index: 50
      width: 100%
      .play
        box-sizing: border-box
        width: 135px
        padding: 7px 0
        margin: 0 auto
        text-align: center
        border: 1px solid $color-theme
        color: $color-theme
        border-radius: 100px
        font-size: 0
        .icon-play
          display: inline-block
          vertical-align: middle
          margin-right: 6px
          font-size: $font-size-medium-x
        .text
          display: inline-block
          vertical-align: middle
          font-size: $font-size-small
    .filter
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      background: rgba(7, 17, 27, 0.4)
  .bg-layer
    position: relative
    height: 100%
    background: $color-background
  .list
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    background: $color-background
    .song-list-wrapper
      padding: 20px 30px
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
