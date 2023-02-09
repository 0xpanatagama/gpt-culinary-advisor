import './globals.css'
import { AnalyticsWrapper } from './components/analytics';
import Image from 'next/image'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <div className="wrapper">
          {children}
          <AnalyticsWrapper />
        </div>
        <footer className="footer">
           <a target="_blank" rel="no-opener" href="https://github.com/0xpanatagama/gpt-culinary-advisor">
           <Image style={{ marginTop: '2px'}} alt="code available on github" width="18" height="18" src="/github.svg" />
           </a>
            <p>
            Shout out to <a target="_blank" rel="no-opener" href="https://twitter.com/dabit3">@dabit3</a> for making the ✨magic✨ behind this happen 🫶 <a className="sponsor" target="_blank" rel="no-opener" href="https://etherscan.io/enslookup-search?search=sha.eth"> Sponsor project 🫡</a>
            </p>
        </footer>
      </body>
    </html>
  )
}
