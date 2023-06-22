# urn.js

```ts
import urn from '@urn.js/client';
const client = urn({
    server: 'https://whatever.something.huh/',
    ably: 'ably subscribe key'
})

async function createGame() {
    const { game, error } = client.games.create({
        settings: {
            maxplayers: 9,
        }
    })
    if(error) throw error // or display error in whatever way
}

client.start()
```