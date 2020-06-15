var event = {
  name: "",
  attendees: 0,
  category: {
    id: -1,
    name: "",
    slug: ""
  }
}

// Function to get information from a JSON file
function getJSONFileResults(filename) {
  return $.getJSON(`./assets/JSON/${filename}.json`);
}

// Create the HTML for a treat in the list
function createTreatHTML(treat) {
  var tags = "";
  for (var i = 0; i < treat.tags.length; i++) {
    treat.tags[i]
    tags += `<span class="text-gray-500 ml-3">${treat.tags[i]}</span>`;
  }

  var element = `
  <button data-treat-id="${treat.id}" type="button" class="treat mb-6 relative flex text-left rounded-lg shadow-xl bg-white block w-full overflow-hidden">
    <div class="w-2/12">
      <img loading="lazy" src="${treat.image}" alt="" class="w-full h-32 object-fit object-cover">
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

// Put all treats in a category into the HTML
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

      addTreatClickListeners();
    });
  }
}

// Print the event data to the page
function showEventData() {
  $("#for").text(event.name);
  $("#attendees").text(event.attendees);
}

// Triggered when the form is submitted
function submitEventForm() {
  event.name = $('#event-form #event-name').val();
  event.attendees = parseInt($('#event-form #event-attendees').val());

  setTreatCategory(0);

  $("#event").remove();
}

// Set up the evrent form (dd listeners, put categories into it)
function setupEventForm() {
  $("#event-form").on('submit', function(event) {
    event.preventDefault();
    submitEventForm();
  });

  $("#event-form input").on('input', function(event) { // Make emoji randomly change when fields are typed in
    var emojis = ['🍬','🍡','🍯','🍩','🧁','🍭','🍰','🎂','🍨','🍫','🍧','🍦'];
    $("#event-form-candy").text(emojis[Math.floor(Math.random() * Math.floor(emojis.length))]);
  });
}

// Create the HTML for the treat popup and add it to page
function createTreatPopup(treat) {
  var totalprice = (treat.price * event.attendees).toFixed(2);

  $('.popup').remove();

  var element = `
      <div class="fixed inset-0 z-30 modal-bg popup pb-32 overflow-y-auto" id="quote" style="background-color: #99999966">
        <button onclick="$('#quote').remove()" class="text-6xl fixed top-0 right-0 p-2 text-pink-600">&times;</button>
        <h2 class="rounded-lg bg-white p-8 modal mt-4 container mx-auto shadow-xl font-heading text-6xl text-pink-500 text-center mt-16">${treat.name}</h2>
        <div class="overflow-hidden rounded-lg bg-white modal mt-4 container mx-auto shadow-xl flex" id="quote-inner">
          <div class="w-1/3 text-center relative bg-center bg-cover" style="background-image: url('${treat.image}')"></div>
          <div class="w-2/3 px-16 py-32">
            <h3 class="text-3xl text-black leading-none mb-6 text-pink-500">Quote for ${event.name}</h3>
            <p>${treat.name} for ${event.attendees} attendees</p>
            <p class="font-bold">Total Price: $${totalprice}</p>
          </div>
        </div>
      </div>`;

  $("body").append(element);

  $('#quote').on('click', function(e) {
    if(e.target.id == "quote"){
     $(this).remove();
   }
  });
}

// Add the click listeners to each treat (To later open the popup)
function addTreatClickListeners() {
  $(".treat").on('click', function(e) {
    showTreatInfoQuote($(this).data("treat-id"));
  });
}

// Find a treat in the database that matches the ID selected and open a popup for it
function showTreatInfoQuote(id) {
  getJSONFileResults("treats").done(function(data) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        createTreatPopup(data[i]);
      }
    }
  })
  .fail(function(error) {
    alert("An error occurred");
  });
}

// Update the current selected treat category
function setTreatCategory(id) {
  event.category.id = id;
  getJSONFileResults("categories").done(function(data) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].id == event.category.id) {
        event.category.name = data[i].name;
        event.category.slug = data[i].slug;
      }
    }

    showEventData();

    $("#selected-category").text(event.category.name);

    for (var i = 0; i < $(".category-nav-button").length; i++) {
      if (parseInt($(".category-nav-button")[i].getAttribute("data-category-id")) ==  event.category.id) {
        $(".category-nav-button")[i].classList.add('bg-pink-700');
      } else {
        $(".category-nav-button")[i].classList.remove('bg-pink-700');
      }
    }

    getTreatsWithCategory(event.category.id);
  });
}

// Create the HTML code for a category button
function createCategoryButton(name, id, slug) {
  return `<button type="button" data-category-id="${id}" class=" category-nav-button mr-6 block mt-2 bg-pink-500 hover:bg-pink-600 rounded-lg px-6 py-2 text-white text-xl">${name}</button>`
}

// Create all the category buttons and add them to the page
function createCategoryButtons() { // FIX ME
  var html = "";
  getJSONFileResults("categories").done(function(data) {
    for (var i = 0; i < data.length; i++) {
      html += createCategoryButton(data[i].name, data[i].id, data[i].slug);
    }
    $("#category-nav").append(html);

    addCategortButtonListeners();
  });
}

function addCategortButtonListeners() {
  $(".category-nav-button").on('click', function(e) {
    setTreatCategory($(e.target).data("category-id"));
  });
}

// When page loads
$(function() {
  setupEventForm();
  createCategoryButtons();
});
