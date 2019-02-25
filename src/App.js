import React, { useState, useEffect } from 'react'
import { gql } from 'apollo-boost'
import { useQuery, useMutation } from 'react-apollo-hooks' 
import { useApolloClient } from 'react-apollo-hooks'

import { Subscription } from 'react-apollo'

import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import PhoneForm from './components/PhoneForm'
import LoginForm from './components/LoginForm'

const PERSON_DETAILS = gql`
fragment PersonDetails on Person {
  id
  name
  phone 
  address {
    street 
    city
  }
}
`

const ALL_PERSONS = gql`
{
  allPersons  {
    ...PersonDetails
  }
}
${PERSON_DETAILS}
`

const CREATE_PERSON = gql`
mutation createPerson($name: String!, $street: String!, $city: String!, $phone: String) {
  addPerson(
    name: $name,
    street: $street,
    city: $city,
    phone: $phone
  ) {
    ...PersonDetails
  }
}
${PERSON_DETAILS}
`

const EDIT_NUMBER = gql`
mutation editNumber($name: String!, $phone: String!) {
  editNumber(name: $name, phone: $phone)  {
    ...PersonDetails
  }
}
${PERSON_DETAILS}
`

const LOGIN = gql`
mutation login($username: String!, $password: String!) {
  login(username: $username, password: $password)  {
    value
  }
}
`

const PERSON_ADDED = gql`
subscription {
  personAdded {
    ...PersonDetails
  }
}
${PERSON_DETAILS}
`

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)

  const client = useApolloClient()

  useEffect(() => {
    setToken(localStorage.getItem('phonebook-user-token', token))
  }, [])

  const handleError = (error) => {
    setErrorMessage(error.graphQLErrors[0].message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 2000)
  }

  const result = useQuery(ALL_PERSONS)

  const includedIn = (set, object) => 
    set.map(p => p.id).includes(object.id)  
  
  const addPerson = useMutation(CREATE_PERSON, {
    onError: handleError,
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: ALL_PERSONS })
      const addedPerson = response.data.addPerson
      
      if (!includedIn(dataInStore.allPersons, addedPerson)) {
        dataInStore.allPersons.push(addedPerson)
        client.writeQuery({
          query: ALL_PERSONS,
          data: dataInStore
        })
      }
    }
  })

  const editNumber = useMutation(EDIT_NUMBER)

  const login = useMutation(LOGIN)

  const errorNotification = () => errorMessage &&
    <div style={{ color: 'red' }}>
      {errorMessage}
    </div>

  if (!token) {
    return (
      <div>
        {errorNotification()}
        <h2>Login</h2>
        <LoginForm
          login={login}
          setToken={(token) => setToken(token)}
          handleError={handleError}
        />
      </div>
    )
  }

  return (
    <div>
      {errorNotification()}
      
      <button onClick={logout}>logout</button>

      <Persons result={result} />

      <h2>create new</h2>
      <PersonForm addPerson={addPerson} />

      <h2>change number</h2>
      <PhoneForm editNumber={editNumber} />    
      <Subscription
        subscription={PERSON_ADDED}
        onSubscriptionData={({subscriptionData}) => {
          const addedPerson = subscriptionData.data.personAdded
          notify(`${addedPerson.name} added`)

          const dataInStore = client.readQuery({ query: ALL_PERSONS })
          if (!includedIn(dataInStore.allPersons, addedPerson)) {
            dataInStore.allPersons.push(addedPerson)
            client.writeQuery({
              query: ALL_PERSONS,
              data: dataInStore
            })
          }
        }}
      > 
        {() => null}
      </Subscription>
    </div>
  )
}

export default App
