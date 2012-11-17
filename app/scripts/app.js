define(
    [
        'jquery',
        'stapes',
        'plugins/tpl!templates/detector.tpl'
    ],
    function(
        $,
        Stapes,
        tplDetector
    ){

        $(function(){

            var detector = $(tplDetector.render()).appendTo('#measurement');

            detector.on('click', function(e){

                $(this).toggleClass('rgb cmy')
            });
        });
    }
);