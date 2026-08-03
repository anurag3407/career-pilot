export const pwaOptions = {
  registerType: 'autoUpdate',
  includeAssets: ['user.svg', 'pwa-192x192.jpg', 'pwa-512x512.jpg'],
  manifest: {
    name: 'Career Pilot',
    short_name: 'CareerPilot',
    description: 'AI-powered career platform',
    theme_color: '#000000',
    background_color: '#000000',
    display: 'standalone',
    icons: [
      {
        src: 'pwa-192x192.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
        purpose: 'any'
      },
      {
        src: 'pwa-512x512.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
        purpose: 'any'
      },
      {
        src: 'pwa-192x192.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
        purpose: 'maskable'
      },
      {
        src: 'pwa-512x512.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
        purpose: 'maskable'
      }
    ]
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,json}'],
    globIgnores: ['templates/**/*', 'template-previews/**/*'],
    maximumFileSizeToCacheInBytes: 5000000
  }
}
