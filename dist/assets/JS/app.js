var event = {}


function getJSONFileResults(filename) {
  return $.getJSON(`./assets/JSON/${filename}.json`);
}



function showEventData() {
  $("#for").text(event.name);
  $("#attendees").text(event.attendees);
}

function submitEventForm() {
  event.name = $('#event-form #event-name').val();
  event.attendees = parseInt($('#event-form #event-attendees').val());
  event.selectedCategory = $("#event-form #event-category").val();
  showEventData();
  $("#event").remove();
}


function setupEventForm() {
  var ajax = getJSONFileResults("categories");
  ajax.done(function(data) {
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


$(function() {

  setupEventForm();


  var testTreat =   {
      name: "Strawberry Cone",
      price: 3.00,
      tags: ["Dairy"],
      image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f",
      categoryId: 0
  }

  function createTreatHTML(treat) {
    var tags = "";
    for (var i = 0; i < treat.tags.length; i++) {
      treat.tags[i]
      tags += `<span class="text-gray-500 ml-3">${treat.tags[i]}</span>`;
    }

    var element = `
    <button type="button" class="mb-6 relative flex text-left rounded-lg shadow-xl bg-white block w-full overflow-hidden">
      <div class="w-2/12">
        <img src="${treat.image}" alt="" class="w-full h-32 object-fit object-cover">
      </div>
      <div class="w-5/6 p-4">
        <h4 class="font-bold text-2xl">${treat.name}</h4>
        <p class="text-black text-lg"><span class="font-bold">Cost:</span> $${treat.price}</p>
        <span class="block text-pink-600 hover:text-pink-400 transition duration-200 ease-in-out">Get Quote</span>
        <div class="tags absolute bottom-0 right-0 px-6 pb-2">
          ${tags}
        </div>
      </div>
    </button>
    `;

    return element;
  }


  function addTreatToPage(treat) {
    $("#treats-list").append(createTreatHTML(treat));

  }

  addTreatToPage(testTreat);

})
