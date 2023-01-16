const users = []

const userJoin = (id, username, room) => {
  const user = { id, username, room }

  users.push(user)

  return user
}

const getUserById = (id) => {
  return users.find(user => user.id === id)
}

const getUsersInRoom = (room) => {
  const usersInRoom = users.filter(user => user.room === room)
  return usersInRoom.map(u => u.username)
}

const getUsers = () => {
  return users
}

const userLeave = (id) => {
  const index = users.findIndex(user => user.id === id)
  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

module.exports = { userJoin, getUserById, getUsersInRoom, getUsers, userLeave }