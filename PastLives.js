
/**
 * 
 */

var statusArray = [];
var panelcount = 0;
var peopleArray = [];
var lookdepth = 90;
var monthNames = [ "January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December" ];

function whodied(year, month, day) {
	var name = "";
	return name;
}
function whoborn(year, month, day) {
	var name = "";
	return name;
}

function birth(person) {

	var birthdate;

	// https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvlimit=1&rvprop=content&format=xml&titles=albert%20Einstein
	var url = 'https://en.wikipedia.org/w/api.php?' + 'format=json'
			+ '&rvlimit=1' + '&rvprop=content' + '&action=query'
			+ '&prop=revisions' + '&titles=' + person + '&callback=?';
	getJSONP(url, function(data) {
		// console.log(data);
		for ( var pageId in data.query.pages) {
			if (data.query.pages.hasOwnProperty(pageId)) {
				var content = data.query.pages[pageId].revisions[0]['*'];
				var bdate = middlestring(content, "Birth date", "}}");
				var ddate = middlestring(content, "Death date", "}}");

				birthdate = bdate;
				document.getElementById("sidebox").innerHTML += " b:"
						+ birthdate;

				/*
				 * birth_date = {{Birth date|df=yes|1879|3|14}} | birth_place =
				 * [[Ulm]], [[Kingdom of Württemberg]], [[German Empire]] |
				 * death_date = {{Death date and
				 * age|df=yes|1955|4|18|1879|3|14}}
				 * 
				 * 
				 */
			}
		}
	});

	return birthdate;

}
function death(person) {
	var deathdate = "00/00/0000";
	var birthdate = "00/00/0000";

	// https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvlimit=1&rvprop=content&format=xml&titles=albert%20Einstein
	var url = 'https://en.wikipedia.org/w/api.php?' + 'format=json'
			+ '&rvlimit=1' + '&rvprop=content' + '&action=query'
			+ '&prop=revisions' +
			// '&exintro=' +
			// '&explaintext=' +
			'&titles=' + person + '&callback=?';
	// 'http://en.wikipedia.org/w/api.php?format=json&action=query&titles=List_of_metropolitan_areas_by_population&prop=revisions&rvprop=content&callback=?'
	getJSONP(url, function(data) {
		// console.log(data);
		for ( var pageId in data.query.pages) {
			if (data.query.pages.hasOwnProperty(pageId)) {
				var content = data.query.pages[pageId].revisions[0]['*'];
				var bdate = middlestring(content, "birth_date", "}}");
				var ddate = middlestring(content, "death_date", "}}");
				ddate = strip(ddate);
				
				/*
				 * 
				 * | birth_date    ={{birth-date|13 March 1763}}
| death_date    ={{death-date and age|2 August 1815|13 March 1763}}

				 * */
				ddate = middlestring(ddate, "|", "");

				var DateArray = ddate.split("|");
				if (DateArray.length == 6) {

					var valid = true;
					for ( var section in DateArray) {
						var isnotanumber = isNaN(DateArray[section]);
						if (isnotanumber == true) {
							valid = false;
						}
					}
					if (valid) {

						var dYear = DateArray[0].trim();
						var dMonth = DateArray[1].trim();
						var dDay = DateArray[2].trim();
						var bYear = DateArray[3].trim();
						var bMonth = DateArray[4].trim();
						var bDay = DateArray[5].trim();
						var valid = true;
						deathdate = dMonth + "/" + dDay + "/" + dYear;
						birthdate = bMonth + "/" + bDay + "/" + bYear;

						console.log(person.trim() + " - " + birthdate + " "
								+ isdate(birthdate) + " - " + deathdate + " "
								+ isdate(deathdate) + " - " + ddate);
						var c = document.getElementById("panel" + panelcount);
						c.childNodes[5].innerHTML = "Death: " + deathdate;
						c.childNodes[7].innerHTML = "Birth: " + birthdate;
						duplicate('templatebutton');
						popdate();

				 			} else {status("No valid dates found for this person");}

				} else {status("No dates found for this person");}

			}
		}
	});

	return deathdate;

}

function strip(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}


// http://www.onthisday.com/birthdays/april/8/1320
// http://www.onthisday.com/deaths/april/8/1320
// https://en.wikipedia.org/wiki/October_18
// https://en.wikipedia.org/wiki/Jacob_Jordaens

// https://en.wikipedia.org/w/api.php?action=opensearch&search=einstein&limit=1&namespace=0&format=jsonfm

// /https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvlimit=1&rvprop=content&format=xml&titles=test

