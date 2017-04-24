const blessed  = require('blessed');
const chalk    = require('chalk');
const Trello   = require('node-trello');

const TRELLO_KEY    = process.env.TRELLO_KEY;
const TRELLO_TOKEN  = process.env.TRELLO_TOKEN;
const TRELLO_BOARD_ID    = process.env.TRELLO_BOARD_ID || 'ozJ6UCto';

var t = new Trello(TRELLO_KEY, TRELLO_TOKEN);

let screen  = blessed.screen();
let text    = blessed.text();

screen.append(text);

screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});

function renderTrelloBoard() {
  getBaard()
  .then((content) => {
    text.setContent(content);
    screen.render();
  })
  .catch((e) => {
    console.error(e);
  });
}

function getBaard() {
  return new Promise((done) => {
    t.get(`/1/boards/${TRELLO_BOARD_ID}/lists?cards=open&card_fields=name&fields=name`, function(err, lists) {
      if (err) throw err;

      let content = '\n\n';

      lists.forEach((list) => {
        let hr = ('-').repeat(list.name.length + 2);
        content += `\t ${chalk.red(list.name)} \n\t${hr}\n`;
        list.cards.forEach((card) => {
          content += `\t\t☞  ${card.name}\n`;
        });
        content += '\n';
      });

      done(content);
    });
  });
}

setInterval(renderTrelloBoard, 1000);

