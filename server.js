const app = require('./app')

// Bring up app
app.listen(3000, '0.0.0.0', err => {
  if (err) {
    console.warn('failed to startup', err)
    process.exit(-1)
  }
  console.info('app listening at', 3000)
})
