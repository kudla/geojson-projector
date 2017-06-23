import proj4 from 'proj4';

export default function ProjectorFactory(options) {
    let {from, to, immutable = true} = options;
    let projections = immutable ? new WeakMap() : undefined;

    return function project(source) {
        let projection = projections && projections.get(source);

        if (!projection) {
            if (source instanceof Array) {
                if (source[0] instanceof Array) {
                    projection = source.map(project);
                } else {
                    projection = proj4(from, to, source.slice());
                }
            } else {
                let {type} = source;
                switch(type) {
                    case 'FeatureCollection': {
                        let {features} = source;
                        features = features.map(project);
                        projection = {...source, features};
                        break;
                    }
                    case 'Feature': {
                        let {geometry} = source;
                        geometry = project(geometry);
                        projection = {...source, geometry};
                        break;
                    }
                    case 'Point':
                    case 'Polygon':
                    case 'LineString': {
                        let {coordinates} = source;
                        coordinates = project(coordinates);
                        projection = {...source, coordinates};
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
