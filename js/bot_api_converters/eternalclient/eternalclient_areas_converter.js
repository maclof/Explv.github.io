'use strict';

import {Area} from '../../model/Area.js';
import {Areas} from '../../model/Areas.js';
import {Position} from '../../model/Position.js';
import {OSBotAreasConverter} from '../osbot/osbot_areas_converter.js';

export class EternalClientAreasConverter extends OSBotAreasConverter {
    
    constructor() {
        super();
        this.javaArea = "RectArea";
        this.javaPosition = "WorldTile";
    }
    
    /*
    API Doc:
        https://eternalclient.ams3.cdn.digitaloceanspaces.com/javadocs/1.1.1/net/eternalclient/api/wrappers/map/RectArea.html
        https://eternalclient.ams3.cdn.digitaloceanspaces.com/javadocs/1.1.1/net/eternalclient/api/wrappers/map/WorldTile.html

    RectArea(int x1, int y1, int x2, int y2)
    RectArea(int x1, int y1, int x2, int y2, int z)
    RectArea(Tile ne, Tile sw)
    
    WorldTile(int x, int y)
    WorldTile(int x, int y, int z)
    */
    fromJava(text, areas) {        
        areas.removeAll();
        text = text.replace(/\s/g, '');

        const areasPattern = `(?:new${this.javaArea}\\((\\d+,\\d+,\\d+,\\d+(?:,\\d+)?)\\)|\\(new${this.javaPosition}\\((\\d+,\\d+(?:,\\d)?)\\),new${this.javaPosition}\\((\\d+,\\d+(?:,\\d)?)\\)\\))`;
        const re = new RegExp(areasPattern,"mg");
        let match;
        while ((match = re.exec(text))) {
            if (match[1] !== undefined) {
                const values = match[1].split(",");
                const z = values.length === 4 ? 0 : values[4];
                areas.add(new Area(new Position(values[0], values[1], z), new Position(values[2], values[3], z)));
            } else {
                const pos1Values = match[2].split(",");
                const pos1Z = pos1Values.length === 2 ? 0 : pos1Values[2];

                const pos2Values = match[3].split(",");
                const pos2Z = pos2Values.length === 2 ? 0 : pos2Values[2];
                
                areas.add(new Area(new Position(pos1Values[0], pos1Values[1], pos1Z), new Position(pos2Values[0], pos2Values[1], pos2Z)));
            }
        }
    }
    
    toJavaSingle(area) {
        if (area.startPosition.z === 0) {
            return `new ${this.javaArea}(${area.startPosition.x}, ${area.startPosition.y}, ${area.endPosition.x}, ${area.endPosition.y})`;
        }
        return `new ${this.javaArea}(${area.startPosition.x}, ${area.startPosition.y}, ${area.endPosition.x}, ${area.endPosition.y}, ${area.endPosition.z})`;
    }
}