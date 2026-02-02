import { useState } from 'react'
import { blink } from '@/lib/blink'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Image as ImageIcon, Download, Loader2, Wand2, RefreshCcw } from 'lucide-react'
import { saveGeneration } from '@/lib/generations'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

export function ImageTool() {
  const [prompt, setPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return

    setIsLoading(true)
    try {
      const { url } = await blink.ai.generateImage({
        prompt: prompt.trim(),
        model: 'fal-ai/nano-banana-pro'
      })

      setImageUrl(url)

      // Save to database
      await saveGeneration({
        type: 'image',
        prompt: prompt.trim(),
        content: url
      })

      toast.success('Image generated successfully')
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Failed to generate image')
    } finally {
      setIsLoading(false)
    }
  }

  const downloadImage = async () => {
    if (!imageUrl) return
    
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ai-generation-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      window.open(imageUrl, '_blank')
    }
  }

  return (
    <div className="container max-w-4xl py-12 space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl border">
          <ImageIcon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Image Generator</h1>
          <p className="text-sm text-muted-foreground">Turn your ideas into visual reality.</p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <Card className="border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 overflow-hidden min-h-[400px] flex items-center justify-center relative">
            <AnimatePresence mode="wait">
              {imageUrl ? (
                <motion.div
                  key="image"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full h-full p-4 flex flex-col items-center gap-4"
                >
                  <img 
                    src={imageUrl} 
                    alt="Generated" 
                    className="w-full max-h-[500px] object-contain rounded-xl shadow-2xl"
                  />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={downloadImage} className="gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setImageUrl('')} className="gap-2">
                      <RefreshCcw className="h-4 w-4" />
                      Clear
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-4 text-muted-foreground p-12 text-center"
                >
                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-full border border-dashed">
                    <ImageIcon className="h-10 w-10 opacity-20" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">No image generated yet</p>
                    <p className="text-sm">Describe something and click generate to see the magic.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {isLoading && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="mt-4 font-medium animate-pulse">Generating your masterpiece...</p>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Prompt</label>
                <textarea
                  placeholder="A futuristic city with flying cars and neon lights, cinematic style, 8k..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full min-h-[120px] p-4 rounded-xl border bg-zinc-50 dark:bg-zinc-950 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {['Photorealistic', 'Cyberpunk', 'Digital Art', 'Oil Painting', 'Minimalist'].map((style) => (
                    <Button 
                      key={style}
                      variant="ghost" 
                      size="sm" 
                      className="text-[10px] uppercase tracking-wider h-7 px-2 border hover:border-primary"
                      onClick={() => setPrompt(prev => prev + (prev ? ', ' : '') + style)}
                    >
                      {style}
                    </Button>
                  ))}
                </div>

                <Button 
                  className="w-full h-12 rounded-xl gap-2 font-bold" 
                  onClick={handleGenerate}
                  disabled={isLoading || !prompt.trim()}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                  Generate Image
                </Button>
              </div>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-dashed text-xs text-muted-foreground leading-relaxed">
                <strong>Pro tip:</strong> Be specific about lighting, colors, and camera angles for better results.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
