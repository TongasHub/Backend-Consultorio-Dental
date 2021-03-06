const { StatusCodes } = require('http-status-codes');
const logger = require('../utils/logger');

const endpointDesconocido = (_req, res) => {
  res.status(StatusCodes.NOT_FOUND).send({ error: 'Endpoint desconocido ' });
};

const extraerToken = (req, _res, next) => {
  const authorization = req.get('authorization') || null;

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    logger.info('token extraido');
    req.token = authorization.substring(7);
  } else {
    req.token = null;
  }

  next();
};

const errorHandler = (err, _req, res, next) => {
  const errName = err.name.toLowerCase();

  if (err.message.includes('duplicate key')) {
    logger.error(
      'Se esta intentando asignar un valor unico en la base de datos',
    );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: true,
      msg:
        'Campos email o DNI ya ocupados, porfavor, utilize otros o en el caso de DNI, hable con el administrador.',
    });
  }

  if (err.message.includes('Usuario o contraseña incorrectos')) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: true,
      msg: 'Usuario o contraseña incorrectos.',
    });
  }

  if (err.message.includes('maximum allowed length')) {
    logger.error(
      'Se esta intentando asignar un campo en la base de datos mayor a la longitud permitida de ese campo',
    );

    return res.status(err.status).send({
      error: true,
      msg:
        'Maxima longitud para alguno de los campos. verifique los campos asignados.',
    });
  }
  if (err.message.includes('jwt malformed')) {
    logger.error('Error en la validacion de JWT');
    return res
      .status(StatusCodes.FORBIDDEN)
      .send({ error: true, msg: 'Token invalido, no autorizado.' });
  }

  if (errName === 'validationerror') {
    logger.error('error, contrasenia incorrecta.');
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: true, msg: 'Password incorrecta.' });
  }

  if (err.message.includes('Ya existe un turno para ese dia y horario')) {
    logger.error(err.message);
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: true,
      errorMessage: 'Ya existe un turno para este dia y horario',
    });
  }

  return next(err);
};

module.exports = {
  endpointDesconocido,
  errorHandler,
  extraerToken,
};
