import {assert} from 'chai';
import domOperator from '../src/class/domOperator';

declare var __html__: { [path: string]: string };
// test string

describe('domOperator', () => {
  describe('addChild', () => {
    let container: HTMLElement = null;
    beforeEach(() => {
      document.body.innerHTML = __html__['test/test.html'];
      container = document.getElementById('testParent');
    });
    afterEach(() => {
      document.body.innerHTML = '';
    });
    // test
    it('create new DIV element, with no options', () => {
      const createdElement = domOperator.addChild();
      // console.log(createdElement)
      assert.equal(createdElement.tagName, 'DIV');
    });
    it('create new element can be get by ID', () => {
      const testStr = 'this is test string';
      const createdElement = domOperator.addChild({
        element: 'span',
        id: 'testSpan',
        className: 'testSpanClass',
        parent: container,
        text: testStr,
      });
      const gotElementByID = document.getElementById('testSpan');
      assert.equal(createdElement.tagName, 'SPAN');
      assert.equal(gotElementByID, createdElement, 'can get element by ID');
      assert.equal(createdElement.getAttribute('class'), 'testSpanClass');
      assert.equal(createdElement.textContent, testStr);
    });
    it('created element with data attr, can be get with data name and get data-attribute', () => {
      const testStr = 'this is test string';
      const createdElement = domOperator.addChild({
        id: 'testDiv',
        parent: container,
        attr: {
          'data-test': testStr,
        },
      });
      const gotElementByData = document.querySelector('[data-test]');
      assert.equal(gotElementByData, createdElement);
      // is data value correct?
      assert.equal(gotElementByData.getAttribute('data-test'), testStr);
    });
    it('child will be inserted correct position', () => {
      const elBase = domOperator.addChild({
        id: 'testDiv_1',
        className: 'insertElement',
        parent: container,
      });
      const elBefore = domOperator.addChild({
        id: 'testDiv_2',
        className: 'insertElement',
        parent: container,
        insertBefore: elBase,
      });
      const elAfter = domOperator.addChild({
        id: 'testDiv_3',
        className: 'insertElement',
        parent: container,
      });
      const elements = document.getElementsByClassName('insertElement');
      assert.equal(elBase, elements[1]);
      assert.equal(elBefore, elements[0]);
      assert.equal(elAfter, elements[2]);
    });
  });
  describe('child will be inserted', () => {
    it('child will be inserted correct position', () => {
      const element = domOperator.addChild({
        className: 'default',
      });
      assert.equal(element.getAttribute('class'), 'default');

      domOperator.addAttr(element, {
        className: 'addList',
      });
      assert.equal(element.getAttribute('class'), 'default addList', 'add class by String');
      domOperator.addAttr(element, {
        className: ['arr1', 'arr2'],
      });
      assert.equal(element.getAttribute('class'), 'default addList arr1 arr2', 'add class by Array');
    });
  });
});
