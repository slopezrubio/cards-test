let hotelItems = {
    /**
     * The init function set in the initial behaviour of the component.
     * Triggers all the necessary events and stores the key properties thereof.
     */
    init: function() {

        // Sends an HTTP request to the provided API to gather the data in there.
        let request = hotelItems.sendHttpRequest('GET', 'https://next.json-generator.com/api/json/get/4Jg9__Wvw', 'json');

        /**
         * While setting the process of rendering, a loader is displayed to assured the user the page
         * is into a process of loading content.
         */
        hotelItems.loader.show();

        // Event triggered once the XmlHTTPRequest is loaded.
        request.addEventListener('load', function() {

            // Checks if the request has been done
            if (request.readyState === XMLHttpRequest.DONE) {

                // Checks if the request is OK
                if (request.status === 200) {
                    hotelItems.get(JSON.parse(this.response), 'hotels');
                    hotelItems.loadElementsToRender(6);
                    hotelItems.loadImages();
                } else {
                    hotelItems.requestErrorHandler(request.status);
                }
            }
        });

        /*
         * Event triggered once the XmlHTTPRequest gets an error.
         * e.g. request.status = 0
         */
        request.addEventListener('error', function() {
            hotelItems.requestErrorHandler(request);
        });

        // Event triggered when scrolling.
        window.addEventListener('scroll', function(event) {

            // Browser Compatibility
            let currentScroll = !window.scrollY ? window.pageYOffset : window.scrollY;

            /*
             * Checks if all the hotels created have their pictures already loaded in the
             * document too so to proceed with the remaining elements.
             */
            if ((hotelItems.data.index) === hotelItems.loader.picturesLoadedFromServer) {

                // Checks if the current vertical scroll position has not been reached before.
                if (currentScroll > hotelItems.data.scrolled) {

                    /*
                     * Gets the latest loaded row vertical position.
                     *
                     * Browser Compatibility
                     */
                    let length = document.getElementsByClassName('hotel-items__row').length - 1;
                    let lastRow = document.getElementsByClassName('hotel-items__row')[length];

                    /*
                     * Avoids an error when the page is refreshed or loaded with the scrollbar beforehand rolled it down.
                     */
                    if (lastRow !== undefined) {

                        // Checks if the user is getting closer to the end of the last row.
                        if (hotelItems.isCloseTo(lastRow)) {

                            /**
                             * Displays the loader all the while the pictures get loaded.
                             */
                            if (hotelItems.loader.picturesLoadedFromServer !== hotelItems.data.hotels.length) {
                                hotelItems.loader.show();
                            }

                            /*
                             * Get the number of cards specified ready to be appended
                             * into the main element (.hotel-items).
                             */
                            hotelItems.loadElementsToRender(6);

                            /*
                              * Loads the pictures that miss, updates the counter
                              * of pictures that have been loaded, and hides the loader
                              * because is no longer necessary.
                              */
                            hotelItems.loadImages();

                            /*
                             * Updates the scrolled page with the end position of the last row
                             * that has newly been created and loaded when appending them
                             * into the element.
                             */
                            hotelItems.data.scrolled = hotelItems.getScrollingGapOf(lastRow);
                        }
                    }
                }
            }
        });
    },
    element: document.querySelector('.hotel-items') !== null ? document.querySelector('.hotel-items') : null,
    data: {
        hotels : [],
        toRender: '',
        index: 0,
        scrolled: 0,
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
    /**
     * Get the body of the given URL through the method (GET, POST, PUT, OPTION...) specified in the 1st argument.
     *
     * @returns {XMLHttpRequest}
     */
    sendHttpRequest: function(method, url, type) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        // xhr.responseType = type;
        xhr.send();
        return xhr;
    },
    requestErrorHandler: function(request) {
        console.log("We are unable to reach the server.");
        return request;
    },
    loadImages: function() {
        // Get all the card's pictures.
        let cardPictures = document.querySelector('.cards').querySelectorAll('img');

        // Adds a upload listener.
        for (let i = 0; i < cardPictures.length; i++) {
            cardPictures[i].addEventListener('load', function(event) {

                /*
                 * Updates the variable that counts all the loaded pictures.
                 */
                hotelItems.loader.picturesLoadedFromServer++;

                /*
                 * Check if all the missing pictures they are now loaded.
                 */
                if (hotelItems.loader.picturesLoadedFromServer === cardPictures.length) {

                    // If so, the loader isn't need anymore.
                    hotelItems.loader.hide();

                    // Finally makes the new cards visible in the browser.
                    hotelItems.displayCards();
                };
            });
        };

        return true;
    },
    /*
     * Gets the gap between the current scrolling and the vertical position of the
     * given element.
     */
    getScrollingGapOf: function(element) {
        return element.getBoundingClientRect().y === undefined
            ? element.getBoundingClientRect().bottom - element.getBoundingClientRect().height
            : element.getBoundingClientRect().y;
    },
    /*
     * Checks if the scrolling is getting closer to the given element.
     */
    isCloseTo: function(element) {
        return hotelItems.getScrollingGapOf(element) < 160;
    },
    /**
     * Gets all the data from the given array and sets them into the corresponding dataSet.
     *
     * Note: The dataSet must be defined in the hotelItems.data object.
     *
     * @param items
     * @param dataSet(string)
     */
    get: function(items, dataSet) {
        if (items.hasOwnProperty('accommodations')) {
            items.accommodations.forEach(function (element) {
                let hotel = element;
                for (let i = 0; i < items.cities.length; i++) {
                    if (element.cityId.toString() === items.cities[i].id.toString()) {
                        for (let y = 0; y < items.countries.length; y++) {
                            if (items.cities[i].countryId.toString() === items.countries[y].id.toString()) {
                                hotel.location.city = items.cities[i].name;
                                hotel.location.country = items.countries[y].name;
                                try {
                                    hotelItems.data[dataSet].push(hotel);
                                    return true;
                                } catch(exception) {
                                    throw new ReferenceError("The data set provided isn't defined in the global variable hotelItems.data");
                                };
                            }
                        }
                    }
                }
            });
        }
    },
    /**
     * Load the HTML Elements with the data got if from the 'data.hotels' array embedded in them.
     *
     * @param length
     * @returns {any}
     */
    loadElementsToRender: function(length) {

        // Creates the container where all the cards are going to be placed.
        let container = hotelItems.createContainer();

        // Initializes the element that will contain a row of cards.
        let row = null;

        /**
         * Sets to the container element the number of cards specified with the 'length' parameter
         * of the method. It creates three cards in every row.
         */
        for (let i = hotelItems.data.index; i < hotelItems.data.index + length && i < hotelItems.data.hotels.length; i++) {

            /*
             * Get the card with the data ready to be appended it within the row.
             */
            hotelItems.accommodationCardFactory(hotelItems.data.hotels[i]);

            // Checks if it is the first item we put inside the row.
            if (i % 3 === 0 || i === hotelItems.data.index) {

                /*
                 * Creates the row where the cards are going to be appended and sets
                 * the class name '.hotel-items__row--loading' so that they don't show
                 * suddenly without being totally loaded.
                 */
                row = document.createElement('div');
                row.setAttribute('class', 'hotel-items__row--loading');
            }

            /*
             *  Checks whether the index has reached the maximum number of hotels provided by the API or
             *  the next index coming is a multiple of 3 so that it can be indeed detected that
              * as the last element of the row and therefore close the tag thereof.
             */
            if (i === hotelItems.data.hotels.length - 1 || (i+1) % 3 === 0) {

                /**
                 * If so, that means there are already three cards ready to be appended or they just
                 * miss the remaining cards and proceeds to append them into the row.
                 */
                row.innerHTML = hotelItems.data.toRender;


                // Appends the row in the container ('.hotel-items')
                container.appendChild(row);

                /*
                 * Ultimately, empties the variable that encapsulated the cards to let the rest of
                 * the rows be rendered.
                 */
                hotelItems.data.toRender = '';
            }
        }

        /**
         * Updates the index that counts the card elements already have been created in the DOM.
         *
         * @type {number}
         */
        hotelItems.data.index = hotelItems.data.index + length >= hotelItems.data.hotels.length ? hotelItems.data.hotels.length : hotelItems.data.index + length;

        // Append them into it.
        document.querySelector('.hotel-items').appendChild(container);
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
    /**
     * Gets a card element ready to be appended with the data which belongs to the given item.
     *
     * @param item
     */
    accommodationCardFactory: function(item) {

        hotelItems.data.toRender += '<div class="card">' +
            '<div class="card-header">';

        if (item.hasOwnProperty('thumbnail')) {
            hotelItems.data.toRender += '<div class="card-header__picture--full">' +
                '<img src="' + item.thumbnail + '" alt="' + 'Imagen del ' + item.name + '">' +
                '</div>';
        }

        hotelItems.data.toRender += '</div>' +
            '<div class="card-body">';

        if (item.hasOwnProperty('name')) {
            hotelItems.data.toRender += '<div class="card-body__name">' +
                '<h4>' + item.name + '</h4>' +
                '</div>';
        }

        if (item.hasOwnProperty('location') && item.location.hasOwnProperty('city')) {
            hotelItems.data.toRender += '<div class="card-body__location">' +
                                            '<h5>' + item.location.city + '</h5>' +
                                            '<p>' + '(' + item.location.country + ')' +'</p>' +
                                        '</div>';
        }

        if (item.hasOwnProperty('usp')) {
            hotelItems.data.toRender += '<div class="card-body__list">' +
                                            hotelItems.getListOfElements(item.usp) +
                                        '</div>';
        }

        if (item.hasOwnProperty('description')) {
            hotelItems.data.toRender += '<div class="card-body__description">' +
                '<p>' + hotelItems.truncateText(24, item.description) + '</p>' +
                '</div>';
        }

        if (item.hasOwnProperty('pricePerNight') && item.pricePerNight.value >= 0) {
            hotelItems.data.toRender += '<div class="card-body__price">' +
                '<p>' + item.pricePerNight.value + ' ' + item.pricePerNight.currencySymbol + ' ' + item.pricePerNight.currency + ' (Per night)</p>' +
                '</div>';
        }

        hotelItems.data.toRender += '</div>' +
            '</div>';

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
    isAFilledArray: function(arg) {
        return arg.forEach && arg.length < 0;
    },
    /**
     * Replace the number of words contained in the given string to the specified number in the
     * 1st argument of the method, including '...' as an ending of the string. Truncates the text
     * with number of words passed in the first argument.
     *
     * @param length
     * @param string
     * @returns {*}
     */
    truncateText: function(length, string) {
        // Initialize the variable where the truncated text is going to be stored.
        let result = string;

        // Checks if the given string in the 1st argument is not empty.
        if (string.length > 0) {
            let words = string.split(" ", length);

            /*
             * Checks if the number of words of the string does not contain less words
             * than the required in the truncation.
             */
            if (words.length === length) {
                result = '';
                words.forEach(function(element, index) {
                    result += index > 0 && index < length ? ' ' + element : element;
                    if (index === (length - 1)) {
                        let endingExpression = '...';
                        result += endingExpression;
                    }
                });
            }
            return result;
        }

        return -1;
    }
};

console.time('init');
hotelItems.init();
console.timeEnd('init');