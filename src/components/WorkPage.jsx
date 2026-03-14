import WorkCategoryPage from './WorkCategoryPage'
import { brandingImages } from '../data/workImages'

function WorkPage() {
  return (
    <WorkCategoryPage
      title="BRANDING"
      activeTab="branding"
      images={brandingImages}
    />
  )
}

export default WorkPage
