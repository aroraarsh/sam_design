import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import * as pdfjsLib from 'pdfjs-dist'
import resumePdf from '../assets/Shanker_Resume.pdf'
import './ResumePage.css'

// PDF.js worker (CDN so it works in Vite dev and build)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

function ResumePage() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!resumePdf || !containerRef.current) return

    let cancelled = false

    const loadPdf = async () => {
      try {
        const pdf = await pdfjsLib.getDocument(resumePdf).promise
        if (cancelled) return
        const container = containerRef.current
        if (!container) return
        container.innerHTML = ''

        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled) return
          const page = await pdf.getPage(i)
          const viewport = page.getViewport({ scale: 2 })
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          canvas.height = viewport.height
          canvas.width = viewport.width
          canvas.className = 'resume-pdf-page'
          await page.render({ canvasContext: ctx, viewport }).promise
          if (cancelled) return
          container.appendChild(canvas)
        }
      } catch (err) {
        if (!cancelled) console.error('Failed to load PDF:', err)
      }
    }

    loadPdf()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="resume-page">
      <Link to="/" className="resume-back">← Back to ID</Link>
      <a href={resumePdf} download="Shanker_Resume.pdf" className="resume-download">
        Download Resume
      </a>
      <div ref={containerRef} className="resume-pdf-container" aria-label="Resume" />
    </div>
  )
}

export default ResumePage
