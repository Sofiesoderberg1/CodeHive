import { io } from 'socket.io-client'

let socket

// ================= CHAT AUTH =================

/**
 * Authenticates a normal chat user and stores JWT token locally.
 *
 * @async
 * @returns {Promise<string>} JWT token
 */
const chatAuth = async () => {
  const existingToken = localStorage.getItem('chatToken')

  if (existingToken) {
    return existingToken
  }

  const res = await fetch('/chat-login', {
    method: 'POST'
  })

  const data = await res.json()

  localStorage.setItem('chatToken', data.token)
  localStorage.setItem('userId', data.userId)

  return data.token
}

// ================= START SOCKET =================

chatAuth().then(token => {
  socket = io(window.location.origin, {
    auth: {
      token
    }
  })

  socket.on('connect', () => {
    console.log('Socket connected')
  })
  setupSocket()
})

// ================= CHAT USER =================

/**
 * Currently selected developer for chat.
 *
 * @type {string|null}
 */
let currentChatUser = null

// ================= SOCKET EVENTS =================

/**
 * Sets up all Socket.io event listeners.
 *
 * @returns {void}
 */
function setupSocket () {
  const input = document.querySelector('#chatInput')

  if (input) {
    input.addEventListener('input', () => {
      if (!currentChatUser) return

      socket.emit('typing', currentChatUser)
    })
  }

  /**
   * Handles incoming chat messages.
   */
  socket.on('receiveMessage', (msg) => {
    console.log('MESSAGE ARRIVED:', msg)
    const div = document.createElement('div')

    div.className =
      msg.from === localStorage.getItem('userId')
        ? 'my-message'
        : 'their-message'

    const time = new Date(msg.createdAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })

    div.innerHTML = `
      <div>${msg.message}</div>
      <small>${time}</small>
    `

    document.querySelector('#messages').appendChild(div)

    const messages = document.querySelector('#messages')

    messages.scrollTop = messages.scrollHeight
  })

  /**
   * Displays typing indicator.
   */
  socket.on('showTyping', (user) => {
    const typing = document.querySelector('#typing')

    if (!typing) return

    typing.textContent = `${user} is typing...`

    setTimeout(() => {
      typing.textContent = ''
    }, 1500)
  })

  /**
   * Updates online user count.
   */
  socket.on('onlineUsers', (count) => {
    const status = document.querySelector('#onlineStatus')

    if (!status) return

    status.textContent = `${count} users online`
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
    .forEach((s) => {
      s.style.display = 'none'
    })

  const next = document.getElementById(section)

  if (next) {
    next.style.display = 'block'
  }

  closeMenu()
}

/**
 * Navigates back to previous section.
 */
window.goBack = function () {
  const prev = historyStack.pop()

  if (!prev) return

  currentSection = prev

  document
    .querySelectorAll('section')
    .forEach((s) => {
      s.style.display = 'none'
    })

  const next = document.getElementById(prev)

  if (next) {
    next.style.display = 'block'
  }
}

/**
 * Toggles navigation menu.
 */
document.querySelector('.menu-toggle')
  .addEventListener('click', () => {
    document
      .getElementById('navLinks')
      .classList.toggle('active')
  })

/**
 * Closes navigation menu.
 */
function closeMenu () {
  const nav = document.getElementById('navLinks')

  if (nav) {
    nav.classList.remove('active')
  }
}

/**
 * Closes menu when clicking outside.
 */
document.addEventListener('click', (e) => {
  const nav = document.getElementById('navLinks')
  const toggle = document.querySelector('.menu-toggle')

  if (!nav || !toggle) return

  if (
    !nav.contains(e.target) &&
    e.target !== toggle
  ) {
    nav.classList.remove('active')
  }
})

// ================= BOOKING =================

/**
 * Sends booking request to backend API.
 */
window.book = async function () {
  const name = document.querySelector('#name').value
  const email = document.querySelector('#email').value
  const date = document.querySelector('#date').value
  const message = document.querySelector('#message').value
  const developer = document.querySelector('#developer').value

  if (!name || !email || !date) {
    document.querySelector('#status').textContent =
      'Fill all fields'

    return
  }

  try {
    await fetch('/booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        date,
        message,
        developer
      })
    })

    document.querySelector('#status').textContent =
      'Booking sent!'
  } catch {
    document.querySelector('#status').textContent =
      'Error sending booking'
  }
}

// ================= CHAT =================

/**
 * Sends real-time chat message.
 */
window.sendMessage = function () {
  const input = document.querySelector('#chatInput')

  if (!input.value || !currentChatUser) return

  console.log('Sending message...')

  socket.emit('sendMessage', {
    to: currentChatUser,
    message: input.value
  })

  input.value = ''
}

// ================= MATCHING =================

/**
 * Matches project idea to predefined projects.
 *
 * @param {string} input - User project description
 * @returns {{name: string}|null} Best matching project or null
 */
function matchProject (input) {
  const keywords = input.toLowerCase()

  const projects = [
    {
      name: 'E-commerce site',
      tags: ['shop', 'payment', 'ecommerce']
    },
    {
      name: 'Chat app',
      tags: ['chat', 'message']
    },
    {
      name: 'Portfolio website',
      tags: ['website', 'portfolio']
    }
  ]

  let bestMatch = null
  let maxScore = 0

  projects.forEach(project => {
    let score = 0

    project.tags.forEach(tag => {
      if (keywords.includes(tag)) {
        score++
      }
    })

    if (score > maxScore) {
      maxScore = score
      bestMatch = project
    }
  })

  return bestMatch
}

/**
 * Analyzes project idea.
 */
window.analyze = function () {
  const input = document.querySelector('#message').value

  const result = matchProject(input)

  document.querySelector('#result').textContent =
    result
      ? 'You might need: ' + result.name
      : 'No match found'
}

// ================= DEVELOPERS =================

/**
 * Developer data.
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
 * Opens developer profile.
 *
 * @param {string} id - Developer id
 */
window.openProfile = function (id) {
  const dev = developers[id]

  currentChatUser = dev.id

  const container = document.querySelector('#messages')

  container.innerHTML = ''

  fetch(`/messages/${dev.id}`, {
    headers: {
      authorization: localStorage.getItem('chatToken')
    }
  })
    .then(res => res.json())
    .then(messages => {
      messages.forEach(msg => {
        const div = document.createElement('div')

        div.className =
          msg.from === 'user'
            ? 'my-message'
            : 'their-message'

        const time = new Date(msg.createdAt)
          .toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })

        div.innerHTML = `
          <div>${msg.message}</div>
          <small>${time}</small>
        `

        container.appendChild(div)
      })
    })

  document.querySelector('#profileName').textContent =
    dev.name

  document.querySelector('#profileRole').textContent =
    dev.role

  const profileContainer =
    document.querySelector('#profileDesc')

  profileContainer.innerHTML = ''

  dev.desc.split(',').forEach((skill) => {
    const span = document.createElement('span')

    span.textContent = skill.trim()

    profileContainer.appendChild(span)
  })

  document.querySelector('#profileImg').src =
    `/images/${id}.png`

  window.showSection('profile')
}

// ================= ADMIN =================

/**
 * Loads admin bookings.
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

  const container =
    document.querySelector('#bookingList')

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
 * Admin login.
 */
window.login = async function () {
  const password = prompt('Enter admin password')

  const res = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
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
