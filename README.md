# urn.js

```ts
import urn from '@urn.js/client';
const client = urn({
    server: 'whatever.something.huh',
    token: 'authsessiontoken' // if not provided, go to {server}/auth
})

async function createGame() {
    client.games.create()
}
```