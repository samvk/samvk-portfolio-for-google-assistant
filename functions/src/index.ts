import { dialogflow, SimpleResponse } from 'actions-on-google';
import * as functions from 'firebase-functions';

const app = dialogflow({ debug: true });

/** **** DIALOGFLOW ***** */
app.intent('Default Welcome Intent', (conv) => {
    conv.close(new SimpleResponse({
        speech: `Hi, my name's Sam. I'm a web developer who enjoys problem solving, building apps, and bringing designs to life. My go-to technologies right now include HTML5, CSS3, and JavaScript (E-S Next) — amped with the help of React & Reducks and PostCSS & Sass — built with the help of Webpack and Babel. I also have experience with Node-JS, PHP, and SQL.
On a personal note: I love metal detecting, watching movies, the theatre, and building things.
To learn more about me, visit Sam VK.com. Or send me a message at mail@Sam VK.com.`,
        text: `Hi, my name's Sam. I'm a web developer who enjoys problem solving, building apps, and bringing designs to life. My go-to technologies right now include HTML5, CSS3, and JavaScript(ESNext) — amped with the help of React & Redux and PostCSS & Sass — built with the help of Webpack and Babel. I also have experience with Node.js, PHP, and SQL.

On a personal note: I love metal detecting, watching movies, the theatre, and building things.

To learn more about me, visit https://samvk.com. Or send me a message at mail@samvk.com`,
    }));
});

app.intent(['no', 'actions_intent_CANCEL', 'actions_intent_NO_INPUT'], (conv) => {
    conv.close(new SimpleResponse({
        speech: `<speak><break time="1ms"/></speak>`, // HACK::there must be a way to have a silent conv.close()...
        text: `👋`,
    }));
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
