import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './BadgePage.css'
import badgeImage from '../assets/home page id.jpg'

function BadgePage() {
  const navigate = useNavigate()
  const [isExiting, setIsExiting] = useState(false)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    const hintTimer = window.setTimeout(() => {
      setShowHint(true)
    }, 5000)

    return () => {
      window.clearTimeout(hintTimer)
    }
  }, [])

  const startExitAndNavigate = (path, state) => {
    if (isExiting) return
    setIsExiting(true)
    window.setTimeout(() => {
      navigate(path, state ? { state } : undefined)
    }, 640)
  }

  const handleBarcodeClick = () => startExitAndNavigate('/work', { fromId: true })
  const handleQRClick = () => startExitAndNavigate('/resume')

  return (
    <div className={`badge-page ${isExiting ? 'badge-page--exit' : ''}`.trim()}>
      <div className="lanyard-string" aria-hidden />
      <div className="badge-image-wrap">
        <div className="badge-ring" aria-hidden />
        <img
          src={badgeImage}
          alt="ID badge"
          className="badge-image"
          draggable={false}
        />
        <button
          type="button"
          className="badge-barcode-hit"
          onClick={handleBarcodeClick}
          aria-label="Go to work"
          title="Go to work"
        />
        <button
          type="button"
          className="badge-qr-hit"
          onClick={handleQRClick}
          aria-label="Go to resume"
          title="Go to resume"
        />
      </div>
      <p className={`badge-hint ${showHint && !isExiting ? 'badge-hint--visible' : ''}`.trim()}>
        Click the Work barcode to open portfolio. Click the Resume QR code to open resume.
      </p>
    </div>
  )
}

export default BadgePage
