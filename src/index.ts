import { 
	Kafka,
	ConsumerConfig, 
	ConsumerRunConfig, 
	TopicPartitionOffset,
	EachMessageHandler
} from "kafkajs"

import { randomUUID } from "node:crypto"

/**Reconsumes messages for a given topic from a specific locale date*/
export async function kafkaReconsumeFromLocalDateTime(kafka: Kafka, topic: string, date: Date, eachMessage: EachMessageHandler, consumerConfig?: ConsumerConfig) {
	await kafkaReconsume(kafka, topic, date.getTime(), eachMessage, consumerConfig)
}

/**Reconsumes messages for a given topic from a specific offset in milliseconds*/
export async function kafkaReconsumeByMillisecOffset(kafka: Kafka, topic: string, offsetMilliseconds: number, eachMessage: EachMessageHandler, consumerConfig?: ConsumerConfig) {
	await kafkaReconsume(kafka, topic, Date.now() - offsetMilliseconds, eachMessage, consumerConfig)
}

/**Reconsumes messages for a given topic from a specific timestamp*/
export async function kafkaReconsume(kafka: Kafka, topic: string, timestampMs: number, eachMessage: EachMessageHandler, consumerConfig?: ConsumerConfig) {
	return new Promise<{ [partion: string]: number }>(async (resolve) => {
		const admin = kafka.admin()
		await admin.connect()
		
		const offsetsByTimestamp = await admin.fetchTopicOffsetsByTimestamp(topic, timestampMs)
		
		if (!consumerConfig) {
			consumerConfig = { groupId: "kafka-reconsume-" + randomUUID(), }
		}

		const consumer = kafka.consumer(consumerConfig)
		await consumer.connect()
		
		const maxMessages: { [partion: string]: number } = {}
		const offsetCounter: { [partion: string]: number } = {}

		const topicOffsets = await admin.fetchTopicOffsets(topic);

		topicOffsets.forEach(item => { 
			const partition = item.partition.toString()
			maxMessages[partition] = parseInt(item.high) - parseInt(item.low)
			offsetCounter[partition] = 0
		})
		
		const runConfig: ConsumerRunConfig = {
			autoCommit: false,
			eachMessage: async (item) => {
				const partition = item.partition.toString()
				offsetCounter[partition]++
		
				await eachMessage(item)
		
				const isEnd = checkReconsumeEnd(offsetCounter, maxMessages)
				if (isEnd) resolve(offsetCounter)
			}
		}
	
		//the fromBeginning option should be
		//useless when seeking messages
		consumer.subscribe({ topic, fromBeginning: true })
		consumer.run(runConfig)
		
		for (let partitionOffset of offsetsByTimestamp) {
			Object.defineProperty(partitionOffset, "topic", { value: topic })
			consumer.seek(partitionOffset as TopicPartitionOffset)
		}
	})
}


function checkReconsumeEnd(offsetCounter: { [partion: string]: number }, maxMessages: { [partion: string]: number }): boolean {
	for (const partition in offsetCounter) {
		if (offsetCounter[partition] == maxMessages[partition]) {
			return true
		}
	}

	return false
}