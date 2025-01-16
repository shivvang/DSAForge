import amqlib from "amqplib";
import logger from "./logger.js";


let rabbitMQConnection = null;
let rabbitMQChannel = null;

const EXCHANGE_NAME = "DSAForge_Problem_Exchange";

async function initializeRabbitMQ() {
    try {
        // Establish connection to RabbitMQ
        rabbitMQConnection = await amqlib.connect(process.env.RABBITMQ_URL);
        logger.info("🐇 Connected to RabbitMQ successfully.");

        // Create a channel
        rabbitMQChannel = await rabbitMQConnection.createChannel();
        logger.info("📡 RabbitMQ channel created.");

        // Ensure the exchange exists
        await rabbitMQChannel.assertExchange(EXCHANGE_NAME, "topic", { durable: true });
        logger.info(`🔄 Exchange "${EXCHANGE_NAME}" is set up (Type: topic, Durable: true).`);

        return rabbitMQChannel;
    } catch (error) {
        logger.error("❌ Failed to initialize RabbitMQ:", error);
        throw error; // Throw error to handle it at a higher level
    }
}


/**
 * Publishes an event to the RabbitMQ exchange.
 * @param {string} routingKey - The routing key for the message.
 * @param {object} message - The message payload to be published.
 */
async function publishEventToExchange(routingKey, message) {
    try {
        // Ensure RabbitMQ channel is initialized
        if (!rabbitMQChannel) {
            logger.warn("⚠️ RabbitMQ channel not initialized. Establishing connection...");
            await initializeRabbitMQ();
        }

        // Convert message to a Buffer
        //Buffer.from(string) → Converts the string to a binary Buffer.

        const messageBuffer = Buffer.from(JSON.stringify(message));

        // Publish the message to the exchange
        rabbitMQChannel.publish(EXCHANGE_NAME, routingKey, messageBuffer);
        logger.info(`📤 Event published to exchange: "${EXCHANGE_NAME}" | Routing Key: "${routingKey}"`);

    } catch (error) {
        logger.error(`❌ Failed to publish event to RabbitMQ | Routing Key: "${routingKey}"`, error);
    }
}

/**
 * Consumes events from the RabbitMQ exchange.
 * @param {string} routingKey - The routing key to bind the queue.
 * @param {Function} callback - Function to handle received messages.
 */

async function consumeEvents(routingKey, callback) {
    try {
        // Ensure RabbitMQ channel is initialized
        if (!rabbitMQChannel) {
            logger.warn("⚠️ RabbitMQ channel not initialized. Establishing connection...");
            await initializeRabbitMQ();
        }

        // Create a temporary queue (auto-deleted when connection closes)
        const queue = await rabbitMQChannel.assertQueue("", { exclusive: true });

        // Bind queue to the exchange with the given routing key
        await rabbitMQChannel.bindQueue(queue.queue, EXCHANGE_NAME, routingKey);

        // Consume messages from the queue
        rabbitMQChannel.consume(queue.queue, (msg) => {
            if (msg) {
                const content = JSON.parse(msg.content.toString());
                callback(content);
                rabbitMQChannel.ack(msg);
                logger.info(`✅ Event received: "${routingKey}"`);
            }
        });

    } catch (error) {
        logger.error(`❌ Failed to consume event from RabbitMQ | Routing Key: "${routingKey}"`, error);
    }
}

export  {initializeRabbitMQ,publishEventToExchange,consumeEvents};
