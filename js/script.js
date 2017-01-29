var zIndex = 0;
var clipBoard = [];
var keys = {
    "ctrl": false,
    "a": false,
    "c": false,
    "v": false,
    "x": false,
    "g": false,
    "u": false,
    "f": false,
    "b": false,
};
var gridMode = true;

hideMenuStrip();
hidePropWindow();
fixLayout();



var canvas = new fabric.Canvas('canvas');
canvas.preserveObjectStacking = true;

setGrid();

// create a rectangle object
var rect = new fabric.Rect({
    left: 100,
    top: 100,
    fill: 'red',
    width: 20,
    height: 20
});

canvas.add(rect);

var canvas_container = document.getElementById('canvas-container');
canvas_container.addEventListener("drop", function (e) {
    console.log("DROP");
    // e = e || window.event;
    if (e.preventDefault) {
        e.preventDefault();
    }
    var dt = e.dataTransfer;
    var files = dt.files;

    console.log(e);

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var reader = new FileReader();

        //attach event handlers here...
        reader.onload = function (e) {
            var img = new Image();
            img.src = e.target.result;
            var imgInstance = new fabric.Image(img, {
                left: 100,
                top: 100,
            });
            canvas.add(imgInstance);
        }
        reader.readAsDataURL(file);
    }

    return false;
});

canvas_container.addEventListener('dragover', cancel);
canvas_container.addEventListener('dragenter', cancel);

function cancel(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    return false;
}

function dragEnd(e) {
    var type = $(e.srcElement).attr("data-type");
    if (type === "image") {
        var src = ($($(e.srcElement).children()[0]).attr("src"));
        console.log(e);
        src = src.substr(0, src.indexOf(".png"));
        src += "H.png";
        var image = new Image();
        image.src = src;
        image.onload = function () {
            var imgInstance = new fabric.Image(image, {
                left: e.pageX - 200,
                top: e.pageY - 52,
            });
            canvas.add(imgInstance);
            imgInstance.moveTo(zIndex++);
        }
    }

    if (type === "shape") {
        var shape = $(e.srcElement).attr("data-shape");
        var s;
        if (shape === 'line') {
            s = new fabric.Line([e.pageX - 200, e.pageY - 52, e.pageX, e.pageY], {
                stroke: 'black',
                shadow: 'lightgray 1px 1px 1px'
            });
        } else if (shape === 'rect') {
            s = new fabric.Rect({
                left: e.pageX - 200,
                top: e.pageY - 52,
                fill: 'white',
                stroke: 'black',
                width: 100,
                height: 50,
                shadow: 'lightgray 1px 1px 1px'
            });
        } else if (shape === 'cir') {
            s = new fabric.Circle({
                radius: 50,
                fill: 'white',
                stroke: 'black',
                left: e.pageX - 200,
                top: e.pageY - 52,
                shadow: 'lightgray 1px 1px 1px'
            });
        } else if (shape === 'tri') {
            s = new fabric.Triangle({
                width: 100,
                height: 50,
                fill: 'white',
                stroke: 'black',
                left: e.pageX - 200,
                top: e.pageY - 52,
                shadow: 'lightgray 1px 1px 1px'
            });
        } else if (shape === 'txt') {
            s = new fabric.IText('Text goes here', {
                left: e.pageX - 200,
                top: e.pageY - 52,
                fill: 'black',
                shadow: 'lightgray 1px 1px 1px'
            });
        } else if (shape === 'arrow') {

            var x1 = e.pageX - 200,
                y1 = e.pageY - 52,
                x2 = x1 + 100,
                y2 = y1;

            var arrowSize = 5;

            var li = new fabric.Line([x1, y1, x2, y2], {
                stroke: 'black',
                shadow: 'lightgray 1px 1px 1px'
            });

            var liU = new fabric.Line([x1, y1, x1 + 5, y1 - 5], {
                stroke: 'black',
                shadow: 'lightgray 1px 1px 1px'
            });

            var liD = new fabric.Line([x1, y1, x1 + 5, y1 + 5], {
                stroke: 'black',
                shadow: 'lightgray 1px 1px 1px'
            });


            s = new fabric.Group();

            s.addWithUpdate(li);
            s.addWithUpdate(liU);
            s.addWithUpdate(liD);
        }
        canvas.add(s);
    }

}

