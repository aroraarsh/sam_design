import { Link, useLocation } from 'react-router-dom'
import './WorkPage.css'

function WorkCategoryPage({ title, activeTab, images }) {
  const location = useLocation()
  const animateEntrance = Boolean(location.state?.fromId)
  const flipDirection = location.state?.flipDirection
  const animateFlip = flipDirection === 'left' || flipDirection === 'right'
  const categories = [
    { key: 'branding', label: 'BRANDING', path: '/work' },
    { key: 'social', label: 'SOCIAL MEDIA', path: '/social-media' },
    { key: 'typo', label: 'BOOK OF TYPOGRAPHY', path: '/book-of-typo' },
  ]
  const currentIndex = categories.findIndex((category) => category.key === activeTab)
  const prevCategory = currentIndex > 0 ? categories[currentIndex - 1] : null
  const nextCategory = currentIndex < categories.length - 1 ? categories[currentIndex + 1] : null
  const getDirection = (targetIndex) => {
    if (targetIndex === currentIndex) return null
    return targetIndex < currentIndex ? 'left' : 'right'
  }

  return (
    <div
      className={[
        'work-page',
        animateEntrance ? 'work-page--animate' : '',
        animateFlip ? `work-page--flip-${flipDirection}` : '',
      ]
        .join(' ')
        .trim()}
    >
      <Link to="/" className="work-back">← Back to ID</Link>

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

      <div className="work-gallery">
        {images.map((src, index) => (
          <div key={index} className="work-tile" style={{ '--tile-index': index }}>
            <img src={src} alt={`${title} ${index + 1}`} className="work-image" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default WorkCategoryPage
