'use strict';

import {PolyArea} from '../../model/PolyArea.js';
import {Position} from '../../model/Position.js';
import {OSBotPolyAreaConverter} from '../osbot/osbot_polyarea_converter.js';

export class EternalClientPolyAreaConverter extends OSBotPolyAreaConverter {

    constructor() {
        super();
        this.javaArea = "PolyArea";
        this.javaPosition = "WorldTile";
    }
    
    /*
    API Doc:
        https://eternalclient.ams3.cdn.digitaloceanspaces.com/javadocs/1.1.1/net/eternalclient/api/wrappers/map/PolyArea.html
        https://eternalclient.ams3.cdn.digitaloceanspaces.com/javadocs/1.1.1/net/eternalclient/api/wrappers/map/WorldTile.html

    PolyArea(Tile... tiles)
    
    WorldTile(int x, int y)
    WorldTile(int x, int y, int z)
    */
    fromJava(text, polyarea) {
        polyarea.removeAll();
        text = text.replace(/\s/g, '');

        const positionsPattern = `new${this.javaPosition}\\((\\d+,\\d+(?:,\\d)?)\\)`;
        const re = new RegExp(positionsPattern, "mg");
        let match;
        while ((match = re.exec(text))) {
            const values = match[1].split(",");
            const z = values.length === 2 ? 0 : values[2];
            polyarea.add(new Position(values[0], values[1], z));
        }
    }
    
    toJava(polyarea) {
        if (polyarea.positions.length === 0) {
            return "";
        }
        let output = `${this.javaArea} area = new ${this.javaArea}(\n    new ${this.javaPosition}[] {`;
        for (let i = 0; i < polyarea.positions.length; i++) {
            const position = polyarea.positions[i];
            output += `\n        new ${this.javaPosition}(${position.x}, ${position.y}, ${position.z})`;
            if (i !== polyarea.positions.length - 1) {
                output += ",";
            }
        }
        output += "\n    }\n);";
        return output;
    }
}