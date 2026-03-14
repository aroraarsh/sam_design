import WorkCategoryPage from './WorkCategoryPage'
import { socialMediaImages } from '../data/workImages'

function SocialMediaPage() {
  return (
    <WorkCategoryPage
      title="SOCIAL MEDIA"
      activeTab="social"
      images={socialMediaImages}
    />
  )
}

export default SocialMediaPage
