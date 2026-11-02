import http.server
import socketserver
import urllib.request
import urllib.error

class ReverseProxyHandler(http.server.BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        # Suppress noisy logs
        pass

    def do_GET(self):
        self.forward()

    def do_POST(self):
        self.forward()

    def do_PUT(self):
        self.forward()

    def do_DELETE(self):
        self.forward()

    def do_OPTIONS(self):
        self.forward()

    def forward(self):
        target_url = f"http://127.0.0.1:8000{self.path}"
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length) if content_length > 0 else None
            
            headers = {k: v for k, v in self.headers.items() if k.lower() not in ['host', 'content-length']}
            req = urllib.request.Request(target_url, data=body, headers=headers, method=self.command)
            
            with urllib.request.urlopen(req, timeout=10) as resp:
                self.send_response(resp.status)
                for k, v in resp.headers.items():
                    if k.lower() not in ['transfer-encoding', 'content-length', 'connection']:
                        self.send_header(k, v)
                resp_body = resp.read()
                self.send_header('Content-Length', str(len(resp_body)))
                self.end_headers()
                self.wfile.write(resp_body)
        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            for k, v in e.headers.items():
                if k.lower() not in ['transfer-encoding', 'content-length', 'connection']:
                    self.send_header(k, v)
            err_body = e.read()
            self.send_header('Content-Length', str(len(err_body)))
            self.end_headers()
            self.wfile.write(err_body)
        except Exception:
            # Fallback redirect to port 5173
            self.send_response(302)
            self.send_header('Location', f'http://localhost:5173{self.path}')
            self.end_headers()

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("0.0.0.0", 80), ReverseProxyHandler) as httpd:
        print("HeritageVerse Port 80 Gateway running -> forwarding to http://127.0.0.1:5173")
        httpd.serve_forever()

