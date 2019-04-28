import { dialogflow, SimpleResponse, BasicCard, Button, Image, Suggestions, BrowseCarousel, BrowseCarouselItem, LinkOutSuggestion } from 'actions-on-google';
import * as functions from 'firebase-functions';
import { randomPop } from './util';

/** **** SUGGESTION CHIPS ***** */
enum Chip {
    Projects = '🎨 Projects',
    Skills = '🌠 Skills',
    Contact = '💬 Contact me',
    Github = '☁️ GitHub',
    Goodbye = '👋 Goodbye.',
}

/** **** RESPONSES ***** */
const whatElseResponse = () => randomPop(['Anything else?' ,'What else can I tell you about?', `Anything else you'd like to hear about?`, `What else would you like to hear about?`]);

/** **** DIALOGFLOW ***** */
const app = dialogflow({ debug: true });

app.intent('Default Welcome Intent', (conv) => {
    conv.ask(new SimpleResponse({
        speech: `<speak>
            <s>Hi, my name's Sam.</s>
            <s>I'm a developer who enjoys problem solving, building apps, and bringing designs to life.</s>
            <s>On a personal note: I love metal detecting, watching movies, the theatre, and building things.</s>
            <s>What would you like to know more about?</s>
            <s>To start: try asking me about some of my past projects. Or ask me about my technical skills.</s>
        </speak>`,
        text: 'Welcome...',
    }));

    if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
        return;
    }

    conv.ask(new BasicCard({
        title: 'About me',
        subtitle: `Hi, I'm Sam`,
        text: `I'm a developer who enjoys problem solving, building apps, and bringing designs to life.
On a personal note: I love metal detecting, watching movies, the theatre, and building things.
Try asking me about some of my past projects. Or, you can hit "Learn more" to see my full portfolio.`,
        buttons: new Button({
            title: 'Learn more',
            url: 'https://samvk.com',
        }),
        image: new Image({
            url: 'https://samvk.com/image/samvk-logo.png',
            alt: 'SamVK logo',
        }),
        display: 'WHITE',
    }));

    conv.ask(new Suggestions([Chip.Projects, Chip.Skills, Chip.Contact]));
    conv.ask(new LinkOutSuggestion({ name: Chip.Github, url: 'https://samvk.com/github' }));
});

app.intent('projects', (conv) => {
    if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
        conv.ask(new SimpleResponse({
            speech: `<speak>
                <s>My main project currently is <sub alias='Konica Minolta Marketplace.com'>https://konicaminoltamarketplace.com</sub>. You can also try talking to some of my other apps: try leaving and then saying &quot;Okay Google, talk to Etymology Dictionary&quot;.</s>
                <s>To view more of my past projects, visit <sub alias='Sam VK.com/projects'>https://samvk.com/projects</sub>.</s>
            </speak>`,
            text: `My main project currently is https://konicaminoltamarketplace.com. You can also try talking to some of my other apps: try saying “Okay Google, talk to Etymology Dictionary”.
To view more of my past projects, visit https://samvk.com/projects.`,
        }));
        conv.ask(whatElseResponse());
        return;
    }

    conv.ask('Here are a few of my recent projects...');

    conv.ask(new BrowseCarousel({
        items: [
            new BrowseCarouselItem({
                title: 'Konica Minolta MarketPlace',
                description: 'Global app store rebuilt from scratch using React & Redux and PostCSS – with a back-end in PHP and Node.js serverless microservices on AWS',
                url: 'https://konicaminoltamarketplace.com',
                image: new Image({
                    url: 'https://samvk.com/image/marketplace-logo.png',
                    alt: 'Konica Minolta MarketPlace',
                }),
            }),
            new BrowseCarouselItem({
                title: 'Etymology Dictionary',
                description: 'Skill for Google Assistant built with Dialogflow and Node.js – deployed on Firebase – consuming the Oxford Dictionaries API',
                url: 'https://assistant.google.com/services/invoke/uid/0000003615ded586',
                image: new Image({
                    url: 'https://samvk.com/image/etymology-dictionary-logo.png',
                    alt: 'Etymology Dictionary',
                }),
                footer: `“Ok Google, ask Etymology Dictionary what's the origin of...”`,
            }),
            new BrowseCarouselItem({
                title: 'Hourglass in seconds',
                description: 'A Chrome add-on for Konica Minolta’s corporate time-keeping app that simplifies and enhances feature set and increases user-friendliness',
                url: 'https://chrome.google.com/webstore/detail/hourglass-in-seconds/okgpcdhlngagbfdmgellbnkkmakpijdg',
                image: new Image({
                    url: 'https://samvk.com/image/hourglass-logo.png',
                    alt: 'Hourglass in seconds',
                }),
            }),
        ],
    }));

    conv.ask(whatElseResponse());
    conv.ask(new Suggestions([Chip.Skills, Chip.Contact]));
    conv.ask(new LinkOutSuggestion({ name: Chip.Github, url: 'https://samvk.com/github' }));

});

