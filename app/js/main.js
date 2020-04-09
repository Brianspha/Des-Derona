/*==========Imports Start==========*/
import countryCodes from "country-list";
import countriesQuery from "countries-code";
import countryFlagColors from "country-flag-colors";
import countryJs from "country-js";
import CirclePack from 'circlepack-chart';
import swal from 'sweetalert2'
import $ from 'jquery'

import {
    scaleOrdinal,
    schemePaired,
    scaleSequentialPow,
    interpolateOrRd
} from 'd3'
import Globe from 'globe.gl';
import {
    CountUp
} from 'countup.js';
import {
    request,
    getCoordinates,
    numberWithCommas,
    formatDate
} from '../utils/';
import {
    GLOBE_IMAGE_URL,
    BACKGROUND_IMAGE_URL,
    GEOJSON_URL,
    CASES_API,
} from '../constants/';
import web3Utils from 'web3-utils'
import Embark from '../../embarkArtifacts/embarkjs'

Embark.onReady((error) => {
    console.log('scaleOrdinal: ', scaleOrdinal)
    console.log('schemePaired: ', schemePaired)
    const color = scaleOrdinal(schemePaired);
    const globeContainer = document.getElementById('start');
    console.log('globeContainer: ', globeContainer)
    const getVal = (feat) => feat.covid.cases;
    const colorScale = scaleSequentialPow(interpolateOrRd).exponent(1 / 4);
    let myGlobe;
    /*==========Functions Start==========*/
    /*==========Globe Function Start==========*/
    window.ethereum.on('accountsChanged', function (accounts) {
        window.location = "main.html"
    })
    window.ethereum.on('networkChanged', function (netId) {
        window.location = "main.html"
    })


    /*==========Metamask  Detection Start==========*/
    if (typeof web3 !== 'undefined') {
        console.log('MetaMask is installed')
        getCountryCodes()
        warning('Game under development')
    } else {
        swal.fire({
            type: 'error',
            title: 'OH Noo',
            text: 'MetaMask is not installed!',
            footer: "<a href='https://metamask.io/;';>Please visit their website for instructions of how to download it</a>"
        })
        console.log('MetaMask is not installed')
    }
    async function configurePackedMap() {
        myGlobe = Globe()(globeContainer)
            .globeImageUrl(GLOBE_IMAGE_URL)
            .backgroundImageUrl(BACKGROUND_IMAGE_URL)
            .showGraticules(false)
            .polygonAltitude(0.06)
            .polygonCapColor((feat) => colorScale(getVal(feat)))
            .polygonSideColor(() => 'rgba(0, 100, 0, 0.05)')
            .polygonStrokeColor(() => '#111')
            .polygonLabel(
                ({
                    properties: d,
                    covid: c
                }) => `
                <div class="card" id="card">
                  <img class="card-img" src="${c.countryInfo.flag}" alt="flag" />
                  <div class="container">
                  <div clas=s"bottom-info">Right Click to Play</div>
                  <div class="card-spacer"></div>   
                  <span class="card-title"><b>${d.ADMIN}</b></span> <br />
                     <span class="card-total-cases">${numberWithCommas(
                       c.cases
                     )} total cases</span>
                     <div class="card-spacer"></div>
                     <hr />
                     <div class="card-spacer"></div>
                     <span>${numberWithCommas(c.active)} active</span> <br />
                     <span>${numberWithCommas(c.deaths)} dead</span> <br />
                     <span>${numberWithCommas(c.recovered)} recovered</span>
                     <div class="card-spacer"></div>
                     <hr />
                     <div class="card-spacer"></div>
                     <div class="bottom-info">
                      <span style="color: goldenrod;">Today</span>
                      <span>${numberWithCommas(c.todayCases)} cases</span>
                      <span>${numberWithCommas(c.todayDeaths)} deaths</span>
                     </div>
                  </div>
                </div>
              `
            )
            .onPolygonHover((hoverD) =>
                myGlobe
                .polygonAltitude((d) => (d === hoverD ? 0.12 : 0.06))
                .polygonCapColor((d) =>
                    d === hoverD ? 'steelblue' : colorScale(getVal(d))
                )
            ).onPolygonClick((country) => {
                console.log('country: ', country)
                var countries = JSON.parse(localStorage.getItem('countryCodes'))
                console.log('countries: ', countries)
                var selectedCountry = countries.filter((cnt) => {
                    return cnt.name === country.covid.country
                })
                selectedCountry = selectedCountry.length > 0 ? selectedCountry[0] : countries[Math.round(Math.random() * countries.length)]
                selectedCountry.data = country.covid
                console.log('selectedCountry: ', selectedCountry)
                localStorage.setItem("selectedCountry", JSON.stringify(selectedCountry))
                startGame()
            })
            .polygonsTransitionDuration(400);

        getData();
    }
    async function getData() {
        const countries = await request(GEOJSON_URL);
        const data = await request(CASES_API);

        const countriesWithCovid = [];

        data.forEach((item) => {
            const countryIdxByISO = countries.features.findIndex(
                (i) =>
                i.properties.ISO_A2 === item.countryInfo.iso2 &&
                i.properties.ISO_A3 === item.countryInfo.iso3
            );

            if (countryIdxByISO !== -1) {
                countriesWithCovid.push({
                    ...countries.features[countryIdxByISO],
                    covid: item,
                });
            } else {
                // If no country was found using their ISO, try with name
                const countryIdxByName = countries.features.findIndex(
                    (i) => i.properties.ADMIN.toLowerCase() === item.country.toLowerCase()
                );

                if (countryIdxByName !== -1) {
                    countriesWithCovid.push({
                        ...countries.features[countryIdxByName],
                        covid: item,
                    });
                }
            }

            const maxVal = Math.max(...countriesWithCovid.map(getVal));
            colorScale.domain([0, maxVal]);
        });

        myGlobe.polygonsData(countriesWithCovid);
        //  document.querySelector('.title-desc').innerHTML =
        //      'Hover on a country or territory to see cases, deaths, and recoveries.';

        // Show total counts
        showTotalCounts(data);

        // Get coordinates
        try {
            const {
                latitude,
                longitude
            } = await getCoordinates();

            myGlobe.pointOfView({
                    lat: latitude,
                    lng: longitude,
                },
                1000
            );
        } catch (e) {
            console.log('Unable to set point of view.');
        }
    }

    function showTotalCounts(data) {
        data = data.filter((i) => i.country !== 'World');

        const lastUpdate = Math.max(...data.map((i) => i.updated));
        // document.querySelector('.updated').innerHTML = `(as of ${formatDate(
        //   lastUpdate
        // )})`;

        const totalInfected = data.reduce((a, b) => a + b.cases, 0);
        const infected = new CountUp('infected', totalInfected);
        infected.start();

        const totalDeaths = data.reduce((a, b) => a + b.deaths, 0);
        const deaths = new CountUp('deaths', totalDeaths);
        deaths.start();

        const totalRecovered = data.reduce((a, b) => a + b.recovered, 0);
        const recovered = new CountUp('recovered', totalRecovered);
        recovered.start();
    }
    /*==========Notification Functions Start==========*/

    function success(message) {
        swal.fire(
            'Success',
            message,
            'success'
        )
    }

    function startGame() {
        var ethAddress = web3.eth.defaultAccount
        if (web3Utils.isAddress(ethAddress)) {
            localStorage.setItem('userAddress', ethAddress)
            location.href = "game.html"
        } else {
            error('Invalid Eth address please ensure its correct or create a new one by clicking on the link in the footer')
        }
    }

    function warning(message) {
        swal.fire(
            'Warning',
            message,
            'warning'
        )
    }

    function error(message) {
        swal.fire(
            'Error',
            message,
            'error'
        )
    }
    // Responsive globe
    window.addEventListener('resize', (event) => {
        myGlobe.width([event.target.innerWidth]);
        myGlobe.height([event.target.innerHeight]);
    });
    /*==========Globe Function End==========*/

    function getCountryCodes() {
        var countries = countryCodes.getNames()
        console.log(countries)
        countries = countries.map((country) => {
            var colors = countryFlagColors.find(f => f.name === country)
            colors = colors ? colors.colors : []
            var geo = countryJs.search(country);
            var code = geo.length > 0 ? geo[0].code : "ZA"
            var code = countriesQuery.convertAlphaCode(code)
            geo = geo.length > 0 ? geo[0].geo : null
            colors = colors.map((color) => {
                return color.replace('#', '0x')
            })
            return {
                "name": country,
                "colors": colors,
                "geo": geo,
                "code": code
            }
        })
        countries = countries.map((country) => {
            if (country.colors.length === 0) {
                country.colors = ["#" + ((1 << 24) * Math.random() | 0).toString(16), "#" + ((1 << 24) * Math.random() | 0).toString(16), "#" + ((1 << 24) * Math.random() | 0).toString(16), "#" + ((1 << 24) * Math.random() | 0).toString(16), "#" + ((1 << 24) * Math.random() | 0).toString(16)]
            }
            return country
        })
        console.log(countries)
        //localStorage.setItem("selectedCountry", JSON.stringify(countries[Math.round(Math.random() * countries.length)]))
        localStorage.setItem("countryCodes", JSON.stringify(countries))
    }
    /*==========Click Code Start==========*/

    $('body').on('click', function (e) {
        var screen = $(e.target).data('screen');

        console.log(screen)
        if (screen) {
            game.ScreenManager.setScreen(screen);
        }
    });
    /*==========Card Code Start==========*/

    var $cell = $('.card');

    //open and close card when clicked on card
    $cell.find('.js-expander').click(function () {

        var $thisCell = $(this).closest('.card');

        if ($thisCell.hasClass('is-collapsed')) {
            $cell.not($thisCell).removeClass('is-expanded').addClass('is-collapsed').addClass('is-inactive');
            $thisCell.removeClass('is-collapsed').addClass('is-expanded');

            if ($cell.not($thisCell).hasClass('is-inactive')) {
                //do nothing
            } else {
                $cell.not($thisCell).addClass('is-inactive');
            }

        } else {
            $thisCell.removeClass('is-expanded').addClass('is-collapsed');
            $cell.not($thisCell).removeClass('is-inactive');
        }
    });

    //close card when click on cross
    $cell.find('.js-collapser').click(function () {

        var $thisCell = $(this).closest('.card');

        $thisCell.removeClass('is-expanded').addClass('is-collapsed');
        $cell.not($thisCell).removeClass('is-inactive');

    });
    /*==========Screen Manager Start==========*/

    (function (NS) {

        NS.ScreenManager = {};

        var _current_screen_name = '',
            _current_screen_node = null;

        NS.ScreenManager = {
            screens: ['menu', 'leader', 'credits', 'start'],

            init: function (default_screen_name) {
                this.setScreen(default_screen_name);
            },

            /**
             * You can pass an optional callback to execute after screen set
             */
            setScreen: function (screen_name, callback) {
                if (typeof screen_name !== 'string' || _current_screen_name === screen_name) return;
                _current_screen_name = screen_name;

                if (screen_name == "start") {
                    configurePackedMap()
                }
                // show the current screen
                $('.' + _current_screen_name).addClass('show').focus();


                // hide the rest of the screens
                // forming a class string using reduce function with all classes which
                // are equal to current screen
                $(this.screens.reduce(function (str, class_name) {
                    return str + (class_name === _current_screen_name ? '' : ',.' + class_name);
                }, '').slice(1)).removeClass('show');
                if (callback) {
                    callback.apply(this);
                }
            },

            getCurrentScreen: function () {
                return _current_screen_name;
            }
        };
    })(window.game = window.game || {});
    window.game.ScreenManager.init('menu');
    
    //startGame()
})