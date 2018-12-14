<template>
  <div id="app">
    <Canvas :dotsNum='dotsNum'></Canvas>
    <transition>
    <router-view/>
    </transition>
  </div>
</template>

<script>
import Canvas from './components/Canvas';
export default {
  name: 'App',
  components : {
    Canvas
  },
  data () {
    return {
      'dotsNum' : 25
    }
  }
}
</script>

<style>
canvas{
   -webkit-filter: blur(2px);
            -moz-filter: blur(2px);
            -ms-filter: blur(2px);
            -o-filter: blur(2px);
            filter: blur(2px);
            filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=4, MakeShadow=false);
}
</style>
