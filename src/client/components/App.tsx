import * as React from 'react';
import styled from 'styled-components';
import Temp from './Temp';
import Relays from './Relays';
import {TempHistory} from './TempHistory';

const Wrapper = styled.div`
  padding: 20px;
  background: #edede9;
  min-height: 100vh;
`;

const App = (): JSX.Element => (
  <>
    <Wrapper>
      <Temp />
      <TempHistory />
      <Relays />
    </Wrapper>
  </>
);

export default App;
