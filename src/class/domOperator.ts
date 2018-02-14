interface attrOptions {
  element?     : string;
  id?          : string;
  className?   : string | string[];
  attr?        : object;
  parent?      : HTMLElement;
  insertBefore?: Node;
  text?        : string;
}
class DomOperator {
  constructor () {
  }
  addChild (childOptions: attrOptions = {}) {
    // 新規に作成するElement名を定義する
    const NodeName: string = (childOptions.element) ? childOptions.element : 'div';
    // 新しいHTMLElementを作成する
    const newEl: HTMLElement = document.createElement(NodeName);
    // 属性値の設定を行う
    this.addAttr(newEl, childOptions);

    // parentの指定が無いときは要素を返す
    if (!childOptions.parent) {
      return newEl;
    }
    // 作成したHTMLElementの挿入位置
    if (childOptions.insertBefore) {
      return childOptions.insertBefore.parentNode.insertBefore(newEl, childOptions.insertBefore);
    } else {
      return childOptions.parent.insertBefore(newEl, null);
    }
  }
  // 指定されたElementに属性値を設定する
  addAttr (element: HTMLElement, options: attrOptions = {}) {
    if (options.id && !element.id) element.setAttribute('id', options.id);
    if (options.className) {
      let elClassName:string = element.getAttribute('class');
      elClassName = (elClassName) ? `${elClassName} ` : '';

      let classListToAdd: string = null;
      if (typeof options.className === 'string') {
        classListToAdd = options.className;
      } else {
        classListToAdd = options.className.join(' ');
      }
      element.setAttribute('class', elClassName + classListToAdd);
    }
    if (options.attr) {
      Object.keys(options.attr).forEach((key: string) => {
        element.setAttribute(key, options.attr[key]);
      });
    }
    if (options.text) {
      element.textContent = options.text;
    }
  }
}

export default new DomOperator();
