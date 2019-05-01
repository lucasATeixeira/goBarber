const { User, Appointment } = require('../models')
const { Op } = require('sequelize')
const moment = require('moment')
moment.locale('pt-br')

class ProviderAppointmentController {
  async create (req, res) {
    const cliente = await User.findByPk(req.params.cliente)
    const now = moment()
    const appointments = await Appointment.findAll({
      where: {
        user_id: cliente.id,
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

    const dates = appointments.map(appointment => {
      const teste = moment(appointment.date).calendar()
      return teste
    })

    return res.render('appointments/show', { cliente, dates })
  }
}

module.exports = new ProviderAppointmentController()
