function main() {
  if (app.documents.length === 0) {
    alert("No document is open. Please open a document and try again.");
    return;
  }

  var doc = app.activeDocument;

  // Get the selected swatches
  var selectedSwatches = doc.swatches.getSelected();
  if (selectedSwatches.length === 0) {
    alert("No swatch selected. Please select swatches in the Swatches Panel and try again.");
    return;
  }

  // Set text color to #2e2e2e
  var textColor = new RGBColor();
  textColor.red = 79;
  textColor.green = 79;
  textColor.blue = 79;

  // Rectangle dimensions
  var whiteWidth = 216;
  var whiteHeight = 200;
  var colorWidth = 200;
  var colorHeight = 100;
  var margin = 8;
  var textMargin = 16; // Margin between color rectangle and text
  var xOffset = 0; // To position each swatch group horizontally

  // Process each selected swatch
  for (var i = 0; i < selectedSwatches.length; i++) {
    var swatch = selectedSwatches[i];
    var selectedColor = swatch.color;

    // Convert the color to HEX, RGB, and HSL
    var hexColor = rgbToHex(selectedColor);
    var rgbColor = " (" + Math.round(selectedColor.red) + ", " + Math.round(selectedColor.green) + ", " + Math.round(selectedColor.blue) + ")";
    var hslColor = rgbToHsl(selectedColor);

    // Create the white rectangle
    var whiteRect = doc.pathItems.rectangle(
      0, // Y-coordinate (static for horizontal layout)
      xOffset, // X-coordinate (incremented for horizontal layout)
      whiteWidth,
      whiteHeight
    );
    whiteRect.fillColor = new RGBColor(); // Set to white
    whiteRect.fillColor.red = 255;
    whiteRect.fillColor.green = 255;
    whiteRect.fillColor.blue = 255;
    whiteRect.stroked = false;

    // Calculate the position for the color rectangle
    var colorRectTop = -margin; // Position relative to the white rectangle
    var colorRectLeft = xOffset + margin;

    // Create the color rectangle
    var colorRect = doc.pathItems.rectangle(colorRectTop, colorRectLeft, colorWidth, colorHeight);
    colorRect.fillColor = selectedColor; // Use the swatch's color
    colorRect.stroked = false;

    // Position the text formats
    var textLeft = xOffset + margin;
    var textTop = -(colorHeight + textMargin); // Position HEX below the color rectangle

    // Add HEX value
    var hexTextFrame = doc.textFrames.add();
    hexTextFrame.contents = " " + hexColor;
    hexTextFrame.position = [textLeft, (textTop -= 5)];
    hexTextFrame.textRange.characterAttributes.size = 12;
    hexTextFrame.textRange.characterAttributes.fillColor = textColor;

    // Add RGB value below HEX
    textTop -= textMargin;
    var rgbTextFrame = doc.textFrames.add();
    rgbTextFrame.contents = "RGB" + rgbColor;
    rgbTextFrame.position = [textLeft, (textTop -= 2)];
    rgbTextFrame.textRange.characterAttributes.size = 12;
    rgbTextFrame.textRange.characterAttributes.fillColor = textColor;

    // Add HSL value below RGB
    textTop -= textMargin;
    var hslTextFrame = doc.textFrames.add();
    hslTextFrame.contents = "HSL" + hslColor;
    hslTextFrame.position = [textLeft, (textTop -= 2)];
    hslTextFrame.textRange.characterAttributes.size = 12;
    hslTextFrame.textRange.characterAttributes.fillColor = textColor;

    // Group all created elements
    var group = doc.groupItems.add();
    whiteRect.moveToBeginning(group);
    colorRect.moveToBeginning(group);
    hexTextFrame.moveToBeginning(group);
    rgbTextFrame.moveToBeginning(group);
    hslTextFrame.moveToBeginning(group);

    // Increment xOffset to stack the next swatch group to the right of the current one
    xOffset += whiteWidth + margin;
  }

  alert("Elements grouped successfully for all selected swatches!");
}

// Convert RGB to HEX
function rgbToHex(color) {
  var r = color.red;
  var g = color.green;
  var b = color.blue;

  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// Convert a color component to a 2-digit hex string
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

// Convert RGB to HSL
function rgbToHsl(color) {
  var r = color.red / 255;
  var g = color.green / 255;
  var b = color.blue / 255;

  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return "(" + Math.round(h * 360) + ", " + Math.round(s * 100) + "%, " + Math.round(l * 100) + "%)";
}

main();
