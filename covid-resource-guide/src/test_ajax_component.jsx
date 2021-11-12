import React, { useState, useEffect} from 'react';

function AjaxComponent() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    fetch("http://localhost:56207/rest/metrics/CovidData/test")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          //setItems(result);
          setQuery(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>query</div>
    );
  }
}

export default AjaxComponent;
