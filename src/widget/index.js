import React from 'react';
import ReactDOM from 'react-dom'
import '../../semantic-ui/semantic.less'

class Widget extends React.Component {
  render() {
    return (
      <div className='ui segment'>
        <h1>Hello World FUck</h1>
      </div>
    )
  }
}

ReactDOM.render(
  <Widget />,
  document.getElementById('index')
);
