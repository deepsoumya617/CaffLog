import { useAuth } from '../context/AuthContext'
import Authentication from './Authentication'
import Modal from './Modal'

export default function Layout(props) {
  const { children, showModal, setShowModal } = props
  const { globalUser, logout } = useAuth()
  const header = (
    <header>
      <div>
        <h1 className="text-gradient">CAFFLOG</h1>
        <p>Manage your Caffeine intake.</p>
      </div>
      {globalUser ? (
        <button onClick={logout}>
          <p>Log Out</p>
        </button>
      ) : (
        <button onClick={() => setShowModal(true)}>
          <p>Sign Up Now!</p>
          <i className="fa-solid fa-mug-hot"></i>
        </button>
      )}
    </header>
  )

  const footer = (
    <footer>
      <p>
        <span className="text-gradient">CaffLog</span> was made with ❤️ by{' '}
        <br />{' '}
        <a href="https://github.com/deepsoumya617" target="_blank">
          DeepSoumya
        </a>{' '}
        using{' '}
        <a href="https://www.fantacss.smoljames.com" target="_blank">
          FantaCSS.
        </a>
      </p>
    </footer>
  )

  return (
    <>
      {showModal && (
        <Modal handleCloseModal={() => setShowModal(false)}>
          <Authentication handleCloseModal={() => setShowModal(false)} />
        </Modal>
      )}
      {header}
      <main>{children}</main>
      {footer}
    </>
  )
}
