import React, { useEffect, useState } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */
const JokeList = ({ numJokesToGet= 5 }) =>{

  const [ jokes, setJokes ] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  /* retrieve jokes from API */
  useEffect(() => {
    const getJokes = async () => {
    
      let j = [...jokes];
      let seenJokes = new Set();
      while (j.length < numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { ...jokeObj } = res.data;

        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          j.push({ ...jokeObj, votes: 0 });
        } else {
          console.log("duplicate found!");
        }
      }
      setJokes(j);
      setIsLoading(false);
    }
    if (jokes.length === 0) {
      getJokes();
    }
  }, [jokes, numJokesToGet]);

  const generateNewJokes = () => {
    setJokes([]);
    setIsLoading(true);
  }
  /* change vote for this id by delta (+1 or -1) */

  const vote = (id, delta) => {
    setJokes(allJokes =>
      allJokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    );
  }

  /* render: either loading spinner or list of sorted jokes. */


  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);
  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    )
  }

    return (
      <div className="JokeList">
        <button
          className="JokeList-getmore"
          onClick={generateNewJokes} >
          Get New Jokes
        </button>

        {sortedJokes.map(({joke, id, votes}) => (
          <Joke
            text={joke}
            key={id}
            id={id}
            votes={votes}
            vote={vote}
          />
        ))}
      </div>
    );
  }

export default JokeList;
