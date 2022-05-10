import Enquirer from 'enquirer'
import ansi from 'ansi-escape-sequences'
import { User } from './user.mjs'
import { NormalDice, JigoroDice, PinzoroDice } from './dices.mjs'

class Game {
  constructor () {
    this.user1 = new User('you')
    this.user2 = new User('hanchou')
    this.user3 = new User('kaiji')
    this.users = [this.user1, this.user2, this.user3]
    this.jigoro_dice = new JigoroDice()
    this.normal_dice = new NormalDice()
    this.pinzoro_dice = new PinzoroDice()
  }

  async start () {
    while (true) {
      this.user2._dice = this.normal_dice
      this.user3._dice = this.normal_dice
      console.log(`\u001b[1m☆Dealer: ${this.users[0].name}\u001b[0m`)
      await this.sleep(1000)
      for (const user of this.users) {
        console.log(`${user.name}: ${user._token}`)
      }
      await this.sleep(1000)
      const action = await this.decide_action()
      if (action === 'ikasama') {
        if (this.users[0] !== this.user1) {
          await this.user1.bet()
        }
        this.jigoro_dice._lisk += 20
        if (this.jigoro_dice._lisk > 100) {
          this.jigoro_dice._lisk = 100
        }
        this.user1._dice = this.jigoro_dice
        if (Math.floor(Math.random() * 100) < this.jigoro_dice._lisk) {
          console.log('\u001b[91mdiscovered!\u001b[0m')
          this.user2._dice = this.pinzoro_dice
          this.user3._dice = this.pinzoro_dice
        } else {
          console.log('\u001b[92mnot discovered\u001b[0m')
        }
      } else if (action === 'throw dice') {
        if (this.users[0] !== this.user1) {
          await this.user1.bet()
        }
        this.user1._dice = this.normal_dice
      } else if ((action === 'pass') && (this.users[0] === this.user1)) {
        const prevDieler = this.users.shift()
        this.users.push(prevDieler)
        continue
      } else if (action === 'surrender') {
        process.exit()
      }
      this.user2.npc_bet()
      this.user3.npc_bet()
      await this.create_role(this.users[0])
      if ((action !== 'pass') || (this.users[1] !== this.user1)) {
        await this.bout(this.users[0], this.users[1])
      }
      if ((action !== 'pass') || (this.users[2] !== this.user1)) {
        await this.bout(this.users[0], this.users[2])
      }
      if ((this.user1._token <= 0) || (this.user2._token <= 0) || (this.user3._token <= 0)) {
        this.gameset()
      }
      const prevDealer = this.users.shift()
      this.users.push(prevDealer)
    }
  }

  gameset () {
    console.log('\u001b[1mgameset!\u001b[0m')
    this.users.sort(function (a, b) {
      if (a._token < b._token) return 1
      if (a._token > b._token) return -1
      return 0
    })
    for (const user of this.users) {
      console.log(`${user.name}: ${user._token}`)
    }
    if (this.users[0] === this.user1) {
      console.log('☆☆☆\u001b[3myou are winner!\u001b[0m☆☆☆')
    }
    process.exit()
  }

  async bout (dealer, user) {
    console.log(`${user.name}: ${user.betting} bet`)
    await this.sleep(1000)
    await this.create_role(user)
    if ((dealer.role === -1) || (user.role === -1)) {
      user.betting = user.betting * 2
    }
    if (dealer.role > user.role) {
      const payout = user.betting * this.payout_rate(dealer.role)
      dealer._token += payout
      user._token -= payout
      console.log(`${dealer.name} win`)
      console.log(`${dealer.name}: ${dealer._token}(+${payout})`)
      console.log(`${user.name}: ${user._token}(-${payout})`)
    } else if (dealer.role < user.role) {
      const payout = user.betting * this.payout_rate(user.role)
      user._token += payout
      dealer._token -= payout
      console.log(`${user.name} win`)
      console.log(`${dealer.name}: ${dealer._token}(-${payout})`)
      console.log(`${user.name}: ${user._token}(+${payout})`)
    } else if (dealer.role === user.role) {
      console.log('even')
      console.log(`${dealer.name}: ${dealer._token}(+0)`)
      console.log(`${user.name}: ${user._token}(+0)`)
    }
    await this.sleep(2000)
  }

  async create_role (user) {
    console.log(`${user.name} threw dices`)
    await this.sleep(1000)
    for (let i = 1; i < 4; i++) {
      await this.chinchirorin()
      const diceEyes = await user.throw_dice()
      const role = await this.judge_role(diceEyes)
      await this.sleep(2000)
      if (role !== 0) {
        user.role = role
        break
      }
      user.role = 0
      if (i < 3) {
        console.log(`throw one more : ${i} / 3(limit)`)
        await this.sleep(2000)
      } else if (i === 3) {
        console.log(`${user.name}: role is menasi : 3 / 3(limit)`)
        await this.sleep(2000)
      }
    }
  }

  async sleep (time) {
    const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    await _sleep(time)
  }

  async chinchirorin () {
    const texts = ['chin', ' chiro', ' rin']
    for (const text of texts) {
      process.stdout.write(text)
      await this.sleep(500)
    }
    process.stdout.write(ansi.erase.inLine(1) + ansi.cursor.nextLine(1))
  }

  judge_role (diceEyes) {
    if (this.zorome(diceEyes) && diceEyes[0] === 1) {
      console.log('pinzoro')
      return 13
    } else if (this.zorome(diceEyes)) {
      console.log(diceEyes[0] + 'no zorome')
      return 6 + diceEyes[0]
    } else if (this.hifumi(diceEyes)) {
      console.log('hifumi')
      return -1
    } else if (this.jigoro(diceEyes)) {
      console.log('jigoro')
      return 7
    } else if (this.nome(diceEyes)) {
      const diceNumber = this.nannome(diceEyes)
      console.log(diceNumber + 'nome')
      return diceNumber
    } else {
      console.log('menasi')
      return 0
    }
  }

  zorome = (diceEyes) => {
    return diceEyes[0] === diceEyes[1] && diceEyes[1] === diceEyes[2]
  }

  hifumi = (diceEyes) => {
    return diceEyes.includes(1) && diceEyes.includes(2) && diceEyes.includes(3)
  }

  jigoro = (diceEyes) => {
    return diceEyes.includes(4) && diceEyes.includes(5) && diceEyes.includes(6)
  }

  nome = (diceEyes) => {
    return (diceEyes[0] === diceEyes[1]) || (diceEyes[0] === diceEyes[2]) || (diceEyes[1] === diceEyes[2])
  }

  nannome = (diceEyes) => {
    if (diceEyes[0] === diceEyes[1]) {
      return diceEyes[2]
    } else if (diceEyes[1] === diceEyes[2]) {
      return diceEyes[0]
    } else if (diceEyes[0] === diceEyes[2]) {
      return diceEyes[1]
    }
  }

  payout_rate = (role) => {
    if (role === 13) {
      return 5
    } else if (role > 7 && role < 13) {
      return 3
    } else if (role === 7) {
      return 2
    } else if (role > 0 && role < 7) {
      return 1
    } else if (role === 0) {
      return 1
    } else if (role === -1) {
      return -2
    }
  }

  async decide_action () {
    const actions = ['throw dice', 'ikasama', 'surrender', 'pass']
    const question = {
      type: 'select',
      name: 'action',
      message: 'What are you gonna do?',
      choices: actions
    }
    const answer = await Enquirer.prompt(question)
    return answer.action
  }
}

const game = new Game()
game.start()
