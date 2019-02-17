import React from 'react'
import { Query, ApolloConsumer, Mutation } from "react-apollo"
import { gql } from 'apollo-boost'
import Persons from './components/Persons'

const allPersons = gql`
{
  allPersons  {
    name
    phone
  }
}
`
const App = () => {
  return (
    <div>
      <ApolloConsumer>
        {(client => 
          <Query query={allPersons}>
            {(result) => <Persons result={result} client={client} />}
          </Query> 
        )}
      </ApolloConsumer>
    </div>
  )
}

export default App
