import React, { useState } from 'react';
import './App.css';
import CorpusList from './Component/CorpusList';
import MultiModalList from './Component/MultiModalList';


function App() {

  const choose_version = (e, ver) => {

    setVersion(ver);
    if (ver === 1)
      setContent(<CorpusList />);
    else if (ver === 2)
      setContent(<MultiModalList />);
    else
      setContent(default_content);
  }

  const default_content = <div>
    <div className="version_button_group">
      <button className="version_button" onClick={(e) => choose_version(e, 1)}>Corpus (ver 1.0)</button>
      <button className="version_button" onClick={(e) => choose_version(e, 2)}>Multi-modal (ver 2.0)</button>
    </div>
    <div id="footer"><p>Ke Jyun Wang, Copyright © 2020-2021. All Rights Reserved.</p></div>
  </div>;

  const [ version, setVersion ] = useState(-1);
  const [ content, setContent ] = useState(default_content);
  // const [ content, setContent ] = useState(<MultiModalList />);
  console.log(version);

  return (
    <div className="App">
      {content}
    </div>
  );
}

export default App;
