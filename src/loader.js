const debug = false;
const backgroundImageClassName = 'loader_bgi';

const log = (() => {
  if (!debug) {
    return () => {
      return null;
    };
  }
  return (...arg) => {
    // eslint-disable-next-line no-console
    console.log(...arg);
  };
})();

export default new class Loader {
  constructor() {
    document.addEventListener('DOMContentLoaded', () => {
      log('Loader constructor called');
    });
  }

  activateLoader(onComplete, onEach, progressContainer) {
    log('Loader activateLoader called');
    // ロード済みの画像数
    this.receivedCount = 0;
    // 画像を探してくる
    this.images = this.constructor.findImages();
    log('images', this.images);
    this.expectedCount = this.images.length;

    // 画像読み込みごとのcallback: 渡されていればそれを使う
    // なければ定義する
    if (typeof onEach === 'function') {
      this.onEach = onEach;
    } else {
      this.progressContainer = (progressContainer) || document.getElementById('progressContainer');
      this.onEach = (!this.progressContainer) ? null : (receivedCount) => {
        this.progressContainer.textContent = `${Math.round((receivedCount / this.expectedCount) * 100)}%`;
      };
    }
    log('onEach', this.onEach);

    // ロード完了時のcallback: 渡されていればそれを使う
    this.onComplete = (typeof onComplete === 'function') ? onComplete : this.constructor.defaultLoadedCB;
    log('onComplete', this.onComplete);

    // 各画像読み込み後の処理を仕込む
    this.setWatcher();
  }

  static findImages() {
    log('Loader findImages called');
    const images = [];
    // img要素を探してくる
    const targetsImg = [].slice.call(document.getElementsByTagName('img'));
    targetsImg.forEach((el) => {
      const imgSrc = el.getAttribute('src');
      // srcが空なら中断
      if (!imgSrc) return;
      images.push(imgSrc);
    });

    const targetsBgi = [].slice.call(document.getElementsByClassName(backgroundImageClassName));
    const bgi = 'background-image';
    targetsBgi.forEach((el) => {
      // elementが空なら中断
      if (!el) return;
      // 背景画像を取得し、取得できなければ中断
      const bgSrc = el.style[bgi] || getComputedStyle(el, '')[bgi];
      if (!bgSrc || bgSrc === 'none') return;

      // 画像をpush
      images.push(bgSrc.replace(/^url\(|"|\)$/g, ''));
    });
    return images;
  }

  setWatcher() {
    log('Loader setWatcher called');
    // if images is empty, go to loaded Function
    if (!this.images || this.images.length <= 0) {
      this.onComplete();
      return;
    }

    // 画像の数だけloadListenerが呼ばれたらcallbackが呼ばれる
    // const loadListener(expectedCount = , setting.onEach, setting.onComplete);
    this.images.forEach((url) => {
      const img = new Image();
      document.body.appendChild(img);
      img.width = 1;
      img.height = 1;
      img.onload = this.loadListener.bind(this);
      img.src = url;
    });
  }

  loadListener(e) {
    // remove temporary image
    const tgt = e.target;
    if (tgt) tgt.parentNode.removeChild(tgt);
    this.receivedCount += 1;
    if (this.onEach) this.onEach(this.receivedCount);
    if (this.receivedCount >= this.expectedCount) {
      this.onComplete();
    }
  }

  static defaultLoadedCB() {
    log('Loader: all content has been loaded.');
  }
}();
