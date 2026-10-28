// The current pre-alpha release and the hosted hub. File names and sizes (bytes) come from the published release
// assets; the SHA-256 of each file is in the release's SHA256SUMS.txt. Update this when a release is replaced.
const base = 'https://github.com/ArefinAlter/ogun/releases/download/v0.1.0-alpha.1/'

export const RELEASE = {
  version: '0.1.0-alpha.1',
  tag: 'v0.1.0-alpha.1',
  title: 'Ogun 0.1.0-alpha.1 (Windows alpha)',
  date: '2026-10-29',
  page: 'https://github.com/ArefinAlter/ogun/releases/tag/v0.1.0-alpha.1',
  base,
  hosted: 'https://ogun.103.191.50.32.sslip.io',
  hostedLabel: 'Open the hosted hub',
  checksums: 'SHA256SUMS.txt',
  platforms: [
    {
      os: 'windows',
      req: '0.1.0-alpha.1. Windows 10 or 11, x64. Studio uses the WebView2 runtime that Windows includes.',
      primary: { kind: 'Ogun Studio installer', file: 'ogun-studio-0.1.0-alpha.1-windows-x64-setup.exe', size: 29802025 },
      more: [
        { kind: 'Ogun Studio, portable .zip', file: 'ogun-studio-0.1.0-alpha.1-windows-x64-portable.zip', size: 42717069 },
        { kind: 'ogun, ogund and ogun-server, .zip', file: 'ogun-runtime-0.1.0-alpha.1-windows-x64.zip', size: 47201557 },
      ],
    },
    {
      os: 'linux',
      base: 'https://github.com/ArefinAlter/ogun/releases/download/v0.0.1c/',
      page: 'https://github.com/ArefinAlter/ogun/releases/tag/v0.0.1c',
      req: 'Previous 0.0.1c pre-alpha. No Linux desktop alpha has been released. x64, glibc 2.35 or later. AppImage on most distributions, .deb for Debian and Ubuntu 22.04 or later.',
      primary: { kind: 'Ogun Studio', file: 'ogun-studio-0.0.1c-linux-x64.AppImage', size: 114031096 },
      more: [
        { kind: 'Ogun Studio, .deb package', file: 'ogun-studio-0.0.1c-linux-x64.deb', size: 40049466 },
        { kind: 'ogun, ogund and ogun-server, .tar.gz', file: 'ogun-0.0.1c-linux-x64.tar.gz', size: 38499351 },
      ],
    },
  ],
}
