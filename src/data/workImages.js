import heroPng from '../assets/hero.png'
import homeIdJpg from '../assets/home page id.jpg'

const assetModules = import.meta.glob('../assets/**/*.{png,jpg,jpeg,webp,avif,mp4,mov,webm}', {
  eager: true,
  import: 'default',
})

function mediaTypeFromPath(path) {
  return /\.(mp4|mov|webm)$/i.test(path) ? 'video' : 'image'
}

const assetEntries = Object.entries(assetModules).map(([path, src]) => ({
  path: path.toLowerCase(),
  src,
  type: mediaTypeFromPath(path),
}))

function byKeywords(keywords) {
  return assetEntries.filter((entry) => keywords.some((kw) => entry.path.includes(kw)))
}

function uniqueMedia(list) {
  const seen = new Set()
  return list.filter((item) => {
    if (seen.has(item.src)) return false
    seen.add(item.src)
    return true
  })
}

function fileNameFromPath(path) {
  return path.split('/').pop() || ''
}

function fileNumber(path) {
  const match = fileNameFromPath(path).match(/\d+/)
  return match ? Number(match[0]) : Number.POSITIVE_INFINITY
}

function sortByFileNumber(entries) {
  return [...entries].sort((a, b) => {
    const numDiff = fileNumber(a.path) - fileNumber(b.path)
    if (numDiff !== 0) return numDiff
    return fileNameFromPath(a.path).localeCompare(fileNameFromPath(b.path), undefined, {
      numeric: true,
      sensitivity: 'base',
    })
  })
}

function uniqueMediaSorted(entries) {
  return uniqueMedia(sortByFileNumber(entries))
}

// Fallback pools ensure all pages render even before category-specific assets are added.
const basePool = uniqueMedia(assetEntries)
const safePool =
  basePool.length > 0
    ? basePool
    : [
        { src: heroPng, type: 'image', path: 'fallback/hero.png' },
        { src: homeIdJpg, type: 'image', path: 'fallback/home page id.jpg' },
      ]

const brandingFolderPool = uniqueMediaSorted(
  assetEntries.filter((entry) => entry.path.includes('/assets/branding/'))
)
const socialFolderPool = uniqueMediaSorted(
  assetEntries.filter((entry) => entry.path.includes('/assets/social media/'))
)
const brandingPool = uniqueMediaSorted(byKeywords(['brand', 'branding']))
const socialPool = uniqueMediaSorted(byKeywords(['social', 'media', 'instagram', 'reel']))
const typoPool = uniqueMediaSorted(byKeywords(['typo', 'typography', 'font', 'book']))

export const brandingImages =
  brandingFolderPool.length ? brandingFolderPool : brandingPool.length ? brandingPool : safePool
export const socialMediaImages =
  socialFolderPool.length ? socialFolderPool : socialPool.length ? socialPool : [...safePool].reverse()
export const bookOfTypoImages =
  typoPool.length ? typoPool : [safePool[0], ...safePool.slice(1).reverse()]
