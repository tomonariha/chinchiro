import Enquirer from 'enquirer'

class User {
  constructor (name) {
    this.name = name
    this._token = 1000
    this._betting = 100
  }

  get token () {
    return this._token
  }

  get role () {
    return this._role
  }

  get dice () {
    return this._dice
  }

  get betting () {
    return this._betting
  }

  set role (roleNumber) {
    this._role = roleNumber
  }

  set token (number) {
    this._token = number
  }

  set dice (diceKind) {
    this._dice = diceKind
  }

  set betting (bet) {
    this._betting = bet
  }

  async throw_dice () {
    const diceEyes = []
    for (let i = 1; i < 4; i++) {
      await diceEyes.push(this.dice.roll())
    }
    this.printDice(diceEyes)
    return diceEyes
  }

  async bet () {
    const bettingAmount = ['100', '200', '300', '400', '500']
    const question = {
      type: 'select',
      name: 'bet',
      message: 'How much bet?',
      choices: bettingAmount,
      validate: (token) => {
        if (token <= this._token) {
          return true
        }
        return "don't have enough token"
      }
    }
    const answer = await Enquirer.prompt(question)
    this._betting = answer.bet
  }

  npc_bet () {
    this._betting = Math.floor(Math.random() * 2) * 100 + 100
  }

  printDice (diceEyes) {
    const diceAA1 = { 1: '  |       |', 2: '  |     ● |', 3: '  |     ● |', 4: '  | ●   ● |', 5: '  | ●   ● |', 6: '  | ●   ● |' }
    const diceAA2 = { 1: '  |   \u001b[31m●\u001b[0m   |', 2: '  |       |', 3: '  |   ●   |', 4: '  |       |', 5: '  |   ●   |', 6: '  | ●   ● |' }
    const diceAA3 = { 1: '  |       |', 2: '  | ●     |', 3: '  | ●     |', 4: '  | ●   ● |', 5: '  | ●   ● |', 6: '  | ●   ● |' }
    console.log('  +-------+  +-------+  +-------+')
    process.stdout.write(`${diceAA1[diceEyes[0]]}`)
    process.stdout.write(`${diceAA1[diceEyes[1]]}`)
    console.log(`${diceAA1[diceEyes[2]]}`)
    process.stdout.write(`${diceAA2[diceEyes[0]]}`)
    process.stdout.write(`${diceAA2[diceEyes[1]]}`)
    console.log(`${diceAA2[diceEyes[2]]}`)
    process.stdout.write(`${diceAA3[diceEyes[0]]}`)
    process.stdout.write(`${diceAA3[diceEyes[1]]}`)
    console.log(`${diceAA3[diceEyes[2]]}`)
    console.log('  +-------+  +-------+  +-------+')
  }
}

export { User }
