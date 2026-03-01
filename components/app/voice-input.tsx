"use client"

import { useState, useEffect } from "react"
import { Mic, MicOff, Send, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"

interface VoiceInputProps {
  onSubmit: (text: string) => void
  placeholder?: string
  className?: string
}

export function VoiceInput({ onSubmit, placeholder, className }: VoiceInputProps) {
  const [text, setText] = useState("")
  const {
    isListening,
    transcript,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition()

  // Atualizar texto quando transcript mudar
  useEffect(() => {
    if (transcript) {
      setText(transcript)
    }
  }, [transcript])

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text.trim())
      setText("")
      resetTranscript()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleClear = () => {
    setText("")
    resetTranscript()
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder || 'Ex: "Gastei 50 reais no mercado"'}
              className="pr-8"
            />
            {text && (
              <button
                onClick={handleClear}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {isSupported && (
            <Button
              type="button"
              variant={isListening ? "destructive" : "outline"}
              size="icon"
              onClick={isListening ? stopListening : startListening}
              className="shrink-0"
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          )}

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!text.trim()}
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {isListening && (
          <div className="mt-3 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-sm text-muted-foreground">
              Ouvindo... Fale sua transação
            </span>
          </div>
        )}

        {error && (
          <p className="mt-2 text-sm text-destructive">
            Erro no reconhecimento de voz: {error}
          </p>
        )}

        {!isSupported && (
          <p className="mt-2 text-xs text-muted-foreground">
            Reconhecimento de voz não suportado neste navegador.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
