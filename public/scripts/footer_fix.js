window.addEventListener("resize", fix_footer, false);

function fix_footer(){
    var width = document.getElementById('foo').offsetWidth;
    var footer_thing = document.getElementById('ss');
    footer_thing.style.width = '' + width +'px';
}

fix_footer();