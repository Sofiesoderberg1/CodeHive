/**
 * Extracts username from email address.
 *
 * @param {string} email - User email.
 * @returns {string} Username part of email.
 */
export function getUsernameFromEmail (email) {
  return email.split('@')[0]
}

/**
 * Validates password length.
 *
 * @param {string} password - User password.
 * @returns {boolean} True if password is valid.
 */
export function validatePassword (password) {
  return password.length >= 6
}

/**
 * Validates booking form fields.
 *
 * @param {string} name - Customer name.
 * @param {string} email - Customer email.
 * @param {string} date - Booking date.
 * @returns {boolean} True if all fields are provided.
 */
export function validateBooking (
  name,
  email,
  date
) {
  return !!(name && email && date)
}

/**
 * Validates chat message content.
 *
 * @param {string} message - Chat message.
 * @returns {boolean} True if message is not empty.
 */
export function validateMessage (message) {
  return message.trim().length > 0
}

/**
 * Matches project type based on keywords.
 *
 * @param {string} input - User project description.
 * @returns {string|null} Suggested project type.
 */
export function matchProject (input) {
  const keywords = input.toLowerCase()

  if (
    keywords.includes('shop') ||
    keywords.includes('payment')
  ) {
    return 'E-commerce site'
  }

  if (
    keywords.includes('chat')
  ) {
    return 'Chat app'
  }

  if (
    keywords.includes('portfolio')
  ) {
    return 'Portfolio website'
  }

  return null
}

/**
 * Validates email format.
 *
 * @param {string} email - Email address.
 * @returns {boolean} True if email appears valid.
 */
export function isValidEmail (email) {
  return email.includes('@') &&
    email.includes('.')
}

/**
 * Capitalizes the first letter of a name.
 *
 * @param {string} name - Name string.
 * @returns {string} Capitalized name.
 */
export function capitalizeName (name) {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

/**
 * Truncates text to a specific length.
 *
 * @param {string} text - Text to truncate.
 * @param {number} length - Maximum length.
 * @returns {string} Truncated text.
 */
export function truncateText (text, length) {
  return text.slice(0, length)
}

/**
 * Checks if booking date is in the future.
 *
 * @param {string} date - Booking date.
 * @returns {boolean} True if date is in the future.
 */
export function isBookingInFuture (date) {
  return new Date(date) > new Date()
}

/**
 * Formats username by trimming and converting to lowercase.
 *
 * @param {string} username - Username string.
 * @returns {string} Formatted username.
 */
export function formatUsername (username) {
  return username.trim().toLowerCase()
}
