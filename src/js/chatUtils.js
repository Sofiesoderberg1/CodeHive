/**
 * Creates unique room id for two users.
 *
 * @param {string} user1 - user one.
 * @param {string} user2 - user two.
 * @returns {string} - string.
 */
export function getRoomId (user1, user2) {
  return [user1, user2]
    .sort()
    .join('_')
}
