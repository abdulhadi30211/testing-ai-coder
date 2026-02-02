import { useState, useRef, useEffect } from 'react'
import { blink } from '@/lib/blink'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { MessageSquare, Send, Bot, User, Loader2, Copy, Check, RotateCcw } from 'lucide-react'
import { saveGeneration } from '@/lib/generations'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function ChatTool() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      let fullResponse = ''
      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      await blink.ai.streamText(
        { 
          prompt: userMessage,
          system: "You are a helpful, minimalist AI assistant. Keep responses concise and clear."
        },
        (chunk) => {
          fullResponse += chunk
          setMessages(prev => {
            const next = [...prev]
            next[next.length - 1].content = fullResponse
            return next
          })
        }
      )

      // Save to database
      await saveGeneration({
        type: 'chat',
        prompt: userMessage,
        content: fullResponse
      })

    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Failed to generate response')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const clearChat = () => {
    setMessages([])
    toast.info('Chat cleared')
  }

  return (
    <div className="container max-w-4xl py-12 h-[calc(100vh-8rem)] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl border">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Assistant</h1>
            <p className="text-sm text-muted-foreground">Smart chat for all your questions.</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={clearChat} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Clear Chat
        </Button>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-zinc-200 dark:border-zinc-800">
        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
          <div className="space-y-6">
            <AnimatePresence initial={false}>
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-full border border-dashed">
                    <Bot className="h-8 w-8 text-zinc-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium">How can I help you today?</p>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Ask me anything - from writing code to summarizing complex topics.
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`p-2 rounded-lg h-fit ${message.role === 'user' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 dark:bg-zinc-800'}`}>
                      {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`flex flex-col gap-2 max-w-[80%] ${message.role === 'user' ? 'items-end' : ''}`}>
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                        message.role === 'user' 
                          ? 'bg-zinc-100 dark:bg-zinc-800 rounded-tr-none' 
                          : 'bg-zinc-50 dark:bg-zinc-900 border rounded-tl-none'
                      }`}>
                        {message.content || (isLoading && index === messages.length - 1 ? <Loader2 className="h-4 w-4 animate-spin" /> : null)}
                      </div>
                      {message.role === 'assistant' && message.content && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => copyToClipboard(message.content)}
                        >
                          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="relative flex items-end gap-2 max-w-3xl mx-auto">
            <Textarea
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              className="min-h-[50px] max-h-[200px] resize-none pr-12 rounded-2xl bg-white dark:bg-zinc-950"
            />
            <Button 
              size="icon" 
              className="absolute right-1.5 bottom-1.5 rounded-xl h-8 w-8" 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-[10px] text-center mt-3 text-muted-foreground uppercase tracking-widest">
            Press Enter to send
          </p>
        </div>
      </Card>
    </div>
  )
}
