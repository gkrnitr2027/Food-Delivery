import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import { IoChatbubbleEllipses, IoClose, IoSend, IoCall } from 'react-icons/io5'
import { BsCheckAll } from 'react-icons/bs'
import { getSocket } from '../socketManager'

function DeliveryChat({ orderId, deliveryBoyId, deliveryBoyName, deliveryBoyMobile }) {
  const { socket: reduxSocket, userData } = useSelector(state => state.user)
  // ✅ Use redux socket if available, otherwise fall back to getSocket()
  // This ensures both customer (redux) and delivery boy (getSocket) work
  const socket = reduxSocket || getSocket()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [unread, setUnread] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [showCallConfirm, setShowCallConfirm] = useState(false)
  const bottomRef = useRef(null)
  const typingTimer = useRef(null)

  const roomId = `chat_${orderId}`

  useEffect(() => {
    if (!socket || !orderId) return

    socket.emit('joinChatRoom', { roomId })

    const handleMessage = (msg) => {
      setMessages(prev => [...prev, msg])
      if (!isOpen) setUnread(prev => prev + 1)
    }

    const handleTyping = ({ senderId }) => {
      if (senderId !== userData?._id) {
        setIsTyping(true)
        clearTimeout(typingTimer.current)
        typingTimer.current = setTimeout(() => setIsTyping(false), 2000)
      }
    }

    socket.on('receiveChatMessage', handleMessage)
    socket.on('userTyping', handleTyping)

    return () => {
      socket.off('receiveChatMessage', handleMessage)
      socket.off('userTyping', handleTyping)
      socket.emit('leaveChatRoom', { roomId })
    }
  }, [socket, orderId, isOpen])

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      setUnread(0)
    }
  }, [messages, isOpen])

  const sendMessage = () => {
    if (!input.trim() || !socket) return
    const msg = {
      roomId,
      senderId: userData?._id,
      senderName: userData?.fullName,
      senderRole: userData?.role,
      text: input.trim(),
      timestamp: new Date().toISOString(),
    }
    socket.emit('sendChatMessage', msg)
    setMessages(prev => [...prev, { ...msg, self: true }])
    setInput('')
  }

  const handleTypingEmit = () => {
    if (!socket) return
    socket.emit('typing', { roomId, senderId: userData?._id })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (iso) => {
    const d = new Date(iso)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      {/* ── Floating button ───────────────────────────────────────────────── */}
      <motion.button
        className="fixed bottom-5 right-5 z-[999] w-14 h-14 rounded-full bg-[#7F77DD] text-white flex items-center justify-center shadow-2xl shadow-purple-400/40"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        onClick={() => { setIsOpen(o => !o); setUnread(0) }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 16 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <IoClose size={24} />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <IoChatbubbleEllipses size={24} />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        <AnimatePresence>
          {unread > 0 && !isOpen && (
            <motion.span
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-black flex items-center justify-center border-2 border-white"
            >
              {unread}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Chat window ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed z-[998] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
            style={{
              bottom: '5.5rem',
              right: '1.25rem',
              width: 'min(340px, calc(100vw - 2.5rem))',
              height: 'min(480px, calc(100vh - 10rem))',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2.5 bg-[#7F77DD] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#534AB7] flex items-center justify-center text-lg shrink-0">
                  {userData?.role === 'DeliveryBoy' ? '👤' : '🛵'}
                </div>
                <div className="min-w-0">
                  <p className="text-white font-bold text-sm leading-tight truncate max-w-[140px]">
                    {deliveryBoyName || 'Delivery Boy'}
                  </p>
                  <p className="text-purple-200 text-[11px]">
                    {isTyping ? '✍️ typing...' : userData?.role === 'DeliveryBoy' ? '👤 Customer' : '🛵 On the way'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {/* Call button */}
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => setShowCallConfirm(v => !v)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                >
                  <IoCall size={16} className="text-white" />
                </motion.button>
              </div>
            </div>

            {/* Call confirm dropdown */}
            <AnimatePresence>
              {showCallConfirm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden bg-purple-50 border-b border-purple-100 shrink-0"
                >
                  <div className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-xs text-gray-500">Call delivery partner</p>
                      <p className="text-sm font-bold text-gray-800">
                        {deliveryBoyMobile || 'Number unavailable'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {deliveryBoyMobile ? (
                        <a
                          href={`tel:${deliveryBoyMobile}`}
                          onClick={() => setShowCallConfirm(false)}
                          className="flex items-center gap-1.5 bg-[#7F77DD] text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-[#534AB7] transition-all"
                        >
                          <IoCall size={13} /> Call
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 px-3 py-2 bg-gray-100 rounded-xl">Unavailable</span>
                      )}
                      <button
                        onClick={() => setShowCallConfirm(false)}
                        className="text-xs text-gray-500 px-3 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages area */}
            <div
              className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-[#f5f4fb]"
              onClick={() => setShowCallConfirm(false)}
            >
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
                  <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-3xl">
                    {userData?.role === 'DeliveryBoy' ? '👤' : '🛵'}
                  </div>
                  <div>
                    <p className="text-gray-700 font-semibold text-sm">
                      {userData?.role === 'DeliveryBoy' ? 'Chat with Customer' : 'Chat with your Rider'}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">Messages are only visible during delivery</p>
                  </div>
                  {deliveryBoyMobile && (
                    <a
                      href={`tel:${deliveryBoyMobile}`}
                      className="flex items-center gap-2 text-xs text-[#7F77DD] font-semibold border border-purple-200 bg-white px-4 py-2 rounded-full hover:bg-purple-50 transition-all shadow-sm"
                    >
                      <IoCall size={13} /> Call {deliveryBoyName?.split(' ')[0]}
                    </a>
                  )}
                </div>
              )}

              {messages.map((msg, i) => {
                const isSelf = msg.self || msg.senderId === userData?._id
                const senderAvatar = msg.senderRole === 'DeliveryBoy' ? '🛵' : '👤'
                const selfAvatar = userData?.role === 'DeliveryBoy' ? '🛵' : '👤'
                const prevMsg = messages[i - 1]
                const prevIsSelf = prevMsg && (prevMsg.self || prevMsg.senderId === userData?._id)
                const hideAvatar = isSelf ? (prevIsSelf === true) : (prevIsSelf === false)
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-end gap-1.5 ${isSelf ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* Other person avatar — left */}
                    {!isSelf && (
                      <div className={`w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-sm shrink-0 ${hideAvatar ? 'opacity-0' : ''}`}>
                        {senderAvatar}
                      </div>
                    )}

                    <div
                      className={`max-w-[72%] px-3 py-2 rounded-2xl text-sm shadow-sm ${
                        isSelf
                          ? 'bg-[#7F77DD] text-white rounded-br-none'
                          : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                      }`}
                    >
                      {!isSelf && !hideAvatar && (
                        <p className="text-[10px] font-bold text-purple-400 mb-0.5">{msg.senderName}</p>
                      )}
                      <p className="leading-snug break-words">{msg.text}</p>
                      <div className={`flex items-center gap-1 mt-0.5 ${isSelf ? 'justify-end' : 'justify-start'}`}>
                        <span className={`text-[10px] ${isSelf ? 'text-purple-200' : 'text-gray-400'}`}>
                          {formatTime(msg.timestamp)}
                        </span>
                        {isSelf && <BsCheckAll size={11} className="text-purple-200" />}
                      </div>
                    </div>

                    {/* Self avatar — right */}
                    {isSelf && (
                      <div className={`w-7 h-7 rounded-full bg-[#534AB7] flex items-center justify-center text-sm shrink-0 ${hideAvatar ? 'opacity-0' : ''}`}>
                        {selfAvatar}
                      </div>
                    )}
                  </motion.div>
                )
              })}

              {/* Typing dots */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-3 py-2.5 shadow-sm flex gap-1 items-center">
                      {[0, 1, 2].map(i => (
                        <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-purple-300"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div className="px-2.5 py-2.5 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0">
              <input
                type="text"
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                placeholder="Message..."
                value={input}
                onChange={(e) => { setInput(e.target.value); handleTypingEmit() }}
                onKeyDown={handleKeyDown}
              />
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={sendMessage}
                disabled={!input.trim()}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0 ${
                  input.trim()
                    ? 'bg-[#7F77DD] text-white shadow-md shadow-purple-200'
                    : 'bg-gray-100 text-gray-300'
                }`}
              >
                <IoSend size={15} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default DeliveryChat