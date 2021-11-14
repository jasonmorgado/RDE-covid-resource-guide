import React, { useState, useEffect} from 'react';

// From https://reactjs.org/docs/faq-ajax.html

function AjaxComponent() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("http://localhost:61043/rest/metrics/CovidData/test")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setQuery(result);
        },
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
      <div>{query}</div>
    );
  }
}

export default AjaxComponent;
