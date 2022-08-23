import type { NextPage } from 'next'
import Head from 'next/head'
import { BaseSyntheticEvent, useState } from 'react'
import ErrorMessage from '../components/ErrorMessage'
import MessageCount from '../components/MessageCount'
import validate from '../utils/validate'
import styles from '../styles/Home.module.css'

type TErrorTypes = 'phone' | 'message' | 'general'

type TError = {
  [key in TErrorTypes]?: string
}

const Home: NextPage = () => {
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<TError>({})

  const sendMessage = async (e: BaseSyntheticEvent) => {
    e.preventDefault()

    if (validate.phone(phone) === false) {
      setError({ phone: 'Please check the number.' })
      return
    }

    if (validate.message(message) === false) {
      setError({ message: 'You must supply a message.' })
      return
    }

    setLoading(true)
    setError({})
    setSuccess(false)

    const res = await fetch('/api/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, message }),
    })

    const apiResponse = await res.json()

    if (apiResponse.success) {
      setSuccess(true)
    } else {
      setError({
        general:
          'Something went wrong - we were unable to process your request.',
      })
    }
    setLoading(false)
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Next.js + Twilio</title>
      </Head>

      <form className={styles.form} onSubmit={sendMessage}>
        <h1 className={styles.title}>Send message using Next.js and Twilio</h1>
        <div className={styles.formGroup}>
          <label htmlFor='phone'>
            Phone Number <small>(including country code)</small>
          </label>
          <input
            onChange={e => setPhone(e.target.value)}
            placeholder='+447777777777'
            className={styles.input}
            required
          />
          <ErrorMessage message={error.phone} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor='message'>Message</label>
          <textarea
            onChange={e => setMessage(e.target.value)}
            id='message'
            required
            placeholder='Message'
            className={styles.textarea}
            rows={6}
          ></textarea>
          <MessageCount message={message} />
          <ErrorMessage message={error.message} />
        </div>
        <button disabled={loading} type='submit' className={styles.button}>
          Send Message
        </button>
        {success && (
          <p className={styles.success}>Message sent successfully.</p>
        )}
        <ErrorMessage message={error.general} />
      </form>
    </div>
  )
}

export default Home
