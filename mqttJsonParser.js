const mqtt = require("mqtt");

let mqttJsonParser_client;

const safeLogger = (logger) => (...messages) =>
{
    if (typeof logger === 'function')
    {
        logger(...messages);
    }
};

module.exports = {

    start: (options) =>
    {
        const { credentials, subscriptions, logger } = options;
        const log = safeLogger(logger);

        mqttJsonParser_client = mqtt.connect(credentials);

        mqttJsonParser_client.on("close", () =>
        {
            log("MQTT connection closed");
            module.exports.stop();
        });

        mqttJsonParser_client.on("offline", () =>
        {
            log("MQTT broker connection failed");
            module.exports.stop();
        });

        mqttJsonParser_client.on("error", (error) =>
        {
            log(error);
            module.exports.stop();
        });

        mqttJsonParser_client.on('connect', () =>
        {
            log("MQTT connection successful");

            subscriptions.forEach((sub) =>
            {
                if (sub.enabled)
                {
                    mqttJsonParser_client.subscribe(sub.topic);
                }
            });
        });

        mqttJsonParser_client.on('message', (topic, message) =>
        {
            const parsedMessage = JSON.parse(message.toString());

            subscriptions.forEach((sub) =>
            {
                if (sub.topic === topic)
                {
                    sub.mappings.forEach((mapping) =>
                    {
                        const keys = mapping.schema.split(".");
                        let value = parsedMessage;

                        keys.forEach((key) =>
                        {
                            if (value && value.hasOwnProperty(key))
                            {
                                value = value[key];
                            } else
                            {
                                value = null;
                            }
                        });

                        if (value !== null)
                        {
                            if (typeof mapping.onMessage === 'function')
                            {
                                if (mapping.hasOwnProperty('messageParameter'))
                                {
                                    mapping.onMessage(value, mapping.messageParameter);
                                }
                                else
                                {
                                    mapping.onMessage(value);
                                }
                            }
                        }
                    });
                }
            });
        });
    },
    stop: () => 
    {
        if (mqttJsonParser_client) 
        {
            mqttJsonParser_client.end(true, () =>
            {
                log("MQTT broker connection is closed now");

                mqttJsonParser_client = null;
            });
        }
    },
    isRunning: () => 
    {
        return mqttJsonParser_client !== null;
    }

};
