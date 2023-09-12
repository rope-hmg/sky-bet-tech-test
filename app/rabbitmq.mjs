import { connect as mq_connect } from "amqplib";

export const QUEUE = "store-fixtures";

export async function connect() {
    const mq = await mq_connect({
        protocol: "amqp",
        hostname: "rabbitmq",
        port: 5672,
        username: "rabbitmq",
        password: "rabbitmq",
        vhost: "/feedme",
    });

    return mq;
}
