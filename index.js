const inquirer = require("inquirer");
const chalk = require("chalk");
const fs = require("fs");
operation();
function operation() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "O que você deseja fazer ",
        choices: [
          "Criar conta",
          "Depositar",
          "Consultar Saldo",
          "Sacar",
          "Sair",
        ],
      },
    ])
    .then((answer) => {
      const action = answer["action"];
      switch (action) {
        case "Criar conta":
          creatAccount();
          biuldAccount();
          break;
        case "Depositar":
          deposit();

          break;
        case "Consultar Saldo":
          getAccountBalance()
          break;
        case "Sacar":
          widhtDraw();
          break;
        case "Sair":
          console.log(chalk.bgBlue("Obrigado por ultilizar o accounts"));
          process.exit();
          break;
        default:
          break;
      }
    })
    .catch((err) => console.log(chalk.bgRed(err)));
}
function creatAccount() {
  console.log(chalk.bgGreen.black("OObrigado por escolher Accounts  !"));
  console.log(chalk.green("Defina as opções da sua conta:"));
}
function biuldAccount() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Digite o nome da sua conta: ",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];
      console.info();
      if (!fs.existsSync("accounts")) {
        fs.mkdirSync("accounts");
      }
      const accountPath = `accounts/${accountName}.json`;
      if (fs.existsSync(accountPath)) {
        console.log(chalk.bgRed.black("Conta já existe, escolha outro nome!"));
        biuldAccount();

        return; // Para não continuar e criar o arquivo
      }
      try {
        fs.writeFileSync(accountPath, '{"balance": 0}');
        console.info(
          chalk.bgGreen.black(
            `Parabéns, ${accountName}! Sua conta foi criada com sucesso!`
          )
        );
      } catch (err) {
        console.log(
          chalk.bgRed.black("Houve um erro ao criar a conta! Tente novamente!")
        );
      }
      operation();
    })
    .catch((err) => console.log(chalk.bgRed(err)));
}

function deposit() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da conta",
      },
    ])

    .then((anwser) => {
      const accountName = anwser["accountName"];
      if (!checkAccount(accountName)) {
        deposit();
      }
      inquirer
        .prompt([
          {
            name: "amount",
            message: "Qual o valor que você deseja depositar?",
          },
        ])
        .then((answer) => {
          const amount = answer["amount"];
          addAmount(accountName, amount); // Chame aqui!
        })
        .catch((err) => console.log(chalk.bgRed(err)));
    })
    .catch((err) => console.log(err));
}
function checkAccount(accountName) {
  if (!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(chalk.bgRed("Essa conta não existe"));
    return false;
  }
  return true;
}
function addAmount(accountName, amount) {
  const accountData = getAccount(accountName);
  if (!amount) {
    console.log(chalk.bgRed.black("Valor inválido!"));
    return deposit();
  }
  accountData.balance += parseFloat(amount);
  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
      console.log(err);
    }
  );
  console.log(chalk.green(`Depósito de R$ ${amount} realizado com sucesso!`));
  operation();
}
function getAccount(accountName) {
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: "utf-8",
    flag: "r",
  });
  return JSON.parse(accountJSON);
}
function getAccountBalance() {
  inquirer
  .prompt([
    {
      name: "accountName",
      message: "Qual o nome da conta?",
    },
  ])
  .then((answer) => {
    const accountName = answer["accountName"];
    if (!checkAccount(accountName)) {
      getAccountBalance();
      return;
    }
    const accountData = getAccount(accountName);
    console.log(
      chalk.bgBlue.black(`O saldo da conta ${accountName} é R$ ${accountData.balance}`)
    );
    operation();
  })
  .catch((err) => console.log(chalk.bgRed(err)));
  
}
function widhtDraw() {
  inquirer
  .prompt([
    {
      name: "accountName",
      message: "Qual o nome da conta?",
    },
  ])
  .then((answer) => { 
    const accountName = answer["accountName"];
    if (!checkAccount(accountName)) {
      widhtDraw();
      
    }
    inquirer
      .prompt([
        {
          name: "amount",
          message: "Qual o valor que você deseja sacar?",
        },
      ])
      .then((answer) => {
        const amount = answer["amount"];
        const accountData = getAccount(accountName);
        if (amount > accountData.balance) {
          console.log(chalk.bgRed.black("Saldo insuficiente!"));
          return widhtDraw();
        }
        accountData.balance -= parseFloat(amount);
        fs.writeFileSync(
          `accounts/${accountName}.json`,
          JSON.stringify(accountData),
          function (err) {
            console.log(err);
          }
        );
        console.log(chalk.green(`Saque de R$ ${amount} realizado com sucesso!`));
        operation();
      })
      .catch((err) => console.log(chalk.bgRed(err)));
  })
}