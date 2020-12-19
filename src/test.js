
let btn = document.getElementsByClassName('button')[0];
let list = document.getElementsByClassName('list')[0];


btn.addEventListener('click', function () {
    if (list.style.display == "inline-block") {
        list.style.display = 'none';
    }
    else {
        list.style.display = 'inline-block';
    }
}, false);


document.addEventListener('click', function (event) {
    let elem = event.target;
    while (elem) { //循环判断至根节点，防止点击的是div子元素   
        if (elem.className == 'button' || elem.className == 'list') {
            return;
        }
        elem = elem.parentNode;
    }
    let s = document.getElementsByClassName("list")[0];
    s.style.display = "none";
}, false);

let drag = document.getElementsByClassName('drag');
let span = document.getElementsByTagName('span');
for (let k of drag) {
    k.setAttribute("draggable", true);
    
    k.addEventListener('dragend', function (event) {
        let posY = event.clientY;
        let posX = event.clientX;
        span[0].innerHTML = posX;
        span[1].innerHTML = posY;
    }, false);
}