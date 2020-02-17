// ==UserScript==
// @name            Rothiss - Wayfarer (tools)
// @version         0.1.12
// @description     Custom helper script for Niantic Wayfarer
// @homepageURL     https://gitlab.com/Rothiss/rothiss-wayfarer
// @author          Rothiss, https://gitlab.com/Rothiss/rothiss-wayfarer/graphs/master
// @match           https://wayfarer.nianticlabs.com/*
// @grant           unsafeWindow
// @grant           GM_notification
// @grant           GM_addStyle
// @downloadURL     https://gitlab.com/Rothiss/rothiss-wayfarer/raw/develop/wayfarer.js
// @updateURL       https://gitlab.com/Rothiss/rothiss-wayfarer/raw/develop/wayfarer.js
// @supportURL      https://gitlab.com/Rothiss/rothiss-wayfarer/issues
// @require         https://cdnjs.cloudflare.com/ajax/libs/alertifyjs-alertify.js/1.0.11/js/alertify.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.4.4/proj4.js
// @require         rothissWayfarerCSS https://gitlab.com/Rothiss/rothiss-wayfarer/raw/develop/rothiss-wayfarer.css
// ==/UserScript==

/*
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

/* globals screen, MutationObserver, addEventListener, localStorage, MutationObserver, GM_addStyle, GM_notification, unsafeWindow, angular, google, alertify, proj4 */

const ROT_WFR = {
    VERSION: 100007,
    PREFERENCES: 'rot_wfr_prefs',

    OPTIONS: {
        COMMENT_TEMPLATES: 'comment_templates',
        DARK_MODE: 'dark_mode',
        KEYBOARD_NAV: 'keyboard_nav',
        REFRESH: 'refresh',
        REFRESH_DESKTOP_NOTIFICATION: 'refresh_desktop_notifications',
        SCANNER_OFFSET_FEATURE: 'scanner_offset_feature',
        SCANNER_OFFSET_UI: 'scanner_offset_ui',
    },

    PREFIX: 'rot_wfr_',
    VAR_PREFIX: 'rot_wfr_var', // used in import/export **only**

    VAR: { // will be included in import/export
        SCANNER_OFFSET: 'scanner_offset',
        MAP_TYPE_1: 'map_type_1',
        MAP_TYPE_2: 'map_type_2',
        CUSTOM_PRESETS: 'custom_presets',
    },

    VERSION_CHECK: 'version_check', // outside var, because it should not get exported

    FROM_REFRESH: 'from_refresh', // sessionStorage
}

function addGlobalCss()
{
    // <editor-fold defaultstate="collapsed" desc="CSS Lines">
    let css = `
        .dropdown {
            position: relative;
            display: inline-block;
        }
        
        .dropdown-content {
            display: none;
            position: absolute;
            z-index: 1;
            margin: 0;
        }
        
        .dropdown:hover .dropdown-content {
            display: block;
        }
        
        .dropdown-menu > li > a:focus, .dropdown-menu > li > a:hover {
            background-color: unset;
        }
        
        .dropdown .dropdown-menu {
            left: 0px;
            right: unset;
            width: unset;
        }
        
        .modal-sm {
            width: 350px !important;
        }
        
        .panel-ingress {
            background-color: #004746;
            border: 1px solid #0ff;
            border-radius: 1px;
            box-shadow: inset 0 0 6px rgba(255, 255, 255, 1);
            color: #0ff;
        }
        
        [data-tooltip] {
            position: relative;
            cursor: pointer;
        }
        
        [data-tooltip]:before,
        [data-tooltip]:after {
            visibility: hidden;
            -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
            filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=0);
            opacity: 0;
            pointer-events: none;
        }
        
        [data-tooltip]:before {
            position: absolute;
            top: 150%;
            left: 50%;
            margin-bottom: 5px;
            margin-left: -80px;
            padding: 7px;
            width: relative;
            -webkit-border-radius: 3px;
            -moz-border-radius: 3px;
            border-radius: 3px;
            background-color: #000;
            background-color: hsla(0, 0%, 20%, 0.9);
            color: #fff;
            content: attr(data-tooltip);
            text-align: center;
            font-size: 14px;
            line-height: 1.2;
            z-index: 100;
        }
        
        [data-tooltip]:after {
            position: absolute;
            top: 132%;
            left: relative;
            width: 0;
            border-bottom: 5px solid #000;
            border-bottom: 5px solid hsla(0, 0%, 20%, 0.9);
            border-right: 5px solid transparent;
            border-left: 5px solid transparent;
            content: " ";
            font-size: 0;
            line-height: 0;
        }
        
        [data-tooltip]:hover:before,
        [data-tooltip]:hover:after {
            visibility: visible;
            -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
            filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);
            opacity: 1;
        }
        
        .titleEditBox:hover {
            box-shadow: inset 0 0 20px #ebbc4a;
        }
        
        .titleEditBox:active {
            box-shadow: inset 0 0 15px 2px white;
        }
        
        .group-list li label:hover, ul.sub-group-list a:hover, #root-label:hover {
            box-shadow: inset 0 0 5px #000000 !important;
        }
        
        .group-list li label:active, ul.sub-group-list a:active, #root-label:active {
            box-shadow: inset 0 0 10px 2px #000000 !important;
        }
        
        .modal-body .button:focus, .modal-body textarea:focus {
            outline: 2px dashed #ebbc4a;
        }
        
        .modal-body .button:hover, .gm-style-iw button.button:hover {
            filter: brightness(150%);
        }
        
        .alertify-logs {
            z-index: 100;
        }
        
        .alertify .dialog .msg {
            color: black;
        }
        
        .btn-xs {
            margin-left: 8px;
            padding: 0px 7px 1px !important;
            box-shadow: inset 0 0 4px rgba(255, 255, 255, 1);
            -webkit-box-shadow: inset 0 0 4px rgba(255, 255, 255, 1);
            -moz-box-shadow: inset 0 0 4px rgba(255, 255, 255, 1);
        }
        
        kbd {
            display: inline-block;
            padding: 3px 5px;
            font: 11px SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier, monospace;
            line-height: 10px;
            color: #444d56;
            vertical-align: middle;
            background-color: #fafbfc;
            border: 1px solid #d1d5da;
            border-bottom-color: #c6cbd1;
            border-radius: 3px;
            box-shadow: inset 0 -1px 0 #c6cbd1;
        }
        
        .dropdown-menu {
            margin: 0 !important;
        }
        
        .opr-yellow {
            color: #F3EADA;
        }
        
        #submitAndSkipLowQuality, #submitAndSkipDuplicate {
            margin-left: 32px;
            margin-right: 32px;
        }
        
        #scannerOffsetContainer {
            margin-top: 16px;
        }
        
        #rot_wfr_preferences_button {
            cursor: pointer;
            margin-right: 20px;
            margin-left: 20px;
            color: rgb(157,157,157);
        }
        
        #rot_wfr_custom_presets_card {
            width: 100%;
            height: auto;
            min-height: unset;
            margin-left: 15px;
        }
        
        #submitFF {
            margin-right: 16px;
        }
        
        @media (min-width: 768px) {
            div.modal-custom1 {
                width: 500px;
                max-width: unset !important;
            }
        }
        
        .card-area .card-row-container {
            max-width: unset !important;
        }
        
        #rot_wfr_sidepanel_container {
            background: black;
            border-left: 2px gold inset;
            border-top: 2px gold inset;
            border-bottom: 2px gold inset;
            color: white;
            position: absolute;
            right: 0;
            height: 90%;
            padding: 0 20px;
            z-index: 10;
            width: 400px;
        }
    `
    // </editor-fold>

    // GM_addStyle(css.replace(/\/\/.+/g, ''))

    let newCSS = GM_getResourceText('rothissWayfarerCSS')

    GM_addStyle(newCSS)

    // noop after first run
    addGlobalCss = () =>
    {
    }
}

