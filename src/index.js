import API from '../js/fetchCountries';
import getRefs from '../js/getRefs';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import { error } from '@pnotify/core';
import countryTpl from '../templates/countryTpl.hbs';
import countryListTpl from '../templates/countryListTpl.hbs';
import debounce from 'lodash.debounce';
import '../css/styles.scss';

const refs = getRefs();

refs.inputField.addEventListener('input', debounce(onSearch, 500));

function onSearch(e) {
    const searchQuery = e.target.value;

    if (searchQuery === '') {
        refs.resultsOutput.innerHTML = '';
    } else {
        API.fetchCountriesByName(searchQuery)
            .then(validator)
            .catch(onFetchError);
    }
}

function validator(searchResult) {
    if (searchResult.length > 10) {
        error({
            text: 'Too many matches found. Please enter a more specific query',
            animation: 'fade',
            hide: true,
            delay: 2000,
        });
    } else if (searchResult.length < 10 && searchResult.length > 1) {
        renderCountriesList(searchResult);
    } else {
        renderCountryProfile(searchResult);
    }
}

function renderCountriesList(countries) {
    const wrapper = { objects: countries };
    const countriesListMarkup = countryListTpl(wrapper);
    refs.resultsOutput.innerHTML = countriesListMarkup;
}

function renderCountryProfile(country) {
    const wrapper = country[0];
    const countryProfileMarkup = countryTpl(wrapper);
    refs.resultsOutput.innerHTML = countryProfileMarkup;
}

function onFetchError(err) {
    error({
        text: 'No matches found. Please enter a more specific query',
        animation: 'fade',
        hide: true,
        delay: 2000,
    });
}
