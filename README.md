# Kafka Reconsume

A tiny messages reconsumer based on [kafkajs](https://github.com/tulios/kafkajs)

## Basic usage

This will reconsume messages from a specific topic, starting from the given timestamp:

```typescript
import { kafkaReconsume } from "kafka-reconsum"
import { Kafka } from "kafkajs"

const kafka = 

(async function () { 
	await kafkaReconsume(
		new Kafka({ brokers: ["localhost:9092"] }), 
		"my-topic",
		1202301233, //timestamp
		{ groupId: "test-reconsume" },
		{
			autoCommit: false, 
			eachMessage: async (item) => {
				const message = item.message.value!.toString()
				console.log(item.topic, "==>", message)
			}
		}
	)
})()
```

## Other functions

```typescript

await kafkaReconsumeByMillisecOffset(
	new Kafka({ brokers: ["localhost:9092"] }),  
	"my-topic",
	50000000,
	{ groupId: "test-reconsume" },
	{
		autoCommit: false,
		eachMessage: async (item) => {
			//.....
		}
	}
)

await kafkaReconsumeFromLocalDateTime(
	new Kafka({ brokers: ["localhost:9092"] }),  
	"my-topic",
	new Date("2023-06-06 00:00:00"),
	{ groupId: "test-reconsume" },
	{
		autoCommit: false,
		eachMessage: async (item) => {
			//.....
		}
	}
)
```