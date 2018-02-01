// 文字列からバージョンを取得する
const getVer = (argAgent: string, sarchStr: string, endstr: string = null): string => {
  const agent = argAgent.toLowerCase();

  // 開始位置を検出
  const start: number = agent.indexOf(sarchStr);
  const sliceStart: number = start + sarchStr.length;

  // もし見つからなかったらundefを返す
  if (start < 0) return undefined;

  // 開始位置から前を切り落とす
  const agentSliced = agent.substr(sliceStart);

  // バージョン文字数区切りのスペースの位置を探る（開始文字分減じて文字数とする）
  const end: number = agentSliced.indexOf(endstr);

  // バージョン文字を取り出しreturn
  return agentSliced.substr(0, end).replace('_', '.');
};

interface envObj {
  isPC: boolean;
  isSP: boolean;
  isIE: boolean;
  isWebKit: boolean;
  isiOS: boolean;
  isAndroid: boolean;
  browserVer: string,
  OSVer: string;
  clickEv: string;
  scrollEv: string;
}

const browserEnv = (argAgent) => {// UserAgentを取得
  const agent: string = argAgent.toLowerCase() || navigator.userAgent.toLowerCase();
  // 返すオブジェクトを仮生成
  const envValue: envObj = {
    isPC: true,
    isSP: false,
    isIE: false,
    isWebKit: false,
    isiOS: false,
    isAndroid: false,
    browserVer: null,
    OSVer: null,
    clickEv: null,
    scrollEv: null,
  };
  // IE
  if (agent.match(/msie|trident/)) {
    envValue.isIE = true;
    // OSバージョン
    const OSVer = getVer(agent, 'windows ', ';') || getVer(agent, 'windows ', ')');
    envValue.OSVer = OSVer.match(/[0-9.]+/)[0];

    let MSIEVer = getVer(agent, 'msie ', ';');
    if (!MSIEVer) {
      // MSIEでバージョン番号が取得できない場合
      let tridentVer = parseFloat((getVer(agent, 'trident/', ')')).match(/[0-9.]+/)[0]) + 4;
      envValue.browserVer = tridentVer.toFixed(1);
    } else {
      // MSIEでバージョン番号が取得できた場合
      envValue.browserVer = MSIEVer;
    }

  } else {
    // WebKit
    if (agent.match(/webkit/)) {
      envValue.isWebKit = true;
      if (agent.indexOf('chrome') !== -1) {
        envValue.browserVer = getVer(agent, 'chrome/', ' ');
      } else if (agent.indexOf('safari') !== -1) {
        envValue.browserVer = getVer(agent, 'version/', ' ');
      } else {
        envValue.browserVer = '0';
      }
    }
    // iOS系
    if (agent.match(/iphone|ipad/)) {
      envValue.isPC = false;
      envValue.isSP = true;
      envValue.isiOS = true;
      envValue.OSVer = getVer(agent, 'iphone os ', ' ');
      envValue.browserVer = envValue.OSVer;
    }
    // Android
    if (agent.match(/android/)) {
      envValue.isPC = false;
      envValue.isSP = true;
      envValue.isiOS = false;
      envValue.isAndroid = true;
      envValue.OSVer = getVer(agent, 'android ', ';');
      envValue.browserVer = envValue.OSVer;
    }
  }

  // click event
  envValue.clickEv = (envValue.isPC) ? 'click' : 'touchend';
  (<any>window).clickEv = envValue.clickEv;
  // scoll event
  envValue.scrollEv = (() => {
    if ('onwheel' in document) return 'wheel';
    if ('onmousewheel' in document) return 'mousewheel';
    return 'DOMMouseScroll';
  })();
  (<any>window).scrollEv = envValue.scrollEv;
  // 仮オブジェクト返す
  return envValue;
};

export default {
  getVer,
  browserEnv,
};
