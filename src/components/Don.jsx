import React from 'react'

function Don(props) {
    const {id, name, score,definicion,texto} = props.data
  return (
    <div className='don' key={id}>
        <h3>{name}</h3>
        <h4>{texto}</h4>
        <p>{definicion}</p>
    </div>
  )
}

export default Don