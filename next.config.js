module.exports = {
  async rewrites() {
    return [
      {
        source: '/:slug*',
        destination: '/'
      }
    ]
  }
}
