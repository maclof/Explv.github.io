'use strict';

import {Position} from '../../model/Position.js';
import {Path} from '../../model/Path.js';
import {OSBotPathConverter} from '../osbot/osbot_path_converter.js';

export class EternalClientPathConverter extends OSBotPathConverter {

    constructor() {
        super();
        this.javaArea = "RectArea";
        this.javaPosition = "WorldTile";
    }
    
    /*
    API Doc:
        https://eternalclient.ams3.cdn.digitaloceanspaces.com/javadocs/1.1.1/net/eternalclient/api/wrappers/map/WorldTile.html

    WorldTile(int x, int y)
    WorldTile(int x, int y, int z)
    */
    fromJava(text, path) {
        path.removeAll();
        text = text.replace(/\s/g, '');
        const posPattern = `new${this.javaPosition}\\((\\d+,\\d+(?:,\\d)?)\\)`;
        const re = new RegExp(posPattern, "mg");
        let match;
        while ((match = re.exec(text))) {
            const values = match[1].split(",");
            const z = values.length === 2 ? 0 : values[2];
            path.add(new Position(values[0], values[1], z));
        }
    }
}