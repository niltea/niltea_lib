const debug = false;

const log = (() => {
  if (!debug) {
    return (...arg: any[]) => {
      return null;
    };
  }
  return (...arg: any[]) => {
    // eslint-disable-next-line no-console
    console.log(arg);
  };
})();

export default class Loader {
  private bgClassName: string = 'loader_bgi';

  private images: string[];
  private receivedCount: number;
  private expectedCount: number;

  // callbacks
  private onEach: (receivedCount: number) => any;
  private progressContainer: HTMLElement;
  private onComplete: () => any;

  constructor() {
    log('Loader constructor called');
    // document.addEventListener('DOMContentLoaded', () => {});
  }

  activateLoader(onComplete: () => {} = null, onEach = null, progressContainer: HTMLElement = null) {
    log('Loader activateLoader called');
    // TODO: move to constructor
    // ロード済みの画像数
    this.receivedCount = 0;
    // 画像を探してくる
    this.images = this.findImages();
    log('images', this.images);

    // 画像数
    this.expectedCount = this.images.length;

    // 画像読み込みごとのcallback: 渡されていればそれを使う
    // なければ定義する
    if (typeof onEach === 'function') {
      this.onEach = onEach;
    } else {
      this.progressContainer = progressContainer || document.getElementById('progressContainer');
      this.onEach = (!this.progressContainer) ? null : (receivedCount: number) => {
        this.progressContainer.textContent = `${Math.round((receivedCount / this.expectedCount) * 100)}%`;
      };
    }
    log('onEach', this.onEach);

    // ロード完了時のcallback: 渡されていればそれを使う
    this.onComplete = (typeof onComplete === 'function') ? onComplete : this.defaultLoadedCB;
    log('onComplete', this.onComplete);

    // 各画像読み込み後の処理を仕込む
    this.setWatcher();

    return {
      images: this.images,
      expectedCount: this.expectedCount,
    }
  }

  // HTML中から画像を探し出す
  private findImages(): string[] {
    log('Loader findImages called');
    const imageURLs: string[] = [];

    // img要素を探し、foreachでsrcを格納する
    const imgElements: HTMLElement[] = [].slice.call(document.getElementsByTagName('img'));
    imgElements.forEach(($img: HTMLElement) => {
      const imgSrc: string = $img.getAttribute('src');
      // srcが空なら中断
      if (!imgSrc) return;
      // URLを配列に格納
      imageURLs.push(imgSrc);
    });

    const bgi: string = 'background-image';
    // 指定されたclassNameを含む要素からbackground-imageの値を取得・格納する
    const targetsBgi = [].slice.call(document.getElementsByClassName(this.bgClassName));
    targetsBgi.forEach(($el) => {
      // elementが空なら中断
      if (!$el) return;
      // 背景画像を取得し、取得できなければ中断
      const bgSrc = $el.style[bgi] || getComputedStyle($el)[bgi];
      if (!bgSrc || bgSrc === 'none') return;

      // URLを配列に格納
      imageURLs.push(bgSrc.replace(/^url\(|"|\)$/g, ''));
    });
    return imageURLs;
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

  private defaultLoadedCB() {
    log('Loader: all content has been loaded.');
  }
};
