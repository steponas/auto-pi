import * as React from 'react';
import styled from 'styled-components';
import Temp from './Temp';
import Relays from './Relays';

const Wrapper = styled.div`
  border: 1px solid black;
`;

const App = (): JSX.Element => <Wrapper>
  <Temp />
  <Relays />
</Wrapper>;

export default App;
