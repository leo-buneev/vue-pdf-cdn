# vue-pdf-cdn

[PDF.js](https://mozilla.github.io/pdf.js/) is very advanced JS library for parsing and displaying PDF files by Mozilla. This project aims to provide simple and lightweight Vue.js component, that downloads library files lazily from cdn with minimal setup.

Similar projects:

* [vue-pdf](https://www.npmjs.com/package/vue-pdf/) - includes PDF.js files into your bundle with webpack. Sometimes this may be undesirable because:
    * it may require additional webpack [configuration](https://github.com/FranckFreiburger/vue-pdf/issues/13)
    * webpack processing can lead to [issues](https://github.com/FranckFreiburger/vue-pdf/issues/140)
    * latest webpack has a [bug](https://github.com/FranckFreiburger/vue-pdf/issues/97) in development mode with worker files
    * it will increase bundle size (pdf.js viewer + worker = about 800 kb) and build time.

## Install

```bash
yarn add vue-pdf-cdn
# or
npm install vue-pdf-cdn
```

## Usage

```vue
<template>
  <pdf
    src="./static/relativity.pdf"
  />
</template>

<script>
import pdf from 'vue-pdf-cdn'

export default {
  components: {
    pdf
  },
}
</script>
```

### Props

- `src` - URL of PDF file to load and display

## Author

**vue-pdf-cli**. Released under the [MIT](./LICENSE) License.

Authored and maintained by [leo-buneev](https://github.com/leo-buneev/) and contributors. Huge thanks to [FranckFreiburger](https://github.com/FranckFreiburger/) for initial webpack version.
