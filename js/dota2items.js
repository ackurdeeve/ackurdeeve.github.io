$(function(){
    var itemNodes = $("[class^='bg-60px']");
    $("[class^='bg-60px']").click(function () {
        for (let i =0;i<itemNodes.length;i++){
            itemNodes[i].style.boxShadow = '';
        }
        this.style.boxShadow = "0 0 2px 2px #aaa";
        // console.log("success");
    });
});