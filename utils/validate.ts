function message(string: string): boolean {
  return string.length > 0
}

function phone(string: string): boolean {
  const regex = /^\+(?:\d ?){6,14}\d$/
  return regex.test(string)
}

const validate = { message, phone }

export default validate
