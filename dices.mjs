class NormalDice {
  roll () {
    return Math.floor(Math.random() * 6) + 1
  }
}

class JigoroDice {
  constructor () {
    this._lisk = 0
  }

  get lisk () {
    return this._lisk
  }

  set lisk (probability) {
    this._lisk = probability
  }

  roll () {
    return Math.floor(Math.random() * 3) + 4
  }
}

class PinzoroDice {
  roll () {
    return 1
  }
}

export { NormalDice, JigoroDice, PinzoroDice }
