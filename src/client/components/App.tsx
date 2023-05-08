import * as React from 'react';
import styled from 'styled-components';
import Temp from './Temp';
import Relays from './Relays';
import {TempHistory} from './TempHistory';

const Wrapper = styled.div`
  border: 1px solid black;
`;

const App = (): JSX.Element => <Wrapper>
  <Temp />
  <TempHistory />
  <Relays />
</Wrapper>;

export default App;
