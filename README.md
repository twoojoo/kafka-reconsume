# Kafka Reconsume

A tiny messages reconsumer based on [kafkajs](https://github.com/tulios/kafkajs)

## Basic usage

This will reconsume messages from a specific topic, starting from the given timestamp:

```typescript
import { Kafka, ConsumerConfig, ConsumerRunConfig } from "kafkajs"
import { kafkaReconsume } from "kafka-reconsume"

(async function () { 
	const result = await kafkaReconsume(
		new Kafka({ brokers: ["localhost:9092"] }), 
		"my-topic",
		1202301233, //timestamp
		async (item) => {
			const message = item.message.value!.toString()
			console.log(item.topic, "==>", message)
		}
	)

	for (const partition in result) {
		console.log(
			"partition:", partition,
			"messages:", result[partition]
		)
	}
})()
```

- **Autocommit** is always set to **false**, to ensure programmatic reconsume.
- By default a **randomly generated consumer group id** will be used, but it can be set proividing the whole consumer config as last optional argument.

## Other utilities

Just two little wrappers around the main function:

```typescript

await kafkaReconsumeByMillisecOffset(
	new Kafka({ brokers: ["localhost:9092"] }),  
	"my-topic",
	10000, //starts from 10 seconds ago
	async (item) => { /*....*/}
)

await kafkaReconsumeFromLocalDateTime(
	new Kafka({ brokers: ["localhost:9092"] }),  
	"my-topic",
	new Date("2023-06-06 00:00:00")
	async (item) => { /*....*/}
)
```