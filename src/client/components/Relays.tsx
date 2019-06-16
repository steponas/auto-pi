import * as React from 'react';
import * as _ from 'lodash';
import styled from 'styled-components';
import { Row, Col, Switch } from 'antd';
import { RelayState } from 'raspberry/i2c';
import { RelayRequest } from 'server/pi-api/relay';
import { getPiData, postPiData } from '../common/fetch';
import * as relays from '../../config/relay-names';

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

export default class Relays extends React.Component<{}, State> {
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

  async fetchData(): Promise<void> {
    try {
      const data = await getPiData('relay-state');
      this.setState({ relayState: data.state });
    } catch (err) {
      console.log(err);
      this.setState({ stateError: true });
    }
  }

  toggleSwitch = async (num: number, isOn: boolean): Promise<void> => {
    console.log(isOn);
    try {
      const body: RelayRequest = {
        relayNum: num,
        targetState: isOn,
      };
      await postPiData('relay', body);
    } catch (e) {
      this.setState({
        postError: e.message,
      });
      return;
    }

    await this.fetchData();
  };

  render(): JSX.Element {
    const {relayState} = this.state;
    if (!relayState) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        {
          _.map(relays, (num, relayName): JSX.Element => {
            const checked = relayState[num];
            return (
              <Item key={num}>
                <Col span={20}>{relayName}</Col>
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
