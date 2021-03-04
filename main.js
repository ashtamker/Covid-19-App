const baseEndpoint = 'https://restcountries.herokuapp.com/api/v1';
const proxy = 'https://api.allorigins.win/raw?url';


async function getCountries() {
    const response = await fetch(`${proxy}=${baseEndpoint}`);
    const data = await response.json();
    const countryInRegion = {};

    for(let i = 0; i < data.length; i++)
     countryInRegion[data[i].name.common] = data[i].region;

    return countryInRegion;
    
}

console.log(getCountries()); 
