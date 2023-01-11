import React, { useRef, useEffect } from 'react';
import Text from '../../atoms/Text/Text.js';

const KEY_CODES = {
    ENTER: 13,
    SPACE: 32,
    DOWN_ARROW: 40,
    UP_ARROW: 38,
    ESC: 27
};
const getPreviousOptionIndex = (currentIndex, options) => {
    if (currentIndex === null) {
        return 0;
    }
    if (currentIndex == 0) {
        return options.length - 1;
    }
    return currentIndex - 1;
};
const getNextOptionIndex = (currentIndex, options) => {
    if (currentIndex === null) {
        return 0;
    }
    if (currentIndex == options.length - 1) {
        return 0;
    }
    return currentIndex + 1;
};
const Select = ({ options = [], label = "Select an option", onOptionSelected: handler, renderOption }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(null);
    const [highlightedIndex, setHighlightedIndex] = React.useState(null);
    const [overlayTop, setOverlayTop] = React.useState(0);
    const labelRef = useRef(null);
    const [optionRef, setOptionRef] = React.useState([]);
    const onOptionSelected = (option, optionIndex) => {
        setIsOpen(!isOpen);
        if (handler) {
            handler(option, optionIndex);
        }
        setSelectedIndex(optionIndex);
        setIsOpen(false);
    };
    const onLabelClick = () => {
        setIsOpen(!isOpen);
    };
    useEffect(() => {
        setOverlayTop((labelRef.current?.offsetHeight || 0) + 10);
    }, [labelRef.current?.offsetHeight]);
    let selectedOption = null;
    if (selectedIndex !== null) {
        selectedOption = options[selectedIndex];
    }
    const highlightOption = (optionIndex) => {
        setHighlightedIndex(optionIndex);
    };
    const onButtonKeyDown = (event) => {
        event.preventDefault();
        if ([KEY_CODES.ENTER, KEY_CODES.SPACE, KEY_CODES.DOWN_ARROW].includes(event.keyCode)) {
            setIsOpen(true);
            highlightOption(0);
        }
    };
    useEffect(() => {
        setOptionRef(options.map(_ => React.createRef()));
    }, [options.length]);
    useEffect(() => {
        if (highlightedIndex !== null && isOpen) {
            const ref = optionRef[highlightedIndex];
            if (ref && ref.current) {
                ref.current.focus();
            }
        }
    }, [isOpen, highlightedIndex]);
    const onOptionKeyDown = (event) => {
        if (event.keyCode === KEY_CODES.ESC) {
            setIsOpen(false);
            return;
        }
        if (event.keyCode === KEY_CODES.DOWN_ARROW) {
            highlightOption(getNextOptionIndex(highlightedIndex, options));
        }
        if (event.keyCode === KEY_CODES.UP_ARROW) {
            highlightOption(getPreviousOptionIndex(highlightedIndex, options));
        }
        if (event.keyCode === KEY_CODES.ENTER) {
            onOptionSelected(options[highlightedIndex], highlightedIndex);
        }
    };
    return (React.createElement("div", { className: "dse-select" },
        React.createElement("button", { onKeyDown: onButtonKeyDown, "aria-controls": 'dse-select-list', "aria-haspopup": true, "aria-expanded": isOpen ? true : undefined, ref: labelRef, className: "dse-select__label", onClick: () => onLabelClick() },
            React.createElement(Text, null, selectedOption === null ? label : selectedOption.label),
            React.createElement("svg", { className: `dse-select__caret ${isOpen ? 'dse-select__caret--open' : 'dse-select__caret--closed'}`, width: "1rem", height: "1rem", fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor" },
                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19.5 8.25l-7.5 7.5-7.5-7.5" }))),
        isOpen ? (React.createElement("ul", { role: 'menu', id: 'dse-select-list', style: { top: overlayTop }, className: "dse-select__overlay" }, options.map((option, optionIndex) => {
            const isSelected = selectedIndex === optionIndex;
            const isHightlighted = highlightedIndex === optionIndex;
            const ref = optionRef[optionIndex];
            const renderOptionProps = {
                option,
                isSelected,
                getOptionRecommendedProps: (overrideProps = {}) => {
                    return {
                        ref,
                        role: 'menuitemradio',
                        'aria-label': option.label,
                        'aria-checked': isSelected ? true : undefined,
                        onKeyDown: onOptionKeyDown,
                        tabIndex: isHightlighted ? -1 : 0,
                        onMouseEnter: () => highlightOption(optionIndex),
                        onMouseLeave: () => highlightOption(null),
                        className: `dse-select__option
                    ${isSelected ? 'dse-select__option--selected' : ''}
                    ${isHightlighted ? 'dse-select__option--highlighted' : ''} 
                  `,
                        key: option.value,
                        onClick: () => onOptionSelected(option, optionIndex),
                        ...overrideProps
                    };
                }
            };
            if (renderOption) {
                return renderOption(renderOptionProps);
            }
            return React.createElement("li", { ...renderOptionProps.getOptionRecommendedProps() },
                React.createElement(Text, null, option.label),
                isSelected ? (React.createElement("svg", { width: '1rem', height: '1rem', fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor" },
                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4.5 12.75l6 6 9-13.5" }))) : null);
        }))) : null));
};

export { Select as default };
//# sourceMappingURL=Select.js.map
