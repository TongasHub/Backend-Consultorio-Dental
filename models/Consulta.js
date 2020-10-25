/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const { PRESTACIONES } = require('../utils/common');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const consultaSchema = new mongoose.Schema({
  paciente: {
    type: mongoose.SchemaTypes.ObjectIdj,
    ref: 'Paciente',
    required: true,
  },
  prestacion: {
    type: String,
    enum: PRESTACIONES,
    required: true,
  },
  fecha: {
    type: String,
    required: true,
  },
  observacion: {
    type: String,
    maxlength: 500,
  },
});

consultaSchema.set('toJSON', {
  transform: (document, returnedConsulta) => {
    returnedConsulta.id = returnedConsulta._id.toString();

    delete returnedConsulta._id;
    delete returnedConsulta.__v;
  },
});

module.exports = mongoose.model('Consulta', consultaSchema);
