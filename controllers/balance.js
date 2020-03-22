require('dotenv').config()

const buildResponse     = require('../helpers/buildResponse')
const handleError       = require('../helpers/handleError')
const models            = require('../models')
const UserBalance       = models.UserBalance
const UserBalanceHistory= models.UserBalanceHistory
const Bank              = models.Bank

module.exports = {
  topup: (req, res) => {
    UserBalance.findOne({
      attributes: ['id', 'balance'],
      where: {
        UserId: req._userId
      }
    })
    .then(userBalance => {
      Bank.findByPk(req.body.bankId, {attributes: ['id', 'abbreviation']})
      .then(bank => {
        if(bank) {
          let data = {
            UserBalanceId: userBalance.id,
            balance_before: userBalance.balance,
            balance_after: userBalance.balance + req.body.amount,
            activity: 'TOP UP',
            type: 'debit',
            ip: req.ip,
            location: req.body.location,
            user_agent: req.headers['user-agent'],
            author: req._userId,
            description: `Transfer from ${bank.abbreviation}`,
            source_fund_bank: req.body.bankId,
            createdAt: new Date(),
            updatedAt: new Date(),
          } 

          UserBalanceHistory.create(data)
          .then(ubh => {
            UserBalance.update({
                balance: ubh.balance_after,
                balance_achieve: ubh.balance_after,
              }, {
                where: {
                  id: userBalance.id
                },
              })
            .then( ub => {
                buildResponse.success(res, 'Successfully top up')
              })
            .catch(handleError)
          })
          .catch(handleError)
        } else {
          buildResponse.fail(res, 'Invalid Bank')
        }
      })
      .catch(handleError)
    })
    .catch(handleError)
  },

  getBalance: (req, res) => {
    UserBalance.findOne({
      attributes: ['balance'],
      where: {
        UserId: req._userId
      }
    })
    .then(userBalance => {
      if(userBalance) buildResponse.success(res, userBalance)
      else buildResponse.fail(res, 'Balance not found', 404)
    })
    .catch(handleError)
  }

}