for (var i = 0; i < document.getElementsByClassName('element').length; i++) {
    document.getElementsByClassName('element')[i].ondragend = function (e) {
        dragEnd(e);
    }
}

function setGrid() {
    canvas.setBackgroundColor({
        source: 'images/back.png',
        repeat: 'repeat',
        opacity: 0.2
    }, function () {
        canvas.renderAll();
        $("#btn-grid-mode").addClass("toggle-btn-active");
        gridMode = true;
    });
}

function unsetGrid() {
    canvas.backgroundColor = 'white';
    canvas.renderAll();
    $("#btn-grid-mode").removeClass("toggle-btn-active");
    gridMode = false;
}

$(document).keydown(function (e) {
    console.log(e.keyCode);
    if (e.keyCode == 46) {
        deleteObjects();
    } else if (e.keyCode == 17) {
        keys["ctrl"] = true;
    } else if (e.keyCode == 65) {
        keys["a"] = true;
    } else if (e.keyCode == 67) {
        keys["c"] = true;
    } else if (e.keyCode == 86) {
        keys["v"] = true;
    } else if (e.keyCode == 88) {
        keys["x"] = true;
    } else if (e.keyCode == 71) {
        keys["g"] = true;
    } else if (e.keyCode == 85) {
        keys["u"] = true;
    } else if (e.keyCode == 70) {
        keys["f"] = true;
    } else if (e.keyCode == 66) {
        keys["b"] = true;
    } else if (e.keyCode == 37) {
        moveObject('left');
    } else if (e.keyCode == 38) {
        moveObject('up');
    } else if (e.keyCode == 39) {
        moveObject('right');
    } else if (e.keyCode == 40) {
        moveObject('down');
    }

    //operation in multiple keys
    if (keys["c"] && keys["ctrl"]) {
        //copy selected
        e.preventDefault();
        copyObjects();
    } else if (keys["v"] && keys["ctrl"]) {
        //paste copied elements
        e.preventDefault();
        pasteObjects();
    } else if (keys["x"] && keys["ctrl"]) {
        //delete and save selecred elements
        e.preventDefault();
        cutObjects();
    } else if (keys["g"] && keys["ctrl"]) {
        //delete and save selecred elements      
        e.preventDefault();
        groupObjects();
    } else if (keys["u"] && keys["ctrl"]) {
        //delete and save selecred elements
        e.preventDefault();
        ungroupObjects();
    } else if (keys["f"] && keys["ctrl"]) {
        //delete and save selecred elements
        e.preventDefault();
        bringToFront();
    } else if (keys["b"] && keys["ctrl"]) {
        //delete and save selecred elements
        e.preventDefault();
        sendToBack();
    }

});

$(document.body).keyup(function (e) {
    // reset status of the button 'released' == 'false'
    if (e.keyCode == 17) {
        keys["ctrl"] = false;
    } else if (e.keyCode == 65) {
        keys["a"] = false;
    } else if (e.keyCode == 67) {
        keys["c"] = false;
    } else if (e.keyCode == 86) {
        keys["v"] = false;
    } else if (e.keyCode == 88) {
        keys["x"] = false;
    } else if (e.keyCode == 71) {
        keys["g"] = false;
    } else if (e.keyCode == 85) {
        keys["u"] = false;
    } else if (e.keyCode == 70) {
        keys["f"] = false;
    } else if (e.keyCode == 66) {
        keys["b"] = false;
    }
});

function deleteObjects() {
    var activeObject = canvas.getActiveObject(),
        activeGroup = canvas.getActiveGroup();
    if (activeObject) {
        canvas.remove(activeObject);
    } else if (activeGroup) {
        var objectsInGroup = activeGroup.getObjects();
        canvas.discardActiveGroup();
        objectsInGroup.forEach(function (object) {
            canvas.remove(object);
        });
    }
}

function copyObjects() {
    clipBoard = [];
    var activeObject = canvas.getActiveObject(),
        activeGroup = canvas.getActiveGroup();
    if (activeObject && clipBoard.indexOf(activeObject) < 0) {
        clipBoard.push(activeObject);
    } else if (activeGroup) {
        var objectsInGroup = activeGroup.getObjects();
        canvas.discardActiveGroup();
        objectsInGroup.forEach(function (object) {
            if (clipBoard.indexOf(object) < 0)
                clipBoard.push(object);
        });
    }
}

