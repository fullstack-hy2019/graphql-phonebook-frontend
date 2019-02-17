import React from 'react'
import { Query, ApolloConsumer, Mutation } from "react-apollo"
import { gql } from 'apollo-boost'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'

const allPersons = gql`
{
  allPersons  {
    name
    phone
  }
}
`

const createPerson = gql`
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
  }
}
`

const App = () => {
  return (
    <div>
      <ApolloConsumer>
        {(client) => 
          <Query query={allPersons}>
            {(result) => <Persons result={result} client={client} />}
          </Query> 
        }
      </ApolloConsumer>
      <Mutation
        mutation={createPerson} 
        refetchQueries={[{ query: allPersons }]}
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
