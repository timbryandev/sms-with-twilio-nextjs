import { NextApiRequest, NextApiResponse } from 'next'
import twilio from 'twilio'

import log from '../../utils/log'
import validate from '../../utils/validate'

function logMessage(data: string[]) {
  try {
    const csvString = data.reduce((acc, item) => {
      const start = acc
      const end = ','
      const cleanItem =
        typeof item === 'string' ? item.replace(/(\r\n|\n|\r)/gm, '\\n') : item

      acc = start + cleanItem + end
      return acc
    }, '')

    log(csvString, 'messages')
  } catch (error) {
    log(JSON.stringify(error))
  }
}

export default function sendMessage(req: NextApiRequest, res: NextApiResponse) {
  const accountSid = <string>process.env.TWILIO_ACCOUNT_SID
  const token = <string>process.env.TWILIO_AUTH_TOKEN
  const from = <string>process.env.TWILIO_PHONE_NUMBER
  const client = twilio(accountSid, token)
  const { phone, message } = req.body

  if (req.method !== 'POST') {
    res
      .status(405)
      .send({ success: false, error: 'Only POST requests allowed' })
    return
  }

  if (validate.phone(phone) === false) {
    res.status(422).json({
      success: false,
      error: 'There is an issue with your chosen number.',
    })
    return
  }

  if (validate.message(message) === false) {
    res.status(422).json({
      success: false,
      error: 'There is an issue with your message.',
    })
    return
  }

  client.messages
    .create({
      body: message,
      from,
      to: phone,
    })
    .then((response: any) => {
      res.status(200).json({
        success: true,
        error: null,
      })

      logMessage([true, from, phone, message, JSON.stringify(response)])
    })
    .catch((error: Error) => {
      res.status(500).json({
        success: false,
        error: 'There was an issue sending your message to your chosen number.',
      })

      logMessage([false, from, phone, message, JSON.stringify(error)])
    })
}
