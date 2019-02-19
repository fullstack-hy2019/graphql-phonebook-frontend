import React, { useState } from 'react'
import { Query, ApolloConsumer, Mutation } from "react-apollo"
import { gql } from 'apollo-boost'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'

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

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)

  const handleError = (error) => {
    setErrorMessage(error.graphQLErrors[0].message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  return (
    <div>
      {errorMessage &&
        <div style={{ color: 'red' }}>
          {errorMessage}
        </div>
      }
      <ApolloConsumer>
        {client => 
          <Query query={ALL_PERSONS} pollInterval={2000}>
            {(result) => <Persons result={result} client={client} />}
          </Query> 
        }
      </ApolloConsumer>
      <h2>create new</h2>
      <Mutation
        mutation={CREATE_PERSON} 
        refetchQueries={[{ query: ALL_PERSONS }]}
        onError={handleError}
      >
        {(addPerson) =>
          <PersonForm
            addUser={addPerson}
          />
        }
      </Mutation>
    </div>
  )
}

export default App
