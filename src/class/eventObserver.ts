class EventObserver {
  private handlers = {};
	constructor(public eventName, public eventTarget: EventTarget = document, public argHandler: Function = null) {
		eventTarget.addEventListener(eventName, this.onTick.bind(this));
	}
  addHandler(func: () => any, ID: string): Object {
		this.handlers[ID] = func;
		return this.handlers[ID];
	}
	removeHandler(ID: string) {
	  if (typeof ID !== 'string') return new Error('ID is not string.');

		delete this.handlers[ID];
		return true;
	}
  showHandler(): Object {
	  return this.handlers;
  }
  private onTick(onTickEventHandler) {
    requestAnimationFrame(() => {
      if (this.argHandler !== null) {
        Object.keys(this.handlers).forEach((ID) => {
          this.handlers[ID](onTickEventHandler, this.argHandler);
        });
      } else {
        Object.keys(this.handlers).forEach((ID) => {
          this.handlers[ID](onTickEventHandler);
        });
      }
    });
  }
}
export default EventObserver;
