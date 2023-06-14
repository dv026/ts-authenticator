import axios from "axios"

class EmailService {
  constructor() {}

  async send({
    to,
    subject,
    text,
  }: {
    to: string
    subject: string
    text: string
  }) {
    try {
      return axios
        .post(
          process.env.EMAIL_SENDER_URL,
          {
            sender: {
              name: "ts-authenticator",
              email: "ts-authenticator@no-reply.com",
            },
            to: [
              {
                email: to,
              },
            ],
            subject,
            htmlContent: `<html><head></head><body><p>Hello,</p>${text}</p></body></html>`,
          },
          {
            headers: {
              "api-key": process.env.EMAIL_SENDER_API_KEY,
              accept: "application/json",
              "content-type": "application/json",
            },
          }
        )
        .then((response) => response.data)
    } catch (e) {
      throw new Error(e)
    }
  }
}

export const emailService = new EmailService()
