/* RESIZING THE PLAY AREA AND INNER FIELDS */

const phi = 1.618033;
const gridGap = 0.1;
const ratioOfBoard = (3 * phi + 2 * gridGap) / (4 + 3 * gridGap);

function isRestrictedByWidth(maxPossibleSizes) {
    return (Math.min(...maxPossibleSizes) == maxPossibleSizes[0]);
}

function wideScreen(vw, vh) {

    const ratioOfPlayArea = 1.3;
    var ratioOfSidebar = 1 / (ratioOfPlayArea - (1 / ratioOfBoard));
    var maxPossibleSizes = [0.8 * vw / ratioOfPlayArea, 0.8 * vh];

    if (isRestrictedByWidth(maxPossibleSizes)) {
        var width = maxPossibleSizes[0] * ratioOfPlayArea;
        var height = maxPossibleSizes[0];
    } else {
        var width = maxPossibleSizes[1] * ratioOfPlayArea;
        var height = maxPossibleSizes[1];
    }

    /* Sizes */
    $("#play-area").height(height);
    $("#play-area").width(width);
    
    $("#board").height(height);
    $("#board").width(height / ratioOfBoard);

    $("#board").css("grid-gap", gridGap * height / (ratioOfBoard * (4 + 3 * gridGap)));

    $("#sidebar").height(height);
    $("#sidebar").width(height / ratioOfSidebar);

    /* Border */
    $("#board").css("border-right", "1.5px solid #d8d8d8");
    $("#board").css("padding-right", 20);
    $("#board").css("border-bottom", "none");
    $("#board").css("padding-bottom", 0);
    $("#sidebar").css("padding-left", 10);

    /* Flex Directions */
    $("#play-area").css("flex-direction", "row");
    $("#sidebar").css("flex-direction", "column");
}

function tallScreen(vw, vh) {
    const ratioOfPlayArea = 1.4;
    var ratioOfSidebar = ratioOfPlayArea - ratioOfBoard;
    var maxPossibleSizes = [0.8 * vw, 0.8 * vh / ratioOfPlayArea];

    if (isRestrictedByWidth(maxPossibleSizes)) {
        var width = maxPossibleSizes[0];
        var height = maxPossibleSizes[0] * ratioOfPlayArea;
    } else {
        var width = maxPossibleSizes[1];
        var height = maxPossibleSizes[1] * ratioOfPlayArea;
    }

    /* Sizes */
    $("#play-area").height(height);
    $("#play-area").width(width);

    $("#board").height(width * ratioOfBoard);
    $("#board").width(width);

    $("#board").css("grid-gap", gridGap * width / (4 + 3 * gridGap));

    $("#sidebar").css("min-height", width * ratioOfSidebar);
    $("#sidebar").width(width);

    /* Border */
    $("#board").css("border-bottom", "1.5px solid #d8d8d8");
    $("#board").css("padding-bottom", 20);
    $("#board").css("border-right", "none");
    $("#board").css("padding-right", 0);

    /* Flex Directions */
    $("#play-area").css("flex-direction", "column");
    // $("#sidebar").css("flex-direction", "row");
}

function resize() {
    var vw = $(window).innerWidth();
    var vh = $(window).innerHeight();
    $("#play-area-wrapper").height(vh);
    $("body").height(vh);
    $("body").width(vw);
    
    $("#sidebar").css("font-size", Math.sqrt(vw * vh) / 55);
    
    if (vw > vh) {
        wideScreen(vw, vh);
    } else {
        tallScreen(vw, vh);
    }

}

/* ------------------------------------------------------------------------------------------ */
/* CARDS */
/* ------------------------------------------------------------------------------------------ */


var cardsOnBoard = []

class Card {
    constructor(shape, fill, number, color) {
        this.shape = shape;
        this.fill = fill;
        this.number = number;
        this.color = color;
    }

