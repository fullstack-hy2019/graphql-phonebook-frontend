import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import { useQuery, useMutation } from 'react-apollo-hooks' 

import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import PhoneForm from './components/PhoneForm'

const ALL_PERSONS = gql`
{
  allPersons  {
    name
    phone
    id
  }
}
`

const CREATE_PERSON = gql`
mutation createPerson($name: String!, $street: String!, $city: String!, $phone: String) {
  addPerson(
    name: $name,
    street: $street,
    city: $city,
    phone: $phone
  ) {
    name
    phone
    address {
      street
      city
    }
    id
  }
}
`

const EDIT_NUMBER = gql`
mutation editNumber($name: String!, $phone: String!) {
  editNumber(name: $name, phone: $phone)  {
    name
    phone
    address {
      street
      city
    }
    id
  }
}
`

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)

  const handleError = (error) => {
    setErrorMessage(error.graphQLErrors[0].message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const result = useQuery(ALL_PERSONS)

  const addPerson = useMutation(CREATE_PERSON, {
    onError: handleError,
    refetchQueries: [{ query: ALL_PERSONS }]
  })

  const editNumber = useMutation(EDIT_NUMBER)

  return (
    <div>
      {errorMessage &&
        <div style={{ color: 'red' }}>
          {errorMessage}
        </div>
      }
      
      <Persons result={result} />

      <h2>create new</h2>
      <PersonForm addPerson={addPerson} />

      <h2>change number</h2>
      <PhoneForm editNumber={editNumber} />    
    </div>
  )
}

export default App
