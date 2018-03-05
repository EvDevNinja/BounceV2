# TCP Bounce V2.0.0

### Installation
1. Download
	* clone this git `git clone https://github.com/EvDevNinja/BounceV2/` or
	* zip and unpack `https://github.com/EvDevNinja/BounceV2/archive/master.zip`
2. `cd` into the directory
3. run `npm install`

---

### Configuration
Edit app.js

```javascript
const config = {
	"8080":{//External Port
		"aiden.evdev.online":{//Filter
			"internal":"localhost",//Internal Address
			"port":80 //Internal Port
		}
	}
}
```

---

### Starting The Server
1. `cd` into the directory
2. run `npm start`
