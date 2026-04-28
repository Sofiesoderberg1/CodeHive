// ================= NAVIGATION =================
/**
 * Shows a specific section and hides all others.
 *
 * @param {string} section - The id of the section to display.
 */
window.showSection = function(section) {
  document.querySelectorAll('section').forEach(s => s.style.display = 'none')
  document.getElementById(section).style.display = 'block'
}

/**
 * Initializes the page by showing the home section when DOM is loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
  window.showSection('home')
})

// ================= BOOKING =================
/**
 * Sends a booking request to the backend API.
 * Validates required fields before sending.
 *
 * @async
 * @returns {Promise<void>}
 */
window.book = async function() {
  const name = document.querySelector('#name').value
  const email = document.querySelector('#email').value
  const date = document.querySelector('#date').value
  const message = document.querySelector('#message').value

  if (!name || !email || !date) {
    document.querySelector('#status').textContent = 'Fill all fields'
    return
  }

  try {
    await fetch('http://localhost:5000/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, date, message })
    })

    document.querySelector('#status').textContent = 'Booking sent!'
  } catch {
    document.querySelector('#status').textContent = 'Error sending booking'
  }
}

// ================= CHAT =================

/**
 * WebSocket connection used for real-time chat.
 * @type {WebSocket}
 */
const socket = new WebSocket('wss://courselab.lnu.se/message-app/socket?apiKey=eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd')


/**
 * Sends a message through the WebSocket.
 * Ignores empty input.
 */
window.sendMessage = function() {
  const input = document.querySelector('#chatInput')

  if (!input.value) return

  socket.send(JSON.stringify({
    type: 'message',
    data: input.value,
    username: 'Sofie'
  }))

  input.value = ''
}

/**
 * Handles incoming WebSocket messages and updates the UI.
 *
 * @param {MessageEvent} event - The incoming message event.
 */
socket.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data)
  if (msg.type === 'heartbeat') return

  const div = document.createElement('div')
  div.textContent = msg.username + ': ' + msg.data

  document.querySelector('#messages').appendChild(div)
})
// ================= MATCHING =================

/**
 * Matches user input to the most relevant project based on keywords.
 *
 * @param {string} input - The user input describing a project idea.
 * @returns {{name: string} | null} The best matching project or null if no match is found.
 */
function matchProject(input) {
  const keywords = input.toLowerCase()

  const projects = [
    { name: 'E-commerce site', tags: ['shop', 'payment', 'ecommerce', 'webshop', 'betalning'] },
    { name: 'Chat app', tags: ['chat', 'realtime', 'message', 'chatt'] },
    { name: 'Portfolio website', tags: ['website', 'design', 'portfolio', 'hemsida'] }
  ]

  let bestMatch = null
  let maxScore = 0

  projects.forEach(project => {
    let score = 0

    project.tags.forEach(tag => {
      if (keywords.includes(tag)) score++
    })

    if (score > maxScore) {
      maxScore = score
      bestMatch = project
    }
  })

  return bestMatch
}

/**
 * Analyzes the user's input and displays the best matching project.
 */
window.analyze = function() {
  const input = document.querySelector('#message').value
  const result = matchProject(input)

  document.querySelector('#result').textContent =
    result ? 'You might need: ' + result.name : 'No match found'
}

// ================= DEVELOPERS =================

/**
 * Developer data used to display profiles.
 *
 * @type {Object<string, {name: string, role: string, desc: string}>}
 */
const developers = {
  sofie: {
    name: 'Sofie Söderberg',
    role: 'Fullstack Developer',
    desc: 'React, Node, MongoDB'
  },
  emma: {
    name: 'Emma Andersson',
    role: 'Frontend Developer',
    desc: 'I build modern websites'
  },
  jonas: {
    name: 'Jonas Eriksson',
    role: 'Backend Developer',
    desc: 'Node.js specialist'
  }
}
/**
 * Opens a developer profile and updates the UI.
 *
 * @param {string} id - The developer id.
 */
window.openProfile = function(id) {
  const dev = developers[id]

  document.querySelector('#profileName').textContent = dev.name
  document.querySelector('#profileRole').textContent = dev.role
  document.querySelector('#profileDesc').textContent = dev.desc

  showSection('profile')
}
