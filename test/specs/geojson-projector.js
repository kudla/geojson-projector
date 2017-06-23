import GeojsonProjector from '../../dist/geojson-projector';
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

    let cases = [
        'coordinate',
        'coordinate set',
        'coordinate multiset',
        'point',
        'multi-point',
        'line-string',
        'multi-line-string',
        'polygon',
        'multi-polygon',
        'geometry collection',
        'feature',
        'feature bbox',
        'feature collection',
        'feature collection bbox'
    ];
    let projections = ['EPSG:3857'];
    cases.forEach(sourceCase => {
        describe(`${sourceCase}`, () => {
            let source;
            beforeEach(() => {
                source = require(`../fixtures/${sourceCase}/source`);
            });
            projections.forEach(projectTo => {
                describe(`to ${projectTo} projection`, () => {
                    let projector;
                    let expectedProjection;

                    beforeEach(() => {
                        expectedProjection = require(`../fixtures/${sourceCase}/${projectTo.replace(':', '-').toLowerCase()}`);
                    });

                    describe('imutable input', () => {
                        beforeEach(() => {
                            projector = GeojsonProjector('EPSG:4326', projectTo);
                        });
                        it ('should return same projected instance for same input instance', () => {
                            let projection1 = projector(source);
                            let projection2 = projector(source);
                            expect(projection2).to.equal(projection1);
                        });

                        it('should return same projected values for same input values', () => {
                            let projection1 = projector(source);
                            let projection2 = projector(source instanceof Array ? source.slice() : {...source});
                            expect(projection2).deep.equal(projection1);
                        });

                        it('should produce valid projections', () => {
                            let projection = projector(source);
                            expect(projection).deep.equal(expectedProjection);
                        });

                    });
                    describe('mutable input', () => {
                        beforeEach(() => {
                            projector = GeojsonProjector({from: 'EPSG:4326', to: projectTo, immutable: false});
                        });
                        it ('should return new projected instance for each call', () => {
                            let projection1 = projector(source);
                            let projection2 = projector(source);
                            expect(projection2).to.not.equal(projection1);
                        });

                        it('should return same projected values for same input values', () => {
                            let projection1 = projector(source);
                            let projection2 = projector(source instanceof Array ? source.slice() : {...source});
                            expect(projection2).deep.equal(projection1);
                        });

                        it('should produce valid projections', () => {
                            let projection = projector(source);
                            expect(projection).deep.equal(expectedProjection);
                        });

                    });
                });
            });
        });
    });
});
