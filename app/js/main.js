/*==========Imports Start==========*/
import countryCodes from "country-list";
import countriesQuery from "countries-code";
import countryFlagColors from "country-flag-colors";
import countryJs from "country-js";
import CirclePack from 'circlepack-chart';
import swal from 'sweetalert2'
import d3 from 'd3'
const color = d3.scaleOrdinal(d3.schemePaired);

/*==========Functions Start==========*/
async function configurePackedMap() {
    var myChart = CirclePack();
    myChart
        .data((getData()))
        .color(d => color(d.name))
        .showLabels(false)
        .excludeRoot(true)
        .tooltipContent((d, node) => `Size: <i>${node.value}</i>`)
        (document.getElementById('start'));
}
async function getData(name = 'root', probOfChildren = 1) {
    console.log('start: ', document.getElementById('start'))
    const CHILDREN_PROB_DECAY = 0.15; // per level
    const MAX_CHILDREN = 5;
    const MAX_VALUE = 20;
    if (Math.random() < probOfChildren) {
        console.log('probOfChildren: ', probOfChildren)
        return {
            name,
            children: [...Array(Math.round(Math.random() * MAX_CHILDREN))]
                .map((_, i) => getData(i, probOfChildren - CHILDREN_PROB_DECAY))
        }
    } else {
        return {
            name,
            value: Math.round(Math.random() * MAX_VALUE)
        }
    }
}

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
        return { "name": country, "colors": colors, "geo": geo, "code": code }
    })
    countries = countries.filter((country) => {
        return country.geo !== null
    })
    countries = countries.filter((country) => {
        return country.geo !== null || country.colors.length > 0
    })
    console.log(countries)
    localStorage.setItem("selectedCountry", JSON.stringify(countries[Math.round(Math.random() * countries.length)]))
    localStorage.setItem("countryCodes", JSON.stringify(countries))
}
/*==========Click Code Start==========*/

$('body').on('click', function(e) {
    var screen = $(e.target).data('screen');
    console.log(screen)
    if (screen) {
        game.ScreenManager.setScreen(screen);
    }
});
/*==========Card Code Start==========*/

var $cell = $('.card');

//open and close card when clicked on card
$cell.find('.js-expander').click(function() {

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
$cell.find('.js-collapser').click(function() {

    var $thisCell = $(this).closest('.card');

    $thisCell.removeClass('is-expanded').addClass('is-collapsed');
    $cell.not($thisCell).removeClass('is-inactive');

});
/*==========Screen Manager Start==========*/

(function(NS) {

    NS.ScreenManager = {};

    var _current_screen_name = '',
        _current_screen_node = null;

    NS.ScreenManager = {
        screens: ['menu', 'leader', 'credits', 'start'],

        init: function(default_screen_name) {
            this.setScreen(default_screen_name);
        },

        /**
         * You can pass an optional callback to execute after screen set
         */
        setScreen: function(screen_name, callback) {
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
            $(this.screens.reduce(function(str, class_name) {
                return str + (class_name === _current_screen_name ? '' : ',.' + class_name);
            }, '').slice(1)).removeClass('show');
            if (callback) {
                callback.apply(this);
            }
        },

        getCurrentScreen: function() {
            return _current_screen_name;
        }
    };
})(window.game = window.game || {});

window.game.ScreenManager.init('menu');
getCountryCodes()