function wikime(text) {
	var totalinfo = "";
	var playListURL = '';
	playListURL = 'https://en.wikipedia.org/w/api.php?' + 'format=json'
			+ '&action=query' + '&prop=extracts' + '&exintro='
			+ '&explaintext=' + '&titles=' + text + '&callback=?';
	// /&rvlimit=1&rvprop=content&
	playListURL = 'https://en.wikipedia.org/w/api.php?' + 'format=json'
			+ '&rvlimit=1' + '&rvprop=content' + '&action=query'
			+ '&prop=extracts' + '&exintro=' + '&explaintext=' + '&titles='
			+ person + '&callback=?';
	$.getJSON(playListURL, function(data) {
		var hash = data
		var page_value = ""
		$.each(data["query"]["pages"], function(k, v) {
			var title, extract;
			// alert(k)
			$.each(v, function(key, val) {
				// alert(key
				// + "="
				// +
				// val)
				if (key == "title") {
					title = val;
				}
				if (key == "extract") {
					extract = val;
				}
			});
			if (extract != null) {
				totalinfo += "<p><a href='https://en.wikipedia.org/wiki/"
						+ title + "'>" + title + "</a> " + extract + "</p>";
				var div = document.getElementById('sidebox');
				// div.innerHTML = "";
				if (div != null) {
					div.innerHTML += totalinfo;
				}

			}
		});
	});
}

// wikime("Minnesota");

function getJSONP(url, success) {
	var ud = '_' + +new Date, script = document.createElement('script'), head = document
			.getElementsByTagName('head')[0]
			|| document.documentElement;

	window[ud] = function(data) {
		head.removeChild(script);
		success && success(data);
	};

	script.src = url.replace('callback=?', 'callback=' + ud);
	head.appendChild(script);

}

function middlestring(source, front, end) {
	var result = "";
	if (source == undefined) {
		return "";
	}
	var x = source.indexOf(front) + front.length;
	var y = source.indexOf(end, x);
	if (x == 0) {
		return source;
	}
	if (end == "") {
		result = source.substring(x);
	} else {
		result = source.substring(x, y);
	}
	result = result.replace("df=yes", "");
	result = result.replace("mf=yes", "");
	result = result.replace("df=y", "");
	result = result.replace("mf=y", "");

	var lastChar = result.substr(result.length - 1); // => "1"
	var firstChar = result.substr(0, 1); // => "1"
	if (lastChar == "|") {
		result = result.substr(0, result.length - 1);
	}
	if (firstChar == "|") {
		result = result.substr(1);
	}
	return result.trim();
}

var fruits, text, fLen, i;

people =

[ "Abraham Lincoln", "Adolf Hitler", "Albert Einstein", "Alfred Hitchcock",
		"Amelia Earhart", "Anne Frank", "Mary Magdalene", "Mata Hari",
		"Michael Jackson", "Audrey Hepburn", "Babe Ruth", "Barack Obama",
		"Benazir Bhutto", "Billie Holiday", "C.S. Lewis", "Charles Darwin",
		"Charles de Gaulle", "Christopher Columbus", "Cleopatra",
		"Coco Chanel", "Elvis Presley", "Emmeline Pankhurst",
		"Ernest Hemingway", "Eva Peron", "Fidel Castro",
		"Franklin D. Roosevelt", "George Orwell", "Grace Kelly",
		"Haile Selassie", "Henry Ford", "Indira Gandhi", "Ingrid Bergman",
		"J.R.R. Tolkien", "Jacqueline Kennedy Onassis", "Jawaharlal Nehru",
		"Jesse Owens", "John F. Kennedy", "John Lennon", "John M Keynes",
		"Joseph Stalin", "Katherine Hepburn", "Lance Armstrong", "Leo Tolstoy",
		"Leon Trotsky", "Leonardo da Vinci", "Lionel Messi",
		"Lord Baden Powell", "Louis Pasteur", "Ludwig Beethoven",
		"Lyndon Johnson", "Mahatma Gandhi", "Malcolm X", "Mao Zedong",
		"Marie Antoinette", "Marilyn Monroe", "Martin Luther King",
		"Mother Teresa", "Neil Armstrong", "Oscar Wilde", "Pablo Picasso",
		"Peter Sellers", "Plato 				", "Pope John Paul II", "Queen Victoria",
		"Ronald Reagan", "Rosa Parks", "Sigmund Freud", "Simon Bolivar",
		"Steve Jobs", "Thomas Edison", "V.Lenin", "Vincent Van Gogh",
		"Walt Disney", "Winston Churchill", "Woodrow Wilson" ]

;
fLen = people.length;

function getdatesforpeeps() {

	for (i = 0; i < fLen; i++) {
		sleepFor(2);
		death(people[i]);
	}
}

function sleepFor(sleepDuration) {
	var now = new Date().getTime();
	while (new Date().getTime() < now + sleepDuration) { /*
															 * do nothing
															 */
	}
}

function isdate(mydate) {
	var date_regex = /^([1-9]|0[1-9]|1[0-2])\/([1-9]|0[1-9]|1\d|2\d|3[01])\/([0-2][0-9])\d{2}$/;
	if (!(date_regex.test(mydate))) {
		return false;
	} else {
		return true;
	}
}

