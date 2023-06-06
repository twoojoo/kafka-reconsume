"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const kafkajs_1 = require("kafkajs");
const kafka = new kafkajs_1.Kafka({
    brokers: ["localhost:9092"]
});
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, src_1.kafkaReconsume)(kafka, "my-topic", 1202301233, { groupId: "test-reconsume" }, {
            autoCommit: false,
            eachMessage: (item) => __awaiter(this, void 0, void 0, function* () {
                const message = item.message.value.toString();
                console.log(item.topic, "==>", message);
            })
        });
        yield (0, src_1.kafkaReconsumeByMillisecOffset)(kafka, "my-topic", 50000000, { groupId: "test-reconsume" }, {
            autoCommit: false,
            eachMessage: (item) => __awaiter(this, void 0, void 0, function* () {
                const message = item.message.value.toString();
                console.log(item.topic, "==>", message);
            })
        });
        yield (0, src_1.kafkaReconsumeFromLocalDateTime)(kafka, "my-topic", new Date("2023-06-06 00:00:00"), { groupId: "test-reconsume" }, {
            autoCommit: false,
            eachMessage: (item) => __awaiter(this, void 0, void 0, function* () {
                console.log(new Date(parseInt(item.message.timestamp)).toLocaleString());
                // const message = item.message.value!.toString()
                // console.log(item.topic, "==>", message)
            })
        });
    });
})();
