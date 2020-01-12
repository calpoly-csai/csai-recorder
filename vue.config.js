module.exports = {
  pwa: {
    name: "CSAI Recorder",
    themeColor: "#FFF",
    msTileColor: "#FFF",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "default",
    manifestOptions: {
      background_color: "#FFF"
    },
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "service-worker.js"
    }
  }
};
