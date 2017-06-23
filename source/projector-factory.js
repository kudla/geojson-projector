import proj4 from 'proj4';

const TRANSFORMED_PROPS = [
    'features',
    'geometry',
    'geometries',
    'bbox',
    'coordinates'
];

export default function ProjectorFactory(options) {
    let {from, to, immutable = true} = options;
    let projections = immutable ? new WeakMap() : undefined;

    return function project(source) {
        let projection = projections && projections.get(source);

        if (!projection) {
            if (source instanceof Array) {
                if (typeof source[0] === 'number') {
                    projection = source.slice();
                    for(let position=0;position<projection.length;position+=2) {
                        let point = proj4(from, to, projection.slice(position, position+2));
                        projection[position] = point[0];
                        projection[position+1] = point[1];
                    }
                } else {
                    projection = source.map(project);
                }
            } else {
                let {type} = source;
                switch(type) {
                    case 'GeometryCollection':
                    case 'FeatureCollection':
                    case 'Feature':
                    case 'Point':
                    case 'MultiPoint':
                    case 'Polygon':
                    case 'MultiPolygon':
                    case 'LineString':
                    case 'MultiLineString': {
                        projection = {...source};
                        for(let prop of TRANSFORMED_PROPS) {
                            if (prop in projection) {
                                projection[prop] = project(projection[prop]);
                            }
                        }
                        break;
                    }
                    default: {
                        throw new Error(`Can not project ${type} of ${source}`);
                    }
                }
            }
            projections && projections.set(source, projection);
        }
        return projection;
    };
}
