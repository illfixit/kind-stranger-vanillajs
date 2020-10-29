function touchMoveHandlerX(e) {
    document.querySelector('#container').style.backgroundPosition = `${(((e.targetTouches[0].clientX/window.innerWidth))*100).toFixed(5)}%`
}



window.addEventListener('touchmove', touchMoveHandlerX);


function keyboardButtonsHandler(e) {
    if (e.which == 13 || e.keyCode == 13 || e.key === 'Enter') {

        document.getElementById('container').style.backgroundImage = `url(${document.getElementById('src').value})`;
        document.getElementById('src').value = ""
    }
}

        
window.addEventListener('keydown', keyboardButtonsHandler);