const mqttJsonParser = require("./mqttJsonParser.js");

require('dotenv').config();

const config = {
    host: process.env.MQTT_HOST,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    protocol: process.env.MQTT_PROTOCOL
};

function mqttJsonParser_logger(message)
{
    console.log("[mqttJsonParser]", message);
}

function example_callback(mqtt_value, messageParameter)
{
    console.log("[mqttJsonParser]", messageParameter.label, mqtt_value + " " + messageParameter.unit);
}

mqttJsonParser.start({
    credentials: config,
    logger: mqttJsonParser_logger,
    subscriptions: [
        {
            topic: "shellyplus1pm_solar/status/switch:0",
            enabled: true,
            mappings: [
                {
                    schema: "temperature.tC",
                    onMessage: example_callback,
                    messageParameter: {
                        label: "Shelly temperature",
                        unit: "°C"
                    }
                },
                {
                    schema: "aenergy.total",
                    onMessage: example_callback,
                    messageParameter: {
                        label: "Shelly solar energy",
                        unit: "W"
                    }
                }
            ]
        }
    ]
});

