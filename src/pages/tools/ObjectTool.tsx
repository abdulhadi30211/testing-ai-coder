import { useState } from 'react'
import { blink } from '@/lib/blink'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Database, Loader2, Play, Code, Table, Check, Copy } from 'lucide-react'
import { saveGeneration } from '@/lib/generations'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

export function ObjectTool() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleExtract = async () => {
    if (!input.trim() || isLoading) return

    setIsLoading(true)
    try {
      const { object } = await blink.ai.generateObject({
        prompt: `Extract structured information from the following text: ${input}`,
        schema: {
          type: 'object',
          properties: {
            entities: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  type: { type: 'string', description: 'person, organization, location, date, etc.' },
                  context: { type: 'string' }
                },
                required: ['name', 'type']
              }
            },
            summary: { type: 'string', description: 'A one-sentence summary of the text' },
            sentiment: { type: 'string', enum: ['positive', 'negative', 'neutral'] }
          },
          required: ['entities', 'summary', 'sentiment']
        }
      })

      setResult(object)

      // Save to database
      await saveGeneration({
        type: 'object',
        prompt: input.trim().substring(0, 100) + '...',
        content: JSON.stringify(object)
      })

      toast.success('Data extracted successfully')
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Failed to extract data')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-5xl py-12 space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl border">
          <Database className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Object Extractor</h1>
          <p className="text-sm text-muted-foreground">Extract structured data from any text instantly.</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Input Text</label>
            <Textarea
              placeholder="Paste an article, email, or any text you want to analyze..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[300px] p-4 rounded-xl resize-none border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"
            />
          </div>
          <Button 
            className="w-full h-12 rounded-xl gap-2 font-bold" 
            onClick={handleExtract}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            Extract Data
          </Button>
        </div>

        <div className="space-y-6">
          <Card className="border-zinc-200 dark:border-zinc-800 h-full flex flex-col min-h-[400px]">
            <CardContent className="p-6 flex-1 flex flex-col gap-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2">
                  <Table className="h-4 w-4 text-primary" />
                  <h2 className="font-semibold">Structured Output</h2>
                </div>
                {result && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(result, null, 2))
                      toast.success('JSON copied')
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {result ? (
                <div className="flex-1 space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Summary</p>
                    <p className="text-sm leading-relaxed">{result.summary}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Entities Found</p>
                    <div className="grid gap-2">
                      {result.entities.map((entity: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border text-xs">
                          <div className="space-y-1">
                            <span className="font-bold">{entity.name}</span>
                            <p className="text-muted-foreground">{entity.context}</p>
                          </div>
                          <Badge variant="outline" className="text-[10px] uppercase">{entity.type}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sentiment</p>
                    <Badge className={`${
                      result.sentiment === 'positive' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      result.sentiment === 'negative' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-zinc-100 text-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-400'
                    }`}>
                      {result.sentiment}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                  <Code className="h-12 w-12 opacity-10 mb-4" />
                  <p className="text-sm italic">Input text and click extract to see structured results.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
