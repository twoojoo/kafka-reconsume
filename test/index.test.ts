import {
	kafkaReconsume,
	kafkaReconsumeFromLocalDateTime,
	kafkaReconsumeByMillisecOffset
} from "../src"
import { Kafka } from "kafkajs"

const kafka = new Kafka({
	brokers: ["localhost:9092"]
});

(async function () { 
	await kafkaReconsume(
		kafka, 
		"my-topic",
		1202301233,
		{ groupId: "test-reconsume" },
		{
			autoCommit: false,
			eachMessage: async (item) => {
				const message = item.message.value!.toString()
				console.log(item.topic, "==>", message)
			}
		}
	)

	await kafkaReconsumeByMillisecOffset(
		kafka, 
		"my-topic",
		50000000,
		{ groupId: "test-reconsume" },
		{
			autoCommit: false,
			eachMessage: async (item) => {
				const message = item.message.value!.toString()
				console.log(item.topic, "==>", message)
			}
		}
	)

	await kafkaReconsumeFromLocalDateTime(
		kafka, 
		"my-topic",
		new Date("2023-06-06 00:00:00"),
		{ groupId: "test-reconsume" },
		{
			autoCommit: false,
			eachMessage: async (item) => {
				console.log(new Date(parseInt(item.message.timestamp)).toLocaleString())
				// const message = item.message.value!.toString()
				// console.log(item.topic, "==>", message)
			}
		}
	)


})()