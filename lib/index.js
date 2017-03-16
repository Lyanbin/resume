/**
 * 入口
 */
import bodyStyle from 'raw-loader!./css.css';

let endOfSentence = /[\.\!\?]$/;

export default class Index {
    constructor () {
        console.log(bodyStyle);
        this.styleDiv = document.querySelector('#style-text');
        document.addEventListener('DOMContentLoaded', () => this.writeTo(
            this.styleDiv, bodyStyle, 0, 20, false, 1
        ));
    }

    writeTo(el, message, index, interval, mirrorToStyle, charsPerInterval) {
        let chars = message.slice(index, index + charsPerInterval);
        index = index + charsPerInterval;
        this.writeChar(el, chars);
        if (index < message.length) {
            let thisInterval = interval;
            let thisSliceChars = message.slice(index - 2, index + 1);
            if (endOfSentence.test(thisSliceChars)) {
                console.log(thisSliceChars);
                console.log('asdasdasdsadasdasdasdasd');
                thisInterval = interval * 50;
            }
            setTimeout(() => this.writeTo(this.styleDiv, bodyStyle, index, interval, mirrorToStyle, charsPerInterval), thisInterval);
        }
    }

    writeChar(el, chars) {
        el.innerHTML += chars;
    }

}
new Index();
