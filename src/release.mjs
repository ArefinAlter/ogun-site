// The current pre-alpha release and the hosted hub. File names and sizes (bytes) come from the published release
// assets; the SHA-256 of each file is in the release's SHA256SUMS. Update this when a release is replaced.
const base = 'https://github.com/ArefinAlter/ogun/releases/download/v0.0.1a/'

export const RELEASE = {
  version: '0.0.1a',
  tag: 'v0.0.1a',
  title: 'Ogun 0.0.1a (pre-alpha)',
  date: '2026-10-25',
  page: 'https://github.com/ArefinAlter/ogun/releases/tag/v0.0.1a',
  base,
  hosted: 'https://ogun.103.191.50.32.sslip.io',
  hostedLabel: 'Open the hosted hub',
  checksums: 'SHA256SUMS',
  platforms: [
    {
      os: 'windows',
      req: 'Windows 10 or 11, x64. Studio uses the WebView2 runtime that Windows includes.',
      primary: { kind: 'Ogun Studio installer', file: 'ogun-studio-0.0.1a-windows-x64-setup.exe', size: 3275318 },
      more: [
        { kind: 'Ogun Studio, portable .zip', file: 'ogun-studio-0.0.1a-windows-x64-portable.zip', size: 4400608 },
        { kind: 'ogun and ogund (CLI and daemon), .zip', file: 'ogun-0.0.1a-windows-x64.zip', size: 11712225 },
      ],
    },
    {
      os: 'linux',
      req: 'x64, glibc 2.35 or later. AppImage on most distributions, .deb for Debian and Ubuntu 22.04 or later.',
      primary: { kind: 'Ogun Studio', file: 'ogun-studio-0.0.1a-linux-x64.AppImage', size: 83343864 },
      more: [
        { kind: 'Ogun Studio, .deb package', file: 'ogun-studio-0.0.1a-linux-x64.deb', size: 5187010 },
        { kind: 'ogun and ogund (CLI and daemon), .tar.gz', file: 'ogun-0.0.1a-linux-x64.tar.gz', size: 13483789 },
      ],
    },
  ],
}
