const promisesMap = {}
const loadedScripts = {}

export default {
  ensureScriptIsLoaded(url) {
    if (loadedScripts[url]) return
    if (promisesMap[url]) return promisesMap[url]

    const promise = new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script')
      const installTimeoutId = window.setTimeout(() => {
        promisesMap[url] = null
        reject(new Error(`Failed to load ${url} in 20s`))
      }, 20000)
      scriptElement.onload = () => {
        if (installTimeoutId) window.clearTimeout(installTimeoutId)
        loadedScripts[url] = true
        promisesMap[url] = null
        resolve()
      }

      scriptElement.onerror = err => {
        if (installTimeoutId) window.clearTimeout(installTimeoutId)
        promisesMap[url] = null
        reject(err)
      }
      scriptElement.src = url
      document.body.appendChild(scriptElement)
    })
    promisesMap[url] = promise
    return promise
  },
}