function cutObjects() {
    console.log("cut");
    clipBoard = [];
    var activeObject = canvas.getActiveObject(),
        activeGroup = canvas.getActiveGroup();
    if (activeObject && clipBoard.indexOf(activeObject) < 0) {
        clipBoard.push(activeObject);
        canvas.remove(activeObject);
    } else if (activeGroup) {
        var objectsInGroup = activeGroup.getObjects();
        canvas.discardActiveGroup();
        objectsInGroup.forEach(function (object) {
            if (clipBoard.indexOf(object) < 0) {
                clipBoard.push(object);
                canvas.remove(object);
            }
        });
    }
}

function pasteObjects() {
    clearSelection();
    for (var i = 0; i < clipBoard.length; i++) {
        clipBoard[i].clone(function (object) {
            object.title = object.title + '_copy';
            object.id = (object.id * 2);
            object.set("top", object.top + 20);
            object.set("left", object.left + 20);
            object.set("active", true);

            canvas.add(object);
            object.bringToFront();
            canvas.renderAll();
        });
    }
}

function clearSelection() {
    var activeObject = canvas.getActiveObject(),
        activeGroup = canvas.getActiveGroup();
    if (activeObject) {
        activeObject.set("active", false);
    } else if (activeGroup) {
        var objectsInGroup = activeGroup.getObjects();
        canvas.discardActiveGroup();
        objectsInGroup.forEach(function (object) {
            object.set("active", false);
        });
    }
}

function groupObjects() {
    var activegroup = canvas.getActiveGroup();
    var objectsInGroup = activegroup.getObjects();

    activegroup.clone(function (newgroup) {
        canvas.discardActiveGroup();
        objectsInGroup.forEach(function (object) {
            canvas.remove(object);
        });
        canvas.setActiveObject(newgroup);
        canvas.add(newgroup);
    });
}

function ungroupObjects() {
    var activeObject = canvas.getActiveObject();
    if (activeObject.type == "group") {
        var items = activeObject._objects;
        activeObject._restoreObjectsState();
        canvas.remove(activeObject);
        for (var i = 0; i < items.length; i++) {
            canvas.add(items[i]);
            items[i].set("active", true);
            canvas.item(canvas.size() - 1).hasControls = true;
        }
        canvas.renderAll();
    }
}

function bringToFront() {
    var activeObject = canvas.getActiveObject(),
        activeGroup = canvas.getActiveGroup();
    if (activeObject) {
        activeObject.bringToFront();
    } else if (activeGroup) {
        var objectsInGroup = activeGroup.getObjects();
        canvas.discardActiveGroup();
        objectsInGroup.forEach(function (object) {
            object.bringToFront();
        });
    }
}

function sendToBack() {
    var activeObject = canvas.getActiveObject(),
        activeGroup = canvas.getActiveGroup();
    if (activeObject) {
        activeObject.sendToBack();
    } else if (activeGroup) {
        var objectsInGroup = activeGroup.getObjects();
        canvas.discardActiveGroup();
        objectsInGroup.forEach(function (object) {
            object.sendToBack();
        });
    }
}

function moveObject(dir) {

    var speedX, speedY;
    if (dir == "right") {
        speedX = 0.5;
        speedY = 0;
    } else if (dir == "left") {
        speedX = -0.5;
        speedY = 0;
    } else if (dir == "up") {
        speedX = 0;
        speedY = -0.5;
    } else if (dir == "down") {
        speedX = 0;
        speedY = 0.5;
    }


    var activeObject = canvas.getActiveObject(),
        activeGroup = canvas.getActiveGroup();
    if (activeObject) {
        activeObject.set({
            left: activeObject.getLeft() + speedX,
            top: activeObject.getTop() + speedY
        });
        canvas.renderAll();
    }

}


$('#canvas-container').contextmenu(function (e) {
    e.preventDefault();
    showMenuStrip(e.pageX, e.pageY);
    return false;
});

function showMenuStrip(x, y) {
    $("#menu-strip").css("display", "block");
    $("#menu-strip").css("top", y);
    $("#menu-strip").css("left", x);
}

