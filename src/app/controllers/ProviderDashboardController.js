const { User, Appointment } = require('../models')
const { Op } = require('sequelize')
const moment = require('moment')

class ProviderDashboardController {
  async index (req, res) {
    const users = await User.findAll({ where: { provider: false } })
    const now = moment()
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.session.user.id,
        date: {
          [Op.between]: [
            now.format(),
            now
              .add(1, 'days')
              .endOf('day')
              .format()
          ]
        }
      }
    })
    const userAppointments = appointments.map(appointment => {
      return {
        date: moment(appointment.date).calendar(),
        user: users.filter(user => user.id === appointment.user_id)[0]
      }
    })

    return res.render('provider_dashboard', { users, userAppointments })
  }
}

module.exports = new ProviderDashboardController()
