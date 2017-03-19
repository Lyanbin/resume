/**
 * 入口
 */
import bodyStyle from 'raw-loader!./css.css';
import workText from 'raw-loader!./work.txt';

const endOfSentence = /[\.\!\?。]\s$/;
const commentRegex = /(\/\*(?:[^](?!\/\*))*\*)$/;
const keyRegex = /([a-zA-Z- ^\n]*)$/;
const valueRegex = /([^:]*)$/;
const selectorRegex = /(.*)$/;
const pxRegex = /\dp/;
const pxRegex2 = /p$/;

export default class Index {
    constructor () {
        this.styleDiv = document.querySelector('#style-text');
        this.style = document.querySelector('#style-tag');
        this.workDiv = document.querySelector('#work-text');
        this.styleBuffer = '';
        this.commentFlag = false; // 注释的开始结束的标志
        document.addEventListener('DOMContentLoaded',
            () => {
                // this.writeTo(this.styleDiv, bodyStyle, 0, 2, true, 1);
                new Promise((resolve) => {
                    this.terminal(resolve);
                }).then((resolve) => {
                    this.workexp(resolve);
                });
                // this.terminal();
                // this.workexp();
            }
        );
    }

    terminal(resolve) {
        this.writeTo(this.styleDiv, bodyStyle, 0, 2, true, 1, resolve);
    }

    workexp(resolve) {
        this.writeTo(this.workDiv, workText, 0, 2, false, 1, resolve);
    }

    writeTo(el, message, index, interval, mirrorToStyle, charsPerInterval, resolve) {
        let chars = message.slice(index, index + charsPerInterval);
        index = index + charsPerInterval;
        el.scrollTop = el.scrollHeight;
        if (mirrorToStyle) {
            this.writeCSSChar(el, chars, this.style);
        } else {
            this.writeChar(el, chars);
        }
        if (index < message.length) {
            let thisInterval = interval;
            let thisSliceChars = message.slice(index - 2, index);
            if (endOfSentence.test(thisSliceChars)) {
                // console.log(thisSliceChars);
                thisInterval = interval * 10;
            }
            setTimeout(() => this.writeTo(el, message, index, interval, mirrorToStyle, charsPerInterval, resolve), thisInterval);
        } else {
            resolve && resolve();
        }
    }

    writeChar(el, chars) {
        el.innerHTML += chars;
    }

    writeCSSChar(el, char, style) {
        let text = el.innerHTML;
        let htmlStr = this.handleChar(text, char);
        el.innerHTML = htmlStr;
        this.styleBuffer += char;
        if (char === ';') {
            style.textContent += this.styleBuffer;
            this.styleBuffer = '';
        }

    }

    handleChar(text, char) {
        if (char === '/' && this.commentFlag === false) {
            this.commentFlag = true; // 如果标记为假且碰到「/」则说明注释开始
            text += char;
        } else if (char === '/' && this.commentFlag === true && text.slice(-1) === '*') {
            this.commentFlag = false; // 如果标记为真且碰到「/」则说明注释结束
            text = text.replace(commentRegex, '<span class="comment">$1/</span>');
        } else if (char !== '/' && this.commentFlag) {
            text += char; // 注释部分的文字
        } else if (char === ':') {
            text = text.replace(keyRegex, '<span class="key">$1</span>:');
        } else if (char === ';') {
            text = text.replace(valueRegex, '<span class="value">$1</span>;');
        } else if (char === '{') {
            text = text.replace(selectorRegex, '<span class="selector">$1</span>{');
        } else if (char === 'x' && pxRegex.test(text.slice(-2))) {
            text = text.replace(pxRegex2, '<span class="value px">px</span>');
        } else {
            text += char;
        }
        return text;
    }

}
new Index();
