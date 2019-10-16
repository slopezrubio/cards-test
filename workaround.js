let hotelItems = {
    init: function() {
      let request = hotelItems.all('GET', 'https://next.json-generator.com/api/json/get/4Jg9__Wvw');

      // Make the loader displayed while the cards are being loading.
      hotelItems.loader.show();

      request.addEventListener('load', function() {
          if (request.status === 200 && XMLHttpRequest.DONE) {
              let body = JSON.parse(this.responseText);
              hotelItems.getHotels(body);
              let container = hotelItems.createContainer();
              container.innerHTML = hotelItems.data.toRender;
              hotelItems.element.appendChild(container);
              hotelItems.loadImages();
          } else {
             console.log("The request couldn't be done.")
          }

      });
    },
    element: document.querySelector('.hotel-items') !== null ? document.querySelector('.hotel-items') : null,
    data: {
        hotels : [],
        toRender: ''
    },
    loader: {
        show: function() {
            // Check if the loader is really hidden.
            let hidden = document.querySelector('.loader--hidden') || document.querySelector('.loader');

            // If so, it gets it displayed.
            if (hidden) {
                hidden.className = 'loader loader--displayed';
            }
        },
        hide: function() {
            // Check if the loader is already being displayed.
            let displayed = document.querySelector('.loader--displayed') || document.querySelector('.loader');

            if (displayed) {

                /*
                 * Checks if the loader isn't placed just after the last row of
                 * the card's container.
                 */
                if (!hotelItems.element.children[hotelItems.element.children.length-1].isEqualNode(displayed)) {

                    // If so, places the loader at the end of it.
                    hotelItems.element.querySelector('.cards').appendChild(displayed);
                }

                // Gets it hidden.
                displayed.className = 'loader loader--hidden';
            }
        },
        picturesLoadedFromServer: 0
    },
    loadImages: function() {
        // Gets all the pictures elements placed inside the card's container.
        let cardPictures = document.querySelector('.cards').querySelectorAll('img');

        /*
         * Loops through all of them and sets an event to each one so that prevents the
         * pictures from getting displayed until all of them have been entirely loaded.
         */
        for (let i = 0; i < cardPictures.length; i++) {
            cardPictures[i].addEventListener('load', function(event) {
                // Increments the counter of the pictures loaded.
                hotelItems.loader.picturesLoadedFromServer++;

                /**
                 * Check if the number of pictures inside the card's container
                 * corresponds to the loaded picture's counter (picturesLoadedFromServer).
                 */
                if (hotelItems.loader.picturesLoadedFromServer === cardPictures.length) {

                    // Hides the loader once all the pictures has been loaded.
                    hotelItems.loader.hide();

                    hotelItems.displayCards();
                };
            });
        };

        return true;
    },
    /**
     * Get the body of the given URL through the method specified in the 1st argument.
     *
     * @returns {XMLHttpRequest}
     */
    all: function(method, url) {
        var request = new XMLHttpRequest();
        request.open(method, url);
        request.send();
        return request;
    },
    /**
     * Gets every item of the given object and injects them into an array suited for the
     * data to be displayed ('data.hotels') in index.html.
     *
     * @param items
     */
    getHotels: function(items) {
        // Loops through all the accommodations provided by the API.
        items.accommodations.forEach(function(element, index) {
            // Get the current accommodation.
            let hotel = element;

            // Loops through all the cities provided by The API.
            for (let i = 0; i < items.cities.length; i++) {

                /*
                 * Looks for the city that matches the city in which the
                 * current accommodation is located.
                 */
                if (element.cityId.toString() === items.cities[i].id.toString()) {

                    // Loops through all the countries provided by the API.
                    for (let y = 0; y < items.countries.length; y++) {

                        /*
                         * Looks for the country that matches the country of the city in which
                         * the current accommodation is located.
                         */
                        if (items.cities[i].countryId.toString() === items.countries[y].id.toString()) {

                            /*
                             * Sets the name of the city and the name of the country
                             * into the current accommodation.
                             */
                            hotel.location.city = items.cities[i].name;
                            hotel.location.country = items.countries[y].name;

                            // Pushes the current accommodation to the hotel's array.
                            hotelItems.data.hotels.push(hotel);

                            // Creates the current accommodation's card.
                            hotelItems.accommodationCardFactory(hotel, index, items.accommodations.length);

                            return true;
                        }
                    }
                }
            }
        });
    },
    createContainer: function() {
        /**
         * Checks if the container already exist. If not, creates a 'DIV' element.
         */
        let element = document.getElementsByClassName('cards').length !== 0 ? document.getElementsByClassName('cards')[0] : document.createElement('div');

        // If the element has been finally created then sets the class value to 'cards'.
        if (element.getAttribute('class') === null) {
            element.setAttribute('class', 'cards');
        }

        return element;
    },
    displayCards: function() {

        // Gets all the rows waiting for being displayed in the document.
        let rows = hotelItems.element.getElementsByClassName('hotel-items__row--loading');

        /*
         * Change their class name to get them displayed by CSS rules.
         */
        for (let y = 0; y < rows.length; y++) {
            let row = rows[y];
            row.setAttribute('class', 'hotel-items__row');

            /* Sets the opacity to make a smooth transition when the rows get displayed */
            setTimeout(hotelItems.setOpacity.bind(null, row), 400);

            y--; // <-- This is because every time we set a class value the array is looping it's getting empty.
        }
    },
    setOpacity: function(element) {
        element.style.opacity = 1;
    },
    accommodationCardFactory: function(item, index, length) {

        /*
         * Checks if the item passed is the first element put inside the cards container.
         * If so, it creates the first row.
         */
        hotelItems.data.toRender += (index + 1) === 1 ? '<div class="hotel-items__row--loading">' : '';

        // Creates card container and its header.
        hotelItems.data.toRender += '<div class="card">' +
                                        '<div class="card-header">';
        /*
         * If the API provides a link for the picture, creates the picture of the card.
         */
        if (item.hasOwnProperty('thumbnail')) {
            hotelItems.data.toRender += '<div class="card-header__picture--full">' +
                                            '<img src="' + item.thumbnail + '" alt="' + 'Imagen del ' + item.name + '">' +
                                        '</div>';
        }

        // Creates the body of the card.
        hotelItems.data.toRender += '</div>' +
                                    '<div class="card-body">';

        /**
         * Inside the card's body, appends a container to display the name of the item (hotels).
         */
        if (item.hasOwnProperty('name')) {
            hotelItems.data.toRender += '<div class="card-body__name">' +
                                            '<h4>' + item.name + '</h4>' +
                                        '</div>';
        }

        /**
         * Inside the card's body too, appends the location text to display:
         *
         * - Name of the hotel's city
         * - Name of the country of the city
         */
        if (item.hasOwnProperty('location') && item.location.hasOwnProperty('city')) {
            hotelItems.data.toRender += '<div class="card-body__location">' +
                                            '<p>' + item.location.city + ' (' + item.location.country + ')</p>' +
                                        '</div>';
        }

        /**
         * Inside the card's body too, appends a unordered list of the Unique Selling Propositions.
         * In other words, the offered feature list of the item:
         *
         *  (e.g.)
         * - WiFi
         * - Free Airport Transfer
         * - Close to the center
         * (...)
         */
        if (item.hasOwnProperty('usp')) {
            hotelItems.data.toRender += '<div class="card-body__list">' +
                                            hotelItems.getListOfElements(item.usp) +
                                        '</div>';
        }


        /**
         * Inside the card's body too, appends the provided item's description if exist.
         */
        if (item.hasOwnProperty('description')) {
            hotelItems.data.toRender += '<div class="card-body__description">' +
                '<p>' + hotelItems.truncateText(24, item.description) + '</p>' +
                '</div>';
        }

        /**
         * Inside the card's body too, appends the price per night of the given item.
         */
        if (item.hasOwnProperty('pricePerNight') && item.pricePerNight.value >= 0) {
            hotelItems.data.toRender += '<div class="card-body__price">' +
                '<p>' + item.pricePerNight.value + ' ' + item.pricePerNight.currencySymbol + ' ' + item.pricePerNight.currency + ' (Per night)</p>' +
                '</div>';
        }

        // Closes the card's body and the whole card.
        hotelItems.data.toRender += '</div>' +
                                    '</div>';

        /**
         * Checks if it is the third element of the row which must be the last.
         * Followingly, closes the row element.
         */
        hotelItems.data.toRender += (index + 1) % 3 === 0 && index > 0 ? '</div><div class="hotel-items__row--loading">' : '';

        /**
         * Checks if it is the last item provided by the API.
         * Followingly, closes the row element as no new elements are going to
         * be appended anymore.
         */
        hotelItems.data.toRender += index + 1 === length ? '</div>' : '';

        /* --- Modern Browsers Workaround ---

            hotelItems.data.toRender +=
            `
            <div class="card">
                <div class="card__image">
                    <img src="${item.thumbnail}" alt="Imagen del ${item.name}">
                </div>
                <div class="card__name">
                    <h4>${item.name}</h4>
                </div>
                <div class="card__location">
                    <h5>${item.location.city}</h5>
                    <p>(${item.location.country})</p>
                </div>
                <div class="card__list">
                    ${hotelItems.getListOfElements(item.usp)}
                </div>
                <div class="card__price">
                    <p>${item.pricePerNight.value} ${item.pricePerNight.currencySymbol} ${item.pricePerNight.currency}</p>
                </div>
                <div class="card__description">
                    <p>${hotelItems.truncateText(24, item.description)}</p>
                </div>
            </div>
            `*/
    },
    /**
     * Get all the values of an array and generates an unordered list with all of them.
     *
     * @param list
     * @returns {string}
     */
    getListOfElements: function(list) {
        let unorderedList = '<ul>';
        for (let i = 0; i < list.length; i++) {
            unorderedList += '<li>';
            if (hotelItems.isAFilledArray(list[i])) {
                unorderedList += hotelItems.getListOfElements(list[i])
            } else {
                unorderedList += list[i];
            }
            unorderedList += '</li>';
        }
        unorderedList += '</ul>';

        return unorderedList;
    },
    /**
     * Shrink the number of words contained in the given array to the specified number in the
     * 1st argument of the method including '...' as an ending of the string.
     *
     * @param length
     * @param string
     * @returns {*}
     */
    truncateText: function(length, string) {
        let result = '';
        if (string.length > 0) {
            string.split(" ", length).forEach(function(element, index) {
                result += index > 0 && index < length - 1 ? ' ' + element : element;
                if (index === (length - 1)) {
                    let endingExpression = '...';
                    result += endingExpression;
                }
            });

            return result;
        }

        return null;
    },
    isAFilledArray: function(arg) {
        return arg.forEach && arg.length < 0;
    }
};

console.time('init');
hotelItems.init();
console.timeEnd('init');