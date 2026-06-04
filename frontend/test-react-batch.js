const { createElement, useState, useEffect } = require('react');
const { renderToString } = require('react-dom/server');

function Test() {
  const [val, setVal] = useState([]);
  
  useEffect(() => {
    setVal([{ id: 1 }]);
  }, []);
  
  useEffect(() => {
    setVal(prev => prev.map(p => ({ ...p, extra: true })));
  }, []);
  
  console.log('RENDER', val);
  return null;
}
renderToString(createElement(Test));
