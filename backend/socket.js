import User from "./models/user.model.js"

export const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id)

    // ── Identity ────────────────────────────────────────────────────────────
    socket.on('identity', async ({ userId }) => {
      try {
        await User.findByIdAndUpdate(userId, {
          socketId: socket.id,
          isOnline: true
        }, { new: true })
      } catch (error) {
        console.log('identity error:', error)
      }
    })

    // ── Live location update (delivery boy) ─────────────────────────────────
    socket.on('updateLocation', async ({ latitude, longitude, userId }) => {
      try {
        const user = await User.findByIdAndUpdate(userId, {
          location: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          isOnline: true,
          socketId: socket.id
        })

        if (user) {
          io.emit('updateDeliveryLocation', {
            deliveryBoyId: userId,
            latitude,
            longitude
          })
        }
      } catch (error) {
        console.log('updateLocation error:', error)
      }
    })

    // ── Chat: join room ──────────────────────────────────────────────────────
    socket.on('joinChatRoom', ({ roomId }) => {
      socket.join(roomId)
      console.log(`Socket ${socket.id} joined chat room: ${roomId}`)
    })

    // ── Chat: leave room ─────────────────────────────────────────────────────
    socket.on('leaveChatRoom', ({ roomId }) => {
      socket.leave(roomId)
      console.log(`Socket ${socket.id} left chat room: ${roomId}`)
    })

    // ── Chat: send message (broadcast to room except sender) ─────────────────
    socket.on('sendChatMessage', (msg) => {
      socket.to(msg.roomId).emit('receiveChatMessage', msg)
    })

    // ── Chat: typing indicator ───────────────────────────────────────────────
    socket.on('typing', ({ roomId, senderId }) => {
      socket.to(roomId).emit('userTyping', { senderId })
    })

    // ── Disconnect ───────────────────────────────────────────────────────────
    socket.on('disconnect', async () => {
      try {
        await User.findOneAndUpdate(
          { socketId: socket.id },
          { socketId: null, isOnline: false }
        )
        console.log('Socket disconnected:', socket.id)
      } catch (error) {
        console.log('disconnect error:', error)
      }
    })
  })
}