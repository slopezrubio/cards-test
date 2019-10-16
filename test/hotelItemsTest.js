

describe('hotelItems', function() {
    describe('#truncateText()', function() {
        it('should return the same string when the number of words specified is greater than ' +
            'the contained in the string.', function() {
            var string = "I'm the Stifmeister";
            var length = 6;
            var output = hotelItems.truncateText(length, string);
            chai.expect(output).to.equal(string);
        });

        it('should return -1 when the string is empty.', function() {
            var string = '';
            var length = 5;
            var output = hotelItems.truncateText(length, string);
            chai.expect(output).to.equal(-1);
        });

        it('should contain an ending expression at the end of the returned string', function() {
            var string = "We celebrate the death of Jim with a party in his honour.";
            var length = 5;
            var output = hotelItems.truncateText(length, string);
            var patternToFollow = new RegExp('\(\\w+\\s\){' + (length - 1) + '}\\w+...', 'g');
            chai.assert.isNotNull(output.match(patternToFollow), 'The string returned contains an ending expression');
        })
    });

    describe('#createContainer()', function() {
        it('should return a <div> element.', function() {
            chai.expect(hotelItems.createContainer().tagName).to.equal('DIV');
        });

        it('should return a <div> element with a class named \'cards\'', function() {
            let element = hotelItems.createContainer();
            chai.assert.equal(element.getAttribute('class'), 'cards', 'The element has class name called \'cards\'');
        });
    });

    describe('#requestErrorHandler()', function() {
        it('should return a 404 code if no data has been found from the API provided', function(done) {
            let request = hotelItems.sendHttpRequest('GET', 'https://reqres.in/unexist');
            request.onload = function() {
                if (request.status !== 200) {
                    hotelItems.requestErrorHandler(request.status);
                    done();
                }
            }
        });
    });

    describe('#get()', function() {
        it('should throw an error if the data set provided isn\'t declared in the global object ' +
            'hotelItems.data', function() {
            let getLibraries = function() {
                hotelItems.get({ accommodations: [
                        {
                            id: 1111,
                            name: "Stifmeister Beach Hostel",
                            category: 3,
                            description: "Jim if you can't bring yourself to photograph a naked chick, how the hell are you ever going to sleep with one?",
                            location: {
                                latitude: -1.232343,
                                longitude: 2.434266
                            },
                            pricePerNight: {
                                value: '1654',
                                currency: "€",
                                currencySymbol: "€",
                            },
                            cityId: '123',
                            thumbnail: "https://i.ytimg.com/vi/McxNCoxQ5L0/maxresdefault.jpg",
                        }
                    ], cities: [
                        {
                            id: 123,
                            name: "Atlanta",
                            countryId: 234
                        }
                    ],countries: [
                        {
                            id: 234,
                            name: "EEUU",
                        }
                    ]}, 'libraries');
            };
            chai.expect(getLibraries).to.throw(ReferenceError, "The data set provided isn\'t defined in the global variable hotelItems.data");
        })
    });

    describe('#accommodationCardFactory()', function() {
        it('should return a string with all the HTML code needed without the missed data', function() {
            let item = {
                id: 1111,
                name: "Stifmeister Beach Hostel",
                category: 3,
                // Missed data => description: "Jim if you can't bring yourself to photograph a naked chick, how the hell are you ever going to sleep with one?",
                location: {
                    latitude: -1.232343,
                    longitude: 2.434266,
                    city: "Atlanta",
                    country: "EEUU",
                },
                pricePerNight: {
                    value: '1654',
                    currency: "EUR",
                    currencySymbol: "€",
                },
                thumbnail: "https://i.ytimg.com/vi/McxNCoxQ5L0/maxresdefault.jpg",
            };
            let card = document.createElement('div');

            hotelItems.accommodationCardFactory(item);
            card.innerHTML = hotelItems.data.toRender;
            chai.expect(card.getElementsByClassName('card-body__description').length).to.equal(0);
            card.innerHTML = '';
            document.body.appendChild(card);
            card.parentElement.removeChild(card);
        });
    });
});