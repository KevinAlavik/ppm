const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const handler = {
  input: (message) => {
    return new Promise((resolve) => {
      rl.question(message, (answer) => {
        resolve(answer);
      });
    });
  },
};

module.exports = { handler };
