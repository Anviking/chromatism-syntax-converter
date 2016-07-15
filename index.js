var hljs = require('highlight.js')
var swift = hljs.getLanguage('swift')
var c = hljs.getLanguage('cpp')
//console.log(swift)

function JLKeywordScope(keywords, type) {
	return "JLKeywordScope(keywords: \"" + keywords + "\", tokenType: " + type + ")"
}

function convertKeywords(keywords) {
	if (keywords == undefined) { return [] }
	var key = [keywords.keyword, ".keyword"]
	var built_in = [keywords.built_in, ".otherMethodNames"]
	var literal = [keywords.literal, ".keyword"]
	return [ key, built_in, literal].filter(t => t[0] != undefined).map(t => JLKeywordScope(t[0], t[1]))
}

Array.prototype.flatMap = function(lambda) { 
    return Array.prototype.concat.apply([], this.map(lambda)); 
};

function JLNestedScope(begin, end) {
	var begin = String(begin).replace("\\", "\\\\")
	if (end == "$") {
		return "JLRegexScope(pattern: \"" + begin + ".*" + "\", tokenTypes: .comment)"
	}
	return "JLTokenizingScope(incrementingPattern: \"" + begin + "\", decrementingPattern: \"" + end + "\", tokenType: .comment, hollow: false)"
}


var languages = hljs.listLanguages().filter(l => l != undefined)

function commentScopesFromLanguage(language) {
	var contains = language.contains
	var keywords = convertKeywords(language.keywords)
	return contains.filter(l => l.className == 'comment')
	.map(s => JLNestedScope(s.begin, s.end)).concat(keywords)
}

//console.log(new Set(b))
//console.log(convertKeywords(c.keywords))
var a = languages.map(function(l) {
	var lang = hljs.getLanguage(l)
	var scopes = commentScopesFromLanguage(lang)
	return [l, scopes]
})

var lines = []
a.forEach(function(a) {

	lines.push("case " + a[0] + ":")
	lines.push("    return JLDocumentScope()[")
	lines.push("        " + a[1].join(",\n        "))
	lines.push("    ]")
})


lines.forEach(l => console.log(l))





//console.log(c.contains[1])
