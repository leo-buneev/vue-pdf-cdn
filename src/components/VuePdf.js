import { h } from 'vue'
import externalScriptLoader from '@/services/externalScriptLoader.js'

export default {
  name: 'VuePdf',
  props: {
    src: {
      type: String,
      default: '',
    },
  },
  mounted() {
    this.init()
  },
  watch: {
    src() {
      this.loadFile()
    },
  },
  methods: {
    cleanup() {
      if (this._pdf) {
        this._pdf.cleanup()
        this._pdf.destroy()
        this._pdf = null
      }
      if (this._page) {
        this._page.cleanup()
        this._page._destroy()
        this._page = null
      }
    },
    async init() {
      try {
        this.$emit('status', 'Initializing PDF viewer...')
        this.$emit('loading', true)
        await externalScriptLoader.ensureScriptIsLoaded(getDefaultCdnUrl())
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = getDefaultCdnUrl('pdf.worker')
        this.loadFile()
      } catch (e) {
        this.$emit('error', { message: 'Error during initializing PDF viewer', e })
        console.error('Failure during loading PDF.js:', e)
      }
    },
    async loadFile() {
      if (this._loadingPromise) await this._loadingPromise

      const newPromise = this.loadFileInner()
      this._loadingPromise = newPromise
      await newPromise
      if (this._loadingPromise === newPromise) {
        this._loadingPromise = null
      }
    },
    async loadFileInner() {
      if (this._loadingPromise) await this._loadingPromise
      this.cleanup()
      if (!this.src) return
      try {
        this.$emit('loading', true)
        this.$emit('status', 'Downloading document...')
        const loadingTask = window.pdfjsLib.getDocument(this.src)
        this._pdf = await loadingTask.promise
        this._pageNum = 1
        await this.renderPage(this._pageNum)
        this.$emit('status', 'Rendering document...')
        this.$emit('status', 'Render complete!')
      } catch (e) {
        this.$emit('error', { message: 'Error during displaying PDF file', e })
        console.error('Failure during downloading PDF file:', e)
      }
      this.$emit('loading', false)
    },
    async renderPage(pageNum) {
      this._page = await this._pdf.getPage(pageNum)

      const desiredWidth = this.$el.clientWidth
      const viewport = this._page.getViewport({ scale: 1 })

      const scale = desiredWidth / viewport.width
      const scaledViewport = this._page.getViewport({ scale })

      const canvas = this.$refs.canvas
      canvas.height = scaledViewport.height
      canvas.width = scaledViewport.width
      const renderTask = this._page.render({
        canvasContext: canvas.getContext('2d'),
        viewport: scaledViewport,
      })
      await renderTask.promise
    },
    async prevPage() {
      if (this._pageNum <= 1) {
        return
      }
      this._pageNum--
      await this.renderPage(this._pageNum)
    },
    async nextPage() {
      if (this._pageNum >= this._pdf.numPages) {
        return
      }
      this._pageNum++
      await this.renderPage(this._pageNum)
    },
  },
  beforeUnmount() {
    this.cleanup()
  },
  render() {
    return h('div', { style: 'position: relative; overflow:auto;' }, [
      h('canvas', { style: { display: 'block', width: '100%' }, ref: 'canvas' }),
    ])
  },
}

function getDefaultCdnUrl(filename) {
  if (!filename) filename = 'pdf'
  return `https://unpkg.com/pdfjs-dist@2.12.313/legacy/build/${filename}.min.js` // version for older browsers
}
