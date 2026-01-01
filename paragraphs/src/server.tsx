import {type Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';

const app = new Hono();

// Serve static files from the public directory
app.use('/*', serveStatic({root: './public'}));

app.get('/paragraphs', (c: Context) => {
  return c.html(
    <>
      <p id="para3" hx-swap-oob="outerHTML:#para1">
        This is some new text.
      </p> 
      <p id="para4" hx-swap-oob="outerHTML:#para2">
        See! I told you so.
      </p>
    </>
  );
});

export default app;