    getHueRotate() {
        if (this.color == "green") {
            return ("hue-rotate(0deg)");
        } else if (this.color == "red") {
            return ("hue-rotate(235deg)");
        } else {
            return ("hue-rotate(130deg)");
        }
    }

    equals(other) {
        var properties = ["shape", "fill", "number", "color"];
        for (var i = 0; i < 4; i++) {
            var p = properties[i]
            if (this[p] != other[p]) {
                return false;
            }
        }
        return true;
    }

    isOnBoard() {
        for (var i = 0; i < cardsOnBoard.length; i++) {
            if (this.equals(cardsOnBoard[i])) {
                return true;
            }
        }
        return false;
    }

    createGraphic(cardDiv) {
        var html = ("<img style='filter: " + this.getHueRotate() + ";' src='icons/" + this.shape + "_" + this.fill + ".png'></img>").repeat(this.number);
        $(cardDiv).html(html);
    }
    
}

function random0To2() {
    return Math.floor(Math.random() * 3);
}

function newCard() {
    
    allShapes = ["squiggle", "diamond", "oval"];
    allFills = ["open", "striped", "filled"];
    allNumbers = [1, 2, 3];
    allColors = ["red", "green", "purple"];
    card = new Card(allShapes[random0To2()], allFills[random0To2()], allNumbers[random0To2()], allColors[random0To2()]);
    return card;
}

function isSetProperty(val1, val2, val3) {
    if ((val1 == val2) && (val2 == val3)) {
        return true;
        
    } else if ((val1 != val2) && (val2 != val3) && (val1 != val3)) {
        return true;
    }
    return false;
}

function isSet(card1, card2, card3) {
    var properties = ["shape", "fill", "number", "color"];
    for (var i = 0; i < 4; i++) {
        var p = properties[i];
        if (!(isSetProperty(card1[p], card2[p], card3[p]))) {
            return false;
        }
    }
    return true;

}

function isSetPossible() {
    for (var i = 0; i < cardsOnBoard.length; i++) {
        for (var j = i+1; j < cardsOnBoard.length; j++) {
            for (var k = j+1; k < cardsOnBoard.length; k++) {
                if (isSet(cardsOnBoard[i], cardsOnBoard[j], cardsOnBoard[k])) {
                    return true;
                }
            }
        }
    }
    return false;
}


function shuffleBoard() {
    cardsOnBoard = []
    do {
        $(".card").each(function() {
            do {
                card = newCard()
            }
            while (card.isOnBoard());
    
            cardsOnBoard.push(card);
            card.createGraphic(this);
        })
    }
    while (!isSetPossible());

}


$(document).ready(function() {
    shuffleBoard();
    
    
});


function replaceCards(checkedDiv, ids) {
    do {
        for (var i = 0; i < 3; i++) {
            do {
                card = newCard()
            }
            while (card.isOnBoard());
            cardsOnBoard[ids[i]] = card;
            card.createGraphic(checkedDiv[i]);
        }
    }
    while (!isSetPossible());

}


/* USER INTERACTIONS */

function cardClicked(cardDiv) {
    $(cardDiv).toggleClass("checked");

    checkedDiv = $(".checked").toArray();

    if ($(".checked").length == 3) {
        var ids = [];
        $(".checked").each(function() {
            ids.push(Number($(this).attr("id")));
        });

        if (isSet(cardsOnBoard[ids[0]], cardsOnBoard[ids[1]], cardsOnBoard[ids[2]])) {

            // Success message
            $("#setOrNot").html("Found a set!");
            $("#setOrNot").css("color", "green");
            $("#setOrNot").css("background", "#B0E9BF");

            $("#noOfSets").html(Number($("#noOfSets").html()) + 1)

            replaceCards(checkedDiv, ids);


        } else {
            $("#setOrNot").html("Oops! That one's not a set. Try again.");
            $("#setOrNot").css("background", "#FFAFB1");
            $("#setOrNot").css("color", "#C6272B");

        }
        $(".checked").each(function() {
            $(this).toggleClass("checked");
        });
    }

    
} 
