const chalk = require("chalk");
const figlet = require("figlet");
const inquirer = require("inquirer");
const request = require("@i-scrapper/plugins-request");

const questions = [
    {
        type: "input",
        name: "authorization",
        message: color("Authorization keys:"),
        prefix: `${color("[", "redBright")}Xopple${color("]", "redBright")}`,
        suffix: "~",
        validate: function (input) {
            const done = this.async();
            if (!input) {
                done('Auth Error!!!');
                return false;
            }
            let authParse;
            try {
                authParse = JSON.parse(input);
            } catch (error) {
                authParse = error.message;
            }
            if (typeof authParse != "object") {
                done("Auth Error!!!");
                return false;
            }
            return done(null, true);
        },
    },
    {
        type: "list",
        name: "round",
        message: color("Authorization keys taken at 'Round':"),
        prefix: `${color("[", "redBright")}Xopple${color("]", "redBright")}`,
        suffix: "~",
        choices: ["Stage 1", "Stage 2", "Stage 3 ( Win )"],
        filter: (value) => {
            return {
                "Stage 1": 1,
                "Stage 2": 2,
                "Stage 3 ( Win )": 3,
            }[value];
        },
    },
    {
        type: "input",
        name: "interval",
        message: color("Delay In Milisecond (If Stuck Put 2700) :"),
        prefix: `${color("[", "redBright")}Xopple${color("]", "redBright")}`,
        suffix: "~",
        validate: function (input) {
            const done = this.async();
            if (input && isNaN(input)) {
                done('Isinya Angka Ancrit');
                return false;
            }
            return done(null, true);
        },
    }
];

const xop = figlet.textSync("Xopple", {
    font: 'ANSI Shadow',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 75,
    whitespaceBreak: true
});

console.log(color(xop, "redBright"));
console.log(chalk.redBright.bold('           BY            '));
console.log(chalk.blueBright('╔═══════════════════════╗'));
console.log(chalk.blueBright('║ RayZ : RayZKulbet#3191║'));
console.log(chalk.blueBright('║ Uan  : uangg#9852     ║'));
console.log(chalk.blueBright('╚═══════════════════════╝'));
console.log(chalk.greenBright('Stuck Can Be Caused By Ban or Limit'));
console.log(chalk.greenBright('If Stuck You Must Rerun The Script'));
console.log(chalk.greenBright('If Stuck Again, Maybe Your Account Banned\n'));

inquirer.prompt(questions)
    .then(async ({ authorization, round, interval }) => {
        const authParse = JSON.parse(authorization);
        iStumble(interval, round, authParse);
    });

function iStumble(interval, round, authorization) {
    setInterval(async function iStumble() {
        try {
            const { data } = await stageRequest(authorization, round);
            if (typeof data == "string" && data.includes("BANNED")) {
                console.error(color("BANNED", "redBright"));
            } else if (typeof data == "object") {
                const date = new Date();
                let { Id, Username, Country, Region, Crowns, SkillRating, Experience } = data.User;
                const print = `[${color(date.getHours())}:${date.getMinutes()}:${date.getSeconds()}] ` + [color(Id, "blueBright"), color(Username), color(Country, "cyan"), color(Region, "cyanBright"), color(Crowns, "greenBright"), color(SkillRating, "yellowBright"), color(Experience, "red")].join(" | ");
                console.log(print);
            } else if (typeof data == "string" && data.includes('BANNED')) {
              console.log(chalk.bgRed(`Mampus Banned Makanya Jan Ngecheat, Ini Resiko!!!`));
            }

        } catch (error) {}
    }, Number(interval));
}

function color(text, color) {
    return color ? chalk[color].bold(text) : chalk.white.bold(text);
}

function stageRequest(authorization, round) {
    return new Promise((resolve, reject) => {
        request({
            url: `http://kitkabackend.eastus.cloudapp.azure.com:5010/round/finishv2/${round}`,
            headers: {
                Authorization: JSON.stringify(authorization),
                use_response_compression: true,
                "Accept-Encoding": "gzip",
                "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 10; Redmi Note 8 Pro Build/QQ3A.200705.002)",
            }
        })
            .then((response) => {
                resolve(response);
            })
            .catch(reject);
    });
}
