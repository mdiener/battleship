import json
import tornado.websocket
import tornado.httpserver
import tornado.ioloop
import tornado.web

class WSHandler(tornado.websocket.WebSocketHandler):
  def initialize(self, queue):
    self._queue = queue

  async def _check_queue(self):
    while True:
      while not self._queue.empty():
        entry = self._queue.get()
        if entry['action'] == 'request:state':

  gameboards = set()
  viewboards = set()

  @classmethod
  def request_state(cls, gameid):
    for board in cls.gameboards:
      if board.gameid == gameid:
        board.write_message(json.dumps({
          'action': 'request:state',
        }))

  @classmethod
  def send_state(cls, gameid, data):
    for board in cls.viewboards:
      if board.gameid == gameid:
        board.write_message(json.dumps({
          'action': 'response:state',
          'state': data
        }))

  @property
  def gameid(self):
    return self._gameid

  @gameid.setter
  def gameid(self, value):
    self._gameid = value

  @property
  def boardtype(self):
    return self._boardtype

  @boardtype.setter
  def boardtype(self, value):
    self._boardtype = value

  def check_origin(self, origin):
    return True

  def open(self):
    self.gameid = self.get_argument('gameid')
    self.boardtype = self.get_argument('boardtype')

    if self.boardtype == 'game':
      WSHandler.gameboards.add(self)
    elif self.boardtype == 'view':
      WSHandler.viewboards.add(self)

  def on_message(self, message):
    data = json.loads(message)

    if self.boardtype == 'view':
      if 'request' not in data:
        self.write_message(json.dumps({
          'success': False,
          'message': 'You need to provide what type of request you are making.'
        }))

      if data['request'] == 'state':
        WSHandler.request_state(self.gameid)

    if self.boardtype == 'game':
      if 'data' not in data:
        self.write_message(json.dumps({
          'success': False,
          'message': 'Some game board data needs to be sent.'
        }))

      WSHandler.send_state(self.gameid, data['data'])

  def on_close(self):
    try:
      WSHandler.gameboards.remove(self)
    except KeyError as err:
      pass

    try:
      WSHandler.viewboards.remove(self)
    except KeyError as err:
      pass


def run(port, forking=False):
  app = tornado.web.Application([
    (r'/socket', WSHandler)
  ], websocket_ping_interval=10)

  if not forking:
    app.listen(port)
  else:
    server = tornado.httpserver.HTTPServer(app)
    server.bind(port)
    server.start(0)

  tornado.ioloop.IOLoop.current().start()
