module.exports = {
  "plugins": [
    ["transform-runtime", {
      "polyfill": false,
      "regenerator": true
    }],
    "transform-object-rest-spread"
  ],
  "presets": ["latest", "es2015", "stage-0"]
}