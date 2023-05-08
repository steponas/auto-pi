import React, {useEffect, useState} from 'react'
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';
import moment from 'moment';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {getPiData} from "client/common/fetch";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Wrapper = styled.div`
  margin: 20px 0;
  height: 250px;
`;

export const TempHistory = () => {
  const [data, setData] = useState<{ history: {temp: number; date: string }[] } | undefined>();
  const [error, setError] = useState();

  useEffect(() => {
    getPiData('temp-history')
      .then(data => setData(data))
      .catch(err => setError(err));
  }, []);

  if (error) {
    return <div style={{color: 'red'}}>Failed to fetch: {JSON.stringify(error)}</div>;
  }
  if (!data) {
    return <>Loading...</>;
  }

  const hist = data.history;
  return (
    <Wrapper>
      <Line
        datasetIdKey="id"
        data={{
          labels: hist.map(row => moment(row.date).format('MM-DD HH:mm')),
          datasets: [
            {
              label: 'Temp',
              data: hist.map(row => row.temp),
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            }
          ]
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: false,
            },
          },
        }}
      />
    </Wrapper>
  );
}
