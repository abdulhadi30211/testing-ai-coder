import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MessageSquare, 
  Image as ImageIcon, 
  Eye, 
  Database, 
  ArrowRight,
  Zap,
  Shield,
  Layout
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const tools = [
  {
    id: 'chat',
    title: 'AI Assistant',
    description: 'Smart chat assistant for writing, coding, and brainstorming.',
    icon: MessageSquare,
    href: '/tool/chat',
    color: 'bg-zinc-100 dark:bg-zinc-900',
    badge: 'Popular'
  },
  {
    id: 'image',
    title: 'Image Generator',
    description: 'Create stunning images from simple text descriptions.',
    icon: ImageIcon,
    href: '/tool/image',
    color: 'bg-zinc-100 dark:bg-zinc-900',
    badge: 'Creative'
  },
  {
    id: 'vision',
    title: 'Vision AI',
    description: 'Analyze and extract information from any image.',
    icon: Eye,
    href: '/tool/vision',
    color: 'bg-zinc-100 dark:bg-zinc-900',
    badge: 'New'
  },
  {
    id: 'object',
    title: 'Object Extractor',
    description: 'Extract structured data from unstructured text instantly.',
    icon: Database,
    href: '/tool/object',
    color: 'bg-zinc-100 dark:bg-zinc-900',
    badge: 'Pro'
  }
]

export function HomePage() {
  return (
    <div className="container py-12 md:py-24 space-y-24">
      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <Badge variant="outline" className="px-3 py-1 text-xs uppercase tracking-wider">
            Powerful AI Ecosystem
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            All your AI tools in one <span className="text-primary/60">minimal</span> workspace.
          </h1>
          <p className="text-xl text-muted-foreground">
            A comprehensive collection of AI-powered tools designed to make your productivity seamless and smarter.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center justify-center gap-4"
        >
          <Button size="lg" className="rounded-full px-8" onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}>
            Try for Free
          </Button>
          <Button variant="outline" size="lg" className="rounded-full px-8" onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}>
            View Tools
          </Button>
        </motion.div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Available Tools</h2>
          <p className="text-muted-foreground">Choose a tool to start generating.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link to={tool.href}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-zinc-200 dark:border-zinc-800 group overflow-hidden">
                  <CardHeader className="space-y-4 pb-4">
                    <div className={`p-3 rounded-2xl w-fit ${tool.color} border border-zinc-200 dark:border-zinc-800 group-hover:scale-110 transition-transform duration-300`}>
                      <tool.icon className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{tool.title}</CardTitle>
                        <Badge variant="secondary" className="font-normal text-[10px] px-1.5 py-0">
                          {tool.badge}
                        </Badge>
                      </div>
                      <CardDescription>{tool.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm font-medium text-primary gap-1 group-hover:translate-x-1 transition-transform">
                      Open Tool <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12 py-12 border-y">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-full">
            <Zap className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold">Blazing Fast</h3>
          <p className="text-sm text-muted-foreground">Powered by the latest AI models for near-instant responses and generations.</p>
        </div>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-full">
            <Shield className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold">Privacy First</h3>
          <p className="text-sm text-muted-foreground">Your data and generations are securely stored and only accessible by you.</p>
        </div>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-full">
            <Layout className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold">Unified UI</h3>
          <p className="text-sm text-muted-foreground">A consistent, minimalist interface across all tools for a distraction-free experience.</p>
        </div>
      </section>
    </div>
  )
}
