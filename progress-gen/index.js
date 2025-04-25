const path = require('path');
const dotenv = require('dotenv');
const { Kafka } = require('kafkajs');
const os = require('os');
const MessageProcessor = require('./MessageProcessor');

const customEnvPath = path.resolve(__dirname, '../', '.env');

dotenv.config({ path: customEnvPath });

// console.log(process.env.PDF_API);

IPPORT=process.env.KAFKA_BASE_API;
CLIENTID=os.hostname();
GROUPID='progrss-report-gen';
TOPIC='generate-progress-card';
console.log(process.env.KAFKA_BASE_API)

const kafka = new Kafka({
  clientId: CLIENTID,
  brokers: [IPPORT] // Add your Kafka broker addresses here
});

const consumer = kafka.consumer({ groupId: GROUPID });
const messageProcessor = new MessageProcessor(consumer);

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: TOPIC, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      await messageProcessor.processMessage(topic, partition, JSON.parse(message.value));
    },
  });
};

runConsumer().catch(console.error);
