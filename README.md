# :cookie: cookie-oven

[Express](https://expressjs.com/) middleware to read, write, and refresh one or many authenticated sessions in a sha256-encrypted cookie.

## Usage

One session:
```typescript
import cookieOven from 'cookie-oven';

const app = express();

app.use(
  cookieOven({
    name: 'session',
    secret: 'secret',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  })
);

app.get('/', (request, response) => {
  const sessionId = request.session.id;
  const status = !sessionId ? 401 : 200;
  return response.status(status).end();
});
```

Multiple sessions:
```typescript
import cookieOven from 'cookie-oven';

const app = express();

app.use([
  cookieOven({
    name: 'userSession',
    secret: 'user-secret',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }),

  cookieOven({
    name: 'adminSession',
    secret: 'admin-secret',
    maxAge: 48 * 60 * 60 * 1000 // 48 hours
  }),
]);

app.get('/user', (request, response) => {
  const userSessionId = request.userSession.id;
  const status = !userSessionId ? 401 : 200;
  return response.status(status).end();
});

app.get('/admin', (request, response) => {
  const adminSessionId = request.adminSession.id;
  const status = !adminSessionId ? 401 : 200;
  return response.status(status).end();
});
```

### Options
```typescript
interface OvenSettings {
  name: string; // name of the cookie to set
  secret: string; // key used to sign and verify cookie values
  isRolling?: boolean; // if true, the session will be refreshed on every request (default `false`)

  // Cookie options, same as github.com/pillarjs/cookies
  maxAge: number;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax';
  domain?: string;
  secure?: boolean;
  overwrite?: boolean;
}
```