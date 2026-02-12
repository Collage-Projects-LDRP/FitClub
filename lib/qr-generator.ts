// QR Code generation utility for consistent QR codes across the app

export function generateUserQRCode(userId: number, username: string): string {
  // Create consistent QR pattern based on user ID
  const patterns = [
    "M10,10 L30,10 L30,30 L10,30 Z M70,10 L90,10 L90,30 L70,30 Z M10,70 L30,70 L30,90 L10,90 Z",
    "M15,15 L25,15 L25,25 L15,25 Z M75,15 L85,15 L85,25 L75,25 Z M15,75 L25,75 L25,85 L15,85 Z",
    "M12,12 L28,12 L28,28 L12,28 Z M72,12 L88,12 L88,28 L72,28 Z M12,72 L28,72 L28,88 L12,88 Z",
    "M8,8 L32,8 L32,32 L8,32 Z M68,8 L92,8 L92,32 L68,32 Z M8,68 L32,68 L32,92 L8,92 Z",
    "M14,14 L26,14 L26,26 L14,26 Z M74,14 L86,14 L86,26 L74,26 Z M14,74 L26,74 L26,86 L14,86 Z",
  ]

  const patternIndex = userId % patterns.length
  const pattern = patterns[patternIndex]

  // Generate additional unique elements based on user ID
  const uniqueElements = []
  for (let i = 0; i < 8; i++) {
    const x = 20 + ((userId + i) % 6) * 10
    const y = 20 + ((userId + i * 2) % 6) * 10
    uniqueElements.push(`<rect x="${x}" y="${y}" width="4" height="4" fill="black"/>`)
  }

  // Create border pattern based on user ID
  const borderElements = []
  for (let i = 0; i < 4; i++) {
    const side = i % 4
    let x, y, width, height

    switch (side) {
      case 0: // top
        x = 35 + (userId % 3) * 10
        y = 5
        width = 8
        height = 3
        break
      case 1: // right
        x = 92
        y = 35 + (userId % 3) * 10
        width = 3
        height = 8
        break
      case 2: // bottom
        x = 35 + ((userId + 1) % 3) * 10
        y = 92
        width = 8
        height = 3
        break
      case 3: // left
        x = 5
        y = 35 + ((userId + 2) % 3) * 10
        width = 3
        height = 8
        break
    }

    borderElements.push(`<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="black"/>`)
  }

  const svgContent = `
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="white" rx="8"/>
      <path d="${pattern}" fill="black"/>
      <rect x="40" y="40" width="20" height="20" fill="black"/>
      ${uniqueElements.join("")}
      ${borderElements.join("")}
      <rect x="20" y="45" width="10" height="10" fill="black"/>
      <rect x="70" y="45" width="10" height="10" fill="black"/>
      <rect x="45" y="20" width="10" height="10" fill="black"/>
      <rect x="45" y="70" width="10" height="10" fill="black"/>
      <text x="50" y="55" text-anchor="middle" font-size="6" fill="white" font-weight="bold">VOTE</text>
    </svg>
  `

  return `data:image/svg+xml;base64,${btoa(svgContent)}`
}

export function generateQRCodeForOverlay(userId: number, username: string): string {
  // Use the same QR generation logic for consistency
  return generateUserQRCode(userId, username)
}
