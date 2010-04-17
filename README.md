Footnotes
=========

Footnotes finds all links or citations within a given Element and generates footnotes either at the bottom of the node or in another supplied Element. Takes into account multiple links pointing to the same URL and allows for configurable footnote identifiers (numeric, alpha, alphanumeric, greek, special characters, or any custom set). Inspired by Aaron Gustafson's article, [*Improving Link Display for Print*](http://www.alistapart.com/articles/improvingprint).


How To Use
----------

Instantiate a new `Footnotes` by passing its constructor the `Element` or the ID of an `Element` to use as the target.

	var someElement = document.id('element_identifier')
	var notes = new Footnotes(someElement);

	var notes = new Footnotes('element_identifier')

Note that one may pass `document.body` to create footnotes for the entire document, but this will create footnotes for every link on the page, even page navigation. This is usually not a desired effect.

### apply
Adds footnote references (`.footnoteReference`) after all elements needing citation and the corresponding footnotes (`.footnote`) to the footnote container (`.footnotes`). When called twice in succession, will automatically `clear`, so a reapplication/update of footnotes needs only call `apply` again. Returns the `Footnotes` instance for chaining.

### clear
Removes all footnote references (`.footnoteReference`) and empties the footnote container (`.footnotes` or supplied `Element`)

### attempt(el)
Attempts to `cite()` the given element if it has an `href` or `cite` attribute. `cite` takes precedence over `href`.

### cite(el,url)
Cites the given element with the given URL. This method can be used to cite any arbitrary element. Will use the appropriate reference if the URL has already been cited and create a new footnote with a corresponding reference if it has not. If attempting to cite an element because it has recently been added to an area that has already been cited, use `apply` instead. `apply` will recalculate all references and find all elements that have been added since last run of `apply`.

Options
-------

### footnoteContainer *(default: null)*
Can be any `Element` or a `String` containing the ID of an element. If this option is not supplied or the given value is not found as a unique `Element` identifier, a list will be created as the last child element of the target given in the constructor and this will be used as the footnote container (`.footnotes`). If this container is shared with another instance of `Footnotes`, no URLs that are common across the two instances will be duplicated in the footnote output. However, if different charsets are being used, footnote references (`.footnoteReference`) may not match up with their identifiers (`.footnoteIdentifier`).

### charset *(default: "alpha")*
A set of characters to be used for creating unique identifiers for footnote references. The footnote number is essentially converted to the base of the number of characters. For example, `"alpha"`, which contains the letters *a* through *z* in order, would count up to z and continue to *aa*, *ab*, *ac*, etc. All other character sets, even those provided by the user, will act this same way. 

May be one of:

- `"numeric"`: numbers only
- `"alpha"`: letters only
- `"aphanumeric"`: numbers and letters
- `"qwerty"`: all letters in QWERTY keyboard layout order: left-to-right, top-to-bottom
- `"greek"`: greek alphabet
- `"special"`: special characters: asterisk, dagger, double dagger, etc.
- any `Array`: your own custom character set; must be at least 2 elements
- any `String` not listed: will be split on every character and used as a character set

### format *(default: "{id}")*
A format string to use for formatting footnote references (`.footnoteReference`) that are appended after cited elements. MooTools' [String::substitute](http://mootools.net/docs/core/Native/String#String:substitute) is used to replace special keywords in the format string. Two keywords that are currently defined are `id`, the footnote identifer, and `url`, the footnote URL. For example, a format string of "[{id}]" will add square brackets around the identifier in the `.footnoteReference` `Element`.

Styling Guide
-------------

A sample stylesheet is included. This stylesheet performs typical styling on the footnotes and their references. It also forces the footnotes to appear only on printed documents, while falling back nicely with an appended parentheses-enclosed url if the user has javascript disabled. 

- `.footnoteReference`: The reference to a footnote that is appended after a cited element.
- `.footnotes`: The footnote container (`ul`) either created by or given to this `Footnotes` instance.
- `.footnote`: A footnote (`li`) that was added to the footnote container (`.footnotes`).
- `.footnoteIdentifier`: The first of two elements contained in each footnote (`.footnote`). Contains the identifier for this particular footnote.
- `.footnoteUrl`: The second of two elements contained in each footnote (`.footnote`). Contains the URL for this particular footnote.

TODO
----

Currently planning a feature to add backreferences (a caret or something, as seen on Wikipedia) to each footnote that link to the places that the URL is referenced.

Known Issues
------------

There are currently no known issues.

Additional Info
---------------

I am always open for feature requests or any feedback.
I can be reached at [Github](http://github.com/michaelficarra).

Thanks go out to Aaron Gustafson for the original idea and implementation.
