import React from 'react';

import Select from './Select';

//import { shallow } from 'enzyme';
import { render, fireEvent } from '@testing-library/react';

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

it('renders all options passed to it', () => {
    const { getAllByRole, getByTestId } = render(<Select options={options} /> );
    
    fireEvent.click(getByTestId('dse-select-button'));

    expect(getAllByRole('menuitemradio')).toHaveLength(options.length);
});

it('renders options using custom renderOption method if passed as prop', () => {
  const { getAllByTestId, getByTestId } = render(<Select options={options}  renderOption={({option, getOptionRecommendedProps}) => {
    return <li data-testid="custom-render-option" {...getOptionRecommendedProps()}>{option.label}</li>
  }}/> );

  fireEvent.click(getByTestId('dse-select-button'));

  expect(getAllByTestId('custom-render-option')).toHaveLength(options.length);
    
});

it.only('calls the onOptionSelected prop with the selected option *and its index if passed', () => {
  const onOptionSelected = jest.fn();
  const { getAllByRole, getByTestId } = render(<Select options={options} onOptionSelected={onOptionSelected} /> );

  fireEvent.click(getByTestId('dse-select-button'));

  fireEvent.click(getAllByRole('menuitemradio')[0]);
    
  expect(onOptionSelected).toHaveBeenCalledWith(options[0], 0);
});

it('the button label changes to the selected option label', () => {
  const { getAllByRole, getByTestId } = render(<Select options={options} /> );

  fireEvent.click(getByTestId('dse-select-button'));

  fireEvent.click(getAllByRole('menuitemradio')[0]);
    
  expect(getByTestId('dse-select-button')).toHaveTextContent(options[0].label);
});

it('snashot of the selected optioon state', () => {
  const { getAllByRole, getByTestId, asFragment } = render(<Select options={options} /> );

  fireEvent.click(getByTestId('dse-select-button'));

  fireEvent.click(getAllByRole('menuitemradio')[0]);
    
  expect(asFragment()).toMatchSnapshot();
});

it('snashot ofthe base state', () => {
  const { getByTestId, asFragment } = render(<Select options={options} /> );

  fireEvent.click(getByTestId('dse-select-button'));

  expect(asFragment()).toMatchSnapshot();
});

it('can customize select label', () => {
  const { getByText } = render(<Select options={options} label='This is a custom label' /> );

  expect(getByText(/This is a custom label/)).toBeInTheDocument();
});