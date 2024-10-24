import React, { useState } from 'react';
import './DropDownCurso.css'

const Dropdown = ({ options, onChange }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    onChange(selectedValue);
  };

  return (
    <select className='curso__select' value={selectedOption} onChange={handleChange}>
      <option className='curso__option' value="">Selecciona una opción</option>
      {options.map((option) => (
        <option className='curso__option' key={option.idSubject} value={option.idSubject}>
          {option.subjectName}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
