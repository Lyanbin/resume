/**
 * 入口
 */
import bodyStyle from 'raw-loader!./css.css';
export default class Index {
    constructor () {
        console.log(bodyStyle);
        let self = this;
        document.addEventListener('DOMContentLoaded', function () {
            self.styleDiv = document.querySelector('#style-text');
            console.log(1);
            self.writeTo(self.styleDiv, bodyStyle, 0, 0, 20, false, 1);
        });
    }

    writeTo(el, message, index, interval, mirrorToStyle, charsPerInterval) {
        let chars = message.slice(index, index + charsPerInterval);
        index += index + charsPerInterval;
        this.writeChar(el, chars);
        if (index < message.length) {
            console.log(2);
            this.sleep(1000);
            this.writeTo(this.styleDiv, bodyStyle, 0, 0, 20, false, 1);
        }
    }

    writeChar(el, chars) {
        el.innerHTML += chars;
    }

}
new Index();
