var event = {
  name: "",
  attendees: 0,
  category: {
    id: -1,
    name: "",
    slug: ""
  }
}


function getJSONFileResults(filename) {
  return $.getJSON(`./assets/JSON/${filename}.json`);
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


function createTreatHTML(treat) {
  var tags = "";
  for (var i = 0; i < treat.tags.length; i++) {
    treat.tags[i]
    tags += `<span class="text-gray-500 ml-3">${treat.tags[i]}</span>`;
  }

  var element = `
  <button data-treatobject='${JSON.stringify(treat)}'  type="button" class="treat mb-6 relative flex text-left rounded-lg shadow-xl bg-white block w-full overflow-hidden">
    <div class="w-2/12">
      <img src="${treat.image}" alt="" class="w-full h-32 object-fit object-cover">
    </div>
    <div class="w-5/6 p-4">
      <h4 class="font-bold text-2xl">${treat.name}</h4>
      <p class="text-black text-lg"><span class="font-bold">Cost:</span> $${treat.price.toFixed(2)}</p>
      <span class="block text-pink-600 hover:text-pink-400 transition duration-200 ease-in-out">Get Quote</span>
      <div class="tags absolute bottom-0 right-0 px-6 pb-2">
        ${tags}
      </div>
    </div>
  </button>
  `;

  return element;
}


function getTreatsWithCategory(categoryId=-1) {
  if (categoryId === -1) {
    getJSONFileResults("treats").done(function(data) {
      $("#treats-list").html("");
      var html = "";
      for (var i = 0; i < data.length; i++) {
        html += createTreatHTML(data[i]);
      }
      $("#treats-list").append(html);
    });
  } else {
    $("#treats-list").html("");
    getJSONFileResults("treats").done(function(data) {
      var html = "";
      for (var i = 0; i < data.length; i++) {
        if (data[i].categoryId == categoryId) {
          html += createTreatHTML(data[i]);
        }
      }

      $("#treats-list").append(html);
    });
  }
}

function showEventData() {
  $("#for").text(event.name);
  $("#attendees").text(event.attendees);
  $("#selected-category").text(event.category.name);
}

function submitEventForm() {
  event.name = $('#event-form #event-name').val();
  event.attendees = parseInt($('#event-form #event-attendees').val());
  event.category.id = parseInt($("#event-form #event-category").val());

  getJSONFileResults("categories").done(function(data) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].id == event.category.id) {
        event.category.name = data[i].name;
        event.category.slug = data[i].slug;
      }
    }

    showEventData();
    getTreatsWithCategory(event.category.id);
    $("#event").remove();
  });
}


function setupEventForm() {
  getJSONFileResults("categories").done(function(data) {
    const categorySelect = $("#event-category");
    var options = "";
    for (var i = 0; i < data.length; i++) {
      options += `<option value="${data[i].id}">${data[i].name}</option>`;
    }
    categorySelect.append(options);
  });

  $("#event-form").on('submit', function(event) {
    event.preventDefault();
    submitEventForm();
  });

  $("#event-form input").on('keydown', function(event) { // Make emoji randomly change when fields are typed in
    var emojis = ['🍬','🍡','🍯','🍩','🧁','🍭','🍰','🎂','🍨','🍫','🍧','🍦'];
    $("#event-form-candy").text(emojis[Math.floor(Math.random() * Math.floor(emojis.length))]);
  });
}

function createTreatPopup(treat) {

  var totalprice = treat.price * event.attendees;

  $('.popup').remove();

  var element = `
      <div class="fixed inset-0 z-30 modal-bg bg-gray-200 popup" id="event">
        <h2 class="font-heading text-6xl text-pink-500 text-center mt-16">${treat.name}</h2>
        <div class="rounded-lg bg-white p-8 modal mt-4 container mx-auto shadow-xl flex">
          <div class="w-1/2 text-center relative">
            <img src="${treat.image}">
          </div>
          <div class="w-1/2">
            <h3 class="text-3xl text-black leading-none mb-4">Quote for ${event.name}</h3>
            <p class="${treat.name} for ${event.attendees} attendees"></p>
            <p>Total Price: ${totalprice}</p>
          </div>
        </div>
      </div>`;

  $("body").append(element);
}



$(function() {
  setupEventForm();
})
