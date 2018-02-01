import {assert} from 'chai';
import browserEnv from '../src/class/browserEnv';

// test string
const MSIE7: string = "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)";
const MSIE9: string = "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)";
const MSIE10: string = "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Win64; x64; Trident/6.0)";
const MSIE11: string = "Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; Touch; rv:11.0) like Gecko";
const CG28: string = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.52 Safari/537.36';
const SF11: string = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Safari/604.1.38';
const iOS6: string = 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A403 Safari/8536.25';
const AND4 = 'Mozilla/5.0 (Linux; U; Android 4.1.1; ja-jp; Galaxy Nexus Build/JRO03H) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30';

describe('browserEnv', () => {
  describe('getVer', () => {
    it('returns undef correctly', () => {
      assert.isUndefined(browserEnv.getVer(MSIE9, 'mac os ', /;\)/));
    });
    it('returns OS Version correctly', () => {
      assert.deepEqual(browserEnv.getVer(MSIE7, 'windows ', ')'), "nt 5.1");
      assert.deepEqual(browserEnv.getVer(MSIE9, 'windows ', ';'), "nt 6.1");
      assert.deepEqual(browserEnv.getVer(MSIE10, 'windows ', ';'), "nt 6.2");
    });
    it('returns Browser Version string correctly in IE(msie)', () => {
      assert.deepEqual(browserEnv.getVer(MSIE7, 'msie ', ';'), "7.0");
      assert.deepEqual(browserEnv.getVer(MSIE9, 'msie ', ';'), "9.0");
      // IE11は'MSIE'を含まないのでUndefinedが返ってくるはず
      assert.isUndefined(browserEnv.getVer(MSIE11, 'msie ', ';'));

    });
    it('returns Browser Version string correctly in trident', () => {
      assert.isUndefined(browserEnv.getVer(MSIE7, 'trident/', ';'));
      assert.deepEqual(browserEnv.getVer(MSIE9, 'trident/', ')'), "5.0");
      assert.deepEqual(browserEnv.getVer(MSIE10, 'trident/', ')'), "6.0");
      assert.deepEqual(browserEnv.getVer(MSIE11, 'trident/', ')'), "7.0; touch; rv:11.0");
    });
  });
  describe('browserEnv', () => {
    it('defines IE 7', () => {
      const retVal = browserEnv.browserEnv(MSIE7);
      assert.isTrue(retVal.isPC);
      assert.isFalse(retVal.isSP);
      assert.isTrue(retVal.isIE);
      assert.isFalse(retVal.isWebKit);
      assert.deepEqual(retVal.browserVer, '7.0');
      assert.deepEqual(retVal.OSVer, '5.1');
    });
    it('defines IE 9', () => {
      const retVal = browserEnv.browserEnv(MSIE9);
      assert.isTrue(retVal.isPC);
      assert.isFalse(retVal.isSP);
      assert.isTrue(retVal.isIE);
      assert.isFalse(retVal.isWebKit);
      assert.deepEqual(retVal.browserVer, '9.0');
      assert.deepEqual(retVal.OSVer, '6.1');
    });
    it('defines IE 11', () => {
      const retVal = browserEnv.browserEnv(MSIE11);
      assert.isTrue(retVal.isPC);
      assert.isFalse(retVal.isSP);
      assert.isTrue(retVal.isIE);
      assert.isFalse(retVal.isWebKit);
      assert.deepEqual(retVal.browserVer, '11.0');
      assert.deepEqual(retVal.OSVer, '6.3');
      assert.deepEqual(retVal.clickEv, 'click');
    });
    it('defines Chrome 28', () => {
      const retVal = browserEnv.browserEnv(CG28);
      assert.isTrue(retVal.isPC);
      assert.isFalse(retVal.isSP);
      assert.isFalse(retVal.isIE);
      assert.isTrue(retVal.isWebKit);
      assert.deepEqual(retVal.browserVer, '28.0.1500.52');
      assert.deepEqual(retVal.OSVer, null);
      assert.deepEqual(retVal.clickEv, 'click');
    });
    it('defines Chrome 28', () => {
      const retVal = browserEnv.browserEnv(CG28);
      assert.isTrue(retVal.isPC);
      assert.isFalse(retVal.isSP);
      assert.isFalse(retVal.isIE);
      assert.isTrue(retVal.isWebKit);
      assert.deepEqual(retVal.browserVer, '28.0.1500.52');
      assert.deepEqual(retVal.clickEv, 'click');
    });
    it('defines Safari 11', () => {
      const retVal = browserEnv.browserEnv(SF11);
      assert.isTrue(retVal.isPC);
      assert.isFalse(retVal.isSP);
      assert.isFalse(retVal.isIE);
      assert.isTrue(retVal.isWebKit);
      assert.deepEqual(retVal.browserVer, '11.0');
      assert.deepEqual(retVal.OSVer, null);
      assert.deepEqual(retVal.clickEv, 'click');
    });
    it('defines iOS 6', () => {
      const retVal = browserEnv.browserEnv(iOS6);
      assert.isFalse(retVal.isPC);
      assert.isTrue(retVal.isSP);
      assert.isFalse(retVal.isIE);
      assert.isTrue(retVal.isWebKit);
      assert.isTrue(retVal.isiOS);
      assert.deepEqual(retVal.browserVer, '6.0');
      assert.deepEqual(retVal.OSVer, '6.0');
      assert.deepEqual(retVal.clickEv, 'touchend');
    });
    it('defines Android 4', () => {
      const retVal = browserEnv.browserEnv(AND4);
      assert.isFalse(retVal.isPC);
      assert.isTrue(retVal.isSP);
      assert.isFalse(retVal.isIE);
      assert.isTrue(retVal.isWebKit);
      assert.isFalse(retVal.isiOS);
      assert.deepEqual(retVal.browserVer, '4.1.1');
      assert.deepEqual(retVal.OSVer, '4.1.1');
      assert.deepEqual(retVal.clickEv, 'touchend');
    });
  });
});
