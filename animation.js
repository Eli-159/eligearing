class Typewriter {
    constructor(...elements) {
        this.elTypewriters = elements.map((el, i, arr) => new this.ElementTypewriter(el, i+1==arr.length ? 4000 : 1000));
        const waitProm = Promise.withResolvers();
        this.waitUntilComplete = waitProm.promise;
        this.markComplete = waitProm.resolve;
    }

    type = (concurrent) => {
        if (this.elTypewriters.length < 1) return this.markComplete();
        if (concurrent) {
            Promise.all(this.elTypewriters.map(el => el.startTyping())).then(this.markComplete);
            return this.markComplete();
        }
        this.elTypewriters.shift().startTyping().then(this.type);
    }

    ElementTypewriter = class {
        constructor(element, endDelay) {
            this.el = element;
            this.endDelay = endDelay ??= 0;
            this.text = this.el.getAttribute('data-typewriter');
            this.charsToAdd = this.text.split('');
            const waitProm = Promise.withResolvers();
            this.waitUntilComplete = waitProm.promise;
            this.markComplete = waitProm.resolve;
            this.waitUntilComplete.then(() => this.el.classList.remove('typing'));
        }

        startTyping = () => {
            this.el.classList.add('typing');
            this.#typeChar();
            return this.waitUntilComplete;
        }
    
        #typeChar = () => {
            if (this.charsToAdd.length < 1) return setTimeout(this.markComplete, this.endDelay);
            setTimeout(() => {
                const newChar = this.charsToAdd.shift();
                this.el.textContent += newChar;
                setTimeout(this.#typeChar, /\.|!|\?/g.test(newChar)*300);
            }, this.randomWaitTime);
        }
    
        get randomWaitTime() {
            return Math.floor(Math.random()*80 + 40);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const typewriter = new Typewriter(...document.querySelectorAll('#typingTitle span'));
    typewriter.type();
});