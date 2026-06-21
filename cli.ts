#!/usr/bin/env node

import { getLocation } from './src/location.ts';

function getRandomId(pop: number = 8298979488) {
    return Math.floor(Math.random() * (pop + 1));
}

async function main() {
    const id = getRandomId();
    console.log(await getLocation(id));
}

main()
