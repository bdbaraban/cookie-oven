# :cookie: cookie-oven

Express middleware to read, write, and refresh one or many authenticated sessions in a sha256-encrypted cookie.

## Usage

### One session:
```typescript
import cookieOven from 'cookie-oven';

// Instantiate Express app
const app = express();

// Load cookie-oven middleware
app.use([
  cookieOven({
    name: 'session',
    secret: 'secret',
    maxAge: 600000, // 10 minutes
  }),
]);

// Read session in request
app.get(
  '/route',
  (request, response) => {
    const sessionId = request.session.id;
    const status = !sessionId ? 401 : 200;
    return response.status(status).end();
  })
);
```

### Multiple sessions:
```typescript
import cookieOven from 'cookie-oven';

// Instantiate Express app
const app = express();

// Load cookie-oven middleware
app.use([
  cookieOven({
    name: 'userSession',
    secret: 'user-secret',
    maxAge: 60000, // 10 minutes
  }),

  cookieOven({
    name: 'adminSession',
    secret: 'admin-secret',
    maxAge: 60000 * 2, // 20 minutes
  }),
]);

// Read user session in request
app.get(
  '/user',
  (request, response) => {
    const userSessionId = request.userSession.id;
    const status = !userSessionId ? 401 : 200;
    return response.status(status).end();
  })
);

// Read admin session in request
app.get(
  '/admin',
  (request, response) => {
    const adminSessionId = request.adminSession.id;
    const status = !adminSessionId ? 401 : 200;
    return response.status(status).end();
  })
);
```

### Options:
```typescript
interface OvenSettings {
  // Session values
  name: string;
  secret: string;

  // Cookie settings
  maxAge: number;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax';
  domain?: string;
  secure?: boolean;
  overwrite?: boolean;
  isRolling?: boolean;
}
```