import * as React from 'react';
import { getPiData } from '../common/fetch';
import _ from 'lodash';

// Inspiration and svg from https://codepen.io/dustindowell/pen/rxjxVp

const numberSvgMap = {
  0: [1, 1, 1, 0, 1, 1, 1], // 0
  1: [0, 0, 1, 0, 0, 1, 0], // 1
  2: [1, 0, 1, 1, 1, 0, 1], // 2
  3: [1, 0, 1, 1, 0, 1, 1], // 3
  4: [0, 1, 1, 1, 0, 1, 0], // 4
  5: [1, 1, 0, 1, 0, 1, 1], // 5
  6: [1, 1, 0, 1, 1, 1, 1], // 6
  7: [1, 0, 1, 0, 0, 1, 0], // 7
  8: [1, 1, 1, 1, 1, 1, 1], // 8
  9: [1, 1, 1, 1, 0, 1, 1], // 9
  '-': [0, 0, 0, 1, 0, 0, 0],
};

interface SvgStyle {
  opacity: number;
};
const gStyle = (isActive): SvgStyle => ({
  opacity: isActive ? 1 : 0.08,
});
const getLineStyle = (number, gPos): SvgStyle => {
  const map = numberSvgMap[number];
  return gStyle(map[gPos] === 1);
};

interface ClockProps {
  temp?: number;
};

const Clock = ({ temp }: ClockProps): JSX.Element => {
  let minus: boolean;
  let num1: string;
  let num2: string;
  if (typeof temp === 'number') {
    let strTemp = String(Math.abs(temp));
    if (strTemp.length < 2) {
      strTemp = `0${strTemp}`;
    }
    num1 = strTemp[0];
    num2 = strTemp[1];
    minus = temp < 0;
  } else {
    num1 = '-';
    num2 = '-';
    minus = false;
  }

  return (
    <svg id='clock' width="55" height="32" xmlns='http://www.w3.org/2000/svg'>
      <g>
        <g id="sign">
          <polygon style={gStyle(minus)} points="3,14 9,14 12,16 9,18 3,18 0,16 "/>
        </g>
        <g id="firstNum">
          <path style={getLineStyle(num1, 6)} id="b7" d="M17.774646997451782,31 l3,-3 h6 l3,3 c0,0 -1,1 -3,1 h-6 C18.774646997451782,32 17.774646997451782,31 17.774646997451782,31 z"/>
          <path style={getLineStyle(num1, 5)} id="b6" d="M30.774646997451782,17 l-3,2 v8 l3,3 c0,0 1,-1 1,-3 v-7 C31.774646997451782,18 30.774646997451782,17 30.774646997451782,17 z"/>
          <path style={getLineStyle(num1, 4)} id="b5" d="M16.774646997451782,17 l3,2 v8 l-3,3 c0,0 -1,-1 -1,-3 v-7 C15.774646997451782,18 16.774646997451782,17 16.774646997451782,17 z"/>
          <polygon style={getLineStyle(num1, 3)} id="b4" points="20.774667009711266,14 26.774682268500328,14 29.774693712592125,16 26.774682268500328,18 20.774667009711266,18 17.774659380316734,16 "/>
          <path style={getLineStyle(num1, 2)} id="b3" d="M30.774646997451782,2 l-3,3 v8 l3,2 c0,0 1,-1 1,-3 v-7 C31.774646997451782,3 30.774646997451782,2 30.774646997451782,2 z"/>
          <path style={getLineStyle(num1, 1)} id="b2" d="M16.774646997451782,2 l3,3 v8 l-3,2 c0,0 -1,-1 -1,-3 v-7 C15.774646997451782,3 16.774646997451782,2 16.774646997451782,2 z"/>
          <path style={getLineStyle(num1, 0)} id="b1" d="M17.774646997451782,1 l3,3 h6 l3,-3 c0,0 -1,-1 -3,-1 h-6 C18.774646997451782,0 17.774646997451782,1 17.774646997451782,1 z"/>
        </g>
        <g id="secondNum">
          <path style={getLineStyle(num2, 6)} id="a7" d="M35.77464699745178,31 l3,-3 h6 l3,3 c0,0 -1,1 -3,1 h-6 C36.77464699745178,32 35.77464699745178,31 35.77464699745178,31 z"/>
          <path style={getLineStyle(num2, 5)} id="a6" d="M48.77464699745178,17 l-3,2 v8 l3,3 c0,0 1,-1 1,-3 v-7 C49.77464699745178,18 48.77464699745178,17 48.77464699745178,17 z"/>
          <path style={getLineStyle(num2, 4)} id="a5" d="M34.77464699745178,17 l3,2 v8 l-3,3 c0,0 -1,-1 -1,-3 v-7 C33.77464699745178,18 34.77464699745178,17 34.77464699745178,17 z"/>
          <polygon style={getLineStyle(num2, 3)} id="a4" points="38.77471278607845,14 44.774728044867516,14 47.77473567426205,16 44.774728044867516,18 38.77471278607845,18 35.77470515668392,16 "/>
          <path style={getLineStyle(num2, 2)} id="a3" d="M48.77464699745178,2 l-3,3 v8 l3,2 c0,0 1,-1 1,-3 v-7 C49.77464699745178,3 48.77464699745178,2 48.77464699745178,2 z"/>
          <path style={getLineStyle(num2, 1)} id="a2" d="M34.77464699745178,2 l3,3 v8 l-3,2 c0,0 -1,-1 -1,-3 v-7 C33.77464699745178,3 34.77464699745178,2 34.77464699745178,2 z"/>
          <path style={getLineStyle(num2, 0)} id="a1" d="M35.77464699745178,1 l3,3 h6 l3,-3 c0,0 -1,-1 -3,-1 h-6 C36.77464699745178,0 35.77464699745178,1 35.77464699745178,1 z"/>
        </g>
      </g>
    </svg>
  );
};

interface State {
  temp?: number;
};

export default class Temp extends React.Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount(): void {
    this.fetchData();
  }

  async fetchData(): Promise<void> {
    try {
      const data = await getPiData('temp');
      this.setState({ temp: data.temp });
    } catch (err) {
      console.log(err);
    }
  }

  render(): JSX.Element {
    const temp = this.state.temp;

    return <div>
      <Clock temp={temp} />
    </div>;
  }
}
