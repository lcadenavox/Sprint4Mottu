// Simple dev proxy to avoid CORS on Expo Web by proxying /proxy -> API
const http = require('http');
const httpProxy = require('http-proxy');

const target = process.env.TARGET || 'http://localhost:7054';
const port = process.env.PORT || 5050;

const proxy = httpProxy.createProxyServer({
  target,
  changeOrigin: true,
  secure: false,
});

proxy.on('proxyRes', function (proxyRes) {
  proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';
  proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
});

const server = http.createServer(function (req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    });
    return res.end();
  }

  // strip /proxy prefix
  const url = req.url || '/';
  if (url.startsWith('/proxy')) {
    req.url = url.replace('/proxy', '');
  }
  proxy.web(req, res, { target });
});

server.listen(port, () => {
  console.log(`Dev proxy listening on http://localhost:${port}, forwarding to ${target}`);
});
