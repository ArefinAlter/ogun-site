// Legal pages, generated from one source so both product sites stay consistent.
// The product-specific parts come from the `product` argument; company facts come from site.config.mjs.
// Facts here mirror the software's design (specs, ADRs) and the extension's PRIVACY.md and PERMISSIONS.md.
import { docPage, note, pageHead } from './parts.mjs'
import { esc } from '../lib/html.mjs'

const EFFECTIVE = '2026-10-06'

const meta = (cfg) => `<span>Effective ${EFFECTIVE}</span><span>Last updated ${cfg.updated}</span><span>Applies to ${esc(cfg.url.replace('https://', ''))} and ${esc(cfg.name)}</span>`

function legalPage(cfg, { slug, title, h1, nav, description, lede, sections, aside = '' }) {
  const path = `/legal/${slug}/`
  return {
    path,
    order: 60,
    group: 'Legal',
    nav,
    priority: 0.3,
    product: false,
    updated: cfg.updated,
    title,
    description,
    crumbs: [{ name: 'Legal', path: '/legal/' }, { name: nav, path }],
    ogType: 'article',
    article: { type: 'Article', headline: h1.replace(/<[^>]+>/g, '') },
    body: () => `${pageHead({ crumbs: [{ name: 'Legal', path: '/legal/' }, { name: nav, path }], title: h1, lede, meta: meta(cfg) })}${docPage({ sections, aside })}`,
  }
}

