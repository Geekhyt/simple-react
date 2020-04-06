// 用react 需要使用render方法
import React from './react';
class SubCounter {
    componentWillMount() {
        console.log('child组件将要挂载');
    }
    componentDidMount() {
        console.log('child组件挂载完成');
    }
    render() {
        return '123';
    }
}
class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            number: 666
        }
    }
    componentWillMount() {
        console.log('parent组件将要挂载');
    }
    componentDidMount() {
        console.log('parent组件挂载完成');
    }
    render() {
        return <SubCounter / > ;
    }
}

// function say() {
//     alert(1);
// }
// let element = React.createElement('div', {
//     name: 'xxx'
// }, 'hello', React.createElement('button', {
//     onClick: say
// }, '123'));
// console.log(element);
//jsx语法 =》 虚拟dom对象   
// 类
// React.render(element, document.getElementById('root'))

React.render(React.createElement(Counter, {
    name: "webCanteen"
}), document.getElementById('root'));