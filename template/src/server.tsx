import {type Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';
import * as fs from 'fs';

const app = new Hono();

// Serve static files from the public directory
app.use('/*', serveStatic({root: './public'}));

app.get('/hello', (c: Context) => {
  return c.html(<h2>Hello</h2>);
});

export default app;
