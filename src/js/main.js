// ================= NAVIGATION =================
window.showSection = function(section) {
  document.querySelectorAll('section').forEach(s => s.style.display = 'none')
  document.getElementById(section).style.display = 'block'
};

// visa home direkt
document.addEventListener('DOMContentLoaded', () => {
  window.showSection('home')
})

// ================= BOOKING =================
window.book = async function() {
  const name = document.querySelector('#name').value
  const email = document.querySelector('#email').value
  const date = document.querySelector('#date').value
  const message = document.querySelector('#message').value

  if (!name || !email || !date) {
    document.querySelector('#status').textContent = 'Fill all fields'
    return;
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
const socket = new WebSocket('wss://courselab.lnu.se/message-app/socket?apiKey=eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd')

window.sendMessage = function() {
  const input = document.querySelector('#chatInput')

  if (!input.value) return

  socket.send(JSON.stringify({
    type: 'message',
    data: input.value,
    username: 'Sofie'
  }))

  input.value = ''
};

socket.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data)
  if (msg.type === 'heartbeat') return

  const div = document.createElement('div')
  div.textContent = msg.username + ': ' + msg.data

  document.querySelector('#messages').appendChild(div)
})
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

window.analyze = function() {
  const input = document.querySelector('#message').value
  const result = matchProject(input)

  document.querySelector('#result').textContent =
    result ? 'You might need: ' + result.name : 'No match found'
}

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

window.openProfile = function(id) {
  const dev = developers[id]

  document.querySelector('#profileName').textContent = dev.name
  document.querySelector('#profileRole').textContent = dev.role
  document.querySelector('#profileDesc').textContent = dev.desc

  showSection('profile')
}
