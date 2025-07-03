import './styles/page.module.css'

export const metadata = {
  title: 'Kelvin\'s Personal Website',
  description: 'Personal website with secure communication examples',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
