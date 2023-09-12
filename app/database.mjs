import { MongoClient } from "mongodb";

export async function connect() {
    let client;

    client = new MongoClient("mongodb://localhost:27017");
    client = await client.connect();

    return client.db("Sky-Bet");
}
