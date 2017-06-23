import ProjectorFactory from './projector-factory';

let projectors = {};
export function GeojsonProjector(from, to) {
    let options;
    if (typeof from === 'object') {
        options = from;
    } else {
        options = {from, to};
    }
    let key = projectorKey(options);
    if (!(key in projectors)) {
        projectors[key] = ProjectorFactory(options);
    }
    return projectors[key];
}
export default GeojsonProjector;

function projectorKey({from,to, immutable = true}) {
    return JSON.stringify([from,to, Boolean(immutable)]);
}
