import React from 'react'
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
    id
    address {
      street
      city
    }
  }
}
`

const App = () => {
  return (
    <div>
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
