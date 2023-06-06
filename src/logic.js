const { SingleBar, Presets } = require("cli-progress");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const project = {
  new: (language) => {
    const progressBar = new SingleBar(
      {
        format:
          "Progress [{bar}] {percentage}% | ETA: {eta}s | Created {value}/{total} files",
        barCompleteChar: "\u2588",
        barIncompleteChar: "\u2591",
        hideCursor: true,
      },
      Presets.shades_classic
    );

    console.log(`Creating project template for ${language}`);

    const totalFiles = 2; // Number of files to create based on the template
    let createdFiles = 0;

    progressBar.start(totalFiles, 0);

    const timer = setInterval(() => {
      createdFiles++;

      progressBar.update(createdFiles);

      if (createdFiles === totalFiles) {
        clearInterval(timer);
        progressBar.stop();

        const jsonTemplatePath = path.join(
          __dirname,
          "templates",
          `${language.toLowerCase().replace(" ", "-")}.json`
        );

        fs.readFile(jsonTemplatePath, "utf8", (err, data) => {
          if (err) {
            console.error(
              "\x1b[31m",
              `Failed to read template file: ${err.message}`
            );
            return;
          }

          try {
            const template = JSON.parse(data);
            const projectDirectory = path.join(
              __dirname,
              language.replace(" ", "-")
            );

            fs.mkdirSync(projectDirectory, { recursive: true }); // Create the project directory

            for (const key in template.struct) {
              const fileConfig = template.struct[key];

              if (typeof fileConfig === "string") {
                // Single file
                const filePath = path.join(projectDirectory, fileConfig);
                fs.writeFileSync(filePath, ""); // Create an empty file
              } else if (typeof fileConfig === "object") {
                // Directory with a file inside
                const dirName = key;
                const dirPath = path.join(projectDirectory, dirName);
                const fileName = fileConfig["src-file"];
                const filePath = path.join(dirPath, fileName);

                fs.mkdirSync(dirPath, { recursive: true }); // Create the directory
                fs.writeFileSync(filePath, ""); // Create an empty file inside the directory
              }
            }

            console.log(
              "\x1b[32m",
              `Project template created successfully in ${projectDirectory}`
            );

            // Run initCmds commands in the project directory
            const initCmds = template.initCmds || [];

            if (initCmds.length > 0) {
              console.log("\nRunning init commands in project directory...");

              for (const cmd of initCmds) {
                try {
                  execSync(cmd + "> /dev/null", {
                    cwd: projectDirectory,
                    stdio: "inherit",
                  });
                  console.log(`\n${cmd} executed successfully`);
                } catch (error) {
                  console.error(`\nFailed to execute ${cmd}: ${error.message}`);
                }
              }
            }
          } catch (error) {
            console.error(
              "\x1b[31m",
              `Failed to parse template file: ${error.message}`
            );
          }

          process.exit(0); // Exit the process when done creating the project template
        });
      }
    }, 200);

    setTimeout(() => {
      clearInterval(timer);
      progressBar.stop();
    }, 4000);
  },
};

module.exports = { project };
