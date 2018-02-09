class EventObserver {
  private handlers = {};
  private prevValue = null;
  private onTickBound = this.onTick.bind(this);
	constructor(public eventName, public eventTarget: EventTarget = document, public argHandler: Function = null) {
		eventTarget.addEventListener(eventName, this.onTickBound, { passive: true });
	}
	// terminate all events
	terminate () {
	  // remove Listeners
    this.eventTarget.removeEventListener(this.eventName, this.onTickBound);

    Object.keys(this.handlers).forEach((ID) => {
      this.removeHandler(ID);
    });
  }
  private onTick(evArg) {
    // requestAnimationFrame(() => {
      if (typeof this.argHandler == 'function') {
        const computed = this.argHandler(this.prevValue);

        if (computed.prevValue) {
          this.prevValue = computed.prevValue;
        }
        Object.keys(this.handlers).forEach((ID) => {
          this.handlers[ID](evArg, computed);
        });
      } else {
        Object.keys(this.handlers).forEach((ID) => {
          this.handlers[ID](evArg);
        });
      }
    // });
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
}
export default EventObserver;
