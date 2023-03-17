import Head from 'next/head'
import About from '../components/About'
import Contact from '../components/Contact'
import Main from '../components/Main'
import Projects from '../components/Projects'
import Skills from '../components/Skills'
import Footer from '../components/Footer'


export default function Home() {
  return (
    <div>
      <Head>
        <title>Jun | Back-End Developer</title>
        <meta name="description" content="I’m a back-end developer specializing in building powerfull applications." />
        <link rel="icon" href="/fav.png" />
      </Head>
    <Main />
    <About />
    <Skills />
    <Projects />
    <Contact />   
    <Footer />
    </div>
  )
}
