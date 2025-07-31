import styled from "styled-components";

const Lable = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.colors.primary};
`;

const StyledSelect = styled.select`
  padding: 10px 15px;
  font-size: 16px;
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 20px;
  cursor: pointer;
  outline: none;

  &:hover
  {
    border-color: ${({ theme }) => theme.colors.secondary};
  }

  &:focus
  {
    box-shadow: 0 0 5px ${({ theme }) => theme.colors.secondary};
  }
`;

const CitySelector = ({ cities, selectedCity, onCityChange }) => 
(
    <>
    <Lable htmlFor="city-select">Escolha a Cidade</Lable>
    <StyledSelect id="city-select" value={selectedCity} onChange={onCityChange}>
        {cities.map((city) => 
        (
            <option key={city} value={city}>
                {city}
            </option>
        ))}
    </StyledSelect>
    </>
);

export default CitySelector;