import { db, auth } from './firebase.js'

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'

import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore'

import { getRoomId }
  from './chatUtils.js'

let currentUser = null
let currentChatUser = null

const chatSection =
  document.querySelector('#chatSection')

const currentUserText =
  document.querySelector('#currentUserText')

const authMessage =
  document.querySelector('#authMessage')

onAuthStateChanged(auth, async (user) => {

  if (user) {

    chatSection.style.display = 'block'

    currentUser = user.uid

    currentUserText.textContent =
      `Logged in as ${user.email}`

    authMessage.textContent =
      'Login successful ✅'

    authMessage.style.color =
      '#10b981'

      await setDoc(
        doc(db, 'users', user.uid),
        {
          online: true
        },
        { merge: true }
      )

    console.log('Logged in:', user.email)

  } else {
    chatSection.style.display = 'none'

    currentUser = null

    currentUserText.textContent =
      'Not logged in'

    authMessage.textContent =
      'Logged out'

    authMessage.style.color =
      '#ef4444'

    document.querySelector('#messages')
      .innerHTML = ''

    console.log('Not logged in')
  }
})


/**
 *
 */
window.register = async function () {
  const email =
    document.querySelector('#loginEmail').value

  const password =
    document.querySelector('#loginPassword').value

  const authMessage =
    document.querySelector('#authMessage')

  if (password.length < 6) {
    authMessage.style.color =
   '#ef4444'

    authMessage.textContent =
   'Password must be at least 6 characters'
    return
  }

  const user =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )

  currentUser = user.user.uid

  await setDoc(
    doc(db, 'users', user.user.uid),
    {
      uid: user.user.uid,
      email,
      username: email.split('@')[0],
      role: 'customer',
      online: true
    }
  )

  console.log('Registered:', currentUser)
}

/**
 *
 */
window.loginUser = async function () {
  const email =
    document.querySelector('#loginEmail').value

  const password =
    document.querySelector('#loginPassword').value

  const authMessage =
    document.querySelector('#authMessage')

  try {
    const user =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    )

    authMessage.textContent =
      'Login successful ✅'

    authMessage.style.color = '#10b981'

    currentUser = user.user.uid


    console.log('Logged in:', currentUser)

    loadMessages()
  } catch (error) {
    console.log(error)

    if (error.code === 'auth/wrong-password') {
      authMessage.textContent =
        'Wrong password'
    } else if (
      error.code === 'auth/user-not-found'
    ) {
      authMessage.textContent =
        'User not found'
    } else if (
        error.code === 'auth/invalid-email'
    ) {
      authMessage.textContent =
        'Invalid email'
    } else {
      authMessage.textContent =
        'Something went wrong'
    }
  }
}

console.log('Firebase connected', db)

/**
 *
 */
window.logoutUser = async function () {
  await setDoc(
    doc(db, 'users', currentUser),
    {
      online: false
    },
    { merge: true}
  )
  
  await signOut(auth)

  currentUser = null
  currentChatUser = null

  document.querySelector('#messages').innerHTML = ''

  document.querySelector('#authMessage').textContent = 'Logged out'

  window.showSection('home')

  alert('Logged out')
}

/**
 *
 */
window.loadMessages = function () {
  const roomId = getRoomId(
    currentUser,
    currentChatUser
  )

  console.log('ROOM',
    getRoomId(currentUser, currentChatUser)
  )

  const messagesRef = collection(
    db,
    'chats',
    roomId,
    'messages'
  )

  const q = query(
    messagesRef,
    orderBy('createdAt')
  )
  const container =
    document.querySelector('#messages')

  onSnapshot(q, (snapshot) => {
    container.innerHTML = ''

    snapshot.forEach((doc) => {
      const data = doc.data()

      const div =
        document.createElement('div')

      div.className =
      data.from === currentUser
        ? 'message'
        : 'their-message'

      const sender =
  data.from === currentUser
    ? 'You'
    : data.senderName

div.textContent =
  `${sender}: ${data.text}`

      container.appendChild(div)
    })

    container.scrollTop =
      container.scrollHeight
  })
}
// ======================
// MENU
// ======================
/**
 * Toggles mobile navigation menu.
 */
window.toggleMenu = function () {
  const nav = document.getElementById('navLinks')

  if (nav) {
    nav.classList.toggle('active')
  }
}

// ======================
// LIVE CHAT
// ======================

/**
 * Sends private realtime message.
 */
window.sendMessage = async function () {

  const user = auth.currentUser


  const input =
    document.querySelector('#chatInput')

  const text = input.value.trim()

  if (
    !text ||
    !currentUser ||
    !currentChatUser
  ) {
    return
  }

  const roomId = getRoomId(
    currentUser,
    currentChatUser
  )

  console.log('SENDING TO ROOM:', roomId)

  const messagesRef = collection(
    db,
    'chats',
    roomId,
    'messages'
  )

  await addDoc(messagesRef, {
    text: text,
    senderName: user.email,
    from: user.uid,
    createdAt: serverTimestamp()
  })

  input.value = ''
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
window.toggleMenu = function () {
  const nav = document.getElementById('navLinks')

  if (nav) {
    nav.classList.toggle('active')
  }
}

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
    const res = await fetch('/booking', {
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

    const data = await res.json()

    document.querySelector('#status').textContent =
    data.message || 'Booking sent!'
  } catch {
    document.querySelector('#status').textContent =
    'Error sending booking'
  }
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
    id: 'yA5GRPNfFxTRHHAOJYCr5lsNdas2',
    name: 'Sofie Söderberg',
    role: 'Fullstack Developer',
    desc: 'React, Node, MongoDB'
  },

  emma: {
    id: 'Atv2bkRle2SCjzOVs4m5Ku0dkaA3',
    name: 'Emma Andersson',
    role: 'Frontend Developer',
    desc: 'I build modern websites'
  },

  jonas: {
    id: 'kJHdORKAjeX3pjJj5ToMdj5m2mp2',
    name: 'Jonas Eriksson',
    role: 'Backend Developer',
    desc: 'Node.js specialist'
  },

  customer: {
  id: 'UnbHaR2pSUNf9WfsnAyQk17wRe22',
  name: 'Customer',
  role: 'Customer',
  desc: 'Project client'
}
}

/**
 * Opens developer profile.
 *
 * @param {string} id - Developer id
 */
window.openProfile = function (id) {

  console.log('PROFILE CLICKED:', id)

  const dev = developers[id]

  console.log('DEV OBJECT:', dev)

  currentChatUser = dev.id

  console.log('CHAT USER UID:', currentChatUser)

  console.log('CURRENT USER UID:', currentUser)

  console.log('ROOM:', getRoomId(currentUser, currentChatUser)
)

  loadMessages()

  document.querySelector('#profileName').textContent =
    dev.name

  document.querySelector('#profileRole').textContent =
    dev.role

  const profileContainer =
    document.querySelector('#profileDesc')

  profileContainer.innerHTML = ''

  dev.desc.split(',').forEach((skill) => {
    const span =
      document.createElement('span')

    span.textContent =
      skill.trim()

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
window.adminLogin = async function () {
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

    window.showSection('adminLogin')

    window.loadBookings()
  } else {
    alert('Wrong password')
  }
}
