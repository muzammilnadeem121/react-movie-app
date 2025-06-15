import React from 'react'

const Search = (props) => {
  return (
    <div className='search'>
        <div>
            <img src="./search.svg" alt="icon" />
            <input type="text" placeholder='Search Batman' value={props.searchTerm} onInput={e => props.setSearchTerm(e.target.value)}/>
        </div>
    </div>
  )
}

export default Search;