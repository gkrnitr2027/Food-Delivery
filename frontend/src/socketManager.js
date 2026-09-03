// socketManager.js
// Stores the socket instance outside of Redux to avoid non-serializable errors

let socket = null;

export const setSocket = (s) => {
  socket = s;
};

export const getSocket = () => socket;