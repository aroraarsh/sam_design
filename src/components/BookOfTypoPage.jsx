import WorkCategoryPage from './WorkCategoryPage'
import { bookOfTypoImages } from '../data/workImages'

function BookOfTypoPage() {
  return (
    <WorkCategoryPage
      title="TYPOGRAPHY"
      activeTab="typo"
      images={bookOfTypoImages}
    />
  )
}

export default BookOfTypoPage
