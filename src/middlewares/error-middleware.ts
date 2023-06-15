export const errorMiddleware = (error, req, res, next) => {
  console.log(error)

  if (error.name === "ValidationError") {
    return res.status(400).send({
      type: "ValidationError",
      details: error.details,
    })
  }

  const erroObj = {
    status: 400,
    errorCode: error.errorCode,
    message: error.errorMessage,
    details: error.details,
  }

  return res.status(400).json("er obj", erroObj)

  return res.status(500).send("Something went wrong")
}
