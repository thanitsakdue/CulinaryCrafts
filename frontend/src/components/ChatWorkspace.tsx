import React, { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  Plus,
  Wand2,
  UtensilsCrossed,
  MessageCircle,
  Settings,
  HelpCircle,
  Maximize2,
  Minimize2,
  LogOut,
  ChefHat,
} from 'lucide-react'
import ImageAttachment from './ImageAttachment'
import { apiClient } from '../services/apiClient'

type ChatRole = 'user' | 'assistant'

type ChatMessage = {
  id: string
  role: ChatRole
  text: string
  timestamp: string
  imageDataUrl?: string
}

type Conversation = {
  id: string
  title: string
  gemId: string
  createdAt: string
  updatedAt: string
  messages: ChatMessage[]
}

type Gem = {
  id: string
  name: string
  description: string
}

const STORAGE_KEY = 'culinarycrafts.conversations.v1'

// Format AI messages with beautiful card-based rendering
function FormattedMessage({ text }: { text: string }) {
  // Parse sections: look for section markers like "###" or "**Section:**"
  const sections: { type: string; title?: string; content: string[] }[] = []
  const lines = text.split('\n')

  let currentSection: { type: string; title?: string; content: string[] } | null = null

  for (const line of lines) {
    const trimmed = line.trim()

    // Skip empty lines
    if (!trimmed) {
      if (currentSection && currentSection.content.length > 0) {
        currentSection.content.push('')
      }
      continue
    }

    // H2 headers (##) - main sections
    if (trimmed.match(/^##\s+/)) {
      if (currentSection) sections.push(currentSection)
      const title = trimmed.replace(/^##\s+/, '').replace(/\*\*/g, '')
      currentSection = { type: 'h2', title, content: [] }
      continue
    }

    // H3 headers (###) - subsections
    if (trimmed.match(/^###\s+/)) {
      if (currentSection) sections.push(currentSection)
      const title = trimmed.replace(/^###\s+/, '').replace(/\*\*/g, '')
      currentSection = { type: 'h3', title, content: [] }
      continue
    }

    // H1 headers (#) - recipe title
    if (trimmed.match(/^#\s+/)) {
      if (currentSection) sections.push(currentSection)
      const title = trimmed.replace(/^#\s+/, '').replace(/\*\*(.+?)\*\*/g, '$1')
      currentSection = { type: 'h1', title, content: [] }
      continue
    }

    if (!currentSection) {
      currentSection = { type: 'paragraph', content: [trimmed] }
    } else {
      currentSection.content.push(trimmed)
    }
  }

  if (currentSection) sections.push(currentSection)

  const renderContent = (items: string[]) => {
    return items.map((item, idx) => {
      if (!item.trim()) return null

      // Bold text
      if (item.match(/^\*\*(.+?)\*\*$/)) {
        return (
          <div key={idx} className="font-semibold text-culinary-deepBrown">
            {item.replace(/\*\*/g, '')}
          </div>
        )
      }

      // Unordered list
      if (item.match(/^[\*\-\+]\s/)) {
        return (
          <li key={idx} className="ml-4 list-disc text-culinary-deepBrown">
            {item.replace(/^[\*\-\+]\s/, '').replace(/\*\*(.+?)\*\*/g, (_, g1) => g1)}
          </li>
        )
      }

      // Ordered list
      if (item.match(/^\d+\.\s/)) {
        return (
          <li key={idx} className="ml-4 list-decimal text-culinary-deepBrown">
            {item.replace(/^\d+\.\s/, '').replace(/\*\*(.+?)\*\*/g, (_, g1) => g1)}
          </li>
        )
      }

      // Regular text with formatting
      return (
        <p key={idx} className="text-culinary-deepBrown/90 leading-relaxed">
          {item.split(/(\*\*.*?\*\*)/gm).map((segment, i) => {
            if (segment.match(/^\*\*.*\*\*$/)) {
              return (
                <strong key={i} className="font-semibold text-culinary-deepBrown">
                  {segment.replace(/\*\*/g, '')}
                </strong>
              )
            }
            return segment
          })}
        </p>
      )
    })
  }

  return (
    <div className="space-y-3">
      {sections.map((section, idx) => {
        // Recipe title (H1)
        if (section.type === 'h1') {
          return (
            <div key={idx} className="bg-gradient-to-r from-culinary-terracotta/20 to-culinary-coral/20 rounded-2xl p-4 border border-culinary-terracotta/30">
              <h1 className="text-xl font-bold text-culinary-deepBrown">{section.title}</h1>
            </div>
          )
        }

        // Section headers (H2, H3)
        if (section.type === 'h2' || section.type === 'h3') {
          const isH2 = section.type === 'h2'
          return (
            <div key={idx} className="">
              <div className={isH2 ? 'font-bold text-lg' : 'font-semibold text-base'}>
                <span className="text-culinary-terracotta">{isH2 ? '▪ ' : '◦ '}</span>
                <span className="text-culinary-deepBrown">{section.title}</span>
              </div>
              {section.content.length > 0 && (
                <div className="mt-2 space-y-2 ml-2">
                  {renderContent(section.content)}
                </div>
              )}
            </div>
          )
        }

        // Regular paragraphs
        return (
          <div key={idx} className="space-y-2">
            {renderContent(section.content)}
          </div>
        )
      })}
    </div>
  )
}

const GEMS: Gem[] = [
  { id: 'classic', name: 'Classic Chef', description: 'Balanced cooking help' },
  { id: 'baker', name: 'Pastry Mentor', description: 'Baking & ratios' },
]

function nowIso() {
  return new Date().toISOString()
}

function buildTitleFrom(text: string) {
  const cleaned = text.trim().replace(/\s+/g, ' ')
  if (!cleaned) return 'New conversation'
  return cleaned.length > 42 ? `${cleaned.slice(0, 42)}…` : cleaned
}

function safeParseConversations(raw: string | null): Conversation[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as Conversation[]
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((c) => c && typeof c.id === 'string' && Array.isArray(c.messages))
      .map((c) => ({
        ...c,
        title: typeof c.title === 'string' && c.title ? c.title : 'New conversation',
        gemId: typeof c.gemId === 'string' && c.gemId ? c.gemId : 'classic',
        createdAt: typeof c.createdAt === 'string' ? c.createdAt : nowIso(),
        updatedAt: typeof c.updatedAt === 'string' ? c.updatedAt : nowIso(),
      }))
  } catch {
    return []
  }
}

function newConversation(gemId: string): Conversation {
  const id = `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
  const ts = nowIso()
  return {
    id,
    title: 'New conversation',
    gemId,
    createdAt: ts,
    updatedAt: ts,
    messages: [],
  }
}

export default function ChatWorkspace({
  userName,
  userImage,
  onSignOut,
}: {
  userName?: string | null
  userImage?: string | null
  onSignOut: () => void
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false)
  const [theater, setTheater] = useState(false)

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string>('')
  const [activeGemId, setActiveGemId] = useState<string>('classic')

  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeConversationId) || null
  }, [conversations, activeConversationId])

  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)

  const [imagePreview, setImagePreview] = useState<string>('')
  const [selectedImageBase64, setSelectedImageBase64] = useState<string>('')
  const [selectedImageType, setSelectedImageType] = useState<string>('')

  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initial = safeParseConversations(
      typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    )
    if (initial.length) {
      setConversations(initial)
      setActiveConversationId(initial[0].id)
      setActiveGemId(initial[0].gemId || 'classic')
    } else {
      const c = newConversation('classic')
      setConversations([c])
      setActiveConversationId(c.id)
      setActiveGemId(c.gemId)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
  }, [conversations])

  useEffect(() => {
    // Auto-scroll when messages update
    const el = scrollerRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [activeConversation?.messages.length])

  const setActiveConversation = (id: string) => {
    const found = conversations.find((c) => c.id === id)
    if (!found) return
    setActiveConversationId(id)
    setActiveGemId(found.gemId)
    setSidebarOpenMobile(false)
  }

  const handleNewChat = () => {
    const c = newConversation(activeGemId)
    setConversations((prev) => [c, ...prev])
    setActiveConversationId(c.id)
    setSidebarOpenMobile(false)
  }

  const handleGemSelect = (gemId: string) => {
    setActiveGemId(gemId)
    // Apply gem to active conversation (new chats will inherit)
    if (!activeConversation) return
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConversation.id ? { ...c, gemId } : c))
    )
  }

  const handleImageSelected = (base64: string, imageType: string, _file?: File) => {
    setImagePreview(base64)
    setSelectedImageBase64(base64)
    setSelectedImageType(imageType)
  }

  const handleRemoveImage = () => {
    setImagePreview('')
    setSelectedImageBase64('')
    setSelectedImageType('')
  }

  const appendMessages = (conversationId: string, nextMessages: ChatMessage[]) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c
        const updatedAt = nowIso()
        return {
          ...c,
          updatedAt,
          messages: [...c.messages, ...nextMessages],
        }
      })
    )
  }

  const maybeUpdateTitle = (conversationId: string, firstUserText: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c
        if (c.title && c.title !== 'New conversation') return c
        return { ...c, title: buildTitleFrom(firstUserText) }
      })
    )
  }

  const send = async (preset?: string) => {
    const conversation = activeConversation
    if (!conversation) return
    if (sending) return

    const messageText = (preset ?? input).trim()
    const imageDataUrl = selectedImageBase64
    const imageType = selectedImageType

    if (!messageText && !imageDataUrl) return

    // Immediately reflect user message in UI
    const userMsg: ChatMessage = {
      id: `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      role: 'user',
      text: messageText,
      timestamp: nowIso(),
      imageDataUrl: imageDataUrl || undefined,
    }

    appendMessages(conversation.id, [userMsg])
    maybeUpdateTitle(conversation.id, messageText)

    setInput('')
    handleRemoveImage()
    setSending(true)

    try {
      const response = imageDataUrl
        ? await apiClient.sendMessageWithImage(
            messageText, 
            imageDataUrl, 
            imageType || 'image/jpeg',
            // ส่ง userId เพิ่มเข้าไป (ต้องแน่ใจว่า apiClient รองรับ)
            userName || 'default_user' 
          )
        : await apiClient.sendMessage(
            messageText, 
            activeConversation.id, // ส่ง conversation_id ไปด้วยเพื่อให้ Backend เก็บ History ถูก
            userName || 'default_user' 
          );

      const aiMsg: ChatMessage = {
        id: `m_${(Date.now() + 1).toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
        role: 'assistant',
        text: response.response ?? "Sorry, I couldn't process that.",
        timestamp: nowIso(),
      }
      appendMessages(conversation.id, [aiMsg])
    } catch {
      const errMsg: ChatMessage = {
        id: `m_${(Date.now() + 2).toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
        role: 'assistant',
        text: 'Failed to connect to the server. Please try again.',
        timestamp: nowIso(),
      }
      appendMessages(conversation.id, [errMsg])
    } finally {
      setSending(false)
    }
  }

  const suggestionPills = [
    'Suggest recipes from my ingredients',
    'Create a 30-minute dinner plan',
    'Turn this into a shopping list',
    'Help me cook what’s in this photo',
    'Make it healthier + high protein',
  ]

  const sidebarHidden = theater

  return (
    <div className="min-h-screen bg-culinary-deepBrown text-culinary-cream">
      <div className="flex min-h-screen">
        {/* Mobile overlay */}
        <AnimatePresence>
          {!sidebarHidden && sidebarOpenMobile && (
            <motion.button
              type="button"
              aria-label="Close sidebar"
              className="fixed inset-0 z-40 bg-culinary-deepBrown/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpenMobile(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar - Fixed Position on Desktop */}
        {!sidebarHidden && (
          <aside
            className={
              "flex flex-col border-r border-culinary-gold/10 bg-culinary-deepBrown/95 backdrop-blur-md transition-all duration-300 " +
              (sidebarCollapsed ? 'w-20' : 'w-72') +
              " md:fixed md:top-0 md:left-0 md:h-screen md:z-40 " +
              " max-md:fixed max-md:top-0 max-md:left-0 max-md:h-screen max-md:w-72 max-md:z-50 max-md:shadow-warm " +
              (sidebarOpenMobile ? 'max-md:translate-x-0' : 'max-md:-translate-x-full') +
              ' max-md:transition-transform'
            }
          >
            {/* Header */}
            <div className={sidebarCollapsed ? 'p-2 flex flex-col gap-2 items-center border-b border-culinary-gold/10' : 'flex items-center gap-2 p-3 border-b border-culinary-gold/10'}>
              <button
                type="button"
                className="h-11 w-11 rounded-lg bg-culinary-cream/10 text-culinary-cream hover:bg-culinary-cream/20 active:bg-culinary-cream/25 transition-colors flex items-center justify-center flex-shrink-0"
                onClick={() => setSidebarCollapsed((v) => !v)}
                aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <Menu size={20} />
              </button>

              {!sidebarCollapsed && (
                <button
                  type="button"
                  className="flex-1 h-11 rounded-lg bg-gradient-to-br from-culinary-terracotta to-culinary-coral text-white font-semibold flex items-center justify-center gap-2 hover:shadow-warm active:scale-95 transition-all"
                  onClick={handleNewChat}
                >
                  <Plus size={20} />
                  New
                </button>
              )}

              {sidebarCollapsed && (
                <button
                  type="button"
                  className="h-11 w-11 rounded-lg bg-gradient-to-br from-culinary-terracotta to-culinary-coral text-white font-semibold flex items-center justify-center hover:shadow-warm active:scale-95 transition-all flex-shrink-0"
                  onClick={handleNewChat}
                  aria-label="New chat"
                >
                  <Plus size={20} />
                </button>
              )}
            </div>

            {/* Gems */}
            <div className={sidebarCollapsed ? 'px-2 pt-3 flex flex-col gap-2' : 'px-3 pt-4'}>
              {!sidebarCollapsed && (
                <div className="text-xs uppercase tracking-wider text-culinary-cream/60 mb-3 px-1">
                  Personas
                </div>
              )}

              <div className={sidebarCollapsed ? 'space-y-2 flex flex-col items-center' : 'space-y-2'}>
                {GEMS.map((g) => {
                  const active = g.id === activeGemId
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => handleGemSelect(g.id)}
                      className={
                        "rounded-lg border transition-all text-left " +
                        (sidebarCollapsed 
                          ? 'p-3 w-12 h-12 flex items-center justify-center'
                          : 'w-full rounded-xl border transition-colors p-3') +
                        ' ' +
                        (active
                          ? 'border-culinary-terracotta/40 bg-culinary-cream/10'
                          : 'border-culinary-gold/10 bg-culinary-cream/5 hover:bg-culinary-cream/10')
                      }
                      aria-label={`Select ${g.name}`}
                      title={sidebarCollapsed ? g.name : ''}
                    >
                      <div className={sidebarCollapsed ? '' : 'flex items-center gap-3'}>
                        <div
                          className={
                            "rounded-lg flex items-center justify-center flex-shrink-0 " +
                            (sidebarCollapsed ? 'h-8 w-8' : 'h-10 w-10') +
                            ' ' +
                            (active
                              ? 'bg-culinary-terracotta/20 text-culinary-honey'
                              : 'bg-culinary-cream/10 text-culinary-cream')
                          }
                        >
                          {g.id === 'classic' ? (
                            <ChefHat size={18} />
                          ) : (
                            <UtensilsCrossed size={18} />
                          )}
                        </div>
                        {!sidebarCollapsed && (
                          <div className="min-w-0">
                            <div className="font-semibold text-sm text-culinary-cream truncate">
                              {g.name}
                            </div>
                            <div className="text-xs text-culinary-cream/55 truncate">
                              {g.description}
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* History */}
            <div className={sidebarCollapsed ? 'px-2 pt-3 flex-1 min-h-0 flex flex-col items-center' : 'px-3 pt-4 flex-1 min-h-0'}>
              {!sidebarCollapsed && (
                <div className="text-xs uppercase tracking-wider text-culinary-cream/60 mb-3 px-1">
                  Conversations
                </div>
              )}
              <div className={sidebarCollapsed ? 'space-y-2 w-full flex flex-col items-center' : 'space-y-2 overflow-y-auto min-h-0 w-full pr-1'}>
                {conversations.map((c) => {
                  const active = c.id === activeConversationId
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActiveConversation(c.id)}
                      className={
                        "rounded-lg border px-3 py-2 transition-all text-left " +
                        (sidebarCollapsed
                          ? 'w-12 h-12 p-0 flex items-center justify-center'
                          : 'w-full rounded-xl') +
                        ' ' +
                        (active
                          ? 'border-culinary-terracotta/40 bg-culinary-cream/10'
                          : 'border-culinary-gold/10 bg-culinary-cream/5 hover:bg-culinary-cream/10')
                      }
                      aria-label={`Open conversation ${c.title}`}
                      title={sidebarCollapsed ? c.title : ''}
                    >
                      {sidebarCollapsed ? (
                        <MessageCircle size={18} className="text-culinary-cream/70" />
                      ) : (
                        <div className="flex items-center gap-2">
                          <MessageCircle size={16} className="text-culinary-cream/70 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-culinary-cream truncate">
                              {c.title}
                            </div>
                            <div className="text-[11px] text-culinary-cream/45 truncate">
                              {new Date(c.updatedAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-culinary-gold/10 flex flex-col items-center gap-2">
              <Link
                href="/profile"
                className={
                  "flex items-center justify-center gap-2 rounded-lg border border-culinary-gold/10 bg-culinary-cream/5 hover:bg-culinary-cream/10 transition-colors " +
                  (sidebarCollapsed ? 'p-3 w-12 h-12' : 'w-full p-3')
                }
                title={sidebarCollapsed ? 'Preferences' : ''}
              >
                <Settings size={18} className="text-culinary-cream/70" />
                {!sidebarCollapsed && (
                  <span className="text-sm text-culinary-cream/80">Preferences</span>
                )}
              </Link>
              <a
                href="#"
                className={
                  "flex items-center justify-center gap-2 rounded-lg border border-culinary-gold/10 bg-culinary-cream/5 hover:bg-culinary-cream/10 transition-colors " +
                  (sidebarCollapsed ? 'p-3 w-12 h-12' : 'w-full p-3')
                }
                title={sidebarCollapsed ? 'Support' : ''}
              >
                <HelpCircle size={18} className="text-culinary-cream/70" />
                {!sidebarCollapsed && (
                  <span className="text-sm text-culinary-cream/80">Support</span>
                )}
              </a>
            </div>
          </aside>
        )}

        {/* Main */}
        <main className={`flex-1 min-w-0 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-72'}`}>
          {/* Top Nav */}
          <div className="h-14 border-b border-culinary-gold/10 bg-culinary-deepBrown/80 backdrop-blur-md sticky top-0 z-30">
            <div className="h-full max-w-6xl mx-auto px-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="md:hidden h-10 w-10 rounded-xl bg-culinary-cream/10 hover:bg-culinary-cream/15 transition-colors flex items-center justify-center"
                  onClick={() => setSidebarOpenMobile(true)}
                  aria-label="Open sidebar"
                >
                  <Menu size={18} />
                </button>

                <div className="flex items-baseline gap-2">
                  <div className="text-sm uppercase tracking-widest text-culinary-cream/60">
                    Gemini
                  </div>
                  <div className="text-sm text-culinary-cream/40">•</div>
                  <div className="text-sm font-semibold text-culinary-cream/90">
                    Culinary Crafts
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="h-10 w-10 rounded-xl bg-culinary-cream/10 hover:bg-culinary-cream/15 transition-colors flex items-center justify-center"
                  onClick={() => setTheater((v) => !v)}
                  aria-label={theater ? 'Exit full workspace' : 'Expand workspace'}
                >
                  {theater ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>

                <Link
                  href="/profile"
                  className="h-10 w-10 rounded-xl overflow-hidden border border-culinary-gold/15 bg-culinary-cream/10 hover:bg-culinary-cream/15 transition-colors flex items-center justify-center"
                  aria-label="Profile"
                >
                  {userImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={userImage} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-sm font-semibold">{(userName || 'U').slice(0, 1)}</span>
                  )}
                </Link>

                <button
                  type="button"
                  className="h-10 w-10 rounded-xl bg-culinary-cream/10 hover:bg-culinary-cream/15 transition-colors flex items-center justify-center"
                  onClick={onSignOut}
                  aria-label="Log out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Workspace */}
          <div className="flex-1 min-h-0">
            <div className="h-full flex flex-col items-center">
              {/* Messages */}
              <div
                ref={scrollerRef}
                className="w-full flex-1 min-h-0 overflow-y-auto px-4 py-10"
              >
                <div className="max-w-3xl mx-auto">
                  {/* Hero */}
                  {(!activeConversation || activeConversation.messages.length === 0) && (
                    <div className="text-center pt-10 pb-8">
                      <div className="mb-4 flex justify-center">
                        <ChefHat size={64} className="text-culinary-cream" />
                      </div>
                      <h1 className="text-4xl md:text-6xl font-bold text-culinary-cream">
                        Hello{userName ? `, ${userName}` : ''}.
                      </h1>
                      <p className="mt-4 text-culinary-cream/60 text-base md:text-lg">
                        Ask anything about recipes, ingredients, or share a photo.
                      </p>
                    </div>
                  )}

                  {/* Conversation */}
                  <AnimatePresence initial={false}>
                    {activeConversation?.messages.map((m) => {
                      const isUser = m.role === 'user'
                      return (
                        <motion.div
                          key={m.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className={"flex " + (isUser ? 'justify-end' : 'justify-start')}
                        >
                          <div
                            className={
                              "my-3 max-w-[92%] md:max-w-[78%] rounded-3xl px-4 py-3 border " +
                              (isUser
                                ? 'bg-gradient-to-br from-culinary-terracotta to-culinary-coral text-white border-culinary-terracotta/30'
                                : 'bg-culinary-warmWhite text-culinary-deepBrown border-culinary-gold/15')
                            }
                          >
                            {m.imageDataUrl && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={m.imageDataUrl}
                                alt="Attachment"
                                className="w-full max-h-60 object-cover rounded-2xl mb-3"
                              />
                            )}
                            <div className="text-sm md:text-[15px] leading-relaxed">
                              {isUser ? (
                                <div className="whitespace-pre-wrap">{m.text}</div>
                              ) : (
                                <FormattedMessage text={m.text} />
                              )}
                            </div>
                            <div
                              className={
                                "mt-2 text-[11px] " +
                                (isUser ? 'text-white/70' : 'text-culinary-deepBrown/50')
                              }
                            >
                              {new Date(m.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>

                  {sending && (
                    <div className="flex justify-start">
                      <div className="my-3 max-w-[92%] md:max-w-[78%] rounded-3xl px-4 py-3 border bg-culinary-warmWhite text-culinary-deepBrown border-culinary-gold/15">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-culinary-terracotta animate-bounce" />
                          <div
                            className="h-2 w-2 rounded-full bg-culinary-terracotta animate-bounce"
                            style={{ animationDelay: '0.1s' }}
                          />
                          <div
                            className="h-2 w-2 rounded-full bg-culinary-terracotta animate-bounce"
                            style={{ animationDelay: '0.2s' }}
                          />
                          <span className="text-sm text-culinary-deepBrown/60 ml-2">
                            Thinking…
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Input container (centered, big card) - Sticky */}
              <div className="sticky bottom-0 w-full px-4 py-4 bg-gradient-to-t from-culinary-deepBrown via-culinary-deepBrown/95 to-culinary-deepBrown/0 z-20">
                <div className="max-w-3xl mx-auto">
                  <div className="rounded-[28px] border border-culinary-gold/15 bg-culinary-cream/5 backdrop-blur-md shadow-warm p-4 md:p-5">
                    {/* Attachments row */}
                    {(imagePreview || selectedImageBase64) && (
                      <div className="mb-3 flex items-center gap-3">
                        <div className="rounded-2xl border border-culinary-gold/15 bg-culinary-cream/10 p-2">
                          <ImageAttachment
                            preview={imagePreview}
                            onRemove={handleRemoveImage}
                            onImageSelected={(b64, type, file) => handleImageSelected(b64, type, file)}
                          />
                        </div>
                      </div>
                    )}

                    {/* Prompt row */}
                    <div className="flex items-end gap-3">
                      <div className="flex flex-col gap-2 flex-1 min-w-0">
                        <textarea
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Type a prompt…"
                          rows={1}
                          className="w-full resize-none rounded-2xl border border-culinary-gold/15 bg-culinary-deepBrown/70 text-culinary-cream placeholder:text-culinary-cream/40 px-4 py-4 leading-6 focus:outline-none focus:ring-2 focus:ring-culinary-terracotta focus:border-culinary-terracotta"
                          style={{ minHeight: 56, maxHeight: 168 }}
                          disabled={sending}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault()
                              void send()
                            }
                          }}
                        />

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {!imagePreview && (
                              <div className="rounded-xl border border-culinary-gold/15 bg-culinary-cream/5 px-2 py-1">
                                <ImageAttachment
                                  onImageSelected={(b64, type, file) => handleImageSelected(b64, type, file)}
                                  preview={imagePreview}
                                />
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-culinary-cream/45">
                            Enter to send • Shift+Enter for newline
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => void send()}
                        disabled={sending || (!input.trim() && !selectedImageBase64)}
                        className="h-14 w-14 rounded-2xl bg-gradient-to-br from-culinary-terracotta to-culinary-coral text-white font-semibold flex items-center justify-center hover:shadow-warm active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Send"
                      >
                        <span className="text-lg">↵</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick actions - Hidden when typing or sending */}
                  {!input.trim() && !sending && (
                    <div className="mt-4 flex flex-wrap justify-center gap-2 animate-in fade-in duration-300">
                      {suggestionPills.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => void send(s)}
                          className="px-4 py-2 rounded-full border border-culinary-gold/15 bg-culinary-cream/5 text-culinary-cream/85 hover:bg-culinary-cream/10 transition-colors text-sm"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
