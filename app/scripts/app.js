define(
    [
        'jquery',
        'stapes',
        'plugins/tpl!templates/detector.tpl',
        'modules/quantum'
    ],
    function(
        $,
        Stapes,
        tplDetector,
        quantum
    ){

        $(function(){

            console.log(window.qm=quantum.state(['i','-i']));

            var detector = $(tplDetector.render()).appendTo('#measurement');

            detector.on('click', function(e){

                $(this).toggleClass('rgb cmy')
            });
        });
    }
);