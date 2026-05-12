import { io } from 'socket.io-client'

const socket = io(window.location.origin)
const input = document.querySelector('#chatInput')

if (input) {
  input.addEventListener('input', () => {
    socket.emit('typing', currentChatUser)
  })
}
// ================= NAVIGATION =================

const historyStack = []
let currentSection = 'home'

/**
 * Shows a specific section and hides all others.
 *
 * @param {string} section - The id of the section to display.
 */
window.showSection = function (section) {
  if (section !== currentSection) {
    historyStack.push(currentSection)
    currentSection = section
  }

  document
    .querySelectorAll('section')
    .forEach((s) => (s.style.display = 'none'))

  const next = document.getElementById(section)
  if (next) next.style.display = 'block'

  closeMenu()
}

/**
 * Global variable to keep track of the previously displayed section.
 *
 * @type {string} - The id of the previous section.
 */
window.goBack = function () {
  const prev = historyStack.pop()

  if (!prev) return

  currentSection = prev

  document
    .querySelectorAll('section')
    .forEach((s) => (s.style.display = 'none'))

  const next = document.getElementById(prev)
  if (next) next.style.display = 'block'
}

/**
 * Toggles the navigation menu by adding/removing the 'active' class.
 */
document.querySelector('.menu-toggle').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('active')
})

/**
 * Closes the navigation menu by removing the 'active' class.
 */
function closeMenu () {
  const nav = document.getElementById('navLinks')
  if (nav) nav.classList.remove('active')
}

document.addEventListener('click', (e) => {
  const nav = document.getElementById('navLinks')
  const toggle = document.querySelector('.menu-toggle')

  if (!nav || !toggle) return

  if (!nav.contains(e.target) && e.target !== toggle) {
    nav.classList.remove('active')
  }
})

// ================= BOOKING =================
/**
 * Sends a booking request to the backend API.
 * Validates required fields before sending.
 *
 * @async
 * @returns {Promise<void>}
 */
window.book = async function () {
  const name = document.querySelector('#name').value
  const email = document.querySelector('#email').value
  const date = document.querySelector('#date').value
  const message = document.querySelector('#message').value
  const developer = document.querySelector('#developer').value

  if (!name || !email || !date) {
    document.querySelector('#status').textContent = 'Fill all fields'
    return
  }

  try {
    await fetch('/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, date, message, developer })
    })

    document.querySelector('#status').textContent = 'Booking sent!'
  } catch {
    document.querySelector('#status').textContent = 'Error sending booking'
  }
}

/**
 * Currently selected developer for chat.
 *
 * @type {string|null}
 */
let currentChatUser = null

// ================= CHAT =================

/**
 * Sends a message through Socket.io.
 * Ignores empty input.
 */
window.sendMessage = function () {
  const input = document.querySelector('#chatInput')

  if (!input.value) return

  socket.emit('sendMessage', {
    from: 'user',
    to: currentChatUser || 'global',
    message: input.value
  })

  input.value = ''
}

/**
 * Handles incoming Socket.io messages and updates the UI.
 */
socket.on('receiveMessage', (msg) => {
  // visa bara rätt chat
  if (
    msg.to !== 'global' &&
    msg.to !== currentChatUser &&
    msg.from !== currentChatUser
  ) return

  const div = document.createElement('div')
  div.textContent = msg.from + ': ' + msg.message

  document.querySelector('#messages').appendChild(div)

  const messages = document.querySelector('#messages')
  messages.scrollTop = messages.scrollHeight
})

socket.on('showTyping', (user) => {
  const typing = document.querySelector('#typing')
  
  typing.textContent = `${user} is typing...`

  setTimeout(() => {
    typing.textContent = ''
  }, 1500)
})
socket.on('onlineUsers', (count) => {
  document.querySelector('#onlineStatus').textContent = 
    `${count} users online`
})

// ================= MATCHING =================

/**
 * Matches user input to the most relevant project based on keywords.
 *
 * @param {string} input - The user input describing a project idea.
 * @returns {{name: string} | null} The best matching project or null if no match is found.
 */
function matchProject (input) {
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
window.analyze = function () {
  const input = document.querySelector('#message').value
  const result = matchProject(input)

  document.querySelector('#result').textContent =
    result ? 'You might need: ' + result.name : 'No match found'
}

// ================= DEVELOPERS =================

/**
 * Developer data used to display profiles.
 *
 * @type {{ [key: string]: {name: string, role: string, desc: string} }}
 */
const developers = {
  sofie: {
    id: 'sofie',
    name: 'Sofie Söderberg',
    role: 'Fullstack Developer',
    desc: 'React, Node, MongoDB'
  },
  emma: {
    id: 'emma',
    name: 'Emma Andersson',
    role: 'Frontend Developer',
    desc: 'I build modern websites'
  },
  jonas: {
    id: 'jonas',
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

window.openProfile = function (id) {
  const dev = developers[id]

  currentChatUser = dev.id // ✅ NY

  const container = document.querySelector('#messages')
  container.innerHTML = ''

  fetch(`/messages/${dev.id}`)
    .then(res => res.json())
    .then(messages => {
      socket.emit('joinRoom', id)

      messages.forEach(msg => {
        const div = document.createElement('div')

        div.className =
        msg.from === 'user'
          ? 'my-message'
          : 'their-message'

        div.textContent = msg.message

        container.appendChild(div)
      })
    })

  document.querySelector('#profileName').textContent = dev.name
  document.querySelector('#profileRole').textContent = dev.role

  const profileContainer = document.querySelector('#profileDesc')
  profileContainer.innerHTML = ''

  dev.desc.split(',').forEach((skill) => {
    const span = document.createElement('span')
    span.textContent = skill.trim()
    profileContainer.appendChild(span)
  })
  document.querySelector('#profileImg').src = `/images/${id}.png`

  window.showSection('profile')
}

/**
 * Fetches all bookings from the backend and displays them in the admin view.
 * Requires a valid JWT token stored in localStorage.
 *
 * @async
 * @function loadBookings
 * @returns {Promise<void>}
 */
window.loadBookings = async function () {
  const token = localStorage.getItem('token')

  if (!token) {
    alert('Not authorized')
    return
  }

  const res = await fetch('/bookings', {
    headers: {
      authorization: token
    }
  })

  const data = await res.json()

  const container = document.querySelector('#bookingList')
  container.innerHTML = ''

  data.forEach(b => {
    const div = document.createElement('div')
    div.className = 'card'
    div.innerHTML = `
      <strong>${b.name}</strong><br>
      ${b.email}<br>
      ${b.date}<br>
      ${b.message}
    `
    container.appendChild(div)
  })
}

/**
 * Prompts the user for an admin password and attempts to log in.
 * If successful, stores JWT token in localStorage and loads admin bookings.
 *
 * @async
 * @function login
 * @returns {Promise<void>}
 */
window.login = async function () {
  const password = prompt('Enter admin password')

  const res = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  })

  const data = await res.json()

  if (data.token) {
    localStorage.setItem('token', data.token)
    window.showSection('admin')
    window.loadBookings()
  } else {
    alert('Wrong password')
  }
}
