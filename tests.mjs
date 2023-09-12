import { into_packets } from "./app/parser.mjs";

const test_data = [
    {
        count: 2,
        types: ["event", "market"],
        operations: ["create", "create"],
        data: "|5448|create|event|1694109323865|e32e8bf8-c5cb-4934-982b-f4f2e7a2c924|Football|Sky Bet Championship|\|Fulham\| vs \|Sheffield Wednesday\||1694109235225|0|1|\n|5449|create|market|1694109323866|e32e8bf8-c5cb-4934-982b-f4f2e7a2c924|52fcdb9b-57e9-464e-b7fc-1e25e8f4aac7|Full Time Result|0|1|\n",
    },
    {
        count: 1,
        types: ["outcome"],
        operations: ["create"],
        data: "|5450|create|outcome|1694109323866|52fcdb9b-57e9-464e-b7fc-1e25e8f4aac7|b99bed7b-d283-4530-afe0-6720a6895627|\|Fulham\||1/16|0|1|\n",
    },
    {
        count: 3,
        types: ["outcome", "outcome", "market"],
        operations: ["create", "create", "create"],
        data: "|5451|create|outcome|1694109323866|52fcdb9b-57e9-464e-b7fc-1e25e8f4aac7|313225dd-3df5-4f56-b254-adf53043928a|Draw|6/1|0|1|\n|5452|create|outcome|1694109323866|52fcdb9b-57e9-464e-b7fc-1e25e8f4aac7|fe4ba477-933a-49c0-9c2b-c5fe1640afd4|\|Sheffield Wednesday\||4/11|0|1|\n|5453|create|market|1694109323866|e32e8bf8-c5cb-4934-982b-f4f2e7a2c924|98d33c0b-d7c0-4012-87c7-7edad318b1e7|Both Teams To Score|0|1|\n",
    },
    {
        count: 1,
        types: ["outcome"],
        operations: ["create"],
        data: "|5454|create|outcome|1694109323867|98d33c0b-d7c0-4012-87c7-7edad318b1e7|6b84d568-3d8c-4943-83ad-2e555c64fd99|Yes|5/4|0|1|\n",
    },
    {
        count: 6,
        types: ["outcome", "market", "outcome", "outcome", "outcome", "market"],
        operations: ["create", "create", "create", "create", "create", "create"],
        data: "|5455|create|outcome|1694109323867|98d33c0b-d7c0-4012-87c7-7edad318b1e7|c9587167-dfd0-4286-8e91-c6dc5e72cc01|No|1/9|0|1|\n|5456|create|market|1694109323867|e32e8bf8-c5cb-4934-982b-f4f2e7a2c924|bee8a831-a4d2-4cc9-803f-91af1c502256|Half Time Result|0|1|\n|5457|create|outcome|1694109323867|bee8a831-a4d2-4cc9-803f-91af1c502256|35541879-57f5-48af-a3cc-fcd819def3f8|\|Fulham\||11/10|0|1|\n|5458|create|outcome|1694109323867|bee8a831-a4d2-4cc9-803f-91af1c502256|dafd609f-849b-4f8b-a8b0-febb9211a09f|Draw|7/1|0|1|\n|5459|create|outcome|1694109323868|bee8a831-a4d2-4cc9-803f-91af1c502256|c09572ed-418e-4bc7-a3c8-05eef17fbc89|\|Sheffield Wednesday\||2/7|0|1|\n|5460|create|market|1694109323868|e32e8bf8-c5cb-4934-982b-f4f2e7a2c924|f92c225f-0830-47ca-b5ea-caf438b6658f|Correct Score|0|1|\n",
    },
    {
        count: 1,
        types: ["outcome"],
        operations: ["create"],
        data: "|5461|create|outcome|1694109323868|f92c225f-0830-47ca-b5ea-caf438b6658f|1851d1b4-9b40-47d1-9aa6-ff58fe72da19|\|Fulham\| 1-0|9/4|0|1|\n",
    },
    {
        count: 1,
        types: ["outcome"],
        operations: ["create"],
        data: "|5462|create|outcome|1694109323868|f92c225f-0830-47ca-b5ea-caf438b6658f|973a3462-6154-4aa2-a19a-ca7c90f96ee2|Draw 0-0|11/8|0|1|\n",
    },
    {
        count: 1,
        types: ["outcome"],
        operations: ["create"],
        data: "|5463|create|outcome|1694109323868|f92c225f-0830-47ca-b5ea-caf438b6658f|dca1739a-4a43-4f7d-8ad5-92086b7ce9b5|\|Sheffield Wednesday\| 0-1|5/1|0|1|\n",
    },
    {
        count: 1,
        types: ["outcome"],
        operations: ["create"],
        data: "|5464|create|outcome|1694109323868|f92c225f-0830-47ca-b5ea-caf438b6658f|22d63907-f5e1-4c27-a69d-02472ab5b989|\|Fulham\| 2-0|1/20|0|1|\n",
    },
    {
        count: 4,
        types: ["outcome", "outcome", "outcome", "outcome"],
        operations: ["create", "create", "create", "create"],
        data: "|5465|create|outcome|1694109323869|f92c225f-0830-47ca-b5ea-caf438b6658f|fe351028-4ea5-465c-a291-46f792699ad3|Draw 1-1|11/8|0|1|\n|5466|create|outcome|1694109323869|f92c225f-0830-47ca-b5ea-caf438b6658f|62854a2e-37ff-4f04-941d-b2d8fd11b83f|\|Sheffield Wednesday\| 0-2|1/200|0|1|\n|5467|create|outcome|1694109323869|f92c225f-0830-47ca-b5ea-caf438b6658f|15583b4a-fc75-4e5b-91e1-d24eff3ca874|\|Fulham\| 3-0|4/7|0|1|\n|5468|create|outcome|1694109323870|f92c225f-0830-47ca-b5ea-caf438b6658f|94bbc3ce-d35d-4942-8890-dcbed631d754|Draw 2-2|9/4|0|1|\n",
    },
    {
        count: 1,
        types: ["outcome"],
        operations: ["create"],
        data: "|5469|create|outcome|1694109323870|f92c225f-0830-47ca-b5ea-caf438b6658f|c8ec2cf4-c89e-41c4-bc7f-79232ac70d64|\|Sheffield Wednesday\| 0-3|4/1|0|1|\n",
    },
];

function run() {
    console.log(`Running ${test_data.length} Tests`);

    let passed_count = 0;

    next_test:
    for (const { count, types, operations, data } of test_data) {
        const results = Array.from(into_packets(data));

        if (results.length !== count) {
            console.log(`Test Failed: Parsed ${results.length}, expecting ${count}`);
            continue next_test;
        }

        for (let i = 0; i < results.length; i += 1) {
            const { head } = results[i];

            if (head.type !== types[i]) {
                console.log(`Test Failed: Type[${i}] was ${head.type}, expecting ${types[i]}`);
                continue next_test;
            }

            if (head.operation !== operations[i]) {
                console.log(`Test Failed: Operation[${i}] was ${head.operation}, expecting ${operations[i]}`);
                continue next_test;
            }
        }

        console.log("Test Passed");
        passed_count += 1;
    }

    console.log(`Passed ${passed_count} of ${test_data.length} Tests`);
}

run();