function getPeople(thisdate) {

	if (lookdepth == 0) {
		return;
	}
	var ArrPeeps = [ "none" ];
	peopleArray = [];
	// https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvlimit=1&rvprop=content&format=xml&titles=albert%20Einstein
	// https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvlimit=1&rvprop=content&format=xml&titles=albert%20Einstein
	var url = 'http://en.wikipedia.org/w/api.php?format=json&action=query&titles='
			+ monthNames[thisdate.getMonth()]
			+ '_'
			+ thisdate.getDate()
			+ '&prop=revisions&rvprop=content&callback=?'
	getJSONP(
			url,
			function(data) {

				for ( var pageId in data.query.pages) {
					if (data.query.pages.hasOwnProperty(pageId)) {
						var content = data.query.pages[pageId].revisions[0]['*'];
						// console.log(content);

						var textlist = middlestring(content, "==Deaths==", "==");
						// console.log(textlist);

						ArrPeeps = textlist.split("*");
						for (peep in ArrPeeps) {
							arrLine = ArrPeeps[peep].split("&ndash;")
							var year = arrLine[0];
							year = year.replace("[", "").trim();
							year = year.replace("[", "").trim();
							year = year.replace("]", "").trim();
							year = year.replace("]", "").trim();
							var person = arrLine[1];
							if (person != undefined) {
								var description = "";
								var arrPerson = person.split(",");
								person = middlestring(person, "[[", "]]");// arrPerson[0];

								if (person.indexOf("|") > 1) {
									person = person.split("|")[0].trim();
								}

								person = person.replace("[", "").trim();
								person = person.replace("[", "").trim();
								person = person.replace("]", "").trim();
								person = person.replace("]", "").trim();
								description = arrPerson[1];
								if (description != undefined) {
									description = description
											.replace("[[", "(").trim();
									description = description
											.replace("]]", ")").trim();
									// sleepFor(2);
									// death(person);
									// sleepFor(2);
									var pullme = middlestring(description, "(",
											")");
									description = description.replace("("
											+ pullme + ")", "");
							
								} else {
									description = "";
								}
								if (thisdate.getFullYear() == year) {
									arrthisPerson = []
									arrthisPerson[0] = year;
									arrthisPerson[1] = person;
									arrthisPerson[2] = description;
									peopleArray.push(arrthisPerson);
									lookdepth = 90;

									console.log(year + " :: " + person + " :: "
											+ description);

								}
							} else {
								// status("no person or year: " + arrLine);
							}
						}
						lookdepth = lookdepth - 1;
						status(formatDate(thisdate) + " (" + lookdepth + ") found " + peopleArray.length);
						//console.log("depth " + lookdepth);

					}
				}

				if (peopleArray.length > 0) {
					duplicate('templatepanel');
					// do this later duplicate('templatebutton');
					lookupsomepeeps();

				} else {
					if (peopleArray.length ==0 ){
						thisdate.setDate(thisdate.getDate()-1);
						sleepFor(2);
						//if (lookdepth == 0) {
						//	return;
						//}
						getPeople(thisdate);
						//break;
					}
				//	duplicate('templatedone');
//				
				}

			});

	return peopleArray.length;

}

// http://api.hiztory.org/deaths/09/26/2/15/api.xml
// console.log(getPeople("09/11/2001"));

function lookupsomepeeps() {
	if (peopleArray.length > 0) { //}== 1) {
		var c = document.getElementById("panel" + panelcount);
		c.childNodes[1].innerHTML = "Name: " + peopleArray[0][1];
		c.childNodes[3].innerHTML = "Description: " + peopleArray[0][2];
		death(peopleArray[0][1]);
	} else {

	}
}

function popdate() {
	var enteredDate = document.getElementById('birthday').valueAsDate;
	var result = "Day: " + enteredDate.getDate() // + "<br/>"
	// + "Month: "
	// + enteredDate.getMonth() + "<br/>" + "Year: "
	// + enteredDate.getFullYear()
	;
	// var foo = Math.floor((Math.random() * 10) + 1);
	// status("Result is: " + result + " " + foo);

	if (panelcount > 0) {
		document.getElementById("panel" + panelcount).innerHTML = document
				.getElementById("templatearrow").innerHTML;
		var panelprevious = panelcount - 1;
		var panelname = "panel" + panelprevious;
		var c = document.getElementById(panelname);
		var datetext = c.childNodes[7].innerHTML;
		datetext = datetext.replace("Birth: ", "");
		var newdate = new Date(datetext);

		// newdate = Date.parse();
		getPeople(newdate);
	} else {
		document.getElementById("gobutton").innerHTML = document
				.getElementById("templatearrow").innerHTML;

		status('Getting People..');
		getPeople(enteredDate); // kick off the search
	}
}

function duplicate(which) {
	var original = document.getElementById(which);
	if (original != null) {
		var clone = original.cloneNode(true); // "deep" clone
		clone.id = "panel" + ++panelcount; // there can only be one element
		// with an ID
		clone.onclick = duplicate; // event handlers are not cloned
		clone.style = "display:block";
		original.parentNode.appendChild(clone);

	}
}
function lookmeup() {
	status("need to get some dates");
}

function formatDate(value)
{
   return value.getMonth()+1 + "/" + value.getDate() + "/" + value.getYear();
}

function status(message) {
	var panel = document.getElementById('status');
	panel.innerHTML = "";
	if (statusArray.length > 0) {
		statusArray.splice(0, 1);
	}
	statusArray.push(message);
	for (i = statusArray.length - 1; i >= 0; i--) {
		panel.innerHTML += statusArray[i] + "<br/>";
	}
}

