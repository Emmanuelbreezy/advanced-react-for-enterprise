import React from 'react';

import Select from './Select';

import '@ds.e/scss/lib/Select.css';

const options = [
    {
    label: "Strict Black",
    value: "strict-black",
  },
  {
    label: "Heavenly Green",
    value: "heavenly-green",
  },
  {
    label: "Sweet Pink",
    value: "pink",
  }
  ]

export default {
    title: 'Molecules/Select'
}


export const Template =() => <Select options={options} />