function addDarkModeCss()
{
    // <editor-fold defaultstate="collapsed" desc="CSS Lines">
    let css = `
        :root {
            --happy-headers-color: #ecdcb5;
            --darkened-background: #ccc;
            --dark-background: #0f0f0f;
            --sidebar-background: #252525;
        }

        // Font friendly to other countries (not just US :-/)
        .text-input.text-input, body, h3, html {
            font-family: Roboto,sans-serif;
        }

        // top header
        .header {
            background: var(--sidebar-background);
        }

        .niantic-wayfarer-logo > img {
            filter: invert() hue-rotate(180deg) brightness(1.2) saturate(80%);
        }

        // main loader
        .niantic-loader {
            background: var(--dark-background);
        }

        .niantic-loader__logo {
            filter: invert(0);
        }

        .niantic-loader__shadow {
            filter: blur(4px);
            background: #ccc;
            animation: shadow-on-dark 2.2s ease-in-out infinite;
        }

        @keyframes shadow-on-dark {
            from,
            to {
                opacity: .6;
                filter: blur(6px)
            }
            55% {
                opacity: .3;
                filter: blur(4px)
            }
        }

        // Login screen
        .login-button {
            width: auto;
            display: grid;
            grid-template-columns: 45px 1fr;
            align-items: center;
            min-height: 40px;
            height: auto;
        }
    
        .login-span-text {
            position: static;
            text-align: left;
            transform: none;
            width: 250px;
        }
        
		// general darkness
		body,#gallery-info,.known-information-need-edit,.container {
			background: var(--dark-background);
			color: whitesmoke;
		}

		// cookies dialog
		ark-cookiebar {
			background: var(--darkened-background);
			color: black;
		}

		// most titles
		h3 {
			color: var(--happy-headers-color);
		}

		// dialogs
		.modal-dialog {
			color: black;
		}

		// profile
		#chart-contain > h1 {
			color: var(--happy-headers-color);
		}

		#profile-stats {
			color: whitesmoke;
		}

		// review cards
		.card {
			background: var(--darkened-background);
			color: black;
		}

		.supporting-statement-central-field,
		.supporting-central-field {
			background: var(--darkened-background);
		}

		// review location change
		.known-information-card {
			overflow-y: auto;
		}
		.known-information-card .known-information-map-icon::before {
			filter: invert();
		}

		// nominations list
		#nom-table-title--arrow::before {
			filter: invert() contrast(4);
		}

		#nom-options-button {
			filter: invert();
		}

		.nomination.--selected {
			background: #ddd;
		}

		// settings
		.item-edit {
			filter: invert();
		}

		#SettingsController .settings-content .settings-item .item-header {
			color: var(--happy-headers-color);
		}

		#SettingsController .settings-content .settings-item .item-text {
			color: #ddd;
		}

		#SettingsController .settings-content .settings-item .item-value {
			color: #A37CD9;
		}

		// bar for on/off switch
		.switch-label::before {
			//background-color: rgba(0,0,0,.17);
			background-color: rgba(255,255,255,.5);
		}

		// edit forms
		.breadcrumb {
			background-color: inherit;
		}

		.dropdown #simple-dropdown {
			background: whitesmoke;
			color: black;
		}

		.text-input.text-input {
			background: whitesmoke;
			color: black;
		}

		// material checkbox
		.consent-confirm {
			filter: invert() contrast(90%);
		}

		.consent-confirm label {
			filter: invert();
		}
    `
    // </editor-fold>

    GM_addStyle(css.replace(/\/\/.+/g, ''))

    // noop after first run
    addDarkModeCss = () =>
    {
    }
}

class Preferences
{
    constructor()
    {
        this.options = {}
        this.defaults = {
            [ROT_WFR.OPTIONS.KEYBOARD_NAV]: true,
            [ROT_WFR.OPTIONS.DARK_MODE]: true,
            [ROT_WFR.OPTIONS.COMMENT_TEMPLATES]: true,
            [ROT_WFR.OPTIONS.REFRESH]: true,
            [ROT_WFR.OPTIONS.REFRESH_DESKTOP_NOTIFICATION]: true,
            [ROT_WFR.OPTIONS.SCANNER_OFFSET_FEATURE]: false,
            [ROT_WFR.OPTIONS.SCANNER_OFFSET_UI]: false,
        }

        this.loadOptions()
    }

    /**
     * @param w
     */
    showPreferencesUI(w)
    {
        let inout = new InOut(this)
        let pageContainer = w.document.querySelector('#content-container')
        let rotWfrPreferences = w.document.querySelector('#rot_wfr_sidepanel_container')

        if (rotWfrPreferences !== null) {
            rotWfrPreferences.classList.toggle('hide')
        } else {
            pageContainer.insertAdjacentHTML('afterbegin', `
                <section id="rot_wfr_sidepanel_container">
                    <div class="row">
                        <div class="col-lg-12">
                            <h4 class="gold">Rothiss Wayfarer Preferences</h4>
                        </div>
                        
                        <div class="col-lg-12">
                            <div class="btn-group" role="group">
                                <button id="import_all" class="btn btn-success">Import</button>
                                <button id="export_all" class="btn btn-success">Export</button>
                            </div>
                        </div>
                    </div>
                    
                    <div id="rot_wfr_options"></div>
                    
                    <a id="rot_wfr_reload" class="btn btn-warning hide">
                        <span class="glyphicon glyphicon-refresh"></span>
                        Reload to apply changes
                    </a>
                </section>
            `)

            let optionsContainer = w.document.getElementById('rot_wfr_options')
            let reloadButton = w.document.getElementById('rot_wfr_reload')

            for (let item in this.options) {
                // remove unknown or removed options
                if (strings.options[item] === undefined) {
                    this.remove(item)

                    continue
                }

                const input = w.document.createElement('input')
                input.type = 'checkbox'
                input.name = item
                input.checked = this.options[item]

                const label = w.document.createElement('label')
                label.appendChild(input)
                label.appendChild(w.document.createTextNode(strings.options[item]))

                const div = w.document.createElement('div')
                div.classList.add('checkbox')
                div.appendChild(label)

                optionsContainer.insertAdjacentElement('beforeEnd', div)
            }

            optionsContainer.addEventListener('change', (event) =>
            {
                this.set(event.target.name, event.target.checked)

                reloadButton.classList.remove('hide')
            })

            reloadButton.addEventListener('click', () =>
            {
                window.location.reload()
            })

            w.document.getElementById('import_all').addEventListener('click', () =>
            {
                alertify.okBtn('Import').prompt('Paste here:', (value, event) =>
                    {
                        event.preventDefault()

                        if (value === 'undefined' || value === '') {
                            return
                        }

                        inout.importFromString(value)

                        alertify.success(`✔ Imported preferences`)
                    }, event =>
                    {
                        event.preventDefault()
                    },
                )
            })

            w.document.getElementById('export_all').addEventListener('click', () =>
                {
                    if (navigator.clipboard !== undefined) {
                        navigator.clipboard.writeText(inout.exportAll()).then(() =>
                        {
                            alertify.success(`✔ Exported preferences to your clipboard!`)
                        }, () =>
                        {
                            // ugly alert as fallback
                            alertify.alert(inout.exportAll())
                        })
                    } else {
                        alertify.alert(inout.exportAll())
                    }
                },
            )
        }
    }

    loadOptions()
    {
        Object.assign(this.options, this.defaults, JSON.parse(localStorage.getItem(ROT_WFR.PREFERENCES)))
    }

    /**
     * @param key
     * @param value
     */
    set(key, value)
    {
        this.options[key] = value

        localStorage.setItem(ROT_WFR.PREFERENCES, JSON.stringify(this.options))
    }

    /**
     * @param key
     * @returns {*}
     */
    get(key)
    {
        return this.options[key]
    }

    /**
     * @param key
     */
    remove(key)
    {
        delete this.options[key]

        localStorage.setItem(ROT_WFR.PREFERENCES, JSON.stringify(this.options))
    }

    exportPreferences()
    {
        return JSON.stringify(this.options)
    }

    /**
     * @param string
     */
    importPrefs(string)
    {
        try {
            this.options = JSON.parse(string)

            localStorage.setItem(ROT_WFR.PREFERENCES, JSON.stringify(this.options))
        } catch (e) {
            throw new Error('Could not import preferences!')
        }
    }
}

class InOut
{
    /**
     * @param preferences
     */
    constructor(preferences)
    {
        this.preferences = preferences
    }

    /**
     * @returns {{}}
     */
    static exportVars()
    {
        let exportObject = {}

        for (const item in ROT_WFR.VAR) {
            exportObject[ROT_WFR.VAR[item]] = localStorage.getItem(ROT_WFR.PREFIX + ROT_WFR.VAR[item])
        }

        return exportObject
    }

    /**
     * @param importObject
     */
    static importVars(importObject)
    {
        for (const item in importObject) {
            localStorage.setItem(ROT_WFR.PREFIX + item, importObject[item])
        }
    }

    /**
     * @param string
     */
    importFromString(string)
    {
        try {
            let json = JSON.parse(string)

            if (json.hasOwnProperty(ROT_WFR.PREFERENCES)) {
                this.preferences.importPrefs(json[ROT_WFR.PREFERENCES])
            }

            if (json.hasOwnProperty(ROT_WFR.VAR_PREFIX)) {
                InOut.importVars(json[ROT_WFR.VAR_PREFIX])
            }
        } catch (e) {
            throw new Error('Import failed')
        }
    }

    /**
     * @returns {string}
     */
    exportAll()
    {
        return JSON.stringify(Object.assign({}, { [ROT_WFR.PREFERENCES]: this.preferences.exportPreferences() }, { [ROT_WFR.VAR_PREFIX]: InOut.exportVars() }))
    }
}

