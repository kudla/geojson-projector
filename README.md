# geojson-projector
Fast projector for immutable GeoJSON. It can project any branch of GeoJSON object.

`geojson-projector` can produce the cacheing of projected values which is a good point while one is using immutable data flow.

### Instalation
```bash
npm install --save geojson-projector
```

### Usage

```js
import GeojsonProjector from 'gojson-projector';
let project = GeojsonProjector('EPSG:4326', 'EPSG:3857');

// use cases
let coordinates = project([-122.416667, 37.783333]);
let geometry = project({
    "type": "Point",
    "coordinates": [-122.416667, 37.783333]
});
let feature = project({
    "type": "Feature",
    "geometry": {
        "type": "LineString",
        "coordinates": [
            [-122.416667, 37.783333],
            [4.900000, 52.366667]
        ]
    }

});
let geojson = project({
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [-122.416667, 37.783333]
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [-122.416667, 37.783333],
                    [4.900000, 52.366667]
                ]
            }

        }
    ]
})
```

### Immutable input GeoJSON mode
In case of immutable input GeoJSON mode projector produce cacheing of output results based upon input source instance. Immutable input GeoJSON mode is used by default.
```js
import {isEqual, clone} from 'lodash';
import {GeojsonProjector} from 'gojson-projector';

let project = GeojsonProjector({
    from: 'EPSG:4326',
    to: 'EPSG:3857',
    immutable: true
});
let geometry = project({
    "type": "Point",
    "coordinates": [-122.416667, 37.783333]
});
let projection1 = project(geometry);
let projection2 = project(geometry);
let projectionOfClone = project(clone(geometry));

console.log(projection1 === projection2); // true
console.log(projection1 !== projectionOfClone); // true
console.log(isEqual(projection1, projectionOfClone)); // true
```
### Mutable input GeoJSON mode
In case of mutable input GeoJSON mode projector produce a new calculation per each project call.
```js
import {isEqual, clone} from 'lodash';
import {GeojsonProjector} from 'gojson-projector';

let project = GeojsonProjector({
    from: 'EPSG:4326',
    to: 'EPSG:3857',
    immutable: false
});
let geometry = project({
    "type": "Point",
    "coordinates": [-122.416667, 37.783333]
});
let projection1 = project(geometry);
let projection2 = project(geometry);

console.log(projection1 !== projection2); // true
console.log(isEqual(projection1, projectionOfClone)); // true
```
