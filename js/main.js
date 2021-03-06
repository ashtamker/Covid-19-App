
const countryApi = 'https://restcountries.herokuapp.com/api/v1';
const proxyKey = 'https://api.allorigins.win/raw?url';
const covidApi = 'https://corona-api.com/countries';

const area = {};

async function getCountries() {
    const response = await fetch(`${proxyKey}=${countryApi}`);
    const data = await response.json();
    const countryInRegion = [];

    for(let i = 0; i < data.length; i++){

     countryInRegion.push({name: data[i].name.common, region: data[i].region, key: data[i].cca2});
    }
     
     countryInRegion.forEach(c => {
         if(area[c.region])
         area[c.region].push(c);
         else 
         area[c.region] = [c];
     });  
    

}

console.log(getCountries()); 








var ctx = document.getElementById('canvas').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '#',
            data: [12, 11, 1, 5, 2, 23],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
