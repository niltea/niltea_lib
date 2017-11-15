import util from './util';

const raf = window.requestAnimationFrame;

export default class SmoothScroll {
	constructor({ easing, duration }) {
		this.easing = easing || 'easeInOutCubic';
		this.duration = duration || 1000;
	}
	setAnchorScroll(opt) {
		const anchor = [].slice.call(document.getElementsByTagName('a'));
		anchor.forEach((el) => {
			const href = el.getAttribute('href');
			if (!href || href.charAt(0) !== '#') return;
			el.addEventListener('click', (e) => {
				e.preventDefault();
				this.privAnchorScroll(href, opt);
			});
		});
	}
	privAnchorScroll(href, opt) {
		if (!opt.duration) opt.duration = 800;
		this.scroll(href, opt);
	}

	scroll(target, options = {}) {
		this.start = util.getScrollTop();
		this.options = {
			duration: options.duration || this.duration,
			offset  : options.offset || 0,
			callback: options.callback,
			easing  : this.privEasing(options.easing || this.easing),
		};

		this.distance = (() => {
			const t = (typeof target);
			if (t === 'string') {
				target = target.split('#')[1];
				if (!target) return 0;
				return this.options.offset + document.getElementById(target).getBoundingClientRect().top;
			}
			if (t === 'object') return this.options.offset + target.getBoundingClientRect().top;
			if (t === 'number') return (util.getScrollTop() - target) * -1;
			return 0;
		})();

		this.duration = typeof this.options.duration === 'function'
			? this.options.duration(this.distance)
			: this.options.duration;

		raf((time) => {
			this.timeStart = time;
			this.privLoop(time);
		});
	}
	onLoadScroll(options) {
		const hash = location.hash;
		if (!hash) return false;
		this.scroll(hash, options);
		return true;
	}
	privEnd() {
		window.scrollTo(0, this.start + this.distance);

		typeof this.options.callback === 'function' && this.options.callback();
		this.timeStart = false;
		return true;
	}
	privLoop(time) {
		this.timeElapsed = time - this.timeStart;
		this.next = this.options.easing(this.timeElapsed, this.start, this.distance, this.duration);

		window.scrollTo(0, this.next);

		this.timeElapsed < this.duration ? requestAnimationFrame(time => this.privLoop(time)) : this.privEnd();
	}

	privEasing(func) {
		const easing = {
			easeInOutQuad(t, b, c, d) {
				t /= d / 2;
				if (t < 1) return c / 2 * t * t + b;
				t--;
				return -c / 2 * (t * (t - 2) - 1) + b;
			},
			easeInCubic(t, b, c, d) {
				return c * (t /= d) * t * t + b;
			},
			easeOutCubic(t, b, c, d) {
				return (c * ((t = t / d - 1) * t * t + 1)) + b;
			},
			easeInOutCubic(t, b, c, d) {
				let time = t;
				if ((time /= d / 2) < 1) return c / 2 * time * time * time + b;
				return (c / 2 * (((time -= 2) * time * time) + 2)) + b;
			},
		};
		if (easing[func]) return easing[func];
		return null;
	}
}
