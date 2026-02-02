import { useState, useEffect } from 'react'
import { getGenerations, Generation } from '@/lib/generations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  History, 
  MessageSquare, 
  Image as ImageIcon, 
  Eye, 
  Database, 
  ExternalLink,
  Loader2,
  Trash2,
  Calendar
} from 'lucide-react'
import { blink } from '@/lib/blink'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

export function HistoryPage() {
  const [generations, setGenerations] = useState<Generation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadGenerations()
  }, [])

  const loadGenerations = async () => {
    setIsLoading(true)
    try {
      const data = await getGenerations()
      setGenerations(data)
    } catch (error) {
      console.error(error)
      toast.error('Failed to load history')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteGeneration = async (id: string) => {
    try {
      await blink.db.generations.delete(id)
      setGenerations(prev => prev.filter(g => g.id !== id))
      toast.success('Deleted from history')
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'chat': return <MessageSquare className="h-4 w-4" />
      case 'image': return <ImageIcon className="h-4 w-4" />
      case 'vision': return <Eye className="h-4 w-4" />
      case 'object': return <Database className="h-4 w-4" />
      default: return <History className="h-4 w-4" />
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="container py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl border">
            <History className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Your History</h1>
            <p className="text-sm text-muted-foreground">Review your past AI generations.</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={loadGenerations} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
        </Button>
      </div>

      {isLoading ? (
        <div className="h-[400px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : generations.length === 0 ? (
        <Card className="border-dashed py-20">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-full border border-dashed">
              <History className="h-8 w-8 text-zinc-300" />
            </div>
            <div className="space-y-1">
              <p className="font-medium">No history found</p>
              <p className="text-sm text-muted-foreground">Start using the tools to see your history here.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          <AnimatePresence>
            {generations.map((gen, index) => (
              <motion.div
                key={gen.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group hover:border-primary/50 transition-colors">
                  <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="gap-2 uppercase text-[10px] tracking-widest px-2 py-0.5">
                            {getIcon(gen.type)}
                            {gen.type}
                          </Badge>
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(gen.createdAt)}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteGeneration(gen.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium text-sm line-clamp-1">{gen.prompt}</h3>
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border text-sm text-muted-foreground line-clamp-3">
                          {gen.type === 'object' ? (
                            <pre className="text-[10px] whitespace-pre-wrap">{JSON.stringify(JSON.parse(gen.content), null, 2)}</pre>
                          ) : (
                            gen.content
                          )}
                        </div>
                      </div>
                    </div>

                    {gen.type === 'image' || (gen.type === 'vision' && gen.metadata?.imageUrl) ? (
                      <div className="w-full sm:w-40 h-40 rounded-xl overflow-hidden border bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                        <img 
                          src={gen.type === 'image' ? gen.content : gen.metadata.imageUrl} 
                          className="w-full h-full object-cover" 
                          alt="Generation" 
                        />
                      </div>
                    ) : null}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
