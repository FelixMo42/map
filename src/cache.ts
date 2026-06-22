import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

type CacheStore = Record<string, unknown>;

const CACHE_FILE = path.resolve(process.cwd(), '.cache', 'cache.json');

let cacheStore: CacheStore | null = null;

async function loadCache() {
    if (cacheStore) {
        return cacheStore;
    }

    try {
        const raw = await readFile(CACHE_FILE, 'utf8');
        cacheStore = JSON.parse(raw) as CacheStore;
    } catch (error) {
        if (error instanceof SyntaxError) {
            cacheStore = {};
        } else if (error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
            cacheStore = {};
        } else {
            throw error;
        }
    }

    return cacheStore ?? {};
}

async function saveCache() {
    if (!cacheStore) {
        cacheStore = {};
    }

    await mkdir(path.dirname(CACHE_FILE), { recursive: true });
    await writeFile(CACHE_FILE, JSON.stringify(cacheStore, null, 2), 'utf8');
}

export async function has(name: string) {
    const cache = await loadCache();
    return Object.prototype.hasOwnProperty.call(cache, name);
}

export async function get<T>(name: string) {
    const cache = await loadCache();
    return cache[name] as T | undefined;
}

export async function set<T>(name: string, value: T) {
    const cache = await loadCache();
    cache[name] = value;
    cacheStore = cache;
    await saveCache();
}
