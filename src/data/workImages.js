import heroPng from '../assets/hero.png'
import homeIdJpg from '../assets/home page id.jpg'

const assetModules = import.meta.glob('../assets/*.{png,jpg,jpeg,webp,avif}', {
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

function cycleToCount(items, count) {
  if (items.length === 0) return []
  return Array.from({ length: count }, (_, i) => items[i % items.length])
}

// Fallback pools ensure all pages render even before category-specific assets are added.
const basePool = uniqueSources(assetEntries)
const safePool = basePool.length > 0 ? basePool : [heroPng, homeIdJpg]

const brandingPool = uniqueSources(byKeywords(['brand', 'branding']))
const socialPool = uniqueSources(byKeywords(['social', 'media', 'instagram', 'reel']))
const typoPool = uniqueSources(byKeywords(['typo', 'typography', 'font', 'book']))

export const brandingImages = cycleToCount(brandingPool.length ? brandingPool : safePool, 12)
export const socialMediaImages = cycleToCount(
  socialPool.length ? socialPool : [...safePool].reverse(),
  12
)
export const bookOfTypoImages = cycleToCount(
  typoPool.length ? typoPool : [safePool[0], ...safePool.slice(1).reverse()],
  12
)
