import { useState } from 'react'
import CoffeeForm from './components/CoffeeForm'
import Hero from './components/Hero'
import History from './components/History'
import Layout from './components/Layout'
import Stats from './components/Stats'
import { useAuth } from './context/AuthContext'

function App() {
  const [showModal, setShowModal] = useState(false)
  const { globalUser, globalData, isLoading } = useAuth()
  const isAuthenticated = globalUser
  const isData = globalData && !!Object.keys(globalData || {}).length

  const authenticatedContent = (
    <>
      <Stats />
      <History />
    </>
  )

  return (
    <Layout showModal={showModal} setShowModal={setShowModal}>
      <Hero />
      <CoffeeForm
        isAuthenticated={isAuthenticated}
        showModal={showModal}
        setShowModal={setShowModal}
      />
      {isAuthenticated && isLoading && <p>Loading...</p>}
      {isAuthenticated && isData && authenticatedContent}
    </Layout>
  )
}

export default App
