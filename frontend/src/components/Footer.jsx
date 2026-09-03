import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGithub, FaLinkedin, FaInstagram, FaTwitter, FaEnvelope, FaPhone, FaCode, FaHeart } from 'react-icons/fa'
import { IoClose, IoTime } from 'react-icons/io5'
import { MdSupportAgent } from 'react-icons/md'

const DEV_INFO = {
  name: "Biswajit Pattanaik",
  role: "Full Stack Developer",
  email: "pattanaikbiswajit07@gmail.com",
  phone: "+91 8658846620",
  github: "https://github.com/",
  linkedin: "https://www.linkedin.com/in/biswajit-pattanaik-3586b82b3",
  instagram: "https://www.instagram.com/_pattanaik_07?igsh=MWozbHFlZmNhNnNlZg==",
  twitter: "https://twitter.com/",
}

const SUPPORT_INFO = {
  email: "pattanaikbiswajit07@gmail.com",
  phone: "+91 8658846620",
  hours: "Mon–Sat, 9AM – 8PM",
}

// ── Pulsing live dot ──────────────────────────────────────────────────────────
function LiveDot() {
  return (
    <motion.span
      className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1"
      animate={{ opacity: [1, 0.3, 1], scale: [1, 0.7, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

// ── Contact row ───────────────────────────────────────────────────────────────
function ContactRow({ icon: Icon, iconBg, iconColor, hoverBg, hoverBorder, label, value, href }) {
  return (
    <motion.a
      href={href}
      whileHover={{ x: 3 }}
      className={`flex items-center gap-3 p-3 rounded-2xl border border-gray-100 transition-all no-underline group ${hoverBg} ${hoverBorder}`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${iconBg}`}>
        <Icon size={14} className={iconColor} />
      </div>
      <div>
        <p className="text-[10px] text-gray-400 font-medium leading-none mb-0.5">{label}</p>
        <p className="text-sm font-bold text-gray-700 leading-tight">{value}</p>
      </div>
    </motion.a>
  )
}

// ── Social button ─────────────────────────────────────────────────────────────
function SocialBtn({ icon: Icon, label, href, color, bg }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -4, scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all no-underline"
      style={{ background: bg }}
    >
      <Icon size={20} style={{ color }} />
      <span className="text-[10px] font-semibold text-gray-500">{label}</span>
    </motion.a>
  )
}

// ── Support Modal ─────────────────────────────────────────────────────────────
function SupportModal({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl mb-4 sm:mb-0 border border-gray-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
              className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center"
            >
              <MdSupportAgent size={20} className="text-green-600" />
            </motion.div>
            <div>
              <p className="font-bold text-gray-800 text-sm">Vingo Support</p>
              <p className="text-xs text-gray-400 flex items-center">
                <LiveDot />{SUPPORT_INFO.hours}
              </p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
          >
            <IoClose size={16} />
          </motion.button>
        </div>

        {/* Contact rows */}
        <motion.div
          className="space-y-2.5 mb-5"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {[
            { icon: FaEnvelope, iconBg: 'bg-purple-100', iconColor: 'text-[#7F77DD]', hoverBg: 'hover:bg-purple-50', hoverBorder: 'hover:border-purple-200', label: 'Email support', value: SUPPORT_INFO.email, href: `mailto:${SUPPORT_INFO.email}` },
            { icon: FaPhone,    iconBg: 'bg-green-100',  iconColor: 'text-green-600',  hoverBg: 'hover:bg-green-50',  hoverBorder: 'hover:border-green-200',  label: 'Call support',  value: SUPPORT_INFO.phone, href: `tel:${SUPPORT_INFO.phone}` },
          ].map((r, i) => (
            <motion.div key={i} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              <ContactRow {...r} />
            </motion.div>
          ))}

          {/* Hours row — non-clickable */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 bg-amber-50"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <IoTime size={14} className="text-amber-600" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-medium leading-none mb-0.5">Working hours</p>
              <p className="text-sm font-bold text-gray-700">{SUPPORT_INFO.hours}</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="border-t border-gray-100 pt-4"
        >
          <p className="text-xs text-gray-400 text-center">
            Avg response · <span className="text-green-600 font-semibold">under 2 hours</span>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// ── Dev Modal ─────────────────────────────────────────────────────────────────
function DevModal({ onClose }) {
  const socials = [
    { icon: FaGithub,    href: DEV_INFO.github,    label: "GitHub",    color: "#1e1b4b", bg: "#f3f4f6" },
    { icon: FaLinkedin,  href: DEV_INFO.linkedin,   label: "LinkedIn",  color: "#0077b5", bg: "#e8f4fd" },
    { icon: FaInstagram, href: DEV_INFO.instagram,  label: "Instagram", color: "#e1306c", bg: "#fce8f1" },
    { icon: FaTwitter,   href: DEV_INFO.twitter,    label: "Twitter",   color: "#1da1f2", bg: "#e8f5fd" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl mb-4 sm:mb-0 border border-gray-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
              className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center"
            >
              <FaCode size={16} className="text-[#7F77DD]" />
            </motion.div>
            <div>
              <p className="font-bold text-gray-800 text-sm">{DEV_INFO.name}</p>
              <p className="text-xs text-gray-400">{DEV_INFO.role}</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
          >
            <IoClose size={16} />
          </motion.button>
        </div>

        {/* Contact rows */}
        <motion.div
          className="space-y-2.5 mb-5"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {[
            { icon: FaEnvelope, iconBg: 'bg-purple-100', iconColor: 'text-[#7F77DD]', hoverBg: 'hover:bg-purple-50', hoverBorder: 'hover:border-purple-200', label: 'Email', value: DEV_INFO.email, href: `mailto:${DEV_INFO.email}` },
            { icon: FaPhone,    iconBg: 'bg-green-100',  iconColor: 'text-green-600',  hoverBg: 'hover:bg-green-50',  hoverBorder: 'hover:border-green-200',  label: 'Phone', value: DEV_INFO.phone, href: `tel:${DEV_INFO.phone}` },
          ].map((r, i) => (
            <motion.div key={i} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              <ContactRow {...r} />
            </motion.div>
          ))}
        </motion.div>

        {/* Social grid */}
        <motion.div
          className="grid grid-cols-4 gap-2 mb-5"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}
        >
          {socials.map(s => (
            <motion.div
              key={s.label}
              variants={{ hidden: { opacity: 0, scale: 0.7 }, visible: { opacity: 1, scale: 1 } }}
            >
              <SocialBtn {...s} />
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs text-gray-400 text-center"
        >
          © {new Date().getFullYear()} Vingo. All rights reserved.
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

// ── Main Footer ───────────────────────────────────────────────────────────────
function Footer() {
  const [showSupport, setShowSupport] = useState(false)
  const [showDev, setShowDev] = useState(false)

  return (
    <>
      <motion.footer
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full bg-white border-t border-gray-100 py-3 px-6 flex items-center justify-between sticky bottom-0 z-[100] shadow-[0_-2px_12px_rgba(0,0,0,0.06)]"
      >
        {/* Left — Developer */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowDev(true)}
          className="flex items-center gap-2 group px-2 py-1 rounded-xl hover:bg-gray-50 transition-all"
        >
          <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-[#7F77DD] transition-all">
            <FaCode size={12} className="text-[#7F77DD] group-hover:text-white transition-all" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-[10px] text-gray-400 leading-tight">Developed by</p>
            <p className="text-xs font-bold text-gray-700 leading-tight">{DEV_INFO.name}</p>
          </div>
          <p className="text-xs font-bold text-gray-700 sm:hidden">Developer</p>
        </motion.button>

        {/* Center — Vingo branding */}
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded-md bg-[#7F77DD] flex items-center justify-center">
              <span className="text-white text-[10px] font-black">V</span>
            </div>
            <span className="text-sm font-black text-gray-800 tracking-tight">Vingo</span>
            <span className="text-[#7F77DD] font-black text-sm">.</span>
          </div>
          <p className="text-[9px] text-gray-400 flex items-center gap-0.5">
            Made with <FaHeart size={8} className="text-red-400 mx-0.5" /> in India
          </p>
        </div>

        {/* Right — Support */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowSupport(true)}
          className="flex items-center gap-2 group px-2 py-1 rounded-xl hover:bg-gray-50 transition-all"
        >
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-gray-400 leading-tight">Need help?</p>
            <p className="text-xs font-bold text-gray-700 leading-tight flex items-center justify-end gap-1">
              <LiveDot />Support Team
            </p>
          </div>
          <p className="text-xs font-bold text-gray-700 sm:hidden">Support</p>
          <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-500 transition-all">
            <MdSupportAgent size={14} className="text-green-500 group-hover:text-white transition-all" />
          </div>
        </motion.button>
      </motion.footer>

      {/* Modals */}
      <AnimatePresence>
        {showSupport && <SupportModal onClose={() => setShowSupport(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showDev && <DevModal onClose={() => setShowDev(false)} />}
      </AnimatePresence>
    </>
  )
}

export default Footer