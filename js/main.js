$(document).ready(function () {

  let _url = "https://my-json-server.typicode.com/Praz-715/pwaapi/product";


  let dataResults = '';
  let catResults = '';
  let categories = [];


  function renderPage(data) {


    $.each(data, function (key, items) {

      _cat = items.category

      dataResults += "<div>"
        + "<h3>" + items.name + "</h3>"
        + "<p>" + _cat + "</p>"


      "</div>";

      if ($.inArray(_cat, categories) == -1) {
        categories.push(_cat)
        catResults += "<option value='" + _cat + "'>" + _cat + "</option>"
      }


    })

    $('#products').html(dataResults)
    $('#cat_select').html("<option value='all'>semua</option>" + catResults)
  }

  let networkDataRecived = false

  // fresh data from online
  let networkUpdate = fetch(_url).then((response) => response.json())
    .then((data) => {
      networkDataRecived = true
      renderPage(data)
    })

  // return data from caches
  caches.match(_url).then((response) => {
    if (!response) throw Error('no data on cache')
    return response.json()
  }).then((data) => {
    if (!networkDataRecived) {
      renderPage(data)
      console.log('render data from cache')
    }
  }).catch(function () {
    return networkUpdate
  })

  $('#cat_select').on('change', function () {

    updateProduct($(this).val())

  })

  function updateProduct(cat) {

    let _newUrl = _url
    let NewDataResults = ''


    cat != "all" ? _newUrl += "?category=" + cat : _newUrl = _url



    console.log(_newUrl)
    $.get(_newUrl, function (data) {

      $.each(data, function (key, items) {

        _cat = items.category

        NewDataResults += "<div>"
          + "<h3>" + items.name + "</h3>"
          + "<p>" + _cat + "</p>"


        "</div>";



      })
      $('#products').html(NewDataResults)
    })


  }





}) // end document ready jquery


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(registration => {
        console.log('SW registered with scope:', registration.scope);
      })
      .catch(err => {
        console.error('Registration failed:', err);
      });
  });
}

