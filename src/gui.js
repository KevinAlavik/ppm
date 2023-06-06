const figlet = require("figlet");
const { handler } = require("./handler");
const { project } = require("./logic");

const gui = {
  title: "",
  options: [],
  render: async function () {
    const generateTitle = () => {
      return new Promise((resolve, reject) => {
        figlet.text(gui.title, function (error, titleAscii) {
          if (error) {
            reject(error);
          } else {
            resolve(titleAscii);
          }
        });
      });
    };

    try {
      const titleAscii = await generateTitle();

      console.log(titleAscii);
      console.log("Options:");
      for (let i = 0; i < gui.options.length; i++) {
        console.log(`${i + 1}) ${gui.options[i]}`);
      }
      console.log("");

      let option = await handler.input("Option number: ");
      project.new(gui.options[option - 1]);
      while (!isValidOption(option)) {
        console.log("Invalid option. Please try again.");
        option = await handler.input("Option number: ");
      }
    } catch (error) {
      console.error("Error generating ASCII art:", error);
    }
  },
};

function isValidOption(option) {
  const validOptions = Array.from(Array(gui.options.length), (_, i) =>
    String(i + 1)
  );
  return validOptions.includes(option);
}

module.exports = { gui };
