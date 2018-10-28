import React from "react";
import { createStyledComponent } from "mineral-ui/styles";
import Flex, { FlexItem } from "mineral-ui/Flex";

const LeftMessage = createStyledComponent(FlexItem, {
  background: "#0b93f6",
  borderRadius: "25px",
  color: "white",
  lineHeight: "24px",
  marginBottom: "12px",
  marginRight: "300px",
  marginTop: "0.5rem",
  maxWidth: "255px",
  padding: "10px 20px",
  textAlign: "center",
  width: "50%",
  wordWrap: "break-word"
});

const RightMessage = createStyledComponent(FlexItem, {
  background: "#e5e5ea",
  borderRadius: "25px",
  color: "black",
  lineHeight: "24px",
  marginBottom: "12px",
  marginLeft: "300px",
  marginTop: "0.5rem",
  maxWidth: "255px",
  padding: "10px 20px",
  textAlign: "center",
  width: "50%",
  wordWrap: "break-word"
});

const Message = ({ message }) => {
  return (
    <Flex justifyContent={"center"}>
      {message.name === "Jane Doe" ? (
        <LeftMessage
          data-testid={`message-${message.key}`}
          key={message.key}
        >{`${message.text}`}</LeftMessage>
      ) : (
        <RightMessage
          data-testid={`message-${message.key}`}
          key={message.key}
        >{`${message.text}`}</RightMessage>
      )}
    </Flex>
  );
};

export default Message;
