import net from "net";

import { into_packets } from "./app/parser.mjs";
import { connect, QUEUE } from "./app/rabbitmq.mjs";

async function main() {
    const socket = new net.Socket().connect({
        host: "provider",
        port: 8282,
    });

    const mq = await connect();

    const channel = await mq.createChannel();
    await channel.assertQueue(QUEUE);

    socket.setEncoding("utf8");
    socket.addListener("data", async (buffer) => {
        for (const packet of into_packets(buffer)) {
            const json = JSON.stringify(packet);
            const buffer = Buffer.from(json, "utf8");

            channel.sendToQueue(QUEUE, buffer);
        }
    });
}

main();