function init()
{
    const w = typeof unsafeWindow === 'undefined' ? window : unsafeWindow

    let tryNumber = 15
    let browserLocale = window.navigator.languages[0] || window.navigator.language || 'en'
    let preferences = new Preferences()

    const initWatcher = setInterval(() =>
    {
        if (tryNumber === 0) {
            clearInterval(initWatcher)

            w.document.getElementById('NewSubmissionController').insertAdjacentHTML('afterBegin', `
                <div id="rot_wfr_init_failed" class='alert alert-danger'>
                    <strong>
                        <span class='glyphicon glyphicon-remove'></span> 
                        Rothiss Wayfarer initialization failed, reload page
                    </strong>
                </div>
            `)

            addRefreshContainer()

            return
        }

        if (w.angular) {
            let err = false

            try {
                initAngular()
            } catch (error) {
                err = error
            }

            if (!err) {
                try {
                    initScript()

                    clearInterval(initWatcher)
                } catch (error) {
                    console.log(error)

                    if (error.message === '41') {
                        addRefreshContainer()
                    }

                    if (error.message !== '42') {
                        clearInterval(initWatcher)
                    }
                }
            }
        }

        tryNumber--
    }, 1000)

    function initAngular()
    {
        const el = w.document.querySelector('[ng-app="portalApp"]')

        w.$app = w.angular.element(el)
        w.$injector = w.$app.injector()
        w.inject = w.$injector.invoke
        w.$rootScope = w.$app.scope()

        w.getService = function getService(serviceName)
        {
            w.inject([serviceName, function(s)
            {
                w[serviceName] = s
            }])
        }

        w.$scope = element => w.angular.element(element).scope()
    }

    function initScript()
    {
        // addGlobalCss()

        if (preferences.get(ROT_WFR.OPTIONS.DARK_MODE)) {
            addDarkModeCss()
        }

        addOptionsButton()

        const subMissionDiv = w.document.getElementById('NewSubmissionController')

        // check if subCtrl exists (should exists if we're on /review)
        if (subMissionDiv !== null && w.$scope(subMissionDiv).subCtrl !== null) {
            const subController = w.$scope(subMissionDiv).subCtrl
            const newPortalData = subController.pageData
            const whatController = w.$scope(w.document.getElementById('WhatIsItController')).whatCtrl
            const answerDiv = w.document.getElementById('AnswersController')
            const ansController = w.$scope(answerDiv).answerCtrl

            if (subController.errorMessage !== '') {
                // no portal analysis data available
                throw new Error(41) // @todo better error code
            }

            if (typeof newPortalData === 'undefined') {
                // no submission data present
                throw new Error(42) // @todo better error code
            }

            // detect portal edit
            if (subController.reviewType === 'NEW') {
                modifyNewPage(ansController, subController, whatController, newPortalData)
            } else if (subController.reviewType === 'EDIT') {
                modifyEditPage(ansController, subController, newPortalData)
            }

            checkIfAutoRefresh()

            startExpirationTimer(subController)

            versionCheck()
        } else if (w.location.pathname.includes('profile')) {
            modifyProfile()
        }
    }

    /**
     * @param ansController
     * @param subController
     * @param whatController
     * @param newPortalData
     */
    function modifyNewPage(ansController, subController, whatController, newPortalData)
    {
        let skipDialog = false

        mapButtons(newPortalData, w.document.querySelector('#map-card .card__footer'), 'afterBegin')

        // mutation observer
        const bodyObserver = new MutationObserver(mutationList =>
        {
            for (let mutationRecord of mutationList) {
                // we just want added nodes with (class:modal). null and undefined check for performance reasons
                if (mutationRecord.addedNodes.length > 0 && mutationRecord.addedNodes[0].className === 'modal fade ng-isolate-scope') {
                    // adds keyboard-numbers to low quality sub-sub-lists
                    let sublistItems = mutationRecord.addedNodes[0].querySelectorAll('ul.sub-group-list')

                    if (sublistItems !== undefined) {
                        sublistItems.forEach(el =>
                        {
                            let i = 1

                            el.querySelectorAll('li > a').forEach(el2 =>
                            {
                                el2.insertAdjacentHTML('afterbegin', `<kbd>${i++}</kbd> `)
                            })
                        })

                        let i = 1

                        // adds keyboard numbers to low quality sub-list
                        mutationRecord.addedNodes[0].querySelectorAll('label.sub-group').forEach(el2 =>
                        {
                            el2.insertAdjacentHTML('beforeend', `<kbd class="pull-right ">${i++}</kbd>`)
                        })
                    }

                    // skip "Your analysis has been recorded" dialog
                    if (skipDialog) {
                        if (mutationRecord.addedNodes[0].querySelector('.modal-body button[ng-click="answerCtrl3.reloadPage()"]') !== null) {
                            w.document.location.href = '/review'

                            return
                        }
                    }
                }
            }
        })

        bodyObserver.observe(w.document.body, { childList: true })

        let newSubmitDiv = w.document.querySelector('.answer-btn-container.bottom-btns')
        let { submitButton, submitAndNext } = quickSubmitButton(newSubmitDiv, ansController, bodyObserver)

        if (preferences.get(ROT_WFR.OPTIONS.COMMENT_TEMPLATES)) {
            commentTemplates()
        }

        // make photo filmstrip scrollable
        const filmstrip = w.document.getElementById('map-filmstrip')

        let lastScrollLeft = filmstrip.scrollLeft

        function scrollHorizontally(e)
        {
            e = window.event || e

            if ((('deltaY' in e && e.deltaY !== 0) || ('wheelDeltaY' in e && e.wheelDeltaY !== 0)) && lastScrollLeft === filmstrip.scrollLeft) {
                e.preventDefault()

                const delta = (e.wheelDeltaY || -e.deltaY * 25 || -e.detail)

                filmstrip.scrollLeft -= (delta)

                lastScrollLeft = filmstrip.scrollLeft
            }
        }

        filmstrip.addEventListener('wheel', scrollHorizontally, false)
        filmstrip.addEventListener('DOMMouseScroll', scrollHorizontally, false)

        let _initMap = subController.initMap

        subController.initMap = () =>
        {
            _initMap()
            mapMarker(subController.markers)
        }

        mapMarker(subController.markers)
        mapTypes(subController.map, false)
        mapTypes(subController.map2, true)

        // hook resetStreetView() and re-apply map types and options to first map. not needed for duplicates because resetMap() just resets the position
        let _resetStreetView = subController.resetStreetView

        subController.resetStreetView = () =>
        {
            _resetStreetView()

            mapTypes(subController.map2, true)
        }

        // bind click-event to Dup-Images-Filmstrip. result: a click to the detail-image the large version is loaded in another tab
        const imgDups = w.document.querySelectorAll('#map-filmstrip > ul > li > img')
        const openFullImage = function()
        {
            w.open(`${this.src}=s0`, 'fulldupimage')
        }

        for (let imgSep in imgDups) {
            if (imgDups.hasOwnProperty(imgSep)) {
                imgDups[imgSep].addEventListener('click', () =>
                {
                    const imgDup = w.document.querySelector('#content > img')

                    if (imgDup !== null) {
                        imgDup.removeEventListener('click', openFullImage)
                        imgDup.addEventListener('click', openFullImage)
                        imgDup.setAttribute('style', 'cursor: pointer;')
                    }
                })
            }
        }

        // add translate buttons to title and description (if existing)
        let lang = 'en'

        try {
            lang = browserLocale.split('-')[0]
        } catch (e) {
        }

        const titleContainer = w.document.querySelector('h1.title-description')
        const content = titleContainer.innerText.trim()

        let span = w.document.createElement('span')
        span.className = 'glyphicon glyphicon-book'
        span.innerHTML = ' '

        let a = w.document.createElement('a')
        a.appendChild(span)
        a.className = 'translate-title btn btn-default pull-right'
        a.target = 'translate'
        a.style.setProperty('padding', '0px 4px')
        a.href = `https://translate.google.com/#auto/${lang}/${encodeURIComponent(content)}`
        a.id = 'rot_wfr_translate_title'

        titleContainer.insertAdjacentElement('beforeend', a)

        const descContainer = w.document.querySelector('h4.title-description')

        if (descContainer.innerText !== '&lt;No description&gt;' && descContainer.innerText !== '') {
            span = w.document.createElement('span')
            span.className = 'glyphicon glyphicon-book'
            span.innerHTML = ' '

            a = w.document.createElement('a')
            a.appendChild(span)
            a.className = 'translate-description btn btn-default pull-right'
            a.target = 'translate'
            a.style.setProperty('padding', '0px 4px')
            a.href = `https://translate.google.com/#auto/${lang}/${encodeURIComponent(descContainer.innerText.trim())}`
            a.id = 'rot_wfr_translate_desc'

            descContainer.insertAdjacentElement('beforeend', a)
            descContainer.insertAdjacentHTML('beforebegin', '<hr>')
        }

        const supportingStatement = w.document.querySelector('.supporting-statement-central-field p')

        if (supportingStatement != null && supportingStatement.innerText !== '') {
            span = w.document.createElement('span')
            span.className = 'glyphicon glyphicon-book'
            span.innerHTML = ' '

            a = w.document.createElement('a')
            a.appendChild(span)
            a.className = 'translate-supporting btn btn-default pull-right'
            a.target = 'translate'
            a.style.setProperty('padding', '0px 4px')
            a.href = `https://translate.google.com/#auto/${lang}/${encodeURIComponent(supportingStatement.innerText)}`
            a.id = 'rot_wfr_translate_support'

            supportingStatement.insertAdjacentElement('beforebegin', a)
        }

        // automatically open the first listed possible duplicate
        try {
            const e = w.document.querySelector('#map-filmstrip > ul > li:nth-child(1) > img')

            if (e !== null) {
                setTimeout(() =>
                {
                    e.click()
                }, 500)
            }
        } catch (err) {
        }

        expandWhatIsItBox()

        // Fix rejectComment width
        let _showLowQualityModal = ansController.showLowQualityModal

        ansController.showLowQualityModal = () =>
        {
            _showLowQualityModal()

            setTimeout(() =>
            {
                let rejectReasonTA = w.document.querySelector('textarea[ng-model="answerCtrl2.rejectComment"]')
                rejectReasonTA.style.setProperty('max-width', '100%')

                w.$injector.invoke(['$compile', ($compile) =>
                {
                    let target = w.document.querySelector('.modal-body button:last-child')
                    let compiledSubmit = $compile(`<button id="submitAndSkipLowQuality" class="button-primary" ng-click="answerCtrl2.confirmLowQuality()" ng-disabled="!(answerCtrl2.readyToSubmitSpam())" disabled="disabled">
                        <span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;<span class="glyphicon glyphicon-forward"></span></button>`)(w.$scope(target))

                    target.insertAdjacentElement('beforebegin', compiledSubmit[0])

                    w.document.getElementById('submitAndSkipLowQuality').addEventListener('click', () =>
                    {
                        skipDialog = true
                    })
                }])
            }, 10)
        }

        /* global markDuplicatePressed */
        let _markDuplicatePressed = markDuplicatePressed

        markDuplicatePressed = (guid) =>
        {
            _markDuplicatePressed(guid)
            setTimeout(() =>
            {
                w.$injector.invoke(['$compile', ($compile) =>
                {
                    let target = w.document.querySelector('.modal-body button:last-child')
                    let compiledSubmit = $compile(`<button id="submitAndSkipDuplicate" class="button-primary" ng-click="answerCtrl2.confirmDuplicate()">
                      <span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;<span class="glyphicon glyphicon-forward"></span></button>`)(w.$scope(target))

                    target.insertAdjacentElement('beforebegin', compiledSubmit[0])

                    w.document.getElementById('submitAndSkipDuplicate').addEventListener('click', () =>
                    {
                        skipDialog = true
                    })
                }])
            }, 10)
        }

        /* region keyboard nav */
        if (preferences.get(ROT_WFR.OPTIONS.KEYBOARD_NAV)) {
            activateShortcuts()
        }

        function activateShortcuts()
        {
            // keyboard navigation
            // documentation: https://gitlab.com/1110101/opr-tools#keyboard-navigation

            let currentSelectable = 0
            let maxItems = 7
            let selectedReasonGroup = -1
            let selectedReasonSubGroup = -1

            // Reset when modal is closed
            let _resetLowQuality = ansController.resetLowQuality
            ansController.resetLowQuality = () =>
            {
                _resetLowQuality()

                selectedReasonGroup = -1
                selectedReasonSubGroup = -1
                currentSelectable = 0

                highlight()
            }

            // a list of all 6 star button rows, and the two submit buttons
            let starsAndSubmitButtons = w.document.querySelectorAll('.five-stars, #submitFF')

            function highlight()
            {
                starsAndSubmitButtons.forEach((element) =>
                {
                    element.style.setProperty('border', 'none')
                })

                if (currentSelectable <= maxItems - 2) {
                    starsAndSubmitButtons[currentSelectable].style.setProperty('border', '2px dashed #E47252')

                    submitAndNext.blur()
                    submitButton.blur()
                } else if (currentSelectable === 6) {
                    submitAndNext.focus()
                } else if (currentSelectable === 7) {
                    submitButton.focus()
                }
            }

            /**
             *  Keycodes:
             *      8: Backspace
             *      9: TAB
             *      13: Enter
             *      16: Shift
             *      27: Escape
             *      32: Space
             *      49-53:  Keys 1-5
             *      68: D
             *      97-101: NUMPAD 1-5
             *      107: NUMPAD +
             *      109: NUMPAD -
             *      111: NUMPAD /
             */
            addEventListener('keydown', (event) =>
            {
                let numkey = null

                if (event.keyCode >= 49 && event.keyCode <= 55) {
                    numkey = event.keyCode - 48
                } else if (event.keyCode >= 97 && event.keyCode <= 103) {
                    numkey = event.keyCode - 96
                }

                // do not do anything if a text area or a input with type text has focus
                if (w.document.querySelector('input[type=text]:focus') || w.document.querySelector('textarea:focus')) {
                    return
                } else if ((event.keyCode === 13 || event.keyCode === 32) && w.document.querySelector('a.button[href="/review"]')) {
                    // "analyze next" button
                    w.document.location.href = '/review'

                    event.preventDefault()
                } else if ((event.keyCode === 13 || event.keyCode === 32) && w.document.querySelector('[ng-click="answerCtrl2.confirmLowQuality()"]')) {
                    // submit low quality rating
                    w.document.querySelector('[ng-click="answerCtrl2.confirmLowQuality()"]').click()

                    currentSelectable = 0

                    event.preventDefault()
                } else if ((event.keyCode === 13 || event.keyCode === 32) && w.document.querySelector('[ng-click="answerCtrl2.confirmLowQualityOld()"]')) {
                    // submit low quality rating alternate
                    w.document.querySelector('[ng-click="answerCtrl2.confirmLowQualityOld()"]').click()

                    currentSelectable = 0

                    event.preventDefault()
                } else if ((event.keyCode === 68) && w.document.querySelector('#content > button')) {
                    // click first/selected duplicate (key D)
                    w.document.querySelector('#content > button').click()

                    currentSelectable = 0

                    event.preventDefault()
                } else if (event.keyCode === 84) {
                    // click on translate title link (key T)
                    const link = w.document.querySelector('#rot_wfr_translate_title')

                    if (link) {
                        link.click()

                        event.preventDefault()
                    }
                } else if (event.keyCode === 89) {
                    // click on translate description link (key Y)
                    const link = w.document.querySelector('#rot_wfr_translate_desc')

                    if (link) {
                        link.click()

                        event.preventDefault()
                    }
                } else if (event.keyCode === 85) {
                    // click on translate extra info link (key U)
                    const link = w.document.querySelector('#rot_wfr_translate_support')

                    if (link) {
                        link.click()

                        event.preventDefault()
                    }
                } else if ((event.keyCode === 13 || event.keyCode === 32) && w.document.querySelector('[ng-click="answerCtrl2.confirmDuplicate()"]')) {
                    // submit duplicate
                    w.document.querySelector('[ng-click="answerCtrl2.confirmDuplicate()"]').click()

                    currentSelectable = 0

                    event.preventDefault()
                } else if ((event.keyCode === 13 || event.keyCode === 32) && currentSelectable === maxItems) {
                    // submit normal rating
                    w.document.querySelector('[ng-click="answerCtrl.submitForm()"]').click()

                    event.preventDefault()
                } else if ((event.keyCode === 27 || event.keyCode === 111) && w.document.querySelector('[ng-click="answerCtrl2.resetDuplicate()"]')) {
                    // close duplicate dialog
                    w.document.querySelector('[ng-click="answerCtrl2.resetDuplicate()"]').click()

                    currentSelectable = 0

                    event.preventDefault()
                } else if ((event.keyCode === 27 || event.keyCode === 111) && w.document.querySelector('[ng-click="answerCtrl2.resetLowQuality()"]')) {
                    // close low quality ration dialog
                    w.document.querySelector('[ng-click="answerCtrl2.resetLowQuality()"]').click()

                    currentSelectable = 0

                    event.preventDefault()
                } else if (event.keyCode === 27 || event.keyCode === 111) {
                    // return to first selection (should this be a portal)
                    currentSelectable = 0

                    event.preventDefault()
                } else if (event.keyCode === 106 || event.keyCode === 220) {
                    // skip portal if possible
                    if (newPortalData.canSkip) {
                        ansController.skipToNext()
                    }
                } else if (event.keyCode === 72) {
                    showHelp() // @todo
                } else if (w.document.querySelector('[ng-click="answerCtrl2.confirmLowQuality()"]')) {
                    // Reject reason shortcuts
                    if (numkey != null) {
                        if (selectedReasonGroup === -1) {
                            try {
                                w.document.getElementById('sub-group-' + numkey).click()

                                selectedReasonGroup = numkey - 1

                                w.document.querySelectorAll('label.sub-group kbd').forEach(el => el.classList.add('hide'))
                            } catch (err) {
                            }
                        } else {
                            if (selectedReasonSubGroup === -1) {
                                try {
                                    w.document.querySelectorAll('#reject-reason ul ul')[selectedReasonGroup].children[numkey - 1].children[0].click()

                                    selectedReasonSubGroup = numkey - 1
                                } catch (err) {
                                }
                            } else {
                                w.document.getElementById('root-label').click()

                                selectedReasonGroup = -1
                                selectedReasonSubGroup = -1

                                w.document.querySelectorAll('label.sub-group kbd').forEach(el => el.classList.remove('hide'))
                            }
                        }

                        event.preventDefault()
                    }
                } else if ((event.keyCode === 107 || event.keyCode === 9) && currentSelectable < maxItems) {
                    // select next rating
                    currentSelectable++

                    event.preventDefault()
                } else if ((event.keyCode === 109 || event.keyCode === 16 || event.keyCode === 8) && currentSelectable > 0) {
                    // select previous rating
                    currentSelectable--

                    event.preventDefault()
                } else if (numkey === null || currentSelectable > maxItems - 2) {
                    return
                } else if (numkey !== null && event.shiftKey) {
                    try {
                        w.document.getElementsByClassName('customPresetButton')[numkey - 1].click()

                        if (!document.getElementById('submitFF').disabled) {
                            currentSelectable = 6

                            highlight()
                        }
                    } catch (e) {
                        // ignore
                    }
                } else {
                    // rating 1-5
                    starsAndSubmitButtons[currentSelectable].querySelectorAll('button.button-star')[numkey - 1].click()

                    currentSelectable++
                }

                highlight()
            })

            highlight()
        }

        /* endregion keyboard nav */

        modifyNewPage = () =>
        {
        }
    }

    /**
     * @param ansController
     * @param subController
     * @param newPortalData
     */
    function modifyEditPage(ansController, subController, newPortalData)
    {
        let editDiv = w.document.querySelector('div[ng-show="subCtrl.reviewType===\'EDIT\'"]')

        mapButtons(newPortalData, editDiv, 'afterEnd')

        // mutation observer
        const bodyObserver = new MutationObserver(mutationList =>
        {
            for (let mutationRecord of mutationList) {
                // we just want added nodes with (class:modal). null and undefined check for performance reasons
                if (mutationRecord.addedNodes.length > 0 &&
                    mutationRecord.addedNodes[0].className === 'modal fade ng-isolate-scope' &&
                    mutationRecord.addedNodes[0].querySelector('.modal-body a[href=\'/review\']') !== null
                ) {
                    w.document.location.href = '/review'
                }
            }
        })

        bodyObserver.observe(w.document.body, { childList: true })

        let newSubmitDiv = w.document.querySelector('.answer-btn-container.bottom-btns')
        let { submitButton, submitAndNext } = quickSubmitButton(newSubmitDiv, ansController, bodyObserver)

        if (preferences.get(ROT_WFR.OPTIONS.COMMENT_TEMPLATES)) {
            commentTemplates()
        }

        mapTypes(subController.locationEditsMap, true)

        // add translation links to title and description edits
        if (newPortalData.titleEdits.length > 1 || newPortalData.descriptionEdits.length > 1) {
            for (const titleEditBox of editDiv.querySelectorAll('.titleEditBox.ng-scope')) {
                const contentSpan = titleEditBox.querySelector('.poi-edit-text')

                let span = w.document.createElement('span')
                span.className = 'glyphicon glyphicon-book'
                span.innerHTML = ' '

                let a = w.document.createElement('a')
                a.appendChild(span)
                a.className = 'translate-title button btn btn-default pull-right'
                a.target = 'translate'
                a.style.setProperty('padding', '0px 4px')
                a.href = `https://translate.google.com/#auto/${browserLocale.split('-')[0]}/${encodeURIComponent(contentSpan.innerText.trim())}`

                contentSpan.style.setProperty('display', 'inline-block')
                contentSpan.insertAdjacentElement('beforeEnd', a)
            }
        }

        if (newPortalData.titleEdits.length <= 1) {
            let titleDiv = editDiv.querySelector('div[ng-if="!answerCtrl.needsTitleEdit"]')

            let span = w.document.createElement('span')
            span.className = 'glyphicon glyphicon-book'
            span.innerHTML = ' '

            let a = w.document.createElement('a')
            a.appendChild(span)
            a.className = 'translate-title btn btn-default'
            a.target = 'translate'
            a.style.setProperty('padding', '0px 4px')
            a.style.setProperty('margin-left', '14px')
            a.href = `https://translate.google.com/#auto/${browserLocale.split('-')[0]}/${encodeURIComponent(titleDiv.innerText.trim())}`

            titleDiv.insertAdjacentElement('beforeend', a)
        }

        if (newPortalData.descriptionEdits.length <= 1) {
            let titleDiv = editDiv.querySelector('div[ng-if="!answerCtrl.needsDescriptionEdit"]')

            const content = titleDiv.innerText.trim() || ''

            if (content !== '<No description>' && content !== '') {
                let span = w.document.createElement('span')
                span.className = 'glyphicon glyphicon-book'
                span.innerHTML = ' '

                let a = w.document.createElement('a')
                a.appendChild(span)
                a.className = 'translate-title btn btn-default'
                a.target = 'translate'
                a.style.setProperty('padding', '0px 4px')
                a.style.setProperty('margin-left', '14px')
                a.href = `https://translate.google.com/#auto/${browserLocale.split('-')[0]}/${encodeURIComponent(content)}`

                titleDiv.insertAdjacentElement('beforeEnd', a)
            }
        }

        expandWhatIsItBox()

        // fix locationEditsMap if only one location edit exists
        if (newPortalData.locationEdits.length <= 1 || subController.locationEditsMap.getZoom() > 19) {
            subController.locationEditsMap.setZoom(19)
        }

        /* EDIT PORTAL */
        /* region keyboard navigation */

        if (preferences.get(ROT_WFR.OPTIONS.KEYBOARD_NAV)) {
            activateShortcuts()
        }

        function activateShortcuts()
        {
            let currentSelectable = 0
            let hasLocationEdit = (newPortalData.locationEdits.length > 1)
            let maxItems = (newPortalData.descriptionEdits.length > 1) + (newPortalData.titleEdits.length > 1) + (hasLocationEdit) + 2 // counting *true*, please don't shoot me
            let mapMarkers

            if (hasLocationEdit) {
                mapMarkers = subController.allLocationMarkers
            } else {
                mapMarkers = []
            }

            // a list of all 6 star button rows, and the two submit buttons
            let starsAndSubmitButtons = w.document.querySelectorAll(
                '.edit-container  div[ng-show="subCtrl.pageData.titleEdits.length > 1"]:not(.ng-hide),' +
                '.edit-container div[ng-show="subCtrl.pageData.descriptionEdits.length > 1"]:not(.ng-hide),' +
                '.edit-container div[ng-show="subCtrl.pageData.locationEdits.length > 1"]:not(.ng-hide),' +
                '#submitFF',
            )

            /* EDIT PORTAL */
            function highlight()
            {
                let el = editDiv.querySelector('.poi-edit-map-unable')
                el.style.setProperty('border', 'none')

                starsAndSubmitButtons.forEach((element) =>
                {
                    element.style.setProperty('border', 'none')
                })

                if (hasLocationEdit && currentSelectable === maxItems - 3) {
                    el.style.setProperty('border-left', '4px dashed #ebbc4a')
                    el.style.setProperty('border-top', '4px dashed #ebbc4a')
                    el.style.setProperty('border-bottom', '4px dashed #ebbc4a')
                    el.style.setProperty('border-right', '4px dashed #ebbc4a')
                    el.style.setProperty('padding', '8px')

                    submitAndNext.blur()
                    submitButton.blur()
                } else if (currentSelectable < maxItems - 2) {
                    starsAndSubmitButtons[currentSelectable].style.setProperty('border-left', '4px dashed #ebbc4a')
                    starsAndSubmitButtons[currentSelectable].style.setProperty('padding-left', '16px')

                    submitAndNext.blur()
                    submitButton.blur()
                } else if (currentSelectable === maxItems - 2) {
                    submitAndNext.focus()
                } else if (currentSelectable === maxItems) {
                    submitButton.focus()
                }
            }

            /**
             *  Keycodes:
             *      8: Backspace
             *      9: TAB
             *      13: Enter
             *      16: Shift
             *      27: Escape
             *      32: Space
             *      49-53:  Keys 1-5
             *      68: D
             *      97-101: NUMPAD 1-5
             *      107: NUMPAD +
             *      109: NUMPAD -
             *      111: NUMPAD /
             */
            addEventListener('keydown', (event) =>
            {
                let numkey = null

                if (event.keyCode >= 49 && event.keyCode <= 53) {
                    numkey = event.keyCode - 48
                } else if (event.keyCode >= 97 && event.keyCode <= 101) {
                    numkey = event.keyCode - 96
                }

                // do not do anything if a text area or a input with type text has focus
                if (w.document.querySelector('input[type=text]:focus') || w.document.querySelector('textarea:focus')) {
                    return
                } else if ((event.keyCode === 13 || event.keyCode === 32) && w.document.querySelector('a.button[href="/review"]')) {
                    // "analyze next" button
                    w.document.location.href = '/review'

                    event.preventDefault()
                } else if ((event.keyCode === 13 || event.keyCode === 32) && currentSelectable === maxItems) {
                    // submit normal rating
                    w.document.querySelector('[ng-click="answerCtrl.submitForm()"]').click()

                    event.preventDefault()
                } else if (event.keyCode === 27 || event.keyCode === 111) {
                    // return to first selection (should this be a portal)
                    currentSelectable = 0
                } else if ((event.keyCode === 107 || event.keyCode === 9) && currentSelectable < maxItems) {
                    // select next rating
                    currentSelectable++

                    event.preventDefault()
                } else if ((event.keyCode === 109 || event.keyCode === 16 || event.keyCode === 8) && currentSelectable > 0) {
                    // select previous rating
                    currentSelectable--

                    event.preventDefault()
                } else if (numkey === null || currentSelectable > maxItems - 2) {
                    return
                } else {
                    // rating 1-5
                    if (hasLocationEdit && currentSelectable === maxItems - 3 && numkey <= mapMarkers.length) {
                        google.maps.event.trigger(angular.element(document.getElementById('NewSubmissionController')).scope().getAllLocationMarkers()[numkey - 1], 'click')
                    } else {
                        currentSelectable++
                    }
                }

                highlight()
            })

            highlight()
        }
    }

    /**
     * Add external map buttons
     *
     * @param newPortalData
     * @param targetElement
     * @param where
     */
    function mapButtons(newPortalData, targetElement, where)
    {
        targetElement.insertAdjacentHTML(where, `
            <div id="rot_wfr_map_button_group" class='btn-group'>
                <a class='btn btn-default' target='intel' href='https://intel.ingress.com/intel?ll=${newPortalData.lat},${newPortalData.lng}&z=17'>Intel</a>
                <a class='btn btn-default' target='gmaps' href='https://www.google.com/maps/place/${newPortalData.lat},${newPortalData.lng}'>GMaps</a>
            </div>
        `)
    }

    /**
     * Add new button "Submit and reload", skipping "Your analysis has been recorded." dialog
     *
     * @param submitDiv
     * @param ansController
     * @param bodyObserver
     * @returns {{submitButton: Element | any, submitAndNext: Node}}
     */
    function quickSubmitButton(submitDiv, ansController, bodyObserver)
    {
        let submitButton = submitDiv.querySelector('button.button-primary')
        let submitAndNext = submitButton.cloneNode(false)
        submitAndNext.innerHTML = `<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;<span class="glyphicon glyphicon-forward"></span>`
        submitAndNext.title = 'Submit and go to next review'
        submitAndNext.id = 'submitFF'
        submitButton.addEventListener('click', () =>
        {
            bodyObserver.disconnect()
        })
        submitAndNext.addEventListener('click', () =>
        {
            ansController.openSubmissionCompleteModal = () =>
            {
                window.location.assign('/review')
            }
        })

        w.$injector.invoke(['$compile', ($compile) =>
        {
            let compiledSubmit = $compile(submitAndNext)(w.$scope(submitDiv))

            submitDiv.querySelector('#submitDiv button').insertAdjacentElement('beforeBegin', compiledSubmit[0])
        }])

        return { submitButton, submitAndNext }
    }

    function commentTemplates()
    {
        const cardAdditionalText = w.document.getElementById('additional-comments-card')
        const cardTextBox = cardAdditionalText.querySelector('textarea')

        cardAdditionalText.insertAdjacentHTML('beforeend', `
            <div class="card__footer">
                <span id="rot_wfr_comment_button_group" class='btn-group dropup pull-left'>
                    <button id='photo' class='btn btn-default textButton' data-tooltip='Indicates a low quality photo'>Photo</button>
                    <button id='private' class='btn btn-default textButton' data-tooltip='Located on private residential property'>Private</button>
                    
                    <span class='btn btn-default dropdown'>
                        <span class='caret'></span>
                        
                        <ul id="rot_wfr_comment_button_dropdown" class='dropdown-content dropdown-menu'>
                            <li>
                                <a class='textButton' id='school' data-tooltip='Located on school property'>
                                    School
                                </a>
                            </li>
                            <li>
                                <a class='textButton' id='person' data-tooltip='Photo contains 1 or more people'>
                                    Person
                                </a>
                            </li>
                            <li>
                                <a class='textButton' id='perm' data-tooltip='Seasonal or temporary display or item'>
                                    Temporary
                                </a>
                            </li>
                            <li>
                                <a class='textButton' id='location' data-tooltip='Location wrong'>
                                    Location
                                </a>
                            </li>
                            <li>
                                <a class='textButton' id='natural' data-tooltip='Candidate is a natural feature'>
                                    Natural
                                </a>
                            </li>
                            <li>
                                <a class='textButton' id='emergencyway' data-tooltip='Obstructing emergency way'>
                                    Emergency Way
                                </a>
                            </li>
                        </ul>
                    </span>
                </span>
                
                <span class="hidden-xs pull-right">
                    <button id='clear' class='btn btn-default textButton' data-tooltip='clears the comment box'>Clear</button>
                </span>
            </div>
        `)

        const buttons = w.document.getElementsByClassName('textButton')

        for (let b in buttons) {
            if (buttons.hasOwnProperty(b)) {
                buttons[b].addEventListener('click', event =>
                {
                    const source = event.target || event.srcElement
                    let text = cardTextBox.value

                    if (text.length > 0) {
                        text += ', '
                    }

                    switch (source.id) {
                        case 'photo':
                            text += 'Low quality photo'
                            break
                        case 'private':
                            text += 'Private residential property'
                            break
                        case 'duplicate':
                            text += 'Duplicate of previously reviewed portal candidate'
                            break
                        case 'school':
                            text += 'Located on primary or secondary school grounds'
                            break
                        case 'person':
                            text += 'Picture contains one or more people'
                            break
                        case 'perm':
                            text += 'Portal candidate is seasonal or temporary'
                            break
                        case 'location':
                            text += 'Portal candidate\'s location is not on object'
                            break
                        case 'emergencyway':
                            text += 'Portal candidate is obstructing the path of emergency vehicles'
                            break
                        case 'natural':
                            text += 'Portal candidate is a natural feature'
                            break
                        case 'clear':
                            text = ''
                            break
                    }

                    cardTextBox.value = text
                    cardTextBox.dispatchEvent(new Event('change')) // eslint-disable-line no-undef

                    event.target.blur()
                }, false)
            }
        }
    }

    /**
     * Replace map markers with a nice circle
     *
     * @param markers
     */
    function mapMarker(markers)
    {
        for (let i = 0; i < markers.length; ++i) {
            const marker = markers[i]

            marker.setIcon(POI_MARKER)
        }
    }

    /**
     * Set available map types
     *
     * @param map
     * @param isMainMap
     */
    function mapTypes(map, isMainMap)
    {
        const PROVIDERS = {
            GOOGLE: 'google',
            KARTVERKET: 'kartverket',
        }

        const types = [
            { provider: PROVIDERS.GOOGLE, id: 'roadmap' },
            { provider: PROVIDERS.GOOGLE, id: 'terrain' },
            { provider: PROVIDERS.GOOGLE, id: 'satellite' },
            { provider: PROVIDERS.GOOGLE, id: 'hybrid' },
        ]

        const defaultMapType = 'hybrid'

        map.setOptions({
            // re-enabling map scroll zoom and allow zoom with out holding ctrl
            scrollwheel: true,
            gestureHandling: 'greedy',
            // map type selection
            mapTypeControl: true,
            mapTypeControlOptions: {
                mapTypeIds: types.map(t => t.id),
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            },
        })

        // register custom map types
        types.forEach(t =>
        {
            switch (t.provider) {
                case PROVIDERS.KARTVERKET:
                    map.mapTypes.set(t.id, new google.maps.ImageMapType({
                        layer: t.code,
                        name: t.label,
                        alt: t.label,
                        maxZoom: 19,
                        tileSize: new google.maps.Size(256, 256),
                        getTileUrl: function(coord, zoom)
                        {
                            return `//opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=${this.layer}&zoom=${zoom}&x=${coord.x}&y=${coord.y}`
                        },
                    }))
                    break
            }
        })

        // track current selection for position map
        let mapType

        if (isMainMap) {
            mapType = ROT_WFR.PREFIX + ROT_WFR.VAR.MAP_TYPE_1
        } else {
            mapType = ROT_WFR.PREFIX + ROT_WFR.VAR.MAP_TYPE_2
        }

        // save selection when changed
        map.addListener('maptypeid_changed', function()
        {
            w.localStorage.setItem(mapType, map.getMapTypeId())
        })

        // get map type saved from last use or fall back to default
        map.setMapTypeId(w.localStorage.getItem(mapType) || defaultMapType)
    }

    /**
     * Expand automatically the "What is it?" filter text box
     */
    function expandWhatIsItBox()
    {
        try {
            const whatController = w.$scope(w.document.getElementById('WhatIsItController')).whatCtrl

            setTimeout(() =>
            {
                whatController.showWhat = true
                w.$rootScope.$apply()
            }, 50)
        } catch (err) {
        }
    }

    function modifyProfile()
    {
        // stats enhancements: add processed by nia, percent processed, progress to next recon badge numbers
        let rotWfrScannerOffset = 0

        // get scanner offset from localStorage
        if (preferences.get(ROT_WFR.OPTIONS.SCANNER_OFFSET_FEATURE)) {
            rotWfrScannerOffset = parseInt(w.localStorage.getItem(ROT_WFR.SCANNER_OFFSET)) || 0
        }

        const stats = w.document.querySelector('#profile-stats:not(.visible-xs)')

        const reviewed = parseInt(stats.children[0].children[0].children[1].innerText)
        const accepted = parseInt(stats.children[1].children[1].children[1].innerText)
        const rejected = parseInt(stats.children[1].children[2].children[1].innerText)
        const duplicated = parseInt(stats.children[1].children[3].children[1].innerText)

        const processed = accepted + rejected + duplicated - rotWfrScannerOffset
        const processedPercent = roundToPrecision(processed / reviewed * 100, 1)

        const acceptedPercent = roundToPrecision(accepted / (reviewed) * 100, 1)
        const rejectedPercent = roundToPrecision(rejected / (reviewed) * 100, 1)
        const duplicatedPercent = roundToPrecision(duplicated / (reviewed) * 100, 1)

        const reconBadge = { 100: 'Bronze', 750: 'Silver', 2500: 'Gold', 5000: 'Platin', 10000: 'Black' }

        let nextBadgeName, nextBadgeCount

        for (const key in reconBadge) {
            if (processed <= key) {
                nextBadgeCount = key
                nextBadgeName = reconBadge[key]
                break
            }
        }

        const nextBadgeProcess = processed / nextBadgeCount * 100

        const numberSpans = stats.querySelectorAll('span.stats-right')

        numberSpans[0].insertAdjacentHTML('beforeend', `, <span class=''>100%</span>`)
        numberSpans[1].insertAdjacentHTML('beforeend', `, <span class=''>${acceptedPercent}%</span>`)
        numberSpans[2].insertAdjacentHTML('beforeend', `, <span class=''>${rejectedPercent}%</span>`)
        numberSpans[3].insertAdjacentHTML('beforeend', `, <span class=''>${duplicatedPercent}%</span>`)

        stats.querySelectorAll('h4')[2].insertAdjacentHTML('afterend', `
            <br>
            <h4>
                <span class="stats-left">Processed <u>and</u> accepted analyses:</span> 
                <span class="stats-right">${processed}, 
                    <span class="ingress-gray">${processedPercent}%</span>
                </span>
            </h4>
        `)

        if (processed < 10000) {
            stats.insertAdjacentHTML('beforeEnd', `
                <br>
                <div>
                    Next Ingress Recon badge tier: <b>${nextBadgeName} (${nextBadgeCount})</b>
                    <br>
                    <div class='progress'>
                        <div class='progress-bar progress-bar-warning'
                            role='progressbar'
                            aria-valuenow='${nextBadgeProcess}'
                            aria-valuemin='0'
                            aria-valuemax='100'
                            style='width: ${Math.round(nextBadgeProcess)}%;'
                            title='${nextBadgeCount - processed} to go'>
                            ${Math.round(nextBadgeProcess)}%
                        </div>
                    </div>
                </div>
            `)
        } else {
            stats.insertAdjacentHTML('beforeEnd', `<hr>`)
        }

        stats.insertAdjacentHTML('beforeEnd', `
            <div>
                <i class="glyphicon glyphicon-share"></i> 
                <input readonly onFocus="this.select();" style="width: 90%;" type="text" value="Reviewed: ${reviewed} / Processed: ${accepted + rejected + duplicated} (Created: ${accepted}/ Rejected: ${rejected}/ Duplicated: ${duplicated}) / ${Math.round(processedPercent)}%"/>
            </div>
        `)

        if (accepted < 10000 && preferences.get(ROT_WFR.OPTIONS.SCANNER_OFFSET_UI)) {
            stats.insertAdjacentHTML('beforeEnd', `
                <div id='scannerOffsetContainer'>
                    <span style="margin-left: 5px" class="ingress-mid-blue pull-left">Scanner offset:</span>
                    <input id="scannerOffset" onFocus="this.select();" type="text" name="scannerOffset" size="8" class="pull-right" value="${rotWfrScannerOffset}">
                </div>
            `)

            // we have to inject the tooltip to angular
            w.$injector.invoke(['$compile', ($compile) =>
            {
                let compiledSubmit = $compile(`<span class="glyphicon glyphicon-info-sign ingress-gray pull-left" uib-tooltip-trigger="outsideclick" uib-tooltip-placement="left" tooltip-class="goldBorder" uib-tooltip="Use negative values, if scanner is ahead of Wayfarer"></span>`)(w.$scope(stats))

                w.document.getElementById('scannerOffsetContainer').insertAdjacentElement('afterbegin', compiledSubmit[0])
            }]);

            ['change', 'keyup', 'cut', 'paste', 'input'].forEach(e =>
            {
                w.document.getElementById('scannerOffset').addEventListener(e, (event) =>
                {
                    w.localStorage.setItem(ROT_WFR.SCANNER_OFFSET, event.target.value)
                })
            })
        }

        // noop after first run
        modifyProfile = () =>
        {
        }
    }

    function addOptionsButton()
    {
        // Add preferences button only once
        if (w.document.getElementById('rot_wfr_preferences_button') !== null) {
            return
        }

        const prefCog = w.document.createElement('span')
        prefCog.classList.add('glyphicon', 'glyphicon-cog')

        // add wayfarer-tools preferences button
        let rotWfrPreferencesButton = w.document.createElement('a')
        rotWfrPreferencesButton.classList.add('brand', 'upgrades-icon', 'pull-right')
        rotWfrPreferencesButton.addEventListener('click', () => preferences.showPreferencesUI(w))
        rotWfrPreferencesButton.title = 'Wayfarer-Tools Preferences'
        rotWfrPreferencesButton.setAttribute('id', 'rot_wfr_preferences_button')
        rotWfrPreferencesButton.appendChild(prefCog)

        w.document.querySelector('.header .inner-container:last-of-type').insertAdjacentElement('afterbegin', rotWfrPreferencesButton)
    }

    function addRefreshContainer()
    {
        let cbxRefresh = w.document.createElement('input')
        let cbxRefreshDesktop = w.document.createElement('input')

        cbxRefresh.id = ROT_WFR.OPTIONS.REFRESH
        cbxRefresh.type = 'checkbox'
        cbxRefresh.checked = preferences.get(ROT_WFR.OPTIONS.REFRESH) === 'true'

        cbxRefreshDesktop.id = ROT_WFR.OPTIONS.REFRESH_DESKTOP_NOTIFICATION
        cbxRefreshDesktop.type = 'checkbox'
        cbxRefreshDesktop.checked = preferences.get(ROT_WFR.OPTIONS.REFRESH_DESKTOP_NOTIFICATION) === 'true'

        let refreshPanel = w.document.createElement('div')
        refreshPanel.className = 'panel panel-ingress'

        refreshPanel.addEventListener('change', (event) =>
        {
            preferences.set(event.target.id, event.target.checked)
            if (event.target.checked) {
                startRefresh()
            } else {
                stopRefresh()
            }
        })

        refreshPanel.innerHTML = `
            <div class='panel-heading'>
                <span class='glyphicon glyphicon-refresh'></span>
                Refresh <sup>beta</sup>
                <a href='https://gitlab.com/1110101/opr-tools'>
                    <span class='label label-success pull-right'>Wayfarer-Tools</span>
                </a>
            </div>
            <div id='cbxDiv' class='panel-body bg-primary' style='background:black;'></div>`

        refreshPanel.querySelector('#cbxDiv').insertAdjacentElement('afterbegin', appendCheckbox(cbxRefreshDesktop, 'Desktop notification'))
        refreshPanel.querySelector('#cbxDiv').insertAdjacentElement('afterbegin', appendCheckbox(cbxRefresh, 'Refresh every 5-10 minutes'))

        let colDiv = w.document.createElement('div')
        colDiv.className = 'col-md-4 col-md-offset-4'
        colDiv.appendChild(refreshPanel)

        let rowDiv = w.document.createElement('div')
        rowDiv.className = 'row'
        rowDiv.appendChild(colDiv)

        w.document.getElementById('NewSubmissionController').insertAdjacentElement('beforeend', rowDiv)

        cbxRefresh.checked === true ? startRefresh() : stopRefresh()

        function appendCheckbox(checkbox, text)
        {
            let label = w.document.createElement('label')
            label.appendChild(checkbox)
            label.appendChild(w.document.createTextNode(text))

            let div = w.document.createElement('div')
            div.className = 'checkbox'
            div.appendChild(label)

            return div
        }

        // noop after first run
        addRefreshContainer = () =>
        {
        }
    }

    let refreshIntervalID

    function startRefresh()
    {
        let time = getRandomIntInclusive(5, 10) * 60000

        refreshIntervalID = setInterval(() =>
        {
            reloadWayfarer()
        }, time)

        function reloadWayfarer()
        {
            clearInterval(refreshIntervalID)

            w.sessionStorage.setItem(ROT_WFR.FROM_REFRESH, 'true')
            w.document.location.reload()
        }

        /**
         * Source https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
         *
         * @param min
         * @param max
         * @returns {number}
         */
        function getRandomIntInclusive(min, max)
        {
            min = Math.ceil(min)
            max = Math.floor(max)

            return Math.floor(Math.random() * (max - min + 1)) + min
        }
    }

    function stopRefresh()
    {
        clearInterval(refreshIntervalID)
    }

    function checkIfAutoRefresh()
    {
        if (w.sessionStorage.getItem(ROT_WFR.FROM_REFRESH)) {
            // reset flag
            w.sessionStorage.removeItem(ROT_WFR.FROM_REFRESH)

            if (w.document.hidden) { // if tab in background: flash favicon
                let flag = true

                if (preferences.get(ROT_WFR.OPTIONS.REFRESH_DESKTOP_NOTIFICATION) === 'true') {
                    GM_notification({
                        'title': 'Wayfarer - New Wayspot Analysis Available',
                        'text': 'by Wayfarer-Tools',
                        'image': 'https://gitlab.com/uploads/-/system/project/avatar/3311015/opr-tools.png',
                    })
                }

                let flashId = setInterval(() =>
                {
                    flag = !flag

                    changeFavicon(`${flag ? POI_MARKER : '/imgpub/favicon.ico'}`)
                }, 1000)

                // stop flashing if tab in foreground
                addEventListener('visibilitychange', () =>
                {
                    if (!w.document.hidden) {
                        changeFavicon('/imgpub/favicon.ico')

                        clearInterval(flashId)
                    }
                })
            }
        }
    }

    /**
     * @param src
     */
    function changeFavicon(src)
    {
        let link = w.document.querySelector('link[rel="shortcut icon"]')

        link.href = src
    }

    /**
     * @param subController
     */
    function startExpirationTimer(subController)
    {
        w.document.querySelector('.header .inner-container:last-of-type').insertAdjacentHTML('afterbegin', '<span id="countdownDisplay"></span>')

        let countdownEnd = subController.pageData.expires
        let countdownDisplay = document.getElementById('countdownDisplay')
        countdownDisplay.style.setProperty('color', 'white')

        // Update the count down every 1 second
        let counterInterval = setInterval(function()
        {
            // Get todays date and time
            let now = new Date().getTime()

            // Find the distance between now an the count down date
            let distance = countdownEnd - now

            // Time calculations for minutes and seconds
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            let seconds = Math.floor((distance % (1000 * 60)) / 1000)

            // Display the result in the element
            countdownDisplay.innerText = `${minutes}m ${seconds}s `

            if (distance < 0) {
                // If the count down is finished, write some text
                clearInterval(counterInterval)

                countdownDisplay.innerText = 'EXPIRED'
                countdownDisplay.style.setProperty('color', 'red')
            } else if (distance < 90000) {
                countdownDisplay.style.setProperty('color', 'red')
            }
        }, 1000)
    }

    function versionCheck()
    {
        if (ROT_WFR.VERSION > (parseInt(w.localStorage.getItem(ROT_WFR.PREFIX + ROT_WFR.VERSION_CHECK)) || ROT_WFR.VERSION - 1)) {
            w.localStorage.setItem(ROT_WFR.PREFIX + ROT_WFR.VERSION_CHECK, ROT_WFR.VERSION)

            const changelogString = `
                <h4>
                    <span class="glyphicon glyphicon-asterisk"></span>
                    Rothiss Wayfarer was updated:
                </h4>
                <div>${strings.changelog}</div>
            `

            // show changelog
            alertify.closeLogOnClick(false).logPosition('bottom right').delay(0).log(changelogString, (ev) =>
            {
                ev.preventDefault()
                ev.target.closest('div.default.show').remove()
            }).reset()
        }
    }

    function showHelp()
    {
        let helpString = `
            <a href='https://gitlab.com/1110101/opr-tools'><span class='label label-success'>Wayfarer-Tools</span></a>
            Key shortcuts<br>
            <table class="table table-condensed ">
                <thead>
                    <tr>
                        <th>Keys</th>
                        <th>Function</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><kbd>Keys 1-5</kbd> / <kbd>Numpad 1-5</kbd></td>
                        <td>Valuate current selected field (the yellow highlighted one)</td>
                    </tr>
                    <tr>
                        <td><kbd>Keys 1-7</kbd> / <kbd>Numpad 1-7</kbd></td>
                        <td>Rejection popup: Select list element</td>
                    </tr>
                    <tr>
                        <td><kbd>D</kbd></td>
                        <td>Mark current candidate as a duplicate of the opened portal in "duplicates"</td>
                    </tr>
                    <tr>
                        <td><kbd>T</kbd></td>
                        <td>Open title translation</td>
                    </tr>
                    <tr>
                        <td><kbd>Y</kbd></td>
                        <td>Open description translation</td>
                    </tr>
                    <tr>
                        <td><kbd>U</kbd></td>
                        <td>Open supporting statement translation</td>
                    </tr>
                    <tr>
                        <td><kbd>Space</kbd> / <kbd>Enter</kbd> / <kbd>Numpad Enter</kbd></td>
                        <td>Confirm dialog / Send valuation</td>
                    </tr>
                    <tr>
                        <td><kbd>Tab</kbd> / <kbd>Numpad +</kbd></td>
                        <td>Next field</td>
                    </tr>
                    <tr>
                        <td><kbd>Shift</kbd> / <kbd>Backspace</kbd> / <kbd>Numpad -</kbd></td>
                        <td>Previous field</td>
                    </tr>
                    <tr>
                        <td><kbd>Esc</kbd> / <kbd>Numpad /</kbd></td>
                        <td>First field</td>
                    </tr>
                    <tr>
                        <td><kbd>^</kbd> / <kbd>Numpad *</kbd></td>
                        <td>Skip Portal (if possible)</td>
                    </tr>
                </tbody>
            </table>`

        alertify.closeLogOnClick(false).logPosition('bottom right').delay(0).log(helpString, (ev) =>
        {
            ev.preventDefault()

            ev.target.closest('div.default.show').remove()
        }).reset()
    }

    /**
     * @param num
     * @param precision
     * @returns {number}
     */
    function roundToPrecision(num, precision)
    {
        let shifter

        precision = Number(precision || 0)

        if (precision % 1 !== 0) {
            throw new RangeError('precision must be an integer')
        }

        shifter = Math.pow(10, precision)

        return Math.round(num * shifter) / shifter
    }
}

