import React, {KeyboardEventHandler, useEffect, useRef } from 'react';

import Text from '../../atoms/Text'

const KEY_CODES = {
  ENTER: 13,
  SPACE: 32,
  DOWN_ARROW: 40
}

interface SelectOption {
  label: string;
  value: string;
}

interface RenderOptionProps{
    isSelected: boolean;
    option: SelectOption;
    getOptionRecommendedProps: (overideProps?: Object) => Object;
}

interface SelectProps {
  onOptionSelected?: (option: SelectOption, optionIndex: number) => void;
  options?: SelectOption[];
  label?: string;
  renderOption?:(props: RenderOptionProps) => React.ReactNode;
}


const Select:React.FC<SelectProps>  = ({options = [], label="Select an option", onOptionSelected:handler, renderOption}) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = React.useState<null | number>(null);
  const [highlightedIndex, setHighlightedIndex] = React.useState<null | number>(null);
  const [overlayTop, setOverlayTop] = React.useState<number>(0);
  const labelRef = useRef<HTMLButtonElement>(null);
  const [optionRef, setOptionRef] = React.useState<React.RefObject<HTMLLIElement>[]>([]);
   
  const onOptionSelected = (option:SelectOption, optionIndex: number) => {
    setIsOpen(!isOpen)
    if(handler){
      handler(option, optionIndex);
    }
    setSelectedIndex(optionIndex);
    setIsOpen(false);
   }
   const onLabelClick = () => {
    setIsOpen(!isOpen);
   }

   useEffect(() => {
    setOverlayTop((
       labelRef.current?.offsetHeight || 0
    ) + 10);
   }, [labelRef.current?.offsetHeight])

   let selectedOption = null;
   
   if(selectedIndex !== null){
     selectedOption = options[selectedIndex];
   }

   const highlightItem = (optionIndex: number | null) => {
    setHighlightedIndex(optionIndex);

   } 

   const onButtonKeyDown: KeyboardEventHandler = (event) => {
      event.preventDefault();

      if([KEY_CODES.ENTER, KEY_CODES.SPACE, KEY_CODES.DOWN_ARROW].includes(event.keyCode)){
          setIsOpen(true);

          highlightItem(0);

      }
   }

   useEffect(() => {
      setOptionRef(options.map(_ => React.createRef<HTMLLIElement>()))
   },[options.length]);

   useEffect(() => {
    if(highlightedIndex !== null && isOpen){
      const ref = optionRef[highlightedIndex];

      if(ref && ref.current){
        ref.current.focus();
      }
    }
   },[isOpen])
  
  return (
    <div className="dse-select">
      <button 
        onKeyDown={onButtonKeyDown}
        aria-controls='dse-select-list'
        aria-haspopup={true}
        aria-expanded={isOpen ? true: undefined}
        ref={labelRef}
        className="dse-select__label" onClick={() => onLabelClick()}>
        <Text>
          {selectedOption === null ? label : selectedOption.label}
          </Text>

          <svg  className={`dse-select__caret ${isOpen ? 'dse-select__caret--open':'dse-select__caret--closed'}`} width="1rem" height="1rem" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>

      </button>
      {isOpen ? (
        <ul
        role='menu'
        id='dse-select-list'
         style={{top: overlayTop}} className="dse-select__overlay">
          {options.map((option, optionIndex) => {
            const isSelected = selectedIndex === optionIndex;

            const isHightlighted = highlightedIndex === optionIndex

            const ref = optionRef[optionIndex]

            const renderOptionProps = {
              option,
              isSelected,
              getOptionRecommendedProps: (overrideProps = {}) => {return {
                ref,
                tabIndex:isHightlighted ? -1 : 0,
                onMouseEnter: () => highlightItem(optionIndex),
                onMouseLeave: () => highlightItem(null),
                className: `dse-select__option
                    ${isSelected ? 'dse-select__option--selected': ''}
                    ${isHightlighted ? 'dse-select__option--highlighted': ''} 
                  `,
                  key: option.value,
                  onClick: () => onOptionSelected(option, optionIndex),
                  ...overrideProps
              }}
            }

            if(renderOption){
                return renderOption(renderOptionProps)
            }
            return <li 
                     {...renderOptionProps.getOptionRecommendedProps()}
                   >
                      <Text>
                        {option.label}
                      </Text>
                      {isSelected ? (
                        <svg  width='1rem' height='1rem' fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ): null}

                    </li>
          })}
        </ul>

      ) : null}
    </div>
  )
}

export default Select;