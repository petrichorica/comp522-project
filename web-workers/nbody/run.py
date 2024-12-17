import http.server

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        super().end_headers()

server_address = ('127.0.0.1', 8080)
with http.server.HTTPServer(server_address, CustomHTTPRequestHandler) as httpd:
    print(f"Serving on {server_address[0]}:{server_address[1]}")
    httpd.serve_forever()
