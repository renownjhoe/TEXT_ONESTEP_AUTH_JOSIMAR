import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'

const cache = createCache({
  key: 'css',
  prepend: true
})

export default function EmotionProvider({ children }) {
  return <CacheProvider value={cache}>{children}</CacheProvider>
}