const mqtt = require("mqtt");

module.exports = {
    start: (options) =>
    {
        const { credentials, subscriptions, logger } = options;

        const client = mqtt.connect(credentials);

        client.on("offline", () =>
        {
            logger("MQTT broker connection failed");
        });

        client.on("error", (error) =>
        {
            logger(error);
        });

        client.on("close", () =>
        {
            logger("MQTT connection closed");
        });

        client.on('connect', () =>
        {
            logger("MQTT connection successfully");

            subscriptions.forEach((sub) =>
            {
                if (sub.enabled)
                {
                    client.subscribe(sub.topic);
                }
            });
        });

        client.on('message', (topic, message) =>
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
    }
};
