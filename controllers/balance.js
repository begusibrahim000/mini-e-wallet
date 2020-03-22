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
            source_fund_type: 'bank',
            source_fund_bank: req.body.bankId,
            createdAt: new Date(),
            updatedAt: new Date(),
          } 

          UserBalanceHistory.create(data)
          .then(ubh => {
            UserBalance.update({
                balance: ubh.balance_after,
                balance_achieve: ubh.balance_after,
                updatedAt: new Date()
              }, {
                where: {
                  id: userBalance.id
                },
              })
            .then( ub => {
                buildResponse.success(res, 'Successfully top up')
              })
            .catch(err => {handleError(err, res)})
          })
          .catch(err => {handleError(err, res)})
        } else {
          buildResponse.fail(res, 'Invalid Bank')
        }
      })
      .catch(err => {handleError(err, res)})
    })
    .catch(err => {handleError(err, res)})
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
    .catch(err => {handleError(err, res)})
  },

  transfer: (req, res) => {
    UserBalance.findOne({
      attributes: ['id', 'balance'],
      where: {
        UserId: req._userId
      },
      include: [
        { model: models.User, as: 'User', attributes: ['username']}
      ]
    })
    .then(userBalance => {
      if(userBalance) {
        if(userBalance.balance < req.body.amount) {
          buildResponse.fail(res, 'Insufficient balance')
        } else {
          UserBalance.findOne({
            attributes: ['id', 'balance'],
            where: {
              UserId: req.body.userIdDestination
            },
            include: [
              { model: models.User, as: 'User', attributes: ['username']}
            ]
          })
          .then(userBalanceDest => {
            if(userBalanceDest) {
              let userOriginBalanceAfter = userBalance.balance - req.body.amount
              let userDestBalanceAfter = userBalanceDest.balance + req.body.amount
              let dataHistoryOut = {
                UserBalanceId: userBalance.id,
                balance_before: userBalance.balance,
                balance_after: userOriginBalanceAfter,
                activity: 'Outgoing Transfer',
                type: 'credit',
                ip: req.ip,
                location: req.body.location,
                user_agent: req.headers['user-agent'],
                author: req._userId,
                description: `Transfer to ${userBalanceDest.User.username}`,
                createdAt: new Date(),
                updatedAt: new Date(),
              }
              let dataHistoryIn = {
                UserBalanceId: userBalanceDest.id,
                balance_before: userBalanceDest.balance,
                balance_after: userDestBalanceAfter,
                activity: 'Incoming Transfer',
                type: 'debit',
                ip: req.ip,
                location: req.body.location,
                user_agent: req.headers['user-agent'],
                author: req._userId,
                description: `Transfer from ${userBalance.User.username}`,
                source_fund_type: 'user',
                source_fund_user: req._userId,
                createdAt: new Date(),
                updatedAt: new Date(),
              }

              UserBalanceHistory.bulkCreate([dataHistoryOut, dataHistoryIn])
              .then(histories => {
                UserBalance.update({
                  balance: userOriginBalanceAfter,
                  balance_achieve: userOriginBalanceAfter,
                  updatedAt: new Date()
                }, {
                  where: {
                    id: userBalance.id
                  },
                })
                .then(() => {
                  UserBalance.update({
                    balance: userDestBalanceAfter,
                    balance_achieve: userDestBalanceAfter,
                    updatedAt: new Date()
                  }, {
                    where: {
                      id: userBalanceDest.id
                    },
                  })
                  .then(() => {
                    buildResponse.success(res, 'Successfully Transfer Balance')
                  })
                  .catch(err => {handleError(err, res)})
                })
                .catch(err => {handleError(err, res)})
              })
              .catch(err => {handleError(err, res)})
            } else {
              buildResponse.fail(res, 'Balance not found', 404)
            }
          })
          .catch(err => {handleError(err, res)})
        }
      } else {
        buildResponse.fail(res, 'Balance not found', 404)
      }
    })
    .catch(err => {handleError(err, res)})
  }

}
