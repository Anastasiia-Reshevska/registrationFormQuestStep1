import axios from 'axios';

export function fetchCountryData() {
  const urlCountries =
    'http://quest-registration-api.groupbwt.com/api/countries';
  return axios.get(urlCountries).then((response) => {
    const countries = response.data.countries;
    return countries;
  });
}

export function urlPutsStep1(data) {
  const urlPutsStep1 = 'http://quest-registration-api.groupbwt.com/api/members';
  return axios.post(urlPutsStep1, data);
  return response;
}

export function getListMembers() {
  const urlMembers = 'http://quest-registration-api.groupbwt.com/api/members?per_page=100';
  return axios.get(urlMembers)
  return response;
}
