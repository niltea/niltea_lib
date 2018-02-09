
declare var __html__: { [path: string]: string };

import {assert} from 'chai';
import EventObserver from '../src/class/eventObserver';

// test string
//   after(() => {
//     document.body.innerHTML = '';
//   });

describe('eventObserver', () => {
  interface EventObserverObject {
    eventName    : string;
    eventTarget  : EventTarget;
    argHandler   : Function;
    addHandler   : Function;
    removeHandler: Function;
    showHandler  : Function;
    terminate    : Function;
  }
  let observer:EventObserverObject = null;
  let container:HTMLElement | Node;

  const clickCallback = (e) => {
    return 'clickCallback called';
  };
  before(() => {
    document.body.innerHTML = __html__['test/test.html'];
    container = document.getElementById('testParent');
  });

  beforeEach ((done) => {
    observer = new EventObserver('click', container, clickCallback);
    done();
  });
  afterEach((done) => {
    observer.terminate();
    observer = null;
    done();
  });
  describe('can add event', () => {
    it('can create event observer', () => {
      assert.deepEqual(observer.eventName, 'click');
      assert.deepEqual(observer.eventTarget, container);
      assert.isFunction(observer.argHandler);
    });
  });
  describe('add / remove handler', () => {
    it('can add handler and list handler', () => {
      const testFunc = () => { return 'test'; };
      observer.addHandler(testFunc, 'newHandler');
      assert.equal(observer.showHandler().newHandler, testFunc);
    });
  });
  describe('can remove handler', () => {
    it('can remove handler', () => {
      observer.addHandler(() => { return 'test'; }, 'willRemoved');
      observer.addHandler(() => { return 'test'; }, 'willRest');
      // there will be two events
      const addedHandlers = observer.showHandler();
      assert.equal(Object.keys(addedHandlers).length, 2);
      assert.exists(addedHandlers.willRemoved, 'Handler "willRemoved" have to exist');

      observer.removeHandler('willRemoved');
      const removedHandlers = observer.showHandler();
      assert.exists(removedHandlers.willRest, 'Handler "willRest" have to exist');
      assert.notExists(removedHandlers.willRemoved, 'Handler "willRemoved" is not exist');
    });
    it('can not remove handler that not exist', () => {
      observer.addHandler(() => { return 'test'; }, 'willRemoved');
      observer.addHandler(() => { return 'test'; }, 'willRest');
      // there will be two events
      const addedHandlers = observer.showHandler();
      assert.equal(Object.keys(addedHandlers).length, 2);
      assert.exists(addedHandlers.willRemoved, 'Handler "willRemoved" have to exist');

      observer.removeHandler('willRemoved');
      const removedHandlers = observer.showHandler();
      assert.exists(removedHandlers.willRest, 'Handler "willRest" have to exist');
      assert.notExists(removedHandlers.willRemoved, 'Handler "willRemoved" is not exist');
    });
  });
  describe('call event', () => {
    it('can fire event', (done) => {
      observer.addHandler((ev, handlerValue:String) => {
        assert.equal(handlerValue, 'clickCallback called');
        done();
      }, 'testEvent');
      const evt = document.createEvent("HTMLEvents");
      evt.initEvent('click', true, true );
      container.dispatchEvent(evt);
    });
  });
});
