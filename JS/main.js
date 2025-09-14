
function myMap() {
    let mapProp = {
        center: new google.maps.LatLng(34.10142, -118.34373),
        zoom: 12,
    };

    let marker = new google.maps.Marker({
        position: new google.maps.LatLng(34.10143056752168, -118.343672892704),
    });
    let map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    marker.setMap(map);
};

document.addEventListener("DOMContentLoaded", function () {
    const phoneInput = document.querySelector("#phone");
    const iti = window.intlTelInput(phoneInput, {
        initialCountry: "ua",
        separateDialCode: true,
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@23.8.0/build/js/utils.js",
    });

    $('#birthdate').datepicker({
        autoclose: true
    });

    const countryInput = $("#country");
    countryInput.on("change", function () {
        iti.setCountry(this.value);
    });

    function fetchCountryData() {
      const urlCountries = 'http://quest-registration-api.groupbwt.com/api/countries';
      fetch(urlCountries)
        .then((response) => response.json())
        .then((data) => {
          for (let i = 0; i < data.countries.length; i++) {
            let isCountryUA = data.countries[i].id === 224;
            if (isCountryUA) {
                countryInput.prepend($('<option value="' + data.countries[i].id + '" selected>' + data.countries[i].name + '</option>'));
            } else {
                countryInput.prepend($('<option value="' + data.countries[i].id + '">' + data.countries[i].name + '</option>'));
            }
          }
        });
    }
    fetchCountryData();
})

$(function PutDataFormStep1() {
  const formStep1 = $('#form-step1');
  if (!formStep1 || formStep1.length === 0) return null;
  formStep1
    .parsley({
      excluded: '.iti__search-input',
    })
    .on('form:submit', function () {
      const formData = new FormData(formStep1[0]);
      const urlPutsStep1 = 'http://quest-registration-api.groupbwt.com/api/members';
      fetch(urlPutsStep1, {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
            console.log(response)
        })

      return false;
    });
});



