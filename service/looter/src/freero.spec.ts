import {FreeRo} from "./freero";
import FreeRoCardInfoExtractor = FreeRo.FreeRoCardInfoExtractor;


it('should work', () => {
    expect(true).toBe(true);
});

describe('FreeRoCardInfoExtractor', () => {
    const extractor = new FreeRoCardInfoExtractor();

    it('should be applicable', () => {
        const args = {
            author: 'FreeRO',
            message: '#main : [Server] \'ponoroshku\' выбил \'Hydra Card\'. Грац!',
            date: new Date()
        };

        const actual = extractor.applicable(args);
        const expected = true;

        expect(actual).toBe(expected);
    });

    it('should be not applicable for not server messages', () => {
        const args = {
            author: 'KudesniK',
            message: '#main : [Server] \'ponoroshku\' выбил \'Hydra Card\'. Грац!',
            date: new Date()
        };

        const actual = extractor.applicable(args);
        const expected = false;

        expect(actual).toBe(expected);
    });

    it('should be not applicable for not card messages from server', () => {
        const args = {
            author: 'FreeRO',
            message: '[KudesniK] : Hello world',
            date: new Date()
        };

        const actual = extractor.applicable(args);
        const expected = false;

        expect(actual).toBe(expected);
    });

    it('should be not applicable for not card messages from not server', () => {
        const args = {
            author: 'KudesniK',
            message: 'Hello world',
            date: new Date()
        };

        const actual = extractor.applicable(args);
        const expected = false;

        expect(actual).toBe(expected);
    });

    it('should work for stream data', () => {
        const args = [
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

        const actual = args.map(extractor.applicable.bind(extractor));
        const expected = [true, false, false, true];

        expect(actual).toEqual(expected);

    });
});