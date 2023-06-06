# Kafka Reconsume

A tiny messages reconsumer based on [kafkajs](https://github.com/tulios/kafkajs)

## Basic usage

```bash
npm install kafka-reconsume
```

This will reconsume messages from a specific topic, starting from the given timestamp:

```typescript
import { kafkaReconsume } from "kafka-reconsume"
import { Kafka } from "kafkajs"

const kafka = new Kafka({ brokers: ["localhost:9092"] }), 

(async function () { 
	const result = await kafkaReconsume(
		kafka,
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

- returns the **number of reconsumed messages for each partition**.
- **Autocommit** is always set to **false**, to ensure programmatic reconsume.
- By default a **randomly generated consumer group id** will be used, but it can be set proividing the whole consumer config as last optional argument.

## Other utilities

Just two little wrappers around the main function:

```typescript

await kafkaReconsumeByMillisecOffset(
	kafka,
	"my-topic",
	10000, //starts from 10 seconds ago
	async (item) => { /*....*/}
)

await kafkaReconsumeFromLocalDateTime(
	kafka,
	"my-topic",
	new Date("2023-06-06 00:00:00")
	async (item) => { /*....*/}
)
```