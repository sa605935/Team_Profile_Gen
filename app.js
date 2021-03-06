const Manager = require("./SCRIPT/manager");
const Engineer = require("./SCRIPT/engineer");
const Intern = require("./SCRIPT/intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./SCRIPT/HTML");
const Employee = require("./SCRIPT/employee");
let employee = {};
const employeeArray = [];
let counter = 0;

function promptManager() {
    console.log("Generate a Team Profile");
    inquirer
        .prompt([
            {
                type: "input",
                name: "name",
                message: "Type in the name of the manager:",
            },
            {
                type: "input",
                name: "id",
                message: "What is their ID number?",
            },
            {
                type: "input",
                name: "email",
                message: "What is their email?",
            },
            {
                type: "input",
                name: "officeNumber",
                message: "What is their office number?",
            },
            {
                type: "input",
                name: "counter",
                message: "How many members are on this manager's team?",
            },
        ])
        .then(function (response) {
            console.log(
                "Manager Entry Completed. Pick another title to add a new employee to the list."
            );
            employee = response;
            counter = response.counter;
            const manager = new Manager(
                employee.name,
                employee.id,
                employee.email,
                employee.officeNumber
            );
            employeeArray.push(manager);
            promptEmployee();
        });
}

function promptEmployee() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "name",
                message:
                    "Type in the name of the team member you would like to enter into the generator:",
            },
            {
                type: "input",
                name: "id",
                message: "What is their ID number?",
            },
            {
                type: "input",
                name: "email",
                message: "What is their email?",
            },
            {
                type: "list",
                name: "role",
                message: "What is their role?",
                choices: ["Intern", "Engineer"],
            },
        ])
        .then(function (response) {
            employee = response;
            if (response.role === "Intern") {
                promptIntern();
            } else {
                promptEngineer();
            }
        });
}

function promptIntern() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "school",
                message: "What school do they attend?",
            },
        ])
        .then(function (response) {
            employee.school = response.school;
            const intern = new Intern(
                employee.name,
                employee.id,
                employee.email,
                employee.school
            );
            employeeArray.push(intern);
            counter--;
            if (counter === 0) {
                console.log(`All entries complete!`);
                renderHTML();
            } else {
                if (counter === 1) {
                    console.log(
                        `Entry complete! ${counter} more entry left to go.`
                    );
                } else {
                    console.log(
                        `Entry complete! ${counter} more entries left to go.`
                    );
                }
                promptEmployee();
            }
        });
}

function promptEngineer() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "github",
                message: "What is their GitHub username?",
            },
        ])
        .then(function (response) {
            employee.github = response.github;
            const engineer = new Engineer(
                employee.name,
                employee.id,
                employee.email,
                employee.github
            );
            employeeArray.push(engineer);
            counter--;
            if (counter === 0) {
                console.log(`All entries complete!`);
                renderHTML();
            } else {
                if (counter === 1) {
                    console.log(
                        `Entry complete! ${counter} more entry left to go.`
                    );
                } else {
                    console.log(
                        `Entry complete! ${counter} more entries left to go.`
                    );
                }
                promptEmployee();
            }
        });
}

function renderHTML() {
    const returnedHTML = render(employeeArray);

    if (fs.existsSync(OUTPUT_DIR)) {
        fs.writeFile(outputPath, returnedHTML, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log(
                "File 'index.html' successfully written."
            );
        });
    } else {
        console.log("Folder 'output' not found.");
        console.log("Creating 'output' folder in current repository...");
        const outputDirPath = __dirname + "/output";
        fs.mkdir(outputDirPath, { recursive: false }, (err) => {
            if (err) throw err;
        });
        renderHTML();
    }
}
promptManager();
