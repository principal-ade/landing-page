import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { SignalingServer } from './src/lib/signaling-server';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3002', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

async function startServer() {
  try {
    await app.prepare();
    
    const server = createServer((req, res) => {
      try {
        const parsedUrl = parse(req.url!, true);
        handle(req, res, parsedUrl);
      } catch (error) {
        console.error('Error handling request:', error);
        res.statusCode = 500;
        res.end('Internal server error');
      }
    });

    // Initialize WebSocket signaling server
    try {
      const signalingServer = new SignalingServer(server);
      console.log('✓ WebSocket signaling server initialized');
      
      // Expose stats endpoint for monitoring
      server.on('request', (req, res) => {
        if (req.url === '/orbit/stats' && req.method === 'GET') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(signalingServer.getStats()));
        }
      });
    } catch (error) {
      console.error('Failed to initialize signaling server:', error);
      console.warn('⚠ Running without WebSocket support');
    }

    server.listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> WebSocket endpoint: ws://${hostname}:${port}/orbit/signal`);
      
      if (!dev) {
        console.log('> Running in production mode');
        console.log('> Make sure to use WSS (WebSocket Secure) behind a reverse proxy');
      }
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();