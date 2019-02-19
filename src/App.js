import React from 'react'
import { Query, ApolloConsumer, Mutation } from "react-apollo"
import { gql } from 'apollo-boost'
import Persons from './components/Persons'

const ALL_PERSONS = gql`
{
  allPersons  {
    name
    phone
    id
  }
}
`
const App = () => {
  return (
    <div>
      <ApolloConsumer>
        {(client => 
          <Query query={ALL_PERSONS}>
            {(result) => <Persons result={result} client={client} />}
          </Query> 
        )}
      </ApolloConsumer>
    </div>
  )
}

export default App
