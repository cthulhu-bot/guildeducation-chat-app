import React from "react";
import App from "./App";
import renderer from "react-test-renderer";
import Enzyme, { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Message from "./Message";

Enzyme.configure({ adapter: new Adapter() });

describe("Messanger app", () => {
  it("should render the form inputs with 0 messages and without throwing an error", () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find("input[data-testid='input']").length).toEqual(1);
    expect(wrapper.find("button[data-testid='inputButton']").length).toEqual(1);
    expect(wrapper.state()).toEqual({ currentVal: "", messages: [] });
    expect(wrapper.find(Message).length).toEqual(0);
  });

  it("should update its component state to respond to change events", () => {
    const saveMessage = jest.fn();
    const wrapper = mount(<App saveMessage={saveMessage} />);
    wrapper
      .find("input[data-testid='input']")
      .simulate("change", { target: { value: "Hello World!" } });
    expect(wrapper.state().currentVal).toEqual("Hello World!");
  });

  it("should match its own snapshot", () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
