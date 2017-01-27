const Minifinch = require('./src')
const minifinch = new Minifinch()

if(process.argv[2] == '--dev') {
  minifinch.start(true)
}else {
  minifinch.start()
}