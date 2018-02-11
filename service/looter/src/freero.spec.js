"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var freero_1 = require("./freero");
var FreeRoCardInfoExtractor = freero_1.FreeRo.FreeRoCardInfoExtractor;
it('should work', function () {
    expect(true).toBe(true);
});
describe('FreeRoCardInfoExtractor', function () {
    var extractor = new FreeRoCardInfoExtractor();
    it('should be applicable', function () {
        var args = {
            author: 'FreeRO',
            message: '#main : [Server] \'ponoroshku\' выбил \'Hydra Card\'. Грац!',
            date: new Date()
        };
        var actual = extractor.applicable(args);
        var expected = true;
        expect(actual).toBe(expected);
    });
    it('should be not applicable for not server messages', function () {
        var args = {
            author: 'KudesniK',
            message: '#main : [Server] \'ponoroshku\' выбил \'Hydra Card\'. Грац!',
            date: new Date()
        };
        var actual = extractor.applicable(args);
        var expected = false;
        expect(actual).toBe(expected);
    });
    it('should be not applicable for not card messages from server', function () {
        var args = {
            author: 'FreeRO',
            message: '[KudesniK] : Hello world',
            date: new Date()
        };
        var actual = extractor.applicable(args);
        var expected = false;
        expect(actual).toBe(expected);
    });
    it('should be not applicable for not card messages from not server', function () {
        var args = {
            author: 'KudesniK',
            message: 'Hello world',
            date: new Date()
        };
        var actual = extractor.applicable(args);
        var expected = false;
        expect(actual).toBe(expected);
    });
    it('should work for stream data', function () {
        var args = [
            {
                author: 'FreeRO',
                message: '#main : [Server] \'ponoroshku\' выбил \'Hydra Card\'. Грац!',
                date: new Date()
            },
            {
                author: 'KudesniK',
                message: 'Hello world',
                date: new Date()
            },
            {
                author: 'KudesniK',
                message: '#main : [Server] \'ponoroshku\' выбил \'Hydra Card\'. Грац!',
                date: new Date()
            },
            {
                author: 'FreeRO',
                message: '#main : [Server] \'ponoroshku\' выбил \'Hydra Card\'. Грац!',
                date: new Date()
            }
        ];
        var actual = args.map(extractor.applicable.bind(extractor));
        var expected = [true, false, false, true];
        expect(actual).toEqual(expected);
    });
});
//# sourceMappingURL=freero.spec.js.map