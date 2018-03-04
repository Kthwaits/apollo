if (process.env.NODE_ENV !== 'production') {
  module.exports = {
    HOST: 'http://localhost:3000'
  }
} else {
  module.exports = {
    HOST: 'http://whispering-fjord-50685.herokuapp.com'
  }}
