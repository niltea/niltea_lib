import {assert} from 'chai';
import browserEnv from '../src/class/browserEnv';

describe('browserEnv', () => {
  const MSIE9: string = "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)";
  const MSIE10: string = "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Win64; x64; Trident/6.0)";
  describe('getVer', () => {
    it('returns OS Version correctly', () => {
      assert.equal(browserEnv.getVer(MSIE9, 'windows ', ';'), "windows nt 6.1");
      assert.equal(browserEnv.getVer(MSIE10, 'windows ', ';'), "windows nt 6.2");
    });
    it('returns OS Version string correctly', () => {
      assert.equal(browserEnv.getVer(MSIE9, 'trident/', ')'), "trident/5.0");
      assert.equal(browserEnv.getVer(MSIE10, 'trident/', ')'), "trident/6.0");
    });
    describe('getVer', () => {
    });
  });
});
