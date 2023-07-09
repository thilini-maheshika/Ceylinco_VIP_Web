import React, { useState } from "react";

function Example() {
  const [count, setCount] = useState(0);

  const [value , setValue ] = useState("");

  var x  = 0;

  const increment = () => {
    setCount(count + 1);
    return x= x + 1;
  };

  const clicks = () => {
    var a = increment()
    console.log(a)
  }

  const abc = (values) => {
   setValue(values)
  }

  return (
    <div>
      <p>Count: {count}</p>
      <p>Count: {value}</p>
      <h3>{x}</h3>
      <button onClick={clicks}>Increment</button>
      <input type="text" onChange={(e) => {
        abc(e.target.value)
      }}/>
    </div>
  );
}

export default Example;
