# Kafka Reconsume

A tiny messages reconsumer based on [kafkajs](https://github.com/tulios/kafkajs)

## Basic usage

This will reconsume messages from a specific topic, starting from the given timestamp:

```typescript
import { Kafka, ConsumerConfig, ConsumerRunConfig } from "kafkajs"
import { kafkaReconsume } from "kafka-reconsume"

const consumerConfig: ConsumerConfig = { 
	groupId: "test-reconsume"
}

const consumerRunConfig: ConsumerRunConfig = {
	autoCommit: false, 
	eachMessage: async (item) => {
		const message = item.message.value!.toString()
		console.log(item.topic, "==>", message)
	}
}

(async function () { 
	await kafkaReconsume(
		new Kafka({ brokers: ["localhost:9092"] }), 
		"my-topic",
		1202301233, //timestamp
		consumerConfig,
		consumerRunConfig
	)
})()
```

## Other utilities

Just two little wrappers around the main function:

```typescript

await kafkaReconsumeByMillisecOffset(
	new Kafka({ brokers: ["localhost:9092"] }),  
	"my-topic",
	10000, //starts from 10 seconds ago
	consumerConfig,
	consumerRunConfig
)

await kafkaReconsumeFromLocalDateTime(
	new Kafka({ brokers: ["localhost:9092"] }),  
	"my-topic",
	new Date("2023-06-06 00:00:00"),
	{ groupId: "test-reconsume" },
	consumerConfig,
	consumerRunConfig
)
```