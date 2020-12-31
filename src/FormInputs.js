import React from "react";
import { CustomInput, Col, FormGroup, Label, Input } from "reactstrap";

export const FormRow = ({ name, label, children }) => {
  return (
    <FormGroup row>
      <Col sm={3}>
        <Label for={name}>{label}</Label>
      </Col>
      <Col sm={9}>{children}</Col>
    </FormGroup>
  );
};

export const FormSwitchInput = ({ children, ...props }) => {
  return <CustomInput type="switch" id={props.name} {...props} />;
};

export const FormCheckboxInput = ({ children, ...props }) => {
  return <CustomInput type="checkbox" id={props.name} {...props} />;
};

export const FormInput = ({ children, ...props }) => {
  return (
    <React.Fragment>
      <Input {...props}>{children}</Input>
    </React.Fragment>
  );
};
