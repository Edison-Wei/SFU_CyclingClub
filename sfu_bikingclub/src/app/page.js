import Hero from "@/components/Hero"
import Body from "./Body"
import Header from "../components/Header"


export default function Home() {
  // dark:invert-[.95] dark:hue-rotate-180
  return (
    <main className="font-mono">
      <Header />
      <Hero />
      <Body />
    </main>
  )
}
