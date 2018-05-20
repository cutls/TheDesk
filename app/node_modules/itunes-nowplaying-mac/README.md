# itunes-nowplaying-mac

tested in macOS High Sierra 10.13.2 and iTunes 12.7.2.58

## install

```
npm install itunes-nowplaying-mac
```

## how to use

TypeScript: 

```typescript
import nowplaying from "itunes-nowplyaing-mac"
nowplaying().then(console.log)

import {getRawData as nowplaying} from "itunes-nowplaying-mac"
nowplaying().then(console.log) // return iTunes raw data
```

JavaScript:
```javascript
const nowplaying = require("itunes-nowplaying-mac")
nowplaying().then(console.log)

nowplaying.getRawData().then(console.log) // return iTunes raw data
```

example return data: 
```json
{
    "name": "AnemoneStar",
    "duration": 211.29299926757812,
    "artist": "渋谷凛 (福原綾香)",
    "composer": "Yasushi",
    "album": {
        "name": "THE IDOLM@STER CINDERELLA GIRLS STARLIGHT MASTER 01",
        "artist": "",
        "loved": false,
        "disliked": false
    },
    "genre": "Soundtrack",
    "track": {
        "length": 7,
        "number": 3
    },
    "disc": {
        "length": 1,
        "number": 1
    },
    "sampleRate": 44100,
    "comment": "",
    "loved": true,
    "disliked": false,
    "state": "playing"
}
```