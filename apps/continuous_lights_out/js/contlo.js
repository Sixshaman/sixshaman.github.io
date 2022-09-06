function Init() 
{
    var canvasMain = document.getElementById("CanvasLO");
    canvasMain.width = 512;
    canvasMain.height = 512;

    var contextMain = canvasMain.getContext("2d");

    var field = new Image();
    field.src = 'Field.png';
    field.onload = function() 
    {
        contextMain.drawImage(this, 0, 0);
    }

    var canvasBack = document.getElementById("CanvasTemp");
    canvasBack.width = 64;
    canvasBack.height = 64;

    var contextBack = canvasBack.getContext("2d");

    var fieldDet = new Image();
    fieldDet.crossOrigin = '';
    fieldDet.src = 'FieldDet.png';
    fieldDet.onload = function ()
    {
        contextBack.drawImage(this, 0, 0);
    }

    canvasBack.hidden = true;

    canvasMain.onclick = function(e)
    {
        var x = e.pageX - canvasMain.offsetLeft;
        var y = e.pageY - canvasMain.offsetTop;

        Turn(x, y);
    }

    function Turn(x, y)
    {
        var leftBound   = x <     32 ?        32-x  :  0;
        var rightBound  = x > 512-32 ? 32 + (512-x) : 63;
        var topBound    = y <     32 ?        32-y  :  0;
        var bottomBound = y > 512-32 ? 32 + (512-y) : 63;

        var fieldRect = contextMain.getImageData(x - 32 + leftBound, y - 32 + topBound, rightBound - leftBound, bottomBound - topBound);
        var   detRect = contextBack.getImageData(         leftBound,          topBound, rightBound - leftBound, bottomBound - topBound);

        var ImgData = contextMain.createImageData(rightBound - leftBound, bottomBound - topBound);

        for (var i = 0; i < ImgData.data.length; i += 4)
        {          
            if(fieldRect.data[i] === detRect.data[i])
            {
                ImgData.data[i+0] = 0;
            }
            else
            {
                ImgData.data[i+0] = 255;
            }

            ImgData.data[i+1] = 0;
            ImgData.data[i+2] = 0;
            ImgData.data[i+3] = 255;
        }

        contextMain.putImageData(ImgData, x - 32 + leftBound, y - 32 + topBound);
    }
}