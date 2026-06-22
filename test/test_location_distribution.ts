import { getLocation } from '#src/location';

export async function test$locationDistribution() {
    const locations = []
    for (let i = 0; i < 100; i += 1) {
        const location = await getLocation(i)
        locations.push(location)
        console.log(location)
    }
}
