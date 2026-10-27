// The current pre-alpha release and the hosted hub. File names and sizes (bytes) come from the published release
// assets; the SHA-256 of each file is in the release's SHA256SUMS.txt. Update this when a release is replaced.
const base = 'https://github.com/ArefinAlter/ogun/releases/download/v0.0.1b/'

export const RELEASE = {
  version: '0.0.1b',
  tag: 'v0.0.1b',
  title: 'Ogun 0.0.1b (pre-alpha)',
  date: '2026-10-27',
  page: 'https://github.com/ArefinAlter/ogun/releases/tag/v0.0.1b',
  base,
  hosted: 'https://ogun.103.191.50.32.sslip.io',
  hostedLabel: 'Open the hosted hub',
  checksums: 'SHA256SUMS.txt',
  platforms: [
    {
      os: 'windows',
      req: 'Windows 10 or 11, x64. Studio uses the WebView2 runtime that Windows includes.',
      primary: { kind: 'Ogun Studio installer', file: 'ogun-studio-0.0.1b-windows-x64-setup.exe', size: 29291482 },
      more: [
        { kind: 'Ogun Studio, portable .zip', file: 'ogun-studio-0.0.1b-windows-x64-portable.zip', size: 41606479 },
        { kind: 'ogun, ogund and ogun-server, .zip', file: 'ogun-0.0.1b-windows-x64.zip', size: 30720258 },
      ],
    },
    {
      os: 'linux',
      req: 'x64, glibc 2.35 or later. AppImage on most distributions, .deb for Debian and Ubuntu 22.04 or later.',
      primary: { kind: 'Ogun Studio', file: 'ogun-studio-0.0.1b-linux-x64.AppImage', size: 113560056 },
      more: [
        { kind: 'Ogun Studio, .deb package', file: 'ogun-studio-0.0.1b-linux-x64.deb', size: 39537416 },
        { kind: 'ogun, ogund and ogun-server, .tar.gz', file: 'ogun-0.0.1b-linux-x64.tar.gz', size: 37996127 },
      ],
    },
  ],
}
