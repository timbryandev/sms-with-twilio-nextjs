import styles from '../styles/Statuses.module.css'

interface ErrorMessageProps {
  message: string | undefined
}

const ErrorMessage = ({ message }: ErrorMessageProps): JSX.Element | null => {
  if (message === undefined) {
    return null
  }
  return <p className={styles.error}>{message}</p>
}

export default ErrorMessage
