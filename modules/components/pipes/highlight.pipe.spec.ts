import { HighlightPipe } from './highlight.pipe';

describe('Highlight pipe', () => {
    let pipe: HighlightPipe;

    beforeEach(() => {
        pipe = new HighlightPipe();
    });

    it('returns empty string', () => {
        expect(pipe.transform('', '')).toEqual('');
    });

    it('transform string', () => {
        expect(pipe.transform('item1', 'ite')).toEqual('<b>ite</b>m1');
    });

    it('fails gracefully when input is invalid', () => {
        const str = '////?..----dfs';
        expect(pipe.transform(str, 'ite')).toEqual(str);
    });
});
