# mqttJsonParser

This Node.js library provides an easy solution for receiving MQTT messages, extracting specific JSON keys, and forwarding them to custom callback functions.

## Motivation
I developed this library to streamline data collection from various MQTT-enabled devices within my home network. My objective is to archive this data in a database, enabling visualization with tools like Grafana. Existing solutions, such as NodeRED, proved to be too demanding for such small tasks on resources for small-scale projects, especially when operating on single-board computers.


Checkout this repository to see the script based solution, utilizing the mqttJsonParser: [MQTT-Influx-Bridge](https://github.com/mgiesen/MQTT-Influx-Bridge)

## Prerequisites

Before using the script, make sure you have the following:

- Node.js installed on your system.
- `mqtt` Node.js package installed. Install it using `npm install mqtt` if not already installed.
- `dotenv` Node.js package installed for environment variable management. Install it using `npm install dotenv` if not already installed.
- MQTT broker credentials.

## Usage

1. Clone this repository to your local machine:

```bash
git clone https://github.com/mgiesen/mqttJsonParser.git
```

2. Install the required Node.js packages:

```bash
npm install
```

3. Create a .env file with your MQTT settings in the repository folder:

```bash
MQTT_HOST=
MQTT_USERNAME=
MQTT_PASSWORD=
MQTT_PROTOCOL=
```

4. Customize the subscriptions object in `example.js` to fit your needs. I recommend using [MQTT-Explorer](https://github.com/thomasnordquist/MQTT-Explorer) to identify topics and key mappings.

```javascript
{
    topic: "YOUR_MQTT_TOPIC",
    enabled: true,
    mappings: [
        {
            schema: "YOUR_JSON_MAPPING_TO_SPECIFIC_VALUE",
            onMessage: YOUR_CALLBACK_FUNCTION,
            messageParameter: {
                // ADDITIONAL PARAMETERS YOU WANT TO PASS TO CALLBACK FUNCTION
            }
        }
    ]
}
```

5. Run the script with the configuration file as a command-line argument:

```bash
node example.js
```

## Example MQTT device

[Shelly Plus 1PM](https://www.shelly.com/de/products/shop/shelly-plus-1-pm-2-pack/shelly-plus-1-pm) - WiFi Relais and Energy Meter

![Image](https://www.shelly.com/_Resources/Persistent/d/4/4/d/d44ddf8caa0797bce14639b6082055670a1f14f9/shpl1pm-shop6-1000x1000.webp)

## Example MQTT message

```json
{
	"id": 0,
	"source": "init",
	"output": true,
	"apower": 0.0,
	"voltage": 235.0,
	"current": 0.034,
	"aenergy": {
		"total": 13371.121,
		"by_minute": [0.0, 0.0, 0.0],
		"minute_ts": 1694723159
	},
	"temperature": {
		"tC": 56.9,
		"tF": 134.4
	}
}
```

## Example output of example.js

```
[mqttJsonParser] MQTT connection successfully
[mqttJsonParser] Shelly temperature 57 °C
[mqttJsonParser] Shelly solar energy 13371.121 W
```
