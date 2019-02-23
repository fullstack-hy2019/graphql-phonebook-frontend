import React, { useState } from 'react'

const PersonForm = (props) => {
  const [name, setName] = useState('teppo testaaja')
  const [phone, setPhone] = useState('01-2123123')
  const [street, setStreet] = useState('testitie')
  const [city, setCity] = useState('Helsinki')

  const submit = async (e) => {
    e.preventDefault()

    await props.addPerson({ 
      variables: { 
        name, street, city,
        phone: phone.length>0 ? phone : null
      } 
    })

    setName('')
    setPhone('')
    setStreet('')
    setCity('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          name <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          phone <input
            value={phone}
            onChange={({ target }) => setPhone(target.value)}
          />
        </div>
        <div>
          street <input
            value={street}
            onChange={({ target }) => setStreet(target.value)}
          />
        </div>
        <div>
          city <input
            value={city}
            onChange={({ target }) => setCity(target.value)}
          />
        </div>
        <button type='submit'>add!</button>
      </form>
    </div>
  )
}

export default PersonForm