import {
	kafkaReconsume,
	kafkaReconsumeFromLocalDateTime,
	kafkaReconsumeByMillisecOffset
} from "../src"

import { Kafka } from "kafkajs"


(async function () { 
	const result = await kafkaReconsume(
		new Kafka({ brokers: ["localhost:9092"] }), 
		"sp-gpcs-reservations-raw",
		1202301233, //timestamp
		async (item) => {
			const message = item.message.value!.toString()
			console.log(item.topic, "==>", message)
		}
	)

	for (const partition in result) {
		console.log(
			"partion:", partition,
			"messages:", result[partition]
		)
	}

	process.exit(0)
})()