import heroPng from '../assets/hero.png'
import homeIdJpg from '../assets/home page id.jpg'

const assetModules = import.meta.glob('../assets/**/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default',
})

const assetEntries = Object.entries(assetModules).map(([path, src]) => ({
  path: path.toLowerCase(),
  src,
}))

function byKeywords(keywords) {
  return assetEntries.filter((entry) => keywords.some((kw) => entry.path.includes(kw)))
}

function uniqueSources(list) {
  return [...new Set(list.map((item) => item.src))]
}

// Fallback pools ensure all pages render even before category-specific assets are added.
const basePool = uniqueSources(assetEntries)
const safePool = basePool.length > 0 ? basePool : [heroPng, homeIdJpg]

const brandingFolderPool = uniqueSources(
  assetEntries.filter((entry) => entry.path.includes('/assets/branding/'))
)
const brandingPool = uniqueSources(byKeywords(['brand', 'branding']))
const socialPool = uniqueSources(byKeywords(['social', 'media', 'instagram', 'reel']))
const typoPool = uniqueSources(byKeywords(['typo', 'typography', 'font', 'book']))

export const brandingImages =
  brandingFolderPool.length ? brandingFolderPool : brandingPool.length ? brandingPool : safePool
export const socialMediaImages = socialPool.length ? socialPool : [...safePool].reverse()
export const bookOfTypoImages =
  typoPool.length ? typoPool : [safePool[0], ...safePool.slice(1).reverse()]
