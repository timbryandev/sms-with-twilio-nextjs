const MessageCount = ({ message = '' }) => {
  const limit = 160
  const length = message.length
  const count = Math.ceil(length / limit) || 1

  return (
    <p>
      {length} / {limit * count} ({count} message{count > 1 && 's'})
    </p>
  )
}

export default MessageCount
