import { Bot } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t py-12 md:py-16">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2 font-bold">
          <Bot className="h-5 w-5" />
          <span>AI Tools Hub</span>
        </div>
        <p className="text-center text-sm text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} AI Tools Hub. All rights reserved. Built with Blink.
        </p>
      </div>
    </footer>
  )
}
