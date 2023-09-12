import { connect as db_connect } from "./app/database.mjs";
import { connect as mq_connect, QUEUE } from "./app/rabbitmq.mjs";

async function event_create(collections, body) {
    await collections.events.insertOne(body);
}

async function event_update(collections, body) {
    await collections.events.updateOne(
        { eventId: body.eventId },
        {
            $push: {
                updates: {
                    category: body.category,
                    subCategory: body.subCategory,
                    name: body.name,
                    startTime: body.startTime,
                    displayed: body.displayed,
                    suspended: body.suspended,
                },
            },
        },
    );
}

async function market_create(collections, body) {
    await Promise.all([
        collections.events.updateOne(
            { eventId: body.eventId },
            { $push: { markets: body.marketId } },
        ),

        collections.markets.insertOne(body),
    ]);
}

async function market_update(collections, body) {
    await collections.markets.updateOne(
        { marketId: body.marketId },
        {
            $push: {
                updates: {
                    name: body.name,
                    displayed: body.displayed,
                    suspended: body.suspended,
                }
            }
        },
    );
}

async function outcome_create(collections, body) {
    await Promise.all([
        collections.markets.updateOne(
            { marketId: body.marketId },
            { $push: { outcomes: body.outcomeId } },
        ),

        collections.outcomes.insertOne(body),
    ]);
}

async function outcome_update(collections, body) {
    await collections.outcomes.updateOne(
        { outcomeId: body.outcomeId },
        {
            $push: {
                updates: {
                    name: body.name,
                    price: body.price,
                    displayed: body.displayed,
                    suspended: body.suspended,
                }
            }
        },
    );
}

const type_table = {
    event: {
        create: event_create,
        update: event_update,
    },
    market: {
        create: market_create,
        update: market_update,
    },
    outcome: {
        create: outcome_create,
        update: outcome_update,
    },
}

async function main() {
    // Connect to the Database and get the collections we
    // need for storing the fixtures.
    const db = await db_connect();

    const collections = {
        events: db.collection("events"),
        markets: db.collection("markets"),
        outcomes: db.collection("outcomes"),
    };

    // Connect to the RabbitMQ queue for receiving the fixtures.
    const mq = await mq_connect();

    const channel = await mq.createChannel();
    await channel.assertQueue(QUEUE);

    channel.consume(QUEUE, async (message) => {
        const json = message.content.toString("utf8");
        const { head, body } = JSON.parse(json);

        // NOTE:
        // I would have preferred to do `type_table[head.type]?.[head.operation]?.(collections, body)`
        // but that doesn't allow me to handle the cases where things don't exist. In a real version
        // of this application those cases would be logged to something like Sentry or DataDog.
        const operation = type_table[head.type]?.[head.operation];

        if (operation) {
            operation(collections, body);
        } else {
            console.log(`No operation defined for: ${head.type}_${head.operation}`);
        }
    });
}

main();
