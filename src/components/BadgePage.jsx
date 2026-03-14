import { useNavigate } from 'react-router-dom'
import './BadgePage.css'
import badgeImage from '../assets/home page id.jpg'

function BadgePage() {
  const navigate = useNavigate()

  const handleBarcodeClick = () => navigate('/work', { state: { fromId: true } })
  const handleQRClick = () => navigate('/resume')

  return (
    <div className="badge-page">
      <div className="lanyard-string" aria-hidden />
      <div className="badge-image-wrap">
        <div className="badge-ring" aria-hidden />
        <img
          src={badgeImage}
          alt="ID badge"
          className="badge-image"
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
    </div>
  )
}

export default BadgePage
