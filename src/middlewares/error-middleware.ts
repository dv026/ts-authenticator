export const errorMiddleware = (error, req, res, next) => {
  if (error.name === "ValidationError") {
    return res.status(400).send({
      type: "ValidationError",
      details: error.details,
    })
  }

  const erroObj = {
    errorCode: error.errorCode,
    message: error.message,
    status: error.status,
  }

  return res.status(400).json(erroObj)

  return res.status(500).send("Something went wrong")
}
