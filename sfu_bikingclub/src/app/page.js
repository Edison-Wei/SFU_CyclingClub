import Hero from "@/components/Hero"
import Body from "./Body"
import Header from "../components/Header"

/**
 * 
 * @returns 
 */
export default function Home() {
  return (
    <main className="font-mono">
      <Header />
      <Hero />
      <Body />

    </main>
  )
}
