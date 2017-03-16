/**
 * 入口
 */
import bodyStyle from 'raw-loader!./css.css';

let endOfSentence = /[\.\!\?]\s$/;
let commentRegex = /(\/\*(?:[^](?!\/\*))*\*)$/;

export default class Index {
    constructor () {
        console.log(bodyStyle);
        this.styleDiv = document.querySelector('#style-text');
        this.style = document.querySelector('#style-tag');
        this.styleBuffer = '';
        this.commentFlag = false; // 注释的开始结束的标志
        document.addEventListener('DOMContentLoaded', () => this.writeTo(
            this.styleDiv, bodyStyle, 0, 20, false, 1
        ));
    }

    writeTo(el, message, index, interval, mirrorToStyle, charsPerInterval) {
        let chars = message.slice(index, index + charsPerInterval);
        index = index + charsPerInterval;
        this.writeCSSChar(el, chars, this.style);
        if (index < message.length) {
            let thisInterval = interval;
            let thisSliceChars = message.slice(index - 2, index);
            if (endOfSentence.test(thisSliceChars)) {
                console.log(thisSliceChars);
                thisInterval = interval * 50;
            }
            setTimeout(() => this.writeTo(this.styleDiv, bodyStyle, index, interval, mirrorToStyle, charsPerInterval), thisInterval);
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
            // text += char;
            console.log('asdasdasdasd');
            console.log(commentRegex.test(text));
            text = text.replace(commentRegex, '<span class="comment">$1/</span>');
            console.log(text);
        } else if (char !== '/' && this.commentFlag) {
            text += char; // 注释部分的文字
        } else if (char === ':') {
            text = text.replace(keyRegex, '<span class="key">$1</span>:');
        } else if (char === ';') {
            text = text.replace(valueRegex, '<span class="value">$1</span>:');
        } else if (char === '{') {
            text = text.replace(selectorRegex, '<span class="selector">$1</span>{');
        } else if (char === 'x' && pxRegex.test(text.slice(-2))) {

        } else {
            text += char;
        }
        return text;
    }

}
new Index();
