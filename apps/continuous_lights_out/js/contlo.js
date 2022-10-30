function onBoardLoaded()
{
    let board        = document.getElementById("BoardImage");
    let canvasBoard  = document.getElementById("CanvasBoard");

    let contextBoard = canvasBoard.getContext("2d");

    canvasBoard.width  = board.width;
    canvasBoard.height = board.height;
    
    contextBoard.drawImage(board, 0, 0);
}

function onClickRuleLoaded()
{
    let clickRule       = document.getElementById("ClickRuleImage");
    let canvasClickRule = document.getElementById("CanvasClickRule");

    let contextClickRule = canvasClickRule.getContext("2d");

    canvasClickRule.width  = clickRule.width;
    canvasClickRule.height = clickRule.height;

    contextClickRule.drawImage(clickRule, 0, 0);
}

function main() 
{
    let canvasBoard  = document.getElementById("CanvasBoard");
    let contextBoard = canvasBoard.getContext("2d");

    let canvasClickRule  = document.getElementById("CanvasClickRule");
    let contextClickRule = canvasClickRule.getContext("2d");

    canvasBoard.onclick = function(e)
    {
        let x = e.pageX - canvasBoard.offsetLeft;
        let y = e.pageY - canvasBoard.offsetTop;

        makeTurn(x, y);
    }

    function makeTurn(x, y)
    {
        const clickRuleHalfWidth  = canvasClickRule.width  / 2;
        const clickRuleHalfHeight = canvasClickRule.height / 2;

        const boardLeftBound   = clickRuleHalfWidth;
        const boardTopBound    = clickRuleHalfHeight;
        const boardRightBound  = canvasBoard.width  - clickRuleHalfWidth;
        const boardBottomBound = canvasBoard.height - clickRuleHalfHeight;
        
        const clickRuleLeftBound   = x < boardLeftBound   ?                       clickRuleHalfWidth  - x  : 0;
        const clickRuleRightBound  = x > boardRightBound  ? canvasBoard.width  + (clickRuleHalfWidth  - x) : canvasClickRule.width - 1;
        const clickRuleTopBound    = y < boardTopBound    ?                       clickRuleHalfHeight - y  : 0;
        const clickRuleBottomBound = y > boardBottomBound ? canvasBoard.height + (clickRuleHalfHeight - y) : canvasClickRule.height - 1;
        
        const clickRuleCorrectedWidth  = clickRuleRightBound  - clickRuleLeftBound;
        const clickRuleCorrectedHeight = clickRuleBottomBound - clickRuleTopBound; 

        const boardLeft = x + (clickRuleLeftBound - clickRuleHalfWidth);
        const boardTop  = y + (clickRuleTopBound  - clickRuleHalfHeight);

        let boardRect     = contextBoard.getImageData(boardLeft, boardTop, clickRuleCorrectedWidth, clickRuleCorrectedHeight);
        let clickRuleRect = contextClickRule.getImageData(clickRuleLeftBound, clickRuleTopBound, clickRuleCorrectedWidth, clickRuleCorrectedHeight);

        let imgData = contextBoard.createImageData(clickRuleCorrectedWidth, clickRuleCorrectedHeight);

        for(let i = 0; i < imgData.data.length; i += 4)
        {   
            if(boardRect.data[i] === clickRuleRect.data[i])
            {
                imgData.data[i+0] = 0;
            }
            else
            {
                imgData.data[i+0] = 255;
            }

            imgData.data[i+1] = 0;
            imgData.data[i+2] = 0;
            imgData.data[i+3] = 255;
        }

        contextBoard.putImageData(imgData, boardLeft, boardTop);
    }
}