setTimeout(() =>
{
    init()
}, 250)

const strings = {
    options: {
        [ROT_WFR.OPTIONS.COMMENT_TEMPLATES]: 'Comment templates',
        [ROT_WFR.OPTIONS.DARK_MODE]: 'Dark mode',
        [ROT_WFR.OPTIONS.KEYBOARD_NAV]: 'Keyboard navigation',
        [ROT_WFR.OPTIONS.REFRESH]: 'Periodically refresh wayfarer if no analysis is available',
        [ROT_WFR.OPTIONS.REFRESH_DESKTOP_NOTIFICATION]: '↳ With desktop notification',
        [ROT_WFR.OPTIONS.SCANNER_OFFSET_FEATURE]: 'Scanner offset',
        [ROT_WFR.OPTIONS.SCANNER_OFFSET_UI]: '↳ Display offset input field',
    },
    changelog: `Is it dark?`,
}

const POI_MARKER = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuOWwzfk4AAADlSURBVDhPY/j//z8CTw3U/V8lcvx/MfPX/2Xcd//XyWwDYxAbJAaS63c2Q9aD0NygUPS/hPXt/3bD5f93LI7DwFvnJILlSlg//K+XrUc1AKS5jOvx/wU55Vg1I2OQmlKOpzBDIM4G2UyMZhgGqQW5BOgdBrC/cDkbHwbpAeplAAcONgWEMChMgHoZwCGMTQExGKiXARxN2CSJwUC9VDCAYi9QHIhVQicpi0ZQ2gYlCrITEigpg5IlqUm5VrILkRdghoBMxeUd5MwE1YxqAAiDvAMKE1DAgmIHFMUgDGKDxDCy838GAPWFoAEBs2EvAAAAAElFTkSuQmCC`
