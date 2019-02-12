const Promise = require('bluebird')
const crypto = require('crypto')
const pbkdf2 = Promise.promisify(crypto.pbkdf2)
const randomBytes = Promise.promisify(crypto.randomBytes)
const constants = require('../config/constants')

function generateHashString (password) {
  return randomBytes(constants.PASSWORD.KEYLENTH)
    .then((salt) => {
      salt = salt.toString('base64')
      return [salt, pbkdf2(password, salt, constants.PASSWORD.ITERATIONS, constants.PASSWORD.KEYLENTH, constants.PASSWORD.ALGO)]
    }).spread((salt, hash) => {
      hash = hash.toString('base64')
      return formatHashString(salt, hash)
    })
}

function formatHashString (salt, hash) {
  return `${salt}$${hash}$${constants.PASSWORD.ITERATIONS}$${constants.PASSWORD.KEYLENTH}$${constants.PASSWORD.ALGO}`
}

function parseHashString (hashString) {
  let [salt, hash, iterations, keylength, algo] = hashString.split('$')
  return {
    salt,
    hash,
    iterations: +iterations,
    keylength: +keylength,
    algo
  }
}

function compare (password, hashString) {
  let parsedHashString = parseHashString(hashString)
  return pbkdf2(password, parsedHashString.salt, parsedHashString.iterations, parsedHashString.keylength, parsedHashString.algo)
    .then((hashToCompare) => {
      hashToCompare = hashToCompare.toString('base64')
      return hashToCompare === parsedHashString.hash
    })
}

module.exports = {
  generateHashString,
  compare
}
