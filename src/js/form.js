import $ from 'jquery';

import 'parsleyjs';
import intlTelInput from 'intl-tel-input';
import 'bootstrap-datepicker';
import 'bootstrap-datepicker/dist/locales/bootstrap-datepicker.en-GB.min.js';
import { fetchCountryData, urlPutsStep1 } from './apiRequests.js';

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    let countyList = [];

    function myMap() {
      let mapProp = {
        center: new google.maps.LatLng(34.10142, -118.34373),
        zoom: 12,
      };

      let marker = new google.maps.Marker({
        position: new google.maps.LatLng(34.10143056752168, -118.343672892704),
      });

      let map = new google.maps.Map(
        document.getElementById('googleMap'),
        mapProp
      );
      marker.setMap(map);
    }

    const formStep1 = $('#form-step1');
    const formStep2 = $('#form-step2');
    formStep1.parsley({
      excluded: '.iti__search-input',
    });

    // Initialize intl-tel-input
    const phoneInput = document.querySelector('#phone');
    const iti = intlTelInput(phoneInput, {
      initialCountry: 'ua',
      separateDialCode: true,
      utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@23.8.0/build/js/utils.js',
    });

    const errorMsg = document.querySelector('#error-msg');
    const validMsg = document.querySelector('#valid-msg');

    const errorMap = [
      'Invalid number',
      'Invalid country code',
      'Too short',
      'Too long',
      'Invalid number',
    ];

    const reset = () => {
      phoneInput.classList.remove('error');
      errorMsg.innerHTML = '';
      errorMsg.classList.add('hide');
      validMsg.classList.add('hide');
    };

    const showError = (msg) => {
      phoneInput.classList.add('error');
      errorMsg.innerHTML = msg;
      errorMsg.classList.remove('hide');
    };

    const showValid = () => {
      phoneInput.classList.remove('error');
      validMsg.classList.remove('hide');
    };

    phoneInput.addEventListener('change', reset);
    phoneInput.addEventListener('keyup', reset);

    let hiddenInput = document.querySelector('#full_phone');
    if (!hiddenInput) {
      hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      hiddenInput.name = 'full_phone';
      hiddenInput.id = 'full_phone';
      document.getElementById('form-step1').appendChild(hiddenInput);
    }

    // Initialize datepicker
    $('#birthdate').datepicker({
      language: 'en-GB',
      format: 'yyyy-mm-dd',
      autoclose: true,
    });

    const countryInput = $('#country');
    countryInput.on('change', function () {
      iti.setCountry(this.value);
    });

    fetchCountryData()
      .then((countries) => {
        countyList = countries;
        for (let i = 0; i < countries.length; i++) {
          let isCountryUA = countries[i].id === 224;
          if (isCountryUA) {
            countryInput.prepend(
              $(
                '<option value="' +
                  countries[i].code +
                  '" selected>' +
                  countries[i].name +
                  '</option>'
              )
            );
          } else {
            countryInput.prepend(
              $(
                '<option value="' +
                  countries[i].code +
                  '">' +
                  countries[i].name +
                  '</option>'
              )
            );
          }
        }
      })

    function previewImage() {
      const input = document.getElementById('image-upload');
      const img = document.getElementById('preview-img');
      if (!input || !img) return;

      input.addEventListener('change', function () {
        const file = input.files[0];
        if (!file) return;

        if (file) {
          const reader = new FileReader();
          reader.addEventListener('load', function () {
            img.src = reader.result;
          });
          reader.readAsDataURL(file);
        }
      });
    }

    function shareSocialMedia() {
      const pageUrl = window.location.href;
      if (!pageUrl) return;

      const encodeUrl = encodeURIComponent(pageUrl);
      const postText = encodeURIComponent(
        "I'm sharing an interesting pet project with you."
      );
      const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeUrl}&text=${postText}`,
      };

      document.querySelectorAll('button[data-platform]').forEach((button) => {
        button.addEventListener('click', () => {
          const platform = button.getAttribute('data-platform');
          if (!platform) return;

          const url = shareUrls[platform];
          if (url) {
            window.open(url, '_blank', 'width=600,height=400');
          }
        });
      });
    }

    const btnStepFirst = document.getElementById('button-submit-step1');
    const btnStepSecond = document.getElementById('button-submit-step2');
    const contentStepFirst = document.getElementById('form-step1');
    const contentStepSecond = document.getElementById('form-step2');
    const contentStepThird = document.getElementById('form-step3');

    function PutDataFormStep1() {
      const data = {};
      const formData = new FormData(document.getElementById('form-step1'));

      formData.forEach((value, key) => {
        if (key === 'country_id') {
          const country = countyList.find((item) => item.code === value);
          if (country) {
            value = country.id;
          }
        }
        data[key] = value;
      });

      urlPutsStep1(data)
        .then((response) => {
          localStorage.setItem('currentStep', '2');
          myMap();
          contentStepFirst.classList.add('hide');
          contentStepSecond.classList.remove('hide');
          initStep2();
        })
        .catch((error) =>
          console.error('Error', error.response?.data || error)
        );
    }

    function initStep2() {
      previewImage();

      btnStepSecond.addEventListener('click', function (e) {
        e.preventDefault();
        const isValidSecondStep = formStep2.parsley().validate();

        if (isValidSecondStep) {
          localStorage.setItem('currentStep', '3');
          myMap();
          contentStepSecond.classList.add('hide');
          contentStepThird.classList.remove('hide');
          initStep3();
        }
      });
    }

    function initStep3() {
      contentStepThird.classList.remove('hide');
      shareSocialMedia();
    }

    const currentStep = localStorage.getItem('currentStep') || '1';
    if (currentStep === '1') {
      contentStepFirst.classList.remove('hide');
      myMap();

      btnStepFirst.addEventListener('click', function (e) {
        e.preventDefault();
        const number = iti.getNumber();
        hiddenInput.value = number;
        formStep1.parsley().validate();

        const isValidFirstStepForm = formStep1.parsley().isValid();
        const isValidPhone = iti.isValidNumberPrecise();

        if (!isValidPhone) {
          const errorCode = iti.getValidationError();
          const msg = errorMap[errorCode] || 'Invalid number';
          showError(msg);
        }

        if (isValidFirstStepForm && isValidPhone) {
          PutDataFormStep1();
        }
      });
    }
  });
})();
