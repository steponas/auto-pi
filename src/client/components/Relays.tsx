import * as React from 'react';
import * as _ from 'lodash';
import styled from 'styled-components';
import { Alert, Row, Col, Switch } from 'antd';
import { RelayState } from 'raspberry/i2c';
import { RelayRequest } from 'server/pi-api/relay';
import { SECONDS } from 'common/time';
import { getPiData, postPiData } from '../common/fetch';
import * as relays from '../../config/relay-names';

const {relayNames, ...allRelays} = relays;

interface State {
  relayState?: RelayState;
  stateError: boolean;
  postError?: string;
};

const Item = styled(Row)`
  font-size: 1.3rem;
  line-height: 3rem;
  border-top: dotted 1px rgba(0, 0, 0, 0.65);
`;

const REFETCH_TIME = 10 * SECONDS;

export default class Relays extends React.Component<{}, State> {
  refetchTimeout: number;

  constructor(props) {
    super(props);
    this.state = {
      relayState: undefined,
      stateError: false,
      postError: undefined,
    };
  }

  componentDidMount(): void {
    this.fetchData();
  }

  componentWillUnmount(): void {
    if (this.refetchTimeout) {
      clearTimeout(this.refetchTimeout);
    }
  }

  fetchData = async (): Promise<void> => {
    if (this.refetchTimeout) {
      clearTimeout(this.refetchTimeout);
    }
    try {
      const data = await getPiData('relay-state');
      this.setState({ relayState: data.state, stateError: false });
    } catch (err) {
      console.log(err);
      this.setState({ stateError: true });
    }

    this.refetchTimeout = setTimeout(this.fetchData, REFETCH_TIME);
  }

  toggleSwitch = async (num: number, isOn: boolean): Promise<void> => {
    try {
      const body: RelayRequest = {
        relayNum: num,
        targetState: isOn,
      };
      await postPiData('relay', body);
      this.setState({ postError: undefined });
    } catch (e) {
      this.setState({
        postError: e.message,
      });
      return;
    }

    await this.fetchData();
  };

  render(): JSX.Element {
    const {relayState, stateError, postError } = this.state;
    if (!relayState) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        {stateError && (
          <Alert type="error" message="Error refetching the state" />
        )}
        {postError && (
          <Alert type="error" message={postError} />
        )}
        {
          _.map(allRelays, (num): JSX.Element => {
            const checked = relayState[num];
            return (
              <Item key={num}>
                <Col span={20}>{relayNames[num]}</Col>
                <Col span={4}>
                  <Switch 
                    checked={checked}
                    onChange={(): Promise<void> => this.toggleSwitch(num, !checked)}
                  />
                </Col>
              </Item>
            );
          })
        }
      </div>
    );
  }
}
