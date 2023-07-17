export const errorMiddleware = (error, req, res, next) => {
  if (error.name === "ValidationError") {
    return res.status(400).send({
      type: "ValidationError",
      details: error.details,
    })
  }

  const errorObj = {
    errorCode: error.errorCode,
    message: error.message,
  }

  console.log(errorObj)

  return res.status(400).json(errorObj)

  return res.status(500).send("Something went wrong")
}
