import { coffeeOptions } from '../utils'
import { useState } from 'react'
import Modal from './Modal'
import Authentication from './Authentication'
import { useAuth } from '../context/AuthContext'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'

export default function CoffeeForm(props) {
  const { isAuthenticated, showModal, setShowModal } = props
  const [showCoffeeTypes, setShowCoffeeTypes] = useState(false)
  const [selectedCoffee, setSelectedCoffee] = useState(null)
  const [cost, setCost] = useState(0)
  const [hour, setHour] = useState(0)
  const [minute, setMinute] = useState(0)
  const { globalData, setGlobalData, globalUser } = useAuth()

  async function handleSubmitForm() {
    // show authentication form if not logged in/ signed up
    if (!isAuthenticated) {
      setShowModal(true)
      return
    }
    // edge case -> coffee not selected
    if (!selectedCoffee) return
    // try-catch
    try {
      // new data object
      const newGlobalData = {
        ...(globalData || {}),
      }
      // calculate last consumption time
      const currTime = Date.now()
      const timeToSubtract = hour * 60 * 60 * 1000 + minute * 60 * 100
      const timeStamp = currTime - timeToSubtract
      newGlobalData[timeStamp] = {
        name: selectedCoffee,
        cost: cost,
      }
      // update the global state
      setGlobalData(newGlobalData)
      // update data in firestore
      const userRef = doc(db, 'users', globalUser.uid)
      const res = await setDoc(
        userRef,
        {
          [timeStamp]: {
            name: selectedCoffee,
            cost: cost,
          },
        },
        { merge: true }
      )

      // reset all the states
      setSelectedCoffee(null)
      setCost(0)
      setHour(0)
      setMinute(0)
    } catch (err) {
      console.log(err.message)
    }
  }

  return (
    <>
      <div className="section-header">
        <i className="fa-solid fa-pencil"></i>
        <h2>Start Tracking Today</h2>
      </div>
      <h4>Select Coffee type</h4>
      <div className="coffee-grid">
        {coffeeOptions.slice(0, 5).map((option, optionIdx) => {
          return (
            <button
              onClick={() => {
                setSelectedCoffee(option.name)
                setShowCoffeeTypes(false)
              }}
              className={
                'button-card ' +
                (selectedCoffee == option.name ? 'coffee-button-selected' : '')
              }
              key={optionIdx}
            >
              <h4>{option.name}</h4>
              <p>{option.caffeine} mg</p>
            </button>
          )
        })}
        <button
          onClick={() => {
            setShowCoffeeTypes(true)
            setSelectedCoffee(null)
          }}
          className={
            'button-card ' + (showCoffeeTypes ? 'coffee-button-selected' : '')
          }
        >
          <h4>Other</h4>
          <p>n/a</p>
        </button>
      </div>
      {showCoffeeTypes && (
        <select
          onChange={(e) => setSelectedCoffee(e.target.value)}
          name="coffee-list"
          id="coffee-list"
        >
          <option value={null}>Select Coffee type</option>
          {coffeeOptions
            .slice(5, coffeeOptions.length)
            .map((option, optionIdx) => {
              return (
                <option value={option.name} key={optionIdx}>
                  {option.name} ({option.caffeine} mg)
                </option>
              )
            })}
        </select>
      )}
      <h4>Add the cost ($)</h4>
      <input
        value={cost}
        onChange={(e) => setCost(e.target.value)}
        type="number"
        className="w-full"
        placeholder="3.45"
      />
      <h4>Time since consumption</h4>
      <div className="time-entry">
        <div>
          <h6>Hours</h6>
          <select onChange={(e) => setHour(e.target.value)} id="hours-select">
            {[
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              19, 20, 21, 22, 23,
            ].map((hour, hourIdx) => {
              return (
                <option value={hour} key={hourIdx}>
                  {hour}
                </option>
              )
            })}
          </select>
        </div>
        <div>
          <h6>Mins</h6>
          <select onChange={(e) => setMinute(e.target.value)} id="hours-select">
            {[0, 5, 10, 15, 30, 45].map((minute, minuteIdx) => {
              return (
                <option value={minute} key={minuteIdx}>
                  {minute}
                </option>
              )
            })}
          </select>
        </div>
      </div>
      <button onClick={handleSubmitForm}>
        <p>Add Entry</p>
      </button>
      {showModal && (
        <Modal handleCloseModal={() => setShowModal(false)}>
          <Authentication handleCloseModal={() => setShowModal(false)} />
        </Modal>
      )}
    </>
  )
}
