// import { ToastNotification } from '@/components/ToastNotification'

import { URL_API } from "@/constants/consts"

// Configuração padrão para headers
const defaultHeaders = {
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true'
}

// Interface para opções de configuração das requisições
export interface RequestOptions {
  method: string
  body?: any
  headers?: Record<string, string>
}

// Função genérica para realizar chamadas à API
export async function fetchApi<T>(endpoint: string, options: RequestOptions): Promise<T | null> {
  const url = `${URL_API}${endpoint}`
  
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      },
      credentials: 'include'
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error('Erro na resposta:', errorText)
      throw new Error(`Erro na requisição à API: ${errorText}`)
    }

    // Verifica se há corpo na resposta
    const contentLength = res.headers.get('Content-Length')
    const contentType = res.headers.get('Content-Type')
    if (
      contentLength === '0' || // Sem corpo
      !contentType?.includes('application/json') // Não é JSON
    ) {
      return null
    }

    return res.json() as Promise<T>
  } catch (error) {
    console.error(`Erro na chamada à API (${endpoint}):`, error)
    // ToastNotification({ message: 'Erro na requisição à API.', type: 'error' })
    throw error
  }
}
