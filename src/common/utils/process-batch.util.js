export const processInBatches = async (tasks, batchSize = 20) => {
    const results = [];

    for await (let i = 0; i < tasks.length; i += batchSize) {
        const batch = tasks.slice(i, i + batchSize);
        console.log(`Processing batch: ${i / batchSize + 1}`);

        const batchResults = await Promise.allSettled(batch.map((task) => task()));

        results.push(...batchResults);
    }

    return results;
};
