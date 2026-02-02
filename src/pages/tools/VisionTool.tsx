import { useState } from 'react'
import { blink } from '@/lib/blink'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Eye, Upload, Loader2, Search, FileText, Layout, X } from 'lucide-react'
import { saveGeneration } from '@/lib/generations'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

export function VisionTool() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [analysis, setAnalysis] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreviewUrl(URL.createObjectURL(selectedFile))
      setAnalysis('')
    }
  }

  const handleAnalyze = async () => {
    if (!file || isLoading) return

    setIsLoading(true)
    setUploadProgress(0)

    try {
      // 1. Upload file
      const { publicUrl } = await blink.storage.upload(
        file,
        `vision/${Date.now()}.${file.name.split('.').pop()}`,
        {
          onProgress: (percent) => setUploadProgress(percent)
        }
      )

      // 2. Analyze with AI
      const { text } = await blink.ai.generateText({
        messages: [{
          role: "user",
          content: [
            { type: "text", text: "Analyze this image in detail. Identify objects, text, and describe the overall scene." },
            { type: "image", image: publicUrl }
          ]
        }]
      })

      setAnalysis(text)

      // 3. Save to database
      await saveGeneration({
        type: 'vision',
        prompt: `Analyze image: ${file.name}`,
        content: text,
        metadata: { imageUrl: publicUrl }
      })

      toast.success('Analysis complete')
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Failed to analyze image')
    } finally {
      setIsLoading(false)
    }
  }

  const clear = () => {
    setFile(null)
    setPreviewUrl('')
    setAnalysis('')
    setUploadProgress(0)
  }

  return (
    <div className="container max-w-5xl py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl border">
            <Eye className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Vision AI</h1>
            <p className="text-sm text-muted-foreground">See more with advanced image analysis.</p>
          </div>
        </div>
        {(previewUrl || analysis) && (
          <Button variant="ghost" size="sm" onClick={clear} className="gap-2">
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className={`border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 overflow-hidden relative min-h-[400px] flex items-center justify-center ${!previewUrl ? 'border-dashed' : ''}`}>
            {previewUrl ? (
              <div className="relative w-full h-full p-4 flex flex-col items-center justify-center">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-h-[500px] w-full object-contain rounded-xl shadow-lg"
                />
              </div>
            ) : (
              <label className="flex flex-col items-center gap-4 cursor-pointer p-12 text-center w-full h-full">
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                <div className="p-6 bg-white dark:bg-zinc-950 rounded-full border border-dashed border-zinc-300 dark:border-zinc-700">
                  <Upload className="h-10 w-10 text-zinc-400" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Upload an image</p>
                  <p className="text-sm text-muted-foreground">Drag and drop or click to browse</p>
                </div>
              </label>
            )}

            {isLoading && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 p-6 text-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <div className="mt-4 space-y-2">
                  <p className="font-medium">
                    {uploadProgress < 100 ? `Uploading... ${uploadProgress}%` : 'Analyzing image...'}
                  </p>
                  <div className="w-48 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden mx-auto">
                    <motion.div 
                      className="h-full bg-primary" 
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>

          {previewUrl && !analysis && !isLoading && (
            <Button className="w-full h-12 rounded-xl gap-2 font-bold" onClick={handleAnalyze}>
              <Search className="h-4 w-4" />
              Analyze Image
            </Button>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-zinc-200 dark:border-zinc-800 h-full flex flex-col min-h-[400px]">
            <CardContent className="p-6 flex-1 flex flex-col gap-6">
              <div className="flex items-center gap-2 border-b pb-4">
                <FileText className="h-4 w-4 text-primary" />
                <h2 className="font-semibold">Analysis Result</h2>
              </div>

              {analysis ? (
                <div className="flex-1 space-y-4 prose prose-zinc dark:prose-invert max-w-none animate-fade-in">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{analysis}</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                  <Layout className="h-12 w-12 opacity-10 mb-4" />
                  <p className="text-sm italic">Results will appear here after analysis.</p>
                </div>
              )}

              {analysis && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-fit gap-2"
                  onClick={() => {
                    navigator.clipboard.writeText(analysis)
                    toast.success('Analysis copied to clipboard')
                  }}
                >
                  Copy Report
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
