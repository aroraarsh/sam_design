import heroPng from '../assets/hero.png'
import homeIdJpg from '../assets/home page id.jpg'

const assetModules = import.meta.glob('../assets/**/*.{png,jpg,jpeg,webp,avif,mp4,mov,webm}', {
  eager: true,
  import: 'default',
})
const pdfModules = import.meta.glob('../assets/**/*.pdf', {
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
const pdfEntries = Object.entries(pdfModules).map(([path, src]) => ({
  path: path.toLowerCase(),
  src,
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

function normalizedBaseName(path) {
  const base = fileNameFromPath(path).replace(/\.[^.]+$/, '')
  return base.toLowerCase().replace(/[^a-z0-9]/g, '')
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

const pdfByBaseName = new Map(
  pdfEntries.map((entry) => [normalizedBaseName(entry.path), entry.src])
)

function attachPdfMatch(entries) {
  return entries.map((entry) => {
    if (entry.type !== 'image') return entry
    const pdfSrc = pdfByBaseName.get(normalizedBaseName(entry.path))
    return pdfSrc ? { ...entry, pdfSrc } : entry
  })
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
const typographyFolderPool = uniqueMediaSorted(
  assetEntries.filter(
    (entry) =>
      entry.path.includes('/assets/typography/') &&
      !entry.path.includes('/assets/typography/cover/')
  )
)
const typographyCoverByBaseName = new Map(
  assetEntries
    .filter(
      (entry) =>
        entry.type === 'image' && entry.path.includes('/assets/typography/cover/')
    )
    .map((entry) => [normalizedBaseName(entry.path), entry.src])
)
const typographyPdfPool = sortByFileNumber(
  pdfEntries
    .filter((entry) => entry.path.includes('/assets/typography/'))
    .map((entry) => ({
      path: entry.path,
      src: entry.src,
      type: 'pdf',
      name: fileNameFromPath(entry.path).replace(/\.pdf$/i, ''),
      coverSrc: typographyCoverByBaseName.get(normalizedBaseName(entry.path)),
    }))
)
const brandingPool = uniqueMediaSorted(byKeywords(['brand', 'branding']))
const socialPool = uniqueMediaSorted(byKeywords(['social', 'media', 'instagram', 'reel']))

export const brandingImages =
  attachPdfMatch(
    brandingFolderPool.length ? brandingFolderPool : brandingPool.length ? brandingPool : safePool
  )
export const socialMediaImages =
  attachPdfMatch(
    socialFolderPool.length ? socialFolderPool : socialPool.length ? socialPool : [...safePool].reverse()
  )
export const bookOfTypoImages = [...attachPdfMatch(typographyFolderPool), ...typographyPdfPool]
