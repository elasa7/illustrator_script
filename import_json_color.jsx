function main() {
  // Create a dialog window
  var dialog = new Window("dialog", "Paste JSON and Generate Rectangles");
  dialog.alignChildren = "fill";

  // Add a text area for JSON input
  var inputGroup = dialog.add("group");
  inputGroup.orientation = "column";
  inputGroup.add("statictext", undefined, "Paste JSON below:");
  var input = inputGroup.add("edittext", [0, 0, 300, 150], "", { multiline: true, scrolling: true });

  // Add OK and Cancel buttons
  var buttonGroup = dialog.add("group");
  buttonGroup.alignment = "center";
  var okButton = buttonGroup.add("button", undefined, "OK", { name: "ok" });
  var cancelButton = buttonGroup.add("button", undefined, "Cancel", { name: "cancel" });

  // Handle the OK button click
  okButton.onClick = function () {
    try {
      // Clean up the input text manually
      var jsonText = input.text.replace(/^\s+|\s+$/g, ""); // Trim whitespace
      jsonText = jsonText.replace(/[\r\n]+/g, " "); // Remove newlines

      // Parse the JSON
      var json = parseJSON(jsonText);

      // Extract color values
      var colors = [];
      for (var key in json) {
        if (json.hasOwnProperty(key)) {
          colors.push(json[key]);
        }
      }

      // Create rectangles in Illustrator
      createRectangles(colors);

      // Close the dialog
      dialog.close();
    } catch (e) {
      alert("Invalid JSON format. Please check your input.\n\nError: " + e.message);
    }
  };

  // Handle the Cancel button click
  cancelButton.onClick = function () {
    dialog.close();
  };

  // Show the dialog
  dialog.show();
}

function parseJSON(text) {
  if (typeof JSON !== "undefined" && typeof JSON.parse === "function") {
    return JSON.parse(text);
  }

  // Manual JSON parsing fallback
  var result = eval("(" + text + ")");
  return result;
}

function createRectangles(colors) {
  if (app.documents.length === 0) {
    app.documents.add(); // Create a new document if none exists
  }

  var doc = app.activeDocument;
  var startX = 50; // Starting X position
  var startY = 50; // Starting Y position
  var rectWidth = 100;
  var rectHeight = 100;
  var spacing = 20;

  for (var i = 0; i < colors.length; i++) {
    var colorValue = colors[i];
    var rgbMatch = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(colorValue);

    if (rgbMatch) {
      var r = parseInt(rgbMatch[1], 10);
      var g = parseInt(rgbMatch[2], 10);
      var b = parseInt(rgbMatch[3], 10);

      // Create a new rectangle
      var rect = doc.pathItems.rectangle(
        startY - i * (rectHeight + spacing), // Y position
        startX, // X position
        rectWidth,
        rectHeight
      );

      // Assign fill color
      var color = new RGBColor();
      color.red = r;
      color.green = g;
      color.blue = b;
      rect.fillColor = color;

      rect.stroked = false; // Remove stroke
    }
  }
}

main();
