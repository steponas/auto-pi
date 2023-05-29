import React from 'react';
import {Modal, Button, Typography} from 'antd';
import styled from 'styled-components';

interface Props {
  onSelect: (minutes: number) => void;
  onClose: () => void;
  open: boolean;
}

const DURATIONS = [
  {
    time: 30,
    label: '30 min'
  },
  {
    time: 60,
    label: '1 hr'
  },
  {
    time: 120,
    label: '2 hrs'
  },
  {
    time: 240,
    label: '4 hrs'
  }
];

const BigButtom = styled(Button)`
  width: 100%;
  margin-bottom: 20px;
`;

const Title = styled(Typography.Title)`
  margin-bottom: 20px !important;
`;

export const RelayDurationModal = ({onSelect, onClose, open}: Props) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={false}
    >
      <Title level={5}>When to turn the it off?</Title>
      {DURATIONS.map(({time, label}) => (
        <BigButtom key={time} onClick={() => onSelect(time)}>in {label}</BigButtom>
      ))}
    </Modal>
  )
};
