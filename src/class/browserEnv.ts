// UserAgentを取得
const ua: string = navigator.userAgent.toLowerCase();

// 文字列からバージョンを取得する
const getVer= (argAgent: string, sarchStr: string, endstr: string): string => {
  const agent = argAgent.toLowerCase();

  // 開始位置を検出
  const start: number = agent.indexOf(sarchStr);
  if (start < 0) return undefined;

  // 開始位置を検索文字数ぶんシフト
  // バージョン文字数区切りのスペースの位置を探る（開始文字分減じて文字数とする）
  const end: number = agent.indexOf(endstr, start + sarchStr.length) - start;

  // バージョン文字を取り出しreturn
  return agent.substr(start, end).replace('_', '.');
};

const browserEnv = (argAgent) => {
  const agent = argAgent || ua;
  // 返すオブジェクトを仮生成
  const probBrowser = {
    isPC: true,
    isSP: false,
    isIE: false,
    isWebKit: false,
    isiOS: false,
    isAndroid: false,
    browserVer: null,
    OSVer: null,
  };
  // IE
  if (agent.match(/msie|trident/)) {
    probBrowser.isIE = true;
    probBrowser.OSVer = `windows ${getVer(agent, 'windows ', ';')}`;
    probBrowser.browserVer = getVer(agent, 'msie ', ';');
    if (probBrowser.browserVer === undefined) {
      probBrowser.browserVer = parseFloat(getVer(agent, 'trident/', ')')) + 4;
    }
  } else {
    // WebKit
    if (agent.match(/webkit/)) {
      probBrowser.isWebKit = true;
    }
    // iOS系
    if (agent.match(/iphone|ipad/)) {
      probBrowser.isPC = false;
      probBrowser.isSP = true;
      probBrowser.isiOS = true;
      probBrowser.OSVer = getVer(agent, 'iphone os ', ' ');
    }
    // Android
    if (agent.match(/android/)) {
      probBrowser.isPC = false;
      probBrowser.isSP = true;
      probBrowser.isAndroid = true;

      probBrowser.OSVer = getVer(agent, 'android ', ';');
    }
  }
  window.clickEv = (probBrowser.isPC) ? 'click' : 'touchend';
  window.scrollEv = (() => {
    if ('onwheel' in document) return 'wheel';
    if ('onmousewheel' in document) return 'mousewheel';
    return 'DOMMouseScroll';
  })();
  // 仮オブジェクト返す
  return probBrowser;
};

export default {
  getVer,
  browserEnv,
};
