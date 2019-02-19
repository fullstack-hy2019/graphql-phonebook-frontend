import React,  {useState } from 'react'
import { gql } from 'apollo-boost'
import { useApolloClient } from 'react-apollo-hooks'

const FIND_PERSON = gql`
query findPersonByName($nameToSearch: String!) {
  findPerson(name: $nameToSearch) {
    name
    phone 
    id
		address{
      street
      city
    }
  }
}
`

const Persons = ({ result }) => {
  const client = useApolloClient()

  const [person, setPerson] = useState(null)

  if (result.loading) {
    return <div>loading...</div>
  }

  if (person) {
    return(
      <div>
        <h2>{person.name}</h2>
        <div>{person.address.street} {person.address.city}</div>
        <div>{person.phone}</div>
        <button onClick={() => setPerson(null)}>close</button>
      </div>
    )
  }

  const show = async (name) => {
    const { data } = await client.query({
      query: FIND_PERSON,
      variables: { nameToSearch: name }
    })
    setPerson(data.findPerson)
  }

  return (
    <div>
      <h2>Persons</h2>
      {result.data.allPersons.map(p =>
        <div key={p.name}>
          {p.name} {p.phone}
          <button onClick={() => show(p.name)}>show address</button>
        </div>  
      )}
    </div>
  )
}

export default Persons