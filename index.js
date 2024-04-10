const functions = require('@google-cloud/functions-framework')
const formData = require('form-data')
const Mailgun = require('mailgun.js')
const mailgun = new Mailgun(formData)
const createToken = require('./token')

functions.http('verify_email', async (req, res) => {
  const data = Buffer.from(req.body.message.data, 'base64').toString(
    'utf-8'
  )
  const username = JSON.parse(data).username
  const baseUrl = JSON.parse(data).url
  const DOMAIN = process.env.MAILGUN_DOMAIN
  const mg = mailgun.client({
    key: process.env.MAILGUN_API_KEY,
    username: DOMAIN,
  })
  try {
    const token = await createToken(username)
    const data = {
      from: 'Webapp <noreply@mg.jayv.tech>',
      to: username,
      subject: 'Email Verification',
      template: 'Email-Verify',
      'h:X-Mailgun-Variables': JSON.stringify({
        url: baseUrl + '/' + token,
      }),
    }
    await mg.messages.create(DOMAIN, data)
    res.status(200).send()
  } catch (err) {
    throw new Error(err)
  }
})
