import $ from 'jquery';
// 通过父类保存参数
class Unit {
    constructor(element) {
        this.currentElement = element;
    }
}
class ReactTextUnit extends Unit {
    // 保存当前元素的Id 返回当前元素对应的html
    getMarkUp(rootId) {
        this._rootId = rootId;
        return `<span data-reactid="${rootId}">${this.currentElement}</span>`
    }
}
class ReactNativeUnit extends Unit {
    getMarkUp(rootId) {
        this._rootId = rootId;
        // 拼接需要渲染的内容
        let {
            type,
            props
        } = this.currentElement;
        let tagStart = `<${type} data-reactid="${rootId}"`
        let tagEnd = `</${type}>`
        let contentStr;
        for (let propName in props) {
            if (/on[A-Z]/.test(propName)) {
                let eventType = propName.slice(2).toLowerCase(); // 获取click
                // react 里面的事件都是通过事件委托的方式来绑定  v15以前都有id
                $(document).on(eventType, `[data-reactid="${rootId}"]`, props[propName]);
            } else if (propName === 'children') {
                contentStr = props[propName].map((child, idx) => {
                    // 递归循环子节点
                    let childInstance = createReactUnit(child);
                    // 返回的是多个元素的字符串的数组
                    return childInstance.getMarkUp(`${rootId}.${idx}`);
                }).join('');
            } else {
                tagStart += (`${propName}=${props[propName]}`)
            }
        }
        // 返回拼接后的字符串
        return tagStart + `>` + contentStr + tagEnd;
    }
}
// 负责渲染react组件
class ReactCompositUnit extends Unit {
    getMarkUp(rootId) {
        this._rootId = rootId;
        let {
            type: Component,
            props
        } = this.currentElement;
        let componentInstance = new Component(props);
        componentInstance.componentWillMount && componentInstance.componentWillMount();
        // 调用render后返回的结果
        let reactComponentRender = componentInstance.render();
        // 递归渲染组件render后的返回结果
        let ReactCompositUnitInstance = createReactUnit(reactComponentRender);
        let markUp = ReactCompositUnitInstance.getMarkUp(rootId);
        // 在递归后绑定的事件 儿子先绑定成功 再绑定父亲
        $(document).on('mounted', () => {
            componentInstance.componentDidMount && componentInstance.componentDidMount();
        })
        // 实现把render方法返回的结果 作为字符串返回
        return markUp;
    }
}

function createReactUnit(element) {
    if (typeof element === 'string' || typeof element === 'number') {
        return new ReactTextUnit(element);
    }
    if (typeof element === 'object' && typeof element.type === 'string') {
        return new ReactNativeUnit(element);
    }
    if (typeof element === 'object' && typeof element.type === 'function') {
        return new ReactCompositUnit(element);
    }
}

export default createReactUnit;