function hideMenuStrip() {
    $("#menu-strip").css("display", "none");
}

$("#canvas-container").click(function () {
    hideMenuStrip();
    hidePropWindow();
})

$("#menu-strip").click(function () {
    hideMenuStrip();
});

$("#menu-copy").click(function () {
    copyObjects();
})

$("#menu-paste").click(function () {
    pasteObjects();
})

$("#menu-cut").click(function () {
    cutObjects();
})

$("#menu-delete").click(function () {
    deleteObjects();
})

$("#menu-group").click(function () {
    groupObjects();
})

$("#menu-ungroup").click(function () {
    ungroupObjects();
})

$("#menu-front").click(function () {
    bringToFront();
})

$("#menu-back").click(function () {
    sendToBack();
})

$("#menu-prop").click(function () {
    showPropWindow();
})

$("#btn-sketch-mode").click(function () {
    canvas.isDrawingMode = true;
    $(this).addClass("toggle-btn-active");
    $("#btn-shape-mode").removeClass("toggle-btn-active");
});

$("#btn-shape-mode").click(function () {
    canvas.isDrawingMode = false;
    $(this).addClass("toggle-btn-active");
    $("#btn-sketch-mode").removeClass("toggle-btn-active");
});

$("#btn-grid-mode").click(function () {
    console.log("sad");
    if (gridMode) {
        unsetGrid();
    } else {
        setGrid();
    }
});


canvas.on('object:scaling', (e) => {
    // var obj = e.target;
    //     obj.strokeWidth = 1; 
    // e.target.resizeToScale();
    // var activeObject = canvas.getActiveObject();
    // activeObject.set('strokeWidth',obj.strokeWidth);
    //o.scaleX = 1;
    //o.scaleY = 1;

    // if (!o.strokeWidthUnscaled && o.strokeWidth) {
    //     o.strokeWidthUnscaled = o.strokeWidth;
    // }
    // if (o.strokeWidthUnscaled) {
    //     o.strokeWidth = o.strokeWidthUnscaled / o.scaleX;
    // }
})

fabric.Object.prototype.resizeToScale = function () {
    if (this.type !== 'group') {
        this.strokeWidth = this._origStrokeWidth / Math.max(this.scaleX, this.scaleY);
    } else {
        this._objects.forEach(function (obj) {
            console.log(obj);
            obj.strokeWidth = obj._origStrokeWidth / Math.max(obj.group.scaleX, obj.group.scaleY);
        });
    }
}




function showPropWindow() {
    $("#prop-window").css("display", "block");
    var activeObject = canvas.getActiveObject(),
        activeGroup = canvas.getActiveGroup(),
        activeThing;
    if (activeObject) {
        $("#prop-window").css("left", activeObject.left + "px");
        $("#prop-window").css("top", activeObject.top + "px");
        activeThing = activeObject;
    } else if (activeGroup) {
        $("#prop-window").css("left", activeGroup.left + "px");
        $("#prop-window").css("top", activeGroup.top + "px");
        activeThing = activeGroup;
    }
    console.log(activeThing);
    $("#prop-label").val(activeThing.text);
}

$("#prop-label").keyup(function () {
    var activeObject = canvas.getActiveObject(),
        activeGroup = canvas.getActiveGroup(),
        activeThing;
    if (activeObject) {
        activeThing = activeObject;
    } else if (activeGroup) {
        activeThing = activeGroup;
    }
    //  if(activeThing.text){
    activeThing.set("text", $("#prop-label").val());
    canvas.renderAll();
    // }   

})

function hidePropWindow() {
    $("#prop-window").css("display", "none");
}

function fixLayout() {
    var cW = $(window).width() - parseInt($("#toolbar").css("width")) - 8 - 8;
    var cH = window.innerHeight - 60 - 8;
    $("#canvas").attr("width", cW);
    $("#canvas").attr("height", cH);
}

function save(a, format) {
    unsetGrid();
    if (format == "png") {
        a.href = document.getElementById("canvas").toDataURL();
        a.download = "hello";
    } else if (format == "json") {
        console.log(canvas.toJSON());
    }

    setGrid();
}

$(".save").click(function () {
    save(this, $(this).attr("data-type"));
})