import { getLocation } from '#src/location';

export async function test$locationDistribution() {
    const N = 500

    const locations = new Map<string, number>()
    for (let i = 0; i < N; i += 1) {
        const location = await getLocation(i)
        locations.set(
            location?.country_code,
            (locations.get(location?.country_code) ?? 0) + 1
        )
    }

    console.log("## Results")
    for (const [cc, num] of [...locations.entries()].sort((a, b) => a[1] - b[1])) {
        const interval = wilsonInterval(num, N)

        if (interval.estimate < 0.01) {
            continue
        }

        const p = (interval.estimate * 100).toFixed(1)
        const r = (interval.spread * 100).toFixed(1)

        if (cc in country_expected_percent) {
            const ex = country_expected_percent[cc]
            const e = (ex * 100).toFixed(1)
            if (interval.lo < ex && ex < interval.hi) {
                console.log(`√ ${cc} (${num}) = ${p}% ±${r}% (expected: ${e}%)`)
            } else {
                console.log(`X ${cc} (${num}) = ${p}% ±${r}% (expected: ${e}%) [${interval.lo} - ${interval.hi}]`)
            }
        } else {
            console.log(`- ${cc} (${num}) = ${p}% ±${r}%`)
        }
    }
}

function wilsonInterval(k: number, n: number) {
    const p = k / n;
    const z = 1.96; // for 95%
    const z2 = z * z;

    const denom = 1 + z2 / n;
    const center = (p + z2 / (2 * n)) / denom;
    const spread = (z * Math.sqrt(p * (1 - p) / n + z2 / (4 * n * n))) / denom;

    return {
        estimate: p,
        spread,
        lo: Math.max(0, center - spread),
        hi: Math.min(1, center + spread),
    };
}

/**
 * Data from wikipedia[^3]
 */
const country_expected_percent: { [key: string]: number } = {
    "in": .172,
    "cn": .170,
    "us": .041,
    "id": .035,
    "pk": .029,
    "ng": .027,
    "br": .026,
    "bd": .021,
    "ru": .018,
    "mx": .016,
    "jp": .015,
    "ph": .014,
    "cd": .014,
    "et": .014,
    "eg": .013,
}