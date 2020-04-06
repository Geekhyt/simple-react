import $ from 'jquery';
import createReactUnit from './unit.js'
import createElement from './element'
import Component from './component'

let React = {
    render,
    nextRootIndex: 0,
    createElement,
    Component
}

// 给每个元素 添加一个属性 为了方便获取到这个元素
function render(element, container) {
    // 通过工厂函数创建对应的react元素
    let createReactUnitInstance = createReactUnit(element);
    let markUp = createReactUnitInstance.getMarkUp(React.nextRootIndex);
    $(container).html(markUp);
    // 触发挂载完成的方法
    $(document).trigger('mounted') // 所有组件都挂载完成了
}

export default React;