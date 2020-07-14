<template>
  <div id="app">
    <input v-model="src" style="width:100%" />
    <pdf class="editor" :src="src" />
  </div>
</template>

<script>
import pdf from '@/components/VuePdf.js'

export default {
  name: 'app',
  components: {
    pdf,
  },
  data() {
    return {
      src: require('!file-loader?name=[name].[ext]!./assets/sample.pdf'),
    }
  },
}
</script>

<style>
body {
  background: lightgray;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: white;
  width: 800px;
  padding: 50px;
  border-radius: 15px;
  margin: auto;
  margin-top: 100px;
}
.editor {
  width: 800px;
  height: 400px;
  border: 2px solid #2c3e50;
}
</style>
