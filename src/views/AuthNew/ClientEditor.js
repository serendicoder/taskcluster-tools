import React from 'react';
import {
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Col,
  Button,
  Glyphicon,
  ButtonToolbar,
  InputGroup
} from 'react-bootstrap';
import { assoc } from 'ramda';
import TimeInput from '../../components/TimeInput';
import ScopeEditor from '../../components/ScopeEditor/index';
import styles from './styles.css';

export default class ClientEditor extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      currentClient: props.client,
      error: null
    };
  }

  validClientId = () =>
    /^[A-Za-z0-9@/:._-]+$/.test(this.state.currentClient.clientId || '') &&
    (this.props.isNewClient ||
      this.state.currentClient.clientId !== this.props.client.clientId);

  handleClientIdChange = e =>
    this.setState({
      currentClient: assoc('clientId', e.target.value, this.state.currentClient)
    });

  handleDescriptionChange = e =>
    this.setState({
      currentClient: assoc(
        'description',
        e.target.value,
        this.state.currentClient
      )
    });

  handleExpiresChange = date =>
    this.setState({
      currentClient: assoc('expires', date.toJSON(), this.state.currentClient)
    });

  onScopesUpdated = scopes =>
    this.setState({
      currentClient: assoc('scopes', scopes, this.state.currentClient)
    });

  onSubmit = e => {
    e.preventDefault();

    this.props.createClient(this.state.currentClient);
  };

  render() {
    const { isNewClient, client } = this.props;
    const { currentClient } = this.state;
    const validClientId = this.validClientId();

    return (
      <div className={styles.editor}>
        <h4 style={{ marginTop: 0 }}>Create New Client</h4>
        <hr style={{ marginBottom: 10 }} />
        <Form horizontal>
          {!isNewClient && (
            <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>
                <ControlLabel>Old ClientId</ControlLabel>
              </Col>
              <Col sm={10}>
                <InputGroup>
                  <FormControl
                    type="text"
                    disabled={true}
                    value={client.clientId}
                  />
                  <InputGroup.Button>
                    <Button
                      onClick={this.props.resetAccessToken}
                      bsStyle="warning">
                      <Glyphicon glyph="fire" /> Reset accessToken
                    </Button>
                  </InputGroup.Button>
                </InputGroup>
              </Col>
            </FormGroup>
          )}

          <FormGroup
            controlId="clientId"
            validationState={!validClientId ? 'error' : null}>
            <Col componentClass={ControlLabel} sm={2}>
              ClientId
            </Col>
            <Col sm={10}>
              {!validClientId && (
                <ControlLabel>Pick a different clientId</ControlLabel>
              )}
              <FormControl
                type="text"
                value={currentClient.clientId}
                onChange={this.handleClientIdChange}
              />
            </Col>
          </FormGroup>

          <FormGroup controlId="description">
            <Col componentClass={ControlLabel} sm={2}>
              Description
            </Col>
            <Col sm={10}>
              <FormControl
                type="text"
                value={this.state.currentClient.description}
                onChange={this.handleDescriptionChange}
                componentClass="textarea"
              />
            </Col>
          </FormGroup>

          <FormGroup controlId="expires">
            <Col componentClass={ControlLabel} sm={2}>
              Expires
            </Col>
            <Col sm={10}>
              <TimeInput
                value={new Date(currentClient.expires)}
                onChange={this.handleExpiresChange}
                className="form-control"
              />
            </Col>
          </FormGroup>

          <FormGroup controlId="scopes">
            <Col componentClass={ControlLabel} sm={2}>
              Scopes
            </Col>
            <Col sm={10}>
              <ScopeEditor
                editing={true}
                scopesUpdated={this.onScopesUpdated}
                scopes={currentClient.scopes}
              />
            </Col>
          </FormGroup>

          <FormGroup>
            <Col smOffset={2} sm={10}>
              <ButtonToolbar>
                <Button
                  bsStyle="primary"
                  type="submit"
                  onClick={this.onSubmit}
                  disabled={!validClientId}>
                  <Glyphicon glyph="plus" /> Create Client
                </Button>
              </ButtonToolbar>
            </Col>
          </FormGroup>
        </Form>
      </div>
    );
  }
}
