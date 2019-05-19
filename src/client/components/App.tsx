import * as React from 'react';
import styled from 'styled-components';
import Temp from './Temp';

const Wrapper = styled.div`
  max-width: 400px;
  border: 1px solid black;
`;

const App = (): JSX.Element => <Wrapper>
  <Temp />
  <div>
    Other things...
  </div>
</Wrapper>;

export default App;
