const { StatusCodes } = require('http-status-codes');
const MyError = require('../utils/MyError');

exports.getAll = (Model) => async (_req, res, next) => {
  try {
    const docs = await Model.find({});

    if (!docs) {
      res.status(StatusCodes.NOT_FOUND).send({
        error: 'No se pudo encontrar ningun documento asociado a la URL dada.',
      });
    }

    res.send(docs.map((doc) => doc.toJSON()));
  } catch (err) {
    next(
      new MyError(
        'Ocurrio un problema al intentar conseguir todos los registros de la entidad pedida',
      ),
    );
  }
};

exports.getOne = (Model) => async (req, res, next) => {
  try {
    const { id } = req.params;
    const docEncontrado = await Model.findById(id);

    if (!docEncontrado) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ error: 'No hay un paciente con el id especificado ' });
    }

    res.send(docEncontrado.toJSON());
  } catch (err) {
    next(
      new MyError('Ocurrio un problema al intentar buscar el registro pedido'),
    );
  }
};

exports.createOne = (Model) => async (req, res, next) => {
  try {
    const { body } = req;

    const response = await Model.create({ ...body });

    res.status(StatusCodes.CREATED).send(response.toJSON());
  } catch (err) {
    next(
      new MyError(`Ocurrio un problema al intentar crear el registro pedido`),
    );
  }
};

exports.deleteOne = (Model) => async (req, res, next) => {
  try {
    const { id } = req.params;

    await Model.findByIdAndDelete(id);

    res
      .status(StatusCodes.NO_CONTENT)
      .send({ msg: ' El documento pedido fue borrado exitosamente. ' });
  } catch (err) {
    next(
      new MyError(`Ocurrio un problema al intentar borrar el registro pedido.`),
    );
  }
};

exports.updateOne = (Model) => async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;

    const documentoActualizado = await Model.findByIdAndUpdate(
      id,
      { ...body },
      { new: true },
    );

    res.status(StatusCodes.OK).send(documentoActualizado.toJSON());
  } catch (err) {
    next(
      new MyError(
        'Ocurrio un problema al intentar modificar el registro pedido',
      ),
    );
  }
};
