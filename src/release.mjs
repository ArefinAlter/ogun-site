// The current pre-alpha release and the hosted hub. Sizes and SHA-256 come from the published release
// (SHA256SUMS in the release); update them when a release is replaced.
export const RELEASE = {
  version: '0.0.1a',
  tag: 'v0.0.1a',
  title: 'Ogun 0.0.1a (pre-alpha)',
  date: '2026-10-25',
  page: 'https://github.com/ArefinAlter/ogun/releases/tag/v0.0.1a',
  base: 'https://github.com/ArefinAlter/ogun/releases/download/v0.0.1a/',
  hosted: 'https://ogun.103.191.50.32.sslip.io',
  assets: [
    { name: 'ogun-studio-0.0.1a-windows-x64-setup.exe', for: 'Ogun Studio, Windows x64 installer', size: 3275318, sha256: '98db64bc782e4a11c3a3f7236062d33432aeb08ebdf1ae55df9051f1529c9c45' },
    { name: 'ogun-studio-0.0.1a-windows-x64-portable.zip', for: 'Ogun Studio, Windows x64 portable', size: 4400608, sha256: '31b6d420fce2520124230da8c2d37db7891c422f35057b68a60b5ad3ea294176' },
    { name: 'ogun-studio-0.0.1a-linux-x64.AppImage', for: 'Ogun Studio, Linux x64 AppImage', size: 83343864, sha256: 'dba002324c93f041210a16f89c2dae0fa0417cf814d557d4ed114ca1a733177a' },
    { name: 'ogun-studio-0.0.1a-linux-x64.deb', for: 'Ogun Studio, Debian and Ubuntu x64', size: 5187010, sha256: 'e86fa68a2097fae83d6f1c5eb1846533758cea01e6bcd4c95cad5533d3c96135' },
    { name: 'ogun-0.0.1a-windows-x64.zip', for: 'ogun and ogund, Windows x64', size: 11712225, sha256: 'c32634b471ae5842255711c2debac183955721813a017b73f10e6388f66243ff' },
    { name: 'ogun-0.0.1a-linux-x64.tar.gz', for: 'ogun and ogund, Linux x64', size: 13483789, sha256: '1e9a6fc525c67e9ec021a88c6e93d420b86519d9fe51380445aaf4f253f255d8' },
  ],
}

export const fmtSize = (n) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`)
