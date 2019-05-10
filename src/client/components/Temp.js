import React from 'react';
import { getPiData } from '../common/fetch';

export default class Temp extends React.Component {
  state = {
    temp: null,
  };

  componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    try {
      const data = await getPiData('temp');
      this.setState({ temp: data.temp });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const temp = this.state.temp || 'Loading...';

    return `Temp: ${temp}`;
  }
}
