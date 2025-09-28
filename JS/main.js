(function () {
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

  document.addEventListener('DOMContentLoaded', function () {
    const phoneInput = document.querySelector('#phone');
    const iti = window.intlTelInput(phoneInput, {
      initialCountry: 'ua',
      separateDialCode: true,
      utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@23.8.0/build/js/utils.js',
    });

    $('#birthdate').datepicker({
      autoclose: true,
    });

    const countryInput = $('#country');
    countryInput.on('change', function () {
      iti.setCountry(this.value);
    });

    function fetchCountryData() {
      const urlCountries = 'http://quest-registration-api.groupbwt.com/api/countries';
      fetch(urlCountries).then((response) => response.json()).then((data) => {
          for (let i = 0; i < data.countries.length; i++) {
            let isCountryUA = data.countries[i].id === 224;
            if (isCountryUA) {
              countryInput.prepend(
                $('<option value="' +
                    data.countries[i].id +
                    '" selected>' +
                    data.countries[i].name +
                    '</option>'
                )
              );
            } else {
              countryInput.prepend(
                $('<option value="' +
                    data.countries[i].id +'">' +
                    data.countries[i].name +
                    '</option>'
                  )
              );
            }
          }
        });
    }
    fetchCountryData();
  });

  $(function PutDataFormStep1() {
    const formStep1 = $('#form-step1');
    if (!formStep1 || formStep1.length === 0) return null;
    formStep1.parsley({
        excluded: '.iti__search-input',
      })
      .on('form:submit', function () {
        const formData = new FormData(formStep1[0]);
        const urlPutsStep1 ='http://quest-registration-api.groupbwt.com/api/members';
        fetch(urlPutsStep1, {
          method: 'POST',
          body: formData,
        }).then((response) => {
        });
        return false;
      });
  });

  function formSwitch() {
    const btnStepFirst = document.getElementById('button-submit-step1');
    const btnStepSecond = document.getElementById('button-submit-step2');
    const contentStepFirst = document.getElementById('form-step1');
    const contentStepSecond = document.getElementById('form-step2');
    const contentStepThird = document.getElementById('form-step3');
    if (!btnStepFirst ||!contentStepFirst || !contentStepSecond || !btnStepFirst || !btnStepSecond ||!contentStepThird) return;

    contentStepFirst.classList.add('hide');
    contentStepSecond.classList.add('hide');
    contentStepThird.classList.add('hide');

    btnStepFirst.addEventListener('click', function () {
      const isValidFirstStep = $('#form-step1').parsley().validate();

      if (isValidFirstStep) {
        localStorage.setItem('currentStep', '2');
        contentStepSecond.classList.remove('hide');
        contentStepFirst.classList.add('hide');
      }
    });

    btnStepSecond.addEventListener('click', function () {
      const isValidSecondStep = $('#form-step2').parsley().validate();

      if (isValidSecondStep) {
        localStorage.setItem('currentStep', '3');
        contentStepSecond.classList.add('hide');
        contentStepThird.classList.remove('hide');
      }
    });

    const getItem = localStorage.getItem('currentStep');
    if (getItem === '2') {
      contentStepSecond.classList.remove('hide');
    } else if (getItem === '3') {
      contentStepThird.classList.remove('hide');
    } else {
      contentStepFirst.classList.remove('hide');
    }
  }

  formSwitch();

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

  previewImage();

  function validEmail() {
    const formStepFirst = document.getElementById('form-step1');
    const input = document.querySelector('#phone');
    const button = document.querySelector('#button-submit-step1');
    const errorMsg = document.querySelector('#error-msg');
    const validMsg = document.querySelector('#valid-msg');

    if (!formStepFirst || !input || !button || !errorMsg || !validMsg) return;

    let hiddenInput = document.querySelector('#full_phone');
    if (!hiddenInput) {
      hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      hiddenInput.name = 'full_phone';
      hiddenInput.id = 'full_phone';
      formStepFirst.appendChild(hiddenInput);
    }

    const errorMap = [
      'Invalid number',
      'Invalid country code',
      'Too short',
      'Too long',
      'Invalid number',
    ];

    const iti = window.intlTelInput(input, {
      initialCountry: 'ua',
      utilsScript:'https://cdn.jsdelivr.net/npm/intl-tel-input@23.8.0/build/js/utils.js',
    });

    const reset = () => {
      input.classList.remove('error');
      errorMsg.innerHTML = '';
      errorMsg.classList.add('hide');
      validMsg.classList.add('hide');
    };

    const showError = (msg) => {
      input.classList.add('error');
      errorMsg.innerHTML = msg;
      errorMsg.classList.remove('hide');
    };

    const showValid = () => {
      input.classList.remove('error');
      validMsg.classList.remove('hide');
    };

    button.addEventListener('click', () => {
      reset();
      if (!input.value.trim()) {
        showError('Required');
      } else if (iti.isValidNumber()) {
        showValid();
      } else {
        const errorCode = iti.getValidationError();
        const msg = errorMap[errorCode] || 'Invalid number';
        showError(msg);
      }
    });

    input.addEventListener('change', reset);
    input.addEventListener('keyup', reset);

    formStepFirst.addEventListener('submit', function (e) {
      reset();

      if (!input.value.trim()) {
        e.preventDefault();
        showError('Required');
      } else if (!iti.isValidNumber()) {
        e.preventDefault();
        const errorCode = iti.getValidationError();
        const msg = errorMap[errorCode] || 'Invalid number';
        showError(msg);
      } else {
        const number = iti.getNumber();
        hiddenInput.value = number;
        showValid();
      }
    });
  }

  validEmail();


  function shareSocialMedia() {
    const pageUrl = window.location.href;
    if (!pageUrl) return;

    const encodeUrl = encodeURIComponent(pageUrl);
    const postText = encodeURIComponent("I'm sharing an interesting pet project with you."
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

  shareSocialMedia();
})();
