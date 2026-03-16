import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import miniIdImage from '../assets/home page id.jpg'
import './WorkPage.css'

function WorkCategoryPage({ title, activeTab, images }) {
  const EXIT_TO_ID_DURATION_MS = 760
  const location = useLocation()
  const navigate = useNavigate()
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [isExitingToId, setIsExitingToId] = useState(false)
  const [openPdfSrc, setOpenPdfSrc] = useState(null)
  const animateEntrance = Boolean(location.state?.fromId)
  const flipDirection = location.state?.flipDirection
  const animateFlip = flipDirection === 'left' || flipDirection === 'right'
  const categories = [
    { key: 'branding', label: 'BRANDING', path: '/work' },
    { key: 'social', label: 'SOCIAL MEDIA', path: '/social-media' },
    { key: 'typo', label: 'TYPOGRAPHY', path: '/book-of-typo' },
  ]
  const currentIndex = categories.findIndex((category) => category.key === activeTab)
  const prevCategory = currentIndex > 0 ? categories[currentIndex - 1] : null
  const nextCategory = currentIndex < categories.length - 1 ? categories[currentIndex + 1] : null
  const getDirection = (targetIndex) => {
    if (targetIndex === currentIndex) return null
    return targetIndex < currentIndex ? 'left' : 'right'
  }
  const handleTileClick = (media, index) => {
    if (media.type === 'pdf') {
      setExpandedIndex(null)
      setOpenPdfSrc(media.src)
      return
    }
    if (activeTab === 'branding' && media.pdfSrc) {
      setExpandedIndex(null)
      setOpenPdfSrc(media.pdfSrc)
      return
    }
    setExpandedIndex((prev) => (prev === index ? null : index))
  }
  const handleBackToId = (event) => {
    event.preventDefault()
    if (isExitingToId) return
    setIsExitingToId(true)
    window.setTimeout(() => {
      navigate('/')
    }, EXIT_TO_ID_DURATION_MS)
  }

  useEffect(() => {
    if (!openPdfSrc) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpenPdfSrc(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [openPdfSrc])

  return (
    <div
      className={[
        'work-page',
        `work-page--${activeTab}`,
        animateEntrance ? 'work-page--animate' : '',
        isExitingToId ? 'work-page--exit' : '',
        animateFlip ? `work-page--flip-${flipDirection}` : '',
      ]
        .join(' ')
        .trim()}
    >
      <div className="work-bg-fade" aria-hidden />
      <Link to="/" className="work-back work-back-mini" onClick={handleBackToId} aria-label="Back to ID">
        <span className="work-back-lanyard" aria-hidden />
        <span className="work-back-card" aria-hidden>
          <span className="work-back-ring" />
          <img src={miniIdImage} alt="" className="work-back-image" />
        </span>
      </Link>

      <div className="work-copy">
        <p className="work-headline">WORK</p>
      </div>

      <div className="work-services-wrap">
        {prevCategory ? (
          <Link
            to={prevCategory.path}
            state={{ flipDirection: 'left' }}
            className="work-arrow-nav"
            aria-label={`Go to ${prevCategory.label}`}
          >
            ←
          </Link>
        ) : (
          <span className="work-arrow-nav work-arrow-nav--disabled" aria-hidden>
            ←
          </span>
        )}

        <div className="work-services" role="navigation" aria-label="Work categories">
          {categories.map((category, index) => {
            const direction = getDirection(index)
            return (
              <Link
                key={category.key}
                to={category.path}
                state={direction ? { flipDirection: direction } : undefined}
                className={`work-service ${activeTab === category.key ? 'work-service--active' : ''}`.trim()}
              >
                {category.label}
              </Link>
            )
          })}
        </div>

        {nextCategory ? (
          <Link
            to={nextCategory.path}
            state={{ flipDirection: 'right' }}
            className="work-arrow-nav"
            aria-label={`Go to ${nextCategory.label}`}
          >
            →
          </Link>
        ) : (
          <span className="work-arrow-nav work-arrow-nav--disabled" aria-hidden>
            →
          </span>
        )}
      </div>

      <div className={`work-gallery ${expandedIndex !== null ? 'work-gallery--has-expanded' : ''}`.trim()}>
        {images.map((media, index) => (
          <div
            key={index}
            className={[
              'work-tile',
              expandedIndex === index ? 'work-tile--expanded' : '',
              expandedIndex !== null && expandedIndex !== index ? 'work-tile--deemphasized' : '',
            ]
              .join(' ')
              .trim()}
            style={{ '--tile-index': index }}
          >
            <button
              type="button"
              className="work-tile-trigger"
              onClick={() => handleTileClick(media, index)}
              aria-label={
                media.type === 'pdf' || media.pdfSrc
                  ? `Open ${title} PDF ${index + 1}`
                  : `Expand ${title} ${index + 1}`
              }
            >
              {media.type === 'video' ? (
                <video
                  src={media.src}
                  className="work-image"
                  controls={expandedIndex === index}
                  muted
                  loop
                  autoPlay
                  playsInline
                  preload="metadata"
                />
              ) : media.type === 'pdf' ? (
                media.coverSrc ? (
                  <div className="work-pdf-tile work-pdf-tile--cover" aria-hidden>
                    <img
                      src={media.coverSrc}
                      alt=""
                      className="work-image work-pdf-cover-image"
                    />
                  </div>
                ) : (
                  <div className="work-pdf-tile" aria-hidden>
                    <span className="work-pdf-tile-kicker">PDF</span>
                    <span className="work-pdf-tile-title">{media.name || `Document ${index + 1}`}</span>
                  </div>
                )
              ) : (
                <img src={media.src} alt={`${title} ${index + 1}`} className="work-image" />
              )}
            </button>
          </div>
        ))}
      </div>

      {openPdfSrc ? (
        <div className="work-pdf-modal" role="dialog" aria-modal="true" aria-label="PDF viewer">
          <button
            type="button"
            className="work-pdf-backdrop"
            aria-label="Close PDF popup"
            onClick={() => setOpenPdfSrc(null)}
          />
          <div className="work-pdf-frame">
            <button
              type="button"
              className="work-pdf-close"
              onClick={() => setOpenPdfSrc(null)}
              aria-label="Close PDF popup"
            >
              ×
            </button>
            <iframe
              src={`${openPdfSrc}#view=FitH`}
              className="work-pdf-embed"
              title="PDF"
            />
          </div>
        </div>
      ) : null}

      <footer className="work-footer" aria-label="Social links">
        <a
          href="https://www.instagram.com/saammm.svg"
          target="_blank"
          rel="noreferrer"
          className="work-footer-link"
        >
          Instagram
        </a>
        <span className="work-footer-separator" aria-hidden>
          /
        </span>
        <a
          href="https://www.linkedin.com/in/samriddhy-shanker/"
          target="_blank"
          rel="noreferrer"
          className="work-footer-link"
        >
          LinkedIn
        </a>
      </footer>
    </div>
  )
}

export default WorkCategoryPage
