const validateResource = (schema) => (req, res, next) => {
  console.log({ schema });
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (e) {
    console.log({ error: e });
    return res.status(400).send(e);
  }
};

module.exports = validateResource;
