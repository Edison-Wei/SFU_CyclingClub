import Image from 'next/image'
import Hero from './Hero';
import Body from './Body';
import Footer from './Footer';

/**
 * 
 * @returns 
 */
export default function Home() {
  return (
    <main>
      <Hero />

      <Body />
      
      <Footer />
    </main>
  )
}
