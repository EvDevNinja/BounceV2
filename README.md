# TCP Bounce V2.0.0

### Installation
1. Download
	* clone this git `git clone https://github.com/EvDevNinja/BounceV2/` or
	* zip and unpack `https://github.com/EvDevNinja/BounceV2/archive/master.zip`
2. `cd` into the directory
3. run `npm install`

---

### Configuration
Edit config.json (will be automatically generated after your first run)

#### Example Configuration

```javascript
{
	"80":{//External Port
		"aiden.evdev.online":{//Filter
			"internal":"localhost",//Internal Address
			"port":4444 //Internal Port
		},
		"evdev.online":{//Filter, shorter filters last
			"internal":"localhost",//Internal Address
			"port":8888 //Internal Port
		}
	},
	"443":{//External Port
		"aiden.evdev.online":{//Filter
			"internal":"localhost",//Internal Address
			"port":4443 //Internal Port
		},
		"evdev.online":{//Filter, shorter filters last
			"internal":"localhost",//Internal Address
			"port":8443 //Internal Port
		}
	}
}
```

---

### Starting The Server
1. `cd` into the directory
2. run `npm start`