app.intent('contact', (conv) => {
    conv.ask(`Want to send me a message? Just start talking! A transcript will be sent to me when you're done. Are you ready to record?`);

    conv.ask(new Suggestions(['Yes', 'No']));
});

app.intent('contact - yes', (conv) => {
    conv.ask(new SimpleResponse({
        speech: `<speak>Alright, recording now...</speak>`,
        text: 'Alright, 🔴recording now...',
    }));
});

app.intent(['contact - yes - fallback', 'contact - yes - custom'], (conv) => {
    conv.ask(`Alright, sending your message now.`);
    conv.ask(whatElseResponse());

    conv.ask(new Suggestions([Chip.Goodbye, Chip.Projects, Chip.Skills]));
    conv.ask(new LinkOutSuggestion({ name: Chip.Github, url: 'https://samvk.com/github' }));

});

app.intent('contact - no', (conv) => {
    conv.ask(new SimpleResponse({
        speech: `<speak>
            <s>Alright.</s>
            <s>If you&apos;d like to get in touch later, you can reach me at <sub alias='Sam VK.com/contact'>https://samvk.com/contact</sub>, or message me directly at <sub alias='mail@Sam VK.com'>mail@samvk.com</sub></s>
        </speak>`,
        text: `Alright.
If you'd like to get in touch later, you can reach me at https://samvk.com/contact, or message me directly at mail@samvk.com`
    }));
    conv.ask(whatElseResponse());

    conv.ask(new Suggestions([Chip.Goodbye, Chip.Projects, Chip.Skills]));
    conv.ask(new LinkOutSuggestion({ name: Chip.Github, url: 'https://samvk.com/github' }));
});


app.intent('github', (conv) => {
    conv.ask(new SimpleResponse({
        speech: `<speak>To view my GitHub profile and see all of my past projects, visit <sub alias='github.com/Sam VK'>https://github.com/samvk</sub>.</speak>`,
        text: `To view my GitHub profile and see all of my past projects, visit https://github.com/samvk.`
    }));
    conv.ask(whatElseResponse());
    conv.ask(new Suggestions([Chip.Projects, Chip.Skills, Chip.Contact]));
    conv.ask(new LinkOutSuggestion({ name: Chip.Github, url: 'https://samvk.com/github' }));
});

app.intent('skills', (conv) => {
    conv.close(new SimpleResponse({
        speech: `<speak>
            <s>My go-to technologies right now include HTML5, CSS3, and JavaScript (<sub alias='E-S Next'>ESNext</sub>) — amped with the help of React &amp; <sub alias='Reducks'>Redux</sub> and PostCSS &amp; Sass — built with the help of Webpack and Babel. I also have experience with <sub alias='Node-JS'>Node.js</sub>, PHP, and SQL.</s>
            <s>Lately, I&apos;ve also been playing around with TypeScript.</s>
        </speak>`,
        text: `My go-to technologies right now include HTML5, CSS3, and JavaScript(ESNext) — amped with the help of React & Redux and PostCSS & Sass — built with the help of Webpack and Babel. I also have experience with Node.js, PHP, and SQL.
Lately, I've also been playing around with TypeScript.`,
    }));
    conv.ask(whatElseResponse());
    conv.ask(new Suggestions([Chip.Projects, Chip.Contact]));
    conv.ask(new LinkOutSuggestion({ name: Chip.Github, url: 'https://samvk.com/github' }));

});

app.intent(['Default Fallback Intent', 'actions_intent_NO_INPUT'], (conv) => {
    if (conv.arguments.get('IS_FINAL_REPROMPT')) {
        conv.close(`Sorry, I just can't seem to understand you. Let's try this again later.`);
    }

    conv.ask(randomPop([`I didn't catch that.`, `I don't understand what you've just said.`, `Sorry, I'm not sure how to help with that.`]));
    conv.ask(`You can try asking me about some of my past projects, ask me about my technical skills, or ask to contact me.`);

    conv.ask(new Suggestions([Chip.Projects, Chip.Skills, Chip.Contact]));
    conv.ask(new LinkOutSuggestion({ name: Chip.Github, url: 'https://samvk.com/github' }));

});

app.intent(['no', 'actions_intent_CANCEL'], (conv) => {
    conv.close(new SimpleResponse({
        speech: `<speak><break time='1ms'/></speak>`, // HACK::there must be a way to have a silent conv.close()...
        text: `👋`,
    }));
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
