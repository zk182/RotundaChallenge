class Animal {
    constructor(sound) {
        this.sound = sound;
    }
    speak(words){
        const speaking = words.split(' ').map(value => `${value} ${this.sound}`).join(' ');
        return console.log(speaking);
    }
}

class Lion extends Animal {
    constructor(){
        super('roar');
    }
}

class Tiger extends Animal {
    constructor(){
        super('grrr');
    }
}

// Instances 
const lion = new Lion();
const tiger = new Tiger();

// Testing values
lion.speak(`I'm a lion`);
tiger.speak('Lions suck');