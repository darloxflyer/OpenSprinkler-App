/* global $ */

/* OpenSprinkler App
 * Copyright (C) 2015 - present, Samer Albahra. All rights reserved.
 *
 * This file is part of the OpenSprinkler project <http://opensprinkler.com>.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// Configure module
var OSApp = OSApp || {};
OSApp.Language = OSApp.Language || {};

//Localization functions
OSApp.Language._ = function( key ) {

	//Translate item (key) based on currently defined language
	if ( typeof OSApp.uiState.language === "object" && Object.prototype.hasOwnProperty.call(OSApp.uiState.language,  key ) ) {
		var trans = OSApp.uiState.language[ key ];
		return trans ? trans : key;
	} else {

		//If English
		return key;
	}
};

OSApp.Language.setLang = function() {

	//Update all static elements to the current language
	$( "[data-translate]" ).text( function() {
		var el = $( this ),
			txt = el.data( "translate" );

		if ( el.is( "input[type='submit']" ) ) {
			el.val( OSApp.Language._( txt ) );

			// Update button for jQuery Mobile
			if ( el.parent( "div.ui-btn" ).length > 0 ) {
				el.button( "refresh" );
			}
		} else {
			return OSApp.Language._( txt );
		}
	} );
	$( ".ui-toolbar-back-btn" ).text( OSApp.Language._( "Back" ) );

	OSApp.Language.checkCurrLang();
};

OSApp.Language.updateLang = function( lang ) {

	//Empty out the current OSApp.uiState.language (English is provided as the key)
	OSApp.uiState.language = {};

	if ( typeof lang === "undefined" ) {
		OSApp.Storage.get( "lang", function( data ) {

			//Identify the current browser's locale
			var locale = data.lang || navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage || "en";

			OSApp.Language.updateLang( locale.substring( 0, 2 ) );
		} );
		return;
	}

	OSApp.Storage.set( { "lang":lang } );
	OSApp.currentSession.lang = lang;

	if ( lang === "en" ) {
		OSApp.Language.setLang();
		return;
	}

	$.getJSON( OSApp.UIDom.getAppURLPath() + "locale/" + lang + ".js", function( store ) {
		OSApp.uiState.language = store.messages;
		OSApp.Language.setLang();
	} ).fail( OSApp.Language.setLang );
};

OSApp.Language.languageSelect = function() {
	$( "#localization" ).popup( "destroy" ).remove();

	/*
		Commented list of languages used by the string parser to identify strings for translation

		{af: OSApp.Language._("Afrikaans"), am: OSApp.Language._("Amharic"), zh: OSApp.Language._("Chinese"), hr: OSApp.Language._("Croatian"), cs: OSApp.Language._("Czech"), et: OSApp.Language._("Estonian")
		nl: OSApp.Language._("Dutch"), en: OSApp.Language._("English"), pes: OSApp.Language._("Farsi"), fr: OSApp.Language._("French"), de: OSApp.Language._("German"), bg: OSApp.Language._("Bulgarian"),
		el: OSApp.Language._("Greek"), he: OSApp.Language._("Hebrew"), hu: OSApp.Language._("Hungarian"), is: OSApp.Language._("Icelandic"), it: OSApp.Language._("Italian"), lv: OSApp.Language._("Latvian"),
		mn: OSApp.Language._("Mongolian"), no: OSApp.Language._("Norwegian"), pl: OSApp.Language._("Polish"), pt: OSApp.Language._("Portuguese"), ru: OSApp.Language._("Russian"), ta: OSApp.Language._("Tamil"),
		sk: OSApp.Language._("Slovak"), sl: OSApp.Language._("Slovenian"), es: OSApp.Language._("Spanish"), th: OSApp.Language._("Thai"), tr: OSApp.Language._("Turkish"), sv: OSApp.Language._("Swedish"), ro: OSApp.Language._("Romanian")}
	*/

	var popup = "<div data-role='popup' data-theme='a' id='localization' data-corners='false'>" +
				"<ul data-inset='true' data-role='listview' id='lang' data-corners='false'>" +
				"<li data-role='list-divider' data-theme='b' class='center' data-translate='Localization'>" + OSApp.Language._( "Localization" ) + "</li>",

		codes = { af: "Afrikaans", am: "Amharic", bg: "Bulgarian", zh: "Chinese", hr: "Croatian", cs: "Czech", nl: "Dutch",
				en: "English", et: "Estonian", pes: "Farsi", fr: "French", de: "German", el: "Greek", he: "Hebrew", hu: "Hungarian",
				is: "Icelandic", it: "Italian", lv: "Latvian", mn: "Mongolian", no: "Norwegian", pl: "Polish", pt: "Portuguese",
				ru: "Russian", sk: "Slovak", sl: "Slovenian", es: "Spanish", ta: "Tamil", th: "Thai", tr: "Turkish", sv: "Swedish", ro: "Romanian" };

	$.each( codes, function( key, name ) {
		popup += "<li><a href='#' data-lang-code='" + key + "'><span data-translate='" + name + "'>" + OSApp.Language._( name ) + "</span> (" + key.toUpperCase() + ")</a></li>";
	} );

	popup += "</ul></div>";

	popup = $( popup );

	popup.find( "a" ).on( "click", function() {
		var link = $( this ),
			lang = link.data( "lang-code" );

		OSApp.Language.updateLang( lang );
	} );

	OSApp.UIDom.openPopup( popup );

	return false;
};

OSApp.Language.checkCurrLang = function() {
	OSApp.Storage.get( "lang", function( data ) {
		var popup = $( "#localization" );

		popup.find( "a" ).each( function() {
			var item = $( this );
			if ( item.data( "lang-code" ) === data.lang ) {
				item.removeClass( "ui-icon-carat-r" ).addClass( "ui-icon-check" );
			} else {
				item.removeClass( "ui-icon-check" ).addClass( "ui-icon-carat-r" );
			}
		} );

		popup.find( "li.ui-last-child" ).removeClass( "ui-last-child" );
	} );
};
