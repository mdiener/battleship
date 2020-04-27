export default class {
  constructor() {
    this._onmessage = []
    this._onopen = []

    this._isOpen = false
  }

  _getUrl() {
    let wsProtocol = 'ws:'
    if (document.location.protocol == 'https:') wsProtocol = 'wss:'

    let url = wsProtocol + '//' + document.location.hostname
    if (process.env.dev) {
      url += ':8000'
    } else {
      if (document.location.port != '') {
        url += ':' + document.location.port
      }
    }

    url += document.location.pathname + 'socket'

    return url
  }

  get isOpen() {
    return this._isOpen
  }

  open(id, type) {
    this._sock = new WebSocket(this._getUrl() + '?gameid=' + id + '&boardtype=' + type)
    this._isOpen = true

    this._sock.addEventListener('message', (event) => {
      this._onmessage.forEach(cb => {
        if (typeof cb == 'function') cb(JSON.parse(event.data))
      })
    })

    this._sock.addEventListener('open', () => {
      this._onopen.forEach(cb => {
        if (typeof cb == 'function') cb()
      })
    })
  }

  onmessage(func) {
    this._onmessage.push(func)
  }

  onopen(func) {
    this._onopen.push(func)
  }

  send(data) {
    this._sock.send(JSON.stringify(data))
  }

  close() {
    this._sock.close()
    this._isOpen = false
  }
}