export function legalPages(cfg, product) {
  const o = cfg.org
  const P = esc(cfg.name)
  const addr = `${o.legalName}, ${o.address.street}, ${o.address.neighborhood}, ${o.address.city}-${o.address.postalCode}, ${o.address.countryName}`
  const mail = (m = cfg.contacts.general) => `<a href="mailto:${m}">${m}</a>`
  const host = cfg.hosting

  const privacy = legalPage(cfg, {
    slug: 'privacy',
    nav: 'Privacy policy',
    title: `Privacy policy: ${cfg.name} by Verne`,
    h1: 'Privacy policy',
    description: `How ${cfg.name} and this website handle personal data: no cookies, no analytics, no telemetry. What we process when you email us, and your rights.`,
    lede: `The short version: this website uses no cookies and no analytics, ${P} sends no telemetry, and we only process personal data when you write to us.`,
    sections: [
      { id: 'summary', title: 'Summary', body: `<ul><li><strong>This website</strong> sets no cookies, uses no analytics, no tracking pixels and no third-party scripts or fonts. Our hosting provider processes basic request data (such as IP addresses) to deliver the pages and keep them secure.</li><li><strong>The ${P} software</strong> runs on your computer and sends nothing to Verne: no telemetry, no crash reports, no account. Your history, settings and permissions stay on your device.</li>${product.hasExtension ? `<li><strong>The ${P} browser extension</strong> collects nothing and sends nothing to any server. Its details are in the <a href="/legal/extension-privacy/">extension privacy policy</a>.</li>` : ''}<li><strong>If you email us</strong>, for example to ask for early access, we use your address and message to reply, and nothing else.</li></ul>` },
      { id: 'controller', title: 'Who is responsible', body: `<p>The controller for the processing described here is ${esc(addr)}. Contact: ${mail(cfg.contacts.privacy)}, ${esc(o.phone)}. ${P} is a product of ${esc(o.legalName)} ("Verne", "we", "us").</p>` },
      { id: 'scope', title: 'What this policy covers', body: `<p>This policy covers the website at ${esc(cfg.url)}, the ${P} software${product.hasExtension ? ' and browser extension' : ''}, and messages you send us. It does not cover websites you download from, AI assistants or other tools you connect to ${P}, or third-party sites we link to; each has its own terms and policies.</p>` },
      { id: 'website', title: 'This website', body: `<h3>What is processed</h3><p>When you load a page, your browser sends a request that includes your IP address, the page address, the time, your browser’s user agent and, sometimes, the address of the page that linked here. Our hosting provider, ${esc(host.name)}, processes this request data to deliver the site and to protect it against abuse, and may keep it in server logs for a short period under its own retention rules (see its <a href="${host.privacy}">privacy policy</a>). We do not use this data to identify you, and we do not combine it with other data.</p><h3>What is not processed</h3><p>No cookies, no local storage, no analytics or session recording, no advertising, no fingerprinting, no social-media embeds and no third-party scripts. Fonts and artwork are served from this site itself. Our <a href="/legal/cookies/">cookie notice</a> has the details.</p><h3>Machine-readable files</h3><p>We publish files such as <code>llms.txt</code> and <code>sitemap.xml</code> so search and answer engines can read the site. Fetching them is like loading any page.</p>` },
      { id: 'software', title: `The ${P} software`, body: product.softwarePrivacy },
      ...(product.hasExtension ? [{ id: 'extension', title: 'The browser extension', body: `<p>The extension collects no data and sends nothing to any server. When you approve a website, it reads that one site’s cookies only when the ${P} app on the same computer asks for them for your download, and passes them to the app through the browser’s native-messaging channel. They are never stored, logged or sent anywhere else. Full details: <a href="/legal/extension-privacy/">extension privacy policy</a>.</p>` }] : []),
      { id: 'assistants', title: 'AI assistants and other tools you connect', body: `<p>If you connect an AI assistant to ${P} (for example through the Model Context Protocol), ${P} returns information about your jobs to that assistant, such as file names, sizes, folders, status and checksums. ${P} redacts secrets such as tokens and signed-link parameters from what it returns and never returns cookies or credentials. What your assistant does with the information is governed by your assistant provider’s terms and privacy policy, not by us.</p>` },
      { id: 'email', title: 'When you contact us', body: `<p>If you email us (including to ask for early access), we process your email address, name if given, and your message to reply and, for early access, to send you a notification when ${P} is ready to try. We do not add you to marketing lists without asking. We keep the correspondence for as long as needed to handle it and for up to 24 months after our last exchange, unless you ask us to delete it sooner or the law requires us to keep it. Our email service provider processes these messages on our behalf.</p>` },
      { id: 'bases', title: 'Legal bases', body: `<p>Where laws such as the EU or UK General Data Protection Regulation apply, we rely on: <strong>legitimate interests</strong> for delivering and securing the website and replying to messages; <strong>consent</strong> for early-access notifications (you can withdraw it at any time); and <strong>legal obligations</strong> where we must keep or disclose information.</p>` },
      { id: 'sharing', title: 'Sharing and transfers', body: `<p>We do not sell or rent personal data and we do not share it for advertising. Our service providers (hosting and email) process data only on our instructions. Verne is based in Bangladesh and our providers may process data in the United States and other countries; where required, we rely on appropriate safeguards such as standard contractual clauses. We may disclose information if the law requires it or to protect our users, the public or Verne.</p>` },
      { id: 'security', title: 'Security', body: `<p>The website is static, served over HTTPS with strict security headers and no third-party code. The ${P} software is designed so that secrets are never logged or written to disk, and approvals can only be given by a person. Read more in our <a href="/legal/security/">security policy</a>.</p>` },
      { id: 'rights', title: 'Your rights', body: `<p>Depending on where you live, you may have the right to access, correct, delete, restrict or object to the processing of your personal data, to data portability, and to withdraw consent. To exercise these rights, write to ${mail(cfg.contacts.privacy)}; we will reply within 30 days. You can also complain to your local data protection authority. Data that ${P} keeps on your own computer is under your control: you can view and delete it there.</p>` },
      { id: 'children', title: 'Children', body: `<p>This website and ${P} are not directed at children under 13, and we do not knowingly collect their personal data. If you believe a child has sent us personal data, contact us and we will delete it.</p>` },
      { id: 'changes', title: 'Changes to this policy', body: `<p>We will update this page if our practices change, and change the "last updated" date above. If a change is significant, we will say so at the top of this page. Earlier versions are kept in the website’s source history.</p>` },
      { id: 'contact', title: 'Contact', body: `<p>${mail(cfg.contacts.privacy)} · ${esc(addr)}.</p>` },
    ],
  })

  const cookies = legalPage(cfg, {
    slug: 'cookies',
    nav: 'Cookie notice',
    title: `Cookie notice: ${cfg.name} uses no cookies`,
    h1: 'Cookie notice',
    description: `This website sets no cookies and uses no local storage, analytics or tracking. That is why there is no cookie banner. Here is exactly what we mean.`,
    lede: 'There is no cookie banner on this site because there are no cookies to ask about.',
    sections: [
      { id: 'none', title: 'No cookies, no trackers', body: `<p>This website does not set any cookies, first-party or third-party. It does not use local storage, session storage or similar technologies, and it contains no analytics, advertising, tracking pixels, fingerprinting or session recording.</p>` },
      { id: 'third', title: 'No third-party content', body: `<p>Every file this site loads, including fonts, scripts, styles and artwork, is served from this site. Nothing is loaded from other domains, so no third party learns that you visited. Links to other sites only take effect if you click them.</p>` },
      { id: 'host', title: 'Our hosting provider', body: `<p>Our hosting provider, ${esc(host.name)}, receives the technical data any web request contains (see the <a href="/legal/privacy/#website">privacy policy</a>). It does not set cookies on this site on our behalf.</p>` },
      { id: 'product', title: `Cookies inside the ${P} software`, body: product.hasExtension ? `<p>The ${P} software is not this website. When you approve a website, ${P} can use that site’s login cookies for your download, in memory, for at most 15 minutes, without storing them. See <a href="/safety/#cookies">how Zeus handles logins</a> and the <a href="/legal/extension-privacy/">extension privacy policy</a>.</p>` : `<p>The ${P} software is not this website and sets no cookies of its own. Credentials you give ${P} for data sources are kept on your computer, never sent to Verne, and never logged.</p>` },
      { id: 'changes', title: 'Changes', body: `<p>If we ever introduce a cookie or similar technology, we will update this notice first and, where the law requires it, ask for your consent before setting it.</p>` },
    ],
  })

  const terms = legalPage(cfg, {
    slug: 'terms',
    nav: 'Terms of use',
    title: `Terms of use: ${cfg.name} website and software`,
    h1: 'Terms of use',
    description: `The terms for using the ${cfg.name} website, how the Apache-2.0 license governs the software, the pre-alpha disclaimer, liability and governing law.`,
    lede: `These terms govern this website. The ${P} software itself is licensed to you under Apache-2.0, and nothing here takes away the rights that license gives you.`,
    sections: [
      { id: 'agreement', title: 'Agreement', body: `<p>These terms of use ("terms") are an agreement between you and ${esc(o.legalName)} about your use of ${esc(cfg.url)} ("the site") and any ${P} materials we publish there. By using the site you agree to these terms. If you do not agree, please do not use the site.</p>` },
      { id: 'license', title: 'The software license', body: `<p>${P} is open-source software licensed under the <a href="https://www.apache.org/licenses/LICENSE-2.0">Apache License, Version 2.0</a>. Your rights to use, copy, modify and distribute the software are set out in that license, together with its warranty disclaimer and limitation of liability. These terms do not restrict those rights. The license does not grant rights in our names or logos; see the <a href="/legal/trademark/">trademark policy</a>.</p>` },
      { id: 'status', title: 'Pre-alpha status', body: `<p>${P} is in pre-alpha. Descriptions on this site describe the intended design and may change before release. Anything we publish before a stable release may be incomplete, may not work as described and should not be relied on for important data.</p>` },
      { id: 'use', title: 'Using the site', body: `<p>You may browse, read, link to and share the site for any lawful purpose. Please do not: attempt to break or overload the site; access it in ways that bypass its security; use it to distribute malware; or misrepresent your affiliation with Verne.</p>` },
      { id: 'responsibility', title: 'Your responsibility for downloads', body: `<p>${P} is a tool that acts on your instructions or on the instructions of AI agents you connect. You are responsible for what you, and agents acting for you, ask it to do, including complying with copyright law, the terms of the websites you download from and our <a href="/legal/acceptable-use/">acceptable use policy</a>. Review approval requests before you accept them.</p>` },
      { id: 'ip', title: 'Our content and marks', body: `<p>The text, design, artwork and logos on this site are © ${esc(o.legalName)} unless stated otherwise. The source code of this website is open source; see <a href="/legal/licenses/">licenses</a>. ${P}, the ${P} logo, Verne and the Verne logo are trademarks of ${esc(o.legalName)} and may be used only as described in the <a href="/legal/trademark/">trademark policy</a>. Names of other products, such as AI assistants we mention, belong to their owners and are used only to describe compatibility.</p>` },
      { id: 'links', title: 'Third-party sites and services', body: `<p>The site links to other websites and mentions third-party services, such as AI assistants and browsers. We do not control them and are not responsible for their content, availability or practices.</p>` },
      { id: 'disclaimer', title: 'Disclaimer', body: `<p>The site and its content are provided "as is" and "as available", without warranties of any kind, express or implied, including warranties of merchantability, fitness for a particular purpose and non-infringement, to the fullest extent the law allows. The software is provided under the warranty disclaimer in the Apache-2.0 license.</p>` },
      { id: 'liability', title: 'Limitation of liability', body: `<p>To the fullest extent the law allows, Verne is not liable for any indirect, incidental, special, consequential or punitive damages, or for loss of data, profits or goodwill, arising from your use of the site. Nothing in these terms limits liability that cannot be limited by law, such as liability for fraud.</p>` },
      { id: 'changes', title: 'Changes', body: `<p>We may update these terms by posting a new version on this page with a new "last updated" date. If you keep using the site after that date, the updated terms apply.</p>` },
      { id: 'law', title: 'Governing law and disputes', body: `<p>These terms are governed by the laws of Bangladesh, without regard to conflict-of-law principles. Disputes arising from the site or these terms will be resolved in the competent courts of Dhaka, except that either party may seek injunctive relief anywhere to protect its intellectual property. If you are a consumer, you keep any protections the law of your country gives you.</p>` },
      { id: 'general', title: 'General', body: `<p>If any part of these terms is found unenforceable, the rest remains in effect. Not enforcing a provision is not a waiver. These terms, together with the policies they reference, are the whole agreement about the site.</p>` },
      { id: 'contact', title: 'Contact', body: `<p>${mail(cfg.contacts.legal)} · ${esc(addr)}.</p>` },
    ],
  })

  const aup = legalPage(cfg, {
    slug: 'acceptable-use',
    nav: 'Acceptable use',
    title: `Acceptable use policy: ${cfg.name} by Verne`,
    h1: 'Acceptable use',
    description: `How ${cfg.name} may and may not be used: lawful downloads only, no circumventing access controls, captchas or copy protection, respect for websites and people.`,
    lede: `${P} is built to be a good citizen of the web. This policy says how we expect it to be used and what we will not support.`,
    sections: [
      { id: 'relation', title: 'How this policy relates to the license', body: `<p>Your rights to the ${P} source code come from the Apache-2.0 license, and this policy does not change them. This policy applies to our website and any services we operate, sets out what we will and will not help with, and states the uses ${P} is designed to refuse.</p>` },
      { id: 'ok', title: 'Use it for', body: `<ul><li>Downloading files you have the right to access and keep: public files, your own data, and content your accounts are entitled to.</li><li>Letting your AI assistant fetch such files for you, with your approval for anything that uses a login.</li>${product.aupOk || ''}</ul>` },
      { id: 'not', title: 'Do not use it to', body: `<ul><li>Infringe copyright or other rights, or download content you are not allowed to access.</li><li>Get around paywalls, access controls, copy protection (DRM) or other technical protection measures.</li><li>Solve or bypass captchas, bot checks or rate limits, or disguise automated traffic as a person or a browser.</li><li>Use another person’s login or session without their permission, or share sessions with others.</li><li>Collect personal data in breach of privacy law, or for stalking, harassment or unlawful surveillance.</li><li>Overload, disrupt or attack websites or services, including by ignoring their limits.</li><li>Distribute malware or download it for use against others.</li><li>Break the terms of service of the sites you download from where those terms are lawful and apply to you.</li>${product.aupNot || ''}</ul>` },
      { id: 'design', title: 'What the software refuses by design', body: `<p>${P} does not include captcha solving, browser impersonation or copy-protection removal, and it will not add them. ${product.aupDesign}</p>` },
      { id: 'agents', title: 'AI agents act on your behalf', body: `<p>When an AI agent uses ${P}, it acts for you. You are responsible for its requests. ${P} limits what agents can do (they can never approve anything or see credentials), but you should still read every approval request before accepting it.</p>` },
      { id: 'report', title: 'Reporting misuse', body: `<p>If you believe ${P} is being used against your website or your rights, write to ${mail(cfg.contacts.legal)} with details. Because ${P} runs on users’ own computers, we cannot see or stop individual downloads, but we take reports seriously, will not support abusive use and will cooperate with lawful requests.</p>` },
    ],
  })

  const trademark = legalPage(cfg, {
    slug: 'trademark',
    nav: 'Trademark policy',
    title: `Trademark policy: using the ${cfg.name} name and logo`,
    h1: 'Trademark policy',
    description: `How you may refer to ${cfg.name} and use its logo, what forks must do, and what needs our permission. The open-source license does not cover our marks.`,
    lede: `${P} is open source; its name and logo are not. This policy keeps the name meaningful, so people know what they are getting.`,
    sections: [
      { id: 'marks', title: 'Our marks', body: `<p>${esc(o.legalName)} uses the following as trademarks: the name ${P} as applied to download and data software and services, the ${P} logo, mark and wordmark, ${esc(product.otherMarks)}, and the Verne name and V mark. The Apache-2.0 license (section 6) does not grant permission to use them.</p>` },
      { id: 'ok', title: 'You may, without asking', body: `<ul><li>Refer to ${P} by name to say what something is, works with or is based on, accurately (for example, “a plugin for ${P}” or “compatible with ${P}”).</li><li>Use the unmodified logo from our <a href="/brand/">press kit</a> to link to ${P} or in articles, talks and tutorials about it.</li><li>Use the name in discussions, reviews and comparisons, including critical ones.</li></ul>` },
      { id: 'ask', title: 'Please ask first', body: `<ul><li>Using the name or logo on merchandise, in event names or in advertising.</li><li>Distributing an unmodified official build under the ${P} name from your own channel.</li></ul>` },
      { id: 'not', title: 'You may not', body: `<ul><li>Use ${P}, or a confusingly similar name or logo, as the name of your product, service, company, domain or social account.</li><li>Distribute a modified version (a fork) under the ${P} name or logo. Forks are welcome, with a different name and without our logos.</li><li>Suggest that Verne sponsors, endorses or certifies your product when it does not.</li><li>Alter, recolour, animate or combine the logo with other marks.</li></ul>` },
      { id: 'art', title: 'Artwork', body: `<p>The illustrations on this site (such as the ${esc(product.artNames)}) are © ${esc(o.legalName)}. You may use them when writing about ${P}. Please do not use them to brand other products.</p>` },
      { id: 'note', title: 'A note on the name', body: `<p>${esc(product.nameNote)}</p>` },
      { id: 'contact', title: 'Questions and permissions', body: `<p>${mail(cfg.contacts.legal)}.</p>` },
    ],
  })

  const licenses = legalPage(cfg, {
    slug: 'licenses',
    nav: 'Licenses',
    title: `Licenses and third-party notices: ${cfg.name}`,
    h1: 'Licenses and notices',
    description: `The open-source licenses behind ${cfg.name} and this website: Apache-2.0 for the software, the SIL Open Font License for the typefaces, and our notices.`,
    lede: `What you may do with ${P}, its website, and the fonts and artwork used here.`,
    sections: [
      { id: 'software', title: `${P} software`, body: `<p>${esc(product.softwareList)} are licensed under the <a href="https://www.apache.org/licenses/LICENSE-2.0">Apache License, Version 2.0</a>. In short: you may use, modify and distribute the software, including commercially, if you keep the license and notices, state significant changes, and do not use our trademarks. The license includes an express patent grant and a disclaimer of warranties. Copyright ${esc(o.legalName)} and ${P} contributors.</p>` },
      { id: 'site', title: 'This website', body: `<p>The website’s source code (its build script, templates, styles and scripts) is licensed under Apache-2.0. The text, logos and artwork are © ${esc(o.legalName)}; you may quote the text with attribution, and use logos and artwork as the <a href="/legal/trademark/">trademark policy</a> allows.</p>` },
      { id: 'fonts', title: 'Typefaces', body: `<p>These fonts are served from this site under the <a href="https://openfontlicense.org">SIL Open Font License, Version 1.1</a>. The license texts are published with the fonts.</p><div class="table-wrap"><table><thead><tr><th scope="col">Font</th><th scope="col">Copyright</th><th scope="col">License text</th></tr></thead><tbody>${product.fonts.map(([n, c, f]) => `<tr><th scope="row">${esc(n)}</th><td>${esc(c)}</td><td><a href="/fonts/${f}">${f}</a></td></tr>`).join('')}</tbody></table></div>` },
      { id: 'third', title: 'Third-party code on this site', body: `<p>None. The website runs only its own small script, with no libraries, frameworks, analytics or embeds.</p>` },
      { id: 'contact', title: 'Questions', body: `<p>${mail(cfg.contacts.legal)}.</p>` },
    ],
  })

  const security = legalPage(cfg, {
    slug: 'security',
    nav: 'Security policy',
    title: `Security policy and vulnerability disclosure: ${cfg.name}`,
    h1: 'Security and disclosure',
    description: `How to report a security vulnerability in ${cfg.name} or this website, what is in scope, how we respond, and our safe-harbour commitment to researchers.`,
    lede: `${P} handles downloads${product.hasExtension ? ' and, with consent, website sessions' : ' and data-source credentials'}. If you find a weakness, we want to hear about it first.`,
    aside: `<p class="small muted"><a href="/.well-known/security.txt">security.txt</a></p>`,
    sections: [
      { id: 'report', title: 'How to report', body: `<p>Email ${mail(cfg.contacts.security)} with the subject line starting <code>SECURITY:</code>. Please include what you found, the affected component and version or commit, steps to reproduce, the impact you expect, and how you would like to be credited. Do not include real credentials or other people’s data. Once the repositories are public, private reporting through GitHub security advisories will also be available.</p>` },
      { id: 'scope', title: 'Scope', body: `<ul>${product.securityScope.map((s) => `<li>${s}</li>`).join('')}<li>This website and its machine-readable files.</li></ul><p>Out of scope: volumetric denial-of-service, social engineering of Verne staff, physical attacks, findings that require a compromised device or browser, and reports produced only by automated scanners without a demonstrated issue.</p>` },
      { id: 'priorities', title: 'What we care about most', body: `<ul>${product.securityPriorities.map((s) => `<li>${s}</li>`).join('')}</ul>` },
      { id: 'response', title: 'What we commit to', body: `<ul><li>Acknowledge your report within 3 business days.</li><li>Give an initial assessment within 10 business days and keep you informed.</li><li>Fix confirmed issues as fast as their severity requires, and coordinate disclosure with you. Our default disclosure window is 90 days.</li><li>Credit you in the advisory if you wish.</li></ul><p>We do not currently run a paid bug bounty.</p>` },
      { id: 'harbor', title: 'Safe harbour', body: `<p>We will not pursue legal action against good-faith research that follows this policy: test only against your own installations and accounts, avoid privacy violations and service disruption, do not access or keep other people’s data, and give us reasonable time to fix an issue before disclosing it.</p>` },
      { id: 'design', title: 'Security by design', body: `<p>${product.securityDesign}</p>` },
    ],
  })

  const accessibility = legalPage(cfg, {
    slug: 'accessibility',
    nav: 'Accessibility',
    title: `Accessibility statement: ${cfg.name} website`,
    h1: 'Accessibility statement',
    description: `Our accessibility commitment for the ${cfg.name} website: WCAG 2.2 AA as the target, what we have done, known limitations and how to tell us about a barrier.`,
    lede: 'Everyone should be able to read about, evaluate and use our software. Here is where we stand.',
    sections: [
      { id: 'target', title: 'Our target', body: `<p>We aim for this website to conform to the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA.</p>` },
      { id: 'measures', title: 'What we do', body: `<ul><li>Semantic HTML: one main heading per page, landmarks, a skip link and labelled navigation.</li><li>Text colours checked against WCAG contrast ratios: every text pairing meets at least 4.5:1.</li><li>Full keyboard operation with visible focus indicators.</li><li>Animations respect your "reduce motion" setting, and the lightning effect never flashes more than once in any second.</li><li>Decorative artwork is hidden from screen readers; informative images and diagrams have text alternatives or captions.</li><li>Text can be resized to 200 percent and the layout works at small widths and high zoom.</li><li>No time limits, no auto-playing audio or video, no CAPTCHAs.</li></ul>` },
      { id: 'limits', title: 'Known limitations', body: `<p>${product.a11yLimits || 'The interactive demos on the home page are visual previews; the same information is available in the text around them and on the <a href="/how-it-works/">how it works</a> page.'} If you find another barrier, please tell us.</p>` },
      { id: 'software', title: 'The software', body: `<p>${product.a11ySoftware}</p>` },
      { id: 'feedback', title: 'Feedback', body: `<p>Write to ${mail(cfg.contacts.general)} with the page address and the problem. We aim to respond within 5 business days.</p>` },
    ],
  })

  const company = legalPage(cfg, {
    slug: 'company',
    nav: 'Company details',
    title: `Company details: ${cfg.name} is a product of Verne Systems`,
    h1: 'Company details',
    description: `${cfg.name} is published by Verne Systems, Dhaka, Bangladesh. Legal entity, registered address, registration identifiers and contact details.`,
    lede: `${P} is a product of ${esc(o.legalName)}. This page lists the legal entity behind it.`,
    sections: [
      { id: 'entity', title: 'Publisher', body: `<dl class="kv"><dt>Legal name</dt><dd>${esc(o.legalName)}</dd><dt>Trading as</dt><dd>${esc(o.name)}</dd><dt>Address</dt><dd>${esc(o.address.street)}, ${esc(o.address.neighborhood)}, ${esc(o.address.city)}-${esc(o.address.postalCode)}, ${esc(o.address.countryName)}</dd><dt>Email</dt><dd>${mail(o.email)}</dd><dt>Phone</dt><dd>${esc(o.phone)}</dd><dt>Website</dt><dd><a href="${o.url}">${esc(o.url.replace('https://', ''))}</a></dd><dt>Founded</dt><dd>${esc(o.founded)}</dd></dl>` },
      { id: 'registration', title: 'Registration', body: `<dl class="kv"><dt>Company registration</dt><dd>${esc(o.registration.companyRegistration)}</dd><dt>Trade licence</dt><dd>${esc(o.registration.tradeLicense)}</dd><dt>TIN</dt><dd>${esc(o.registration.tin)}</dd><dt>D-U-N-S</dt><dd>${esc(o.registration.duns)}</dd></dl><p class="small muted">The same identifiers are published at <a href="${o.url}/legal/company">${esc(o.url.replace('https://', ''))}/legal/company</a>.</p>` },
      { id: 'responsible', title: 'Responsible for content', body: `<p>${esc(o.legalName)}, at the address above. For questions about this site, write to ${mail(o.email)}.</p>` },
    ],
  })

  const extra = product.extraPages ? product.extraPages(legalPage, { mail, addr }) : []

  const all = [privacy, ...extra, terms, aup, cookies, trademark, licenses, security, accessibility, company]
  const index = {
    path: '/legal/',
    order: 59,
    group: 'Legal',
    nav: 'Legal',
    priority: 0.3,
    product: false,
    updated: cfg.updated,
    title: `Legal: privacy, terms and policies for ${cfg.name}`,
    description: `All legal documents for ${cfg.name} and its website: privacy, terms of use, acceptable use, cookies, trademarks, licenses, security, accessibility.`,
    crumbs: [{ name: 'Legal', path: '/legal/' }],
    body: () => `${pageHead({ crumbs: [{ name: 'Legal', path: '/legal/' }], title: 'Legal', lede: `Every document that governs ${P} and this website. We try to write them so they can actually be read.` })}<div class="wrap section--tight">${note(`<p>${P} is free, open-source software that runs on your computer. Most of what these documents say comes down to three things: we collect almost nothing, you stay in control, and please use ${P} lawfully.</p>`, 'scroll')}<div class="cards">${all.map((p) => `<article class="card" data-reveal><h2 class="h3-like">${p.nav}</h2><p>${p.description}</p><a class="card-link" href="${p.path}">Read</a></article>`).join('')}</div></div>`,
  }
  return [index, ...all]
}
