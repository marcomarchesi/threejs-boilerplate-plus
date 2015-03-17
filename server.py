#!/usr/bin/python
import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web
import sys

def main():
    port = sys.argv[1]
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(port)
    print "Listening on port %s" % (port)
    tornado.ioloop.IOLoop.instance().start()

class WSHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        print 'new connection'
        self.write_message("Hello World")

    def on_message(self, message):
        print 'message received %s' % message

    def on_close(self):
      print 'connection closed'


application = tornado.web.Application([
    (r'/', WSHandler),
])


if __name__ == "__main__":
   main()