import {assert} from 'chai';
import Loader from '../src/class/loader';

declare var __html__: { [path: string]: string };
// test string

describe('loader', () => {
  describe('addChild', () => {
    let container: HTMLElement = null;
    let loader: Loader = null;

    beforeEach(() => {
      document.body.innerHTML = __html__['test/test_image.html'];
      container = document.getElementById('testParent');

      loader = new Loader();
    });
    afterEach(() => {
      document.body.innerHTML = '';
    });
    it('should loader get images', () => {
      const imgLength: number = document.getElementsByTagName('img').length;
      const bgiLength: number = document.getElementsByClassName('loader_bgi').length;
      const loaderParam = loader.activateLoader();
      assert.equal(loaderParam.images.length, imgLength + bgiLength);
      assert.equal(loaderParam.expectedCount, imgLength + bgiLength);
    });
  });
});
