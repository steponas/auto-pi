import * as React from 'react';
import * as _ from 'lodash';
import styled from 'styled-components';
import { Alert, Row, Col, Switch } from 'antd';
import moment from 'moment';
import { RelayRequest } from 'server/pi-api/relay';
import { SECONDS } from 'common/time';
import { getPiData, postPiData } from '../common/fetch';
import * as relays from '../../config/relay-names';
import { RelayStateResponse } from "common/relays";
import {RoundCard} from "client/common/RoundCard";
import { Timer } from "client/common/Timer";
import {RelayDurationModal} from "client/components/RelayDurationModal";

const { relayNames, ...allRelays } = relays;

interface State {
  relayState?: RelayStateResponse[];
  stateError: boolean;
  postError?: string;
  relayToPickTimeFor: number | null;
}

const Item = styled(Row)`
  font-size: 1.3rem;
  line-height: 3rem;
  background: #f5ebe0;
  border: solid 1px #d5bdaf;
  margin-bottom: 20px;
  border-radius: 20px;
  padding: 10px;
`;

const Info = styled('div')`
  font-size: 13px;
  color: #6b705c;
  line-height: 20px;
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
      relayToPickTimeFor: null,
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

  showTimeSelection = (relay: number) => {
    this.setState({relayToPickTimeFor: relay});
  }

  toggle = async (relay: number, isOn: boolean, until: Date | null): Promise<void> => {
    try {
      const body: RelayRequest = {
        relayNum: relay,
        targetState: isOn,
        until: until?.toISOString() ?? null,
      };
      await postPiData('relay', body);
      this.setState({ postError: undefined });
      await this.fetchData();
    } catch (e) {
      this.setState({
        postError: e.message,
      });
    }
  };

  render(): JSX.Element {
    const {relayState, stateError, postError, relayToPickTimeFor } = this.state;
    if (!relayState) {
      return <div>Loading...</div>;
    }

    return (
      <RoundCard>
        {stateError && (
          <Alert type="error" message="Error refetching the state" />
        )}
        {postError && (
          <Alert type="error" message={postError} />
        )}
        {
          _.map(allRelays, (num): JSX.Element => {
            const relay = relayState[num];
            const checked = relay.enabled;
            const handleClick = () => {
              if (checked) {
                this.toggle(num, false, null).catch(() => { /* noop */ });
              } else {
                this.showTimeSelection(num);
              }
            }
            return (
              <Item key={num} onClick={handleClick}>
                <Col span={20}>
                  {relayNames[num]}
                  {relay.enabled && (
                    <Info>
                      Enabled <Timer>{moment(relay.enabledSince).fromNow()}</Timer>
                      {relay.enabledUntil && (
                        <>
                          <br />
                          Will turn off {moment().to(relay.enabledUntil)}
                        </>
                      )}
                    </Info>
                  )}
                </Col>
                <Col span={4}>
                  <Switch checked={checked} />
                </Col>
              </Item>
            );
          })
        }
        <RelayDurationModal
          open={!!relayToPickTimeFor}
          onClose={() => this.setState({relayToPickTimeFor: null})}
          onSelect={(minutes) => {
            if (relayToPickTimeFor) {
              this.toggle(relayToPickTimeFor, true, moment().add(minutes, 'minutes').toDate());
            }
            this.setState({relayToPickTimeFor: null});
          }}
        />
      </RoundCard>
    );
  }
}
