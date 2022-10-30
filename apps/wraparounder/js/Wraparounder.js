function wholeMod(num, modulo)
{
    return ((num % modulo) + modulo) % modulo;
}

function hexToRGBA(hexValue)
{
    let hexRegex    = /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i;
    let parseResult = hexRegex.exec(hexValue);

    if(parseResult && parseResult.length === 3 + 1)
    {
        let r = parseInt(parseResult[1], 16);
        let g = parseInt(parseResult[2], 16);
        let b = parseInt(parseResult[3], 16);

        return [r, g, b, 255];
    }
    else
    {
        return [0, 0, 0, 0];
    }
}

function fill(x, y, fillColor, imageWidth, imageHeight, useWraparound, /*inout*/ imagecontents)
{
    let currPixel   = y * imageWidth + x;
    let sourceColor = [imagecontents[4 * currPixel + 0], imagecontents[4 * currPixel + 1], imagecontents[4 * currPixel + 2], imagecontents[4 * currPixel + 3]];

    if(fillColor[0] === sourceColor[0] && fillColor[1] === sourceColor[1] && fillColor[2] === sourceColor[2])
    {
        return;
    }

    let currPixelIndices = new Set([currPixel]);
    while(currPixelIndices.size != 0)
    {
        let neighbourPixelIndices = new Set([]);
        for(const currPixelIndex of currPixelIndices)
        {
            let currX = Math.floor(currPixelIndex % imageHeight);
            let currY = Math.floor(currPixelIndex / imageHeight);

            let leftX   = currX - 1;
            let rightX  = currX + 1;
            let topY    = currY - 1;
            let bottomY = currY + 1;

            if(useWraparound)
            {
                leftX   = wholeMod(leftX,   imageWidth);
                rightX  = wholeMod(rightX,  imageWidth);
                topY    = wholeMod(topY,    imageHeight);
                bottomY = wholeMod(bottomY, imageHeight);
            }

            let leftElementIndex   = currY   * imageWidth + leftX;
            let rightElementIndex  = currY   * imageWidth + rightX;
            let topElementIndex    = topY    * imageWidth + currX;
            let bottomElementIndex = bottomY * imageWidth + currX;

            if(leftX >= 0)
            {
                if(imagecontents[4 * leftElementIndex + 0] === sourceColor[0] && imagecontents[4 * leftElementIndex + 1] === sourceColor[1] && imagecontents[4 * leftElementIndex + 2] === sourceColor[2])
                {
                    neighbourPixelIndices.add(leftElementIndex);
                }
            }

            if(rightX < imageWidth)
            {
                if(imagecontents[4 * rightElementIndex + 0] === sourceColor[0] && imagecontents[4 * rightElementIndex + 1] === sourceColor[1] && imagecontents[4 * rightElementIndex + 2] === sourceColor[2])
                {
                    neighbourPixelIndices.add(rightElementIndex);
                }
            }

            if(topY >= 0)
            {
                if(imagecontents[4 * topElementIndex + 0] === sourceColor[0] && imagecontents[4 * topElementIndex + 1] === sourceColor[1] && imagecontents[4 * topElementIndex + 2] === sourceColor[2])
                {
                    neighbourPixelIndices.add(topElementIndex);
                }
            }

            if(bottomY < imageHeight)
            {
                if(imagecontents[4 * bottomElementIndex + 0] === sourceColor[0] && imagecontents[4 * bottomElementIndex + 1] === sourceColor[1] && imagecontents[4 * bottomElementIndex + 2] === sourceColor[2])
                {
                    neighbourPixelIndices.add(bottomElementIndex);
                }
            }
        }

        for(const currPixelIndex of currPixelIndices)
        {
            imagecontents[4 * currPixelIndex + 0] = fillColor[0];
            imagecontents[4 * currPixelIndex + 1] = fillColor[1];
            imagecontents[4 * currPixelIndex + 2] = fillColor[2];
            imagecontents[4 * currPixelIndex + 3] = fillColor[3];
        }

        currPixelIndices = neighbourPixelIndices;
    }
}

function main() 
{
    let canvas        = document.getElementById("CanvasWraparounder");
    let canvasContext = canvas.getContext("2d");

    let imageUpload = document.getElementById("UploadImage");

    let buttonSave = document.getElementById("ButtonSave");

    let colorPicker = document.getElementById("ColorSelect");

    let wrapCheckbox = document.getElementById("WrapCheckbox");

    let imageWidth  = 0;
    let imageHeight = 0;

     canvas.hidden = true;

    canvas.onclick = function(e)
    {
        let x = e.offsetX;
        let y = e.offsetY;

        let contents = canvasContext.getImageData(0, 0, imageWidth, imageHeight);

        let useWraparound = wrapCheckbox.checked;

        let fillColor = hexToRGBA(colorPicker.value); 
        fill(x, y, fillColor, contents.width, contents.height, useWraparound, contents.data);

        canvasContext.putImageData(contents, 0, 0);
    }

    imageUpload.onchange = function()
    {
        let imageFile = imageUpload.files[0];

        let fileReader = new FileReader();
        fileReader.onload = function()
        {
            canvas.hidden = false;

            let image    = new Image();
            image.onload = function()
            {
                buttonSave.hidden = false;

                canvas.width  = image.width;
                canvas.height = image.height;

                canvas.clientWidth  = image.width;
                canvas.clientHeight = image.height;

                canvas.style.width  = image.width  + "px";
                canvas.style.height = image.height + "px";

                imageWidth  = image.width;
                imageHeight = image.height;

                canvasContext.drawImage(image, 0, 0);
            }
            image.src = fileReader.result;
        }

        fileReader.readAsDataURL(imageFile);
    }
    
    buttonSave.onclick = function()
    {
        let link      = document.createElement("a");
        link.href     = canvas.toDataURL("image/png");
        link.download = "Image.png";

        link.click();
        link.remove();
    }
}