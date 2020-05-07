import React from "react";
import ReactDOM from "react-dom";
import { Tab } from "semantic-ui-react";

const panes = [
  {
    menuItem: "Tab 1",
    render: () => <Tab.Pane attached={false}>Tab 1 Content</Tab.Pane>,
  },
  {
    menuItem: "Tab 2",
    render: () => <Tab.Pane attached={false}>Tab 2 Content</Tab.Pane>,
  },
  {
    menuItem: "Tab 3",
    render: () => <Tab.Pane attached={false}>Tab 3 Content</Tab.Pane>,
  },
];

// const TabExampleSecondaryPointing = () => (
//   <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
// );

class TabExampleSecondaryPointing extends React.Component {
  render() {
    return <div className="ui segment">Test</div>;
  }
}

ReactDOM.render(
  <TabExampleSecondaryPointing />,
  document.getElementById("react")
);
