import { 
	Kafka,
	ConsumerConfig, 
	ConsumerRunConfig, 
	TopicPartitionOffset
} from "kafkajs"

/**Reconsumes messages for a given topic from a specific locale date*/
export async function kafkaReconsumeFromLocalDateTime(kafka: Kafka, topic: string, date: Date, consumerConfig: ConsumerConfig, consumerRunConfig: ConsumerRunConfig) {
	await kafkaReconsume(kafka, topic, date.getTime(), consumerConfig, consumerRunConfig)
}

/**Reconsumes messages for a given topic from a specific offset in milliseconds*/
export async function kafkaReconsumeByMillisecOffset(kafka: Kafka, topic: string, offsetMilliseconds: number, consumerConfig: ConsumerConfig, consumerRunConfig: ConsumerRunConfig) {
	await kafkaReconsume(kafka, topic, Date.now() - offsetMilliseconds, consumerConfig, consumerRunConfig)
}

/**Reconsumes messages for a given topic from a specific timestamp*/
export async function kafkaReconsume(kafka: Kafka, topic: string, timestampMs: number, consumerConfig: ConsumerConfig, consumerRunConfig: ConsumerRunConfig) {
	const kAdmin = kafka.admin()
	await kAdmin.connect()

	console.log(new Date(timestampMs))

	const offsets = await kAdmin.fetchTopicOffsetsByTimestamp(topic, timestampMs)

	const consumer = kafka.consumer(consumerConfig)
	await consumer.connect()

	//the fromBeginning option should be
	//useless when seeking messages
	consumer.subscribe({ topic })
	consumer.run(consumerRunConfig)

	for (let partitionOffset of offsets) {
		Object.defineProperty(partitionOffset, "topic", { value: topic })
		consumer.seek(partitionOffset as TopicPartitionOffset)
	}
}