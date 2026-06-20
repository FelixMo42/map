#!/usr/bin/env node

import initGdalJs from 'gdal3.js/node.js';
import { fromFile, GeoTIFFImage } from 'geotiff';

const MAP_FILE = 'data/map.tif'

function pixelToWorld(geoTransform: number[], x: number, y: number) {
    return [
        geoTransform[0] + (geoTransform[1] * x) + (geoTransform[2] * y),
        geoTransform[3] + (geoTransform[4] * x) + (geoTransform[5] * y),
    ];
}

async function weightedSample(image: GeoTIFFImage) {
    const width = image.getWidth()
    const nodata = image.getGDALNoData()

    let best = null;

    const raster = await image.readRasters({
        samples: [0],
        interleave: true,
    });

    for (let i = 0; i < raster.length; i += 1) {
        const weight = raster[i];
        if (!Number.isFinite(weight) || weight <= 0 || weight === nodata) {
            continue;
        }

        const key = -Math.log(Math.random()) / weight;
        if (!best || key < best.key) {
            best = {
                key,
                weight,
                x: i % width,
                y: Math.floor(i / width),
            };
        }
    }

    if (!best) {
        throw new Error('Empty map!');
    }

    return best;
}

async function main() {
    const Gdal = await initGdalJs();
    const result = await Gdal.open(MAP_FILE);
    const dataset = result.datasets[0];

    try {
        const info = await Gdal.getInfo(dataset);
        if (info.type !== 'raster' || !info.coordinateTransform) {
            throw new Error(`Expected a raster GeoTIFF, got ${info.type}`);
        }

        const tiff = await fromFile(MAP_FILE);
        const image = await tiff.getImage();
    
        const sample = await weightedSample(image);

        const [worldX, worldY] = pixelToWorld(
            info.coordinateTransform,
            sample.x + Math.random(),
            sample.y + Math.random(),
        );

        const transformed = await Gdal.gdaltransform(
            [[worldX, worldY]],
            ['-s_srs', info.projectionWkt, '-t_srs', 'EPSG:4326', '-output_xy'],
        );
        const [longitude, latitude] = transformed[0];

        console.log(JSON.stringify({
            longitude,
            latitude,
            populationWeight: sample.weight,
            pixel: {
                x: sample.x,
                y: sample.y,
            },
        }, null, 2));
    } finally {
        await Gdal.close(dataset);
    }
}

main()
