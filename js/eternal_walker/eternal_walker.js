'use strict';

import { Position } from '../model/Position.js';

const API_URL = "https://walker.eternalclient.net/path";

const errorMessageMapping = {
    "UNMAPPED_REGION": "Unmapped region",
    "BLOCKED": "Tile is blocked",
    "EXCEEDED_SEARCH_LIMIT": "Exceeded search limit",
    "UNREACHABLE": "Unreachable tile",
    "NO_WEB_PATH" : "No web path",
    "INVALID_CREDENTIALS": "Invalid credentials",
    "RATE_LIMIT_EXCEEDED": "Rate limit exceeded",
    "NO_RESPONSE_FROM_SERVER": "No response from server",
    "UNKNOWN": "Unknown"
};

export function getPath({start, end, onSuccess, onError}) {
    $.ajax({
        url: API_URL,
        type: 'POST',
        data: JSON.stringify({
            "start": {
                "x": parseInt(start.x),
                "y": parseInt(start.y),
                "z": parseInt(start.z)
            },
            "end": {
                "x": parseInt(end.x),
                "y": parseInt(end.y),
                "z": parseInt(end.z)
            },
            "gamestate": {
                "member": true
            }
        }),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            const pathPositions = data.path.map(obj => new Position(obj.x, obj.y, obj.z));
            onSuccess(pathPositions);
        },
        error: function (data) {
            onError(start, end, errorMessageMapping[data]);
        }
    });
}