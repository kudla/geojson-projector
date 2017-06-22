import GeojsonProjector from '../dist/geojson-projector';
import { expect } from 'chai';

describe('GeojsonProjector', () => {
    it('should return projector of function type', () => {
        let from = 'EPSG:4326';
        let to = 'EPSG:3857';
        let projector = GeojsonProjector(from, to);

        expect(projector).to.be.an('function');
    });

    it('should return same projector for same directions', () => {
        let from = 'EPSG:4326';
        let to = 'EPSG:3857';
        let projector1 = GeojsonProjector(from, to);
        let projecctor2 = GeojsonProjector({from, to});

        expect(projecctor2).to.equal(projector1);
    });

    it('should return different projectors for different directions', () => {
        let from = 'EPSG:4326';
        let to1 = 'EPSG:3857';
        let to2 = 'EPSG:4281';
        let projector1 = GeojsonProjector(from, to1);
        let projecctor2 = GeojsonProjector({from, to2});

        expect(projecctor2).not.equal(projector1);
    });

    it('should return same projection instances for same input', () => {
        let from = 'EPSG:4326';
        let to = 'EPSG:3857';
        let projector = GeojsonProjector(from, to);
        let geojson = {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [30, 30]
            }
        };
        let projection1 = projector(geojson);
        let projection12= projector(geojson);

        expect(projection12).to.equal(projection1);
    });
});
