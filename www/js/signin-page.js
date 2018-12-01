/*
  signin-page.js
  --------------

  Copyright (c) 2018, Reactane, all rights reserved.

*/

( this.undefine || require( 'undefine' )( module, require ) )()
( 'signin-page', [ [ 'rs', 'toubkal' ] ], function( rs ) {
  "use strict";
  
  return rs
    
    /* ---------------------------------------------------------------------------------------------------------------------
      @pipelet $signin( $selector, options )
      
      @description:
      
      @source:
      - login_strategies dataflow
      
      @parameters
      - $selector (String/Pipelet):
      - options           (Object): optionnal object

    */
    .Compose( '$signin', function( login_strategies, $selector, options ) {
      login_strategies

          .map( function( _ ) {

            return {
                id: 'main'
              , tag: 'main'
              , content: '<section class="section bk-blue h-100 relative">'
                  +  '<div class="container signin">'
                  +   '<header>'
                  +    '<div class="signin__title c-blueLigth t-center"> Welcome to </div>'
                  +    '<figure class="signin__logo>'
                  +     '<img src="../public/images/logo-amadeus.svg" alt="Logo Amadeus" />'
                  +    '</figure>'
                  +   '</header>'
                  +   '<p class="c-blueLigth t-center">'
                  +    'La musique est un marqueur temporel de l\'histoire de l\'humanité.'
                  +   '</p>'
                  +   '<div class="connect t-center">'
          // <a href="#" class="btn btn--blueLight"><span>Se connecter avec</span> <span class="icon-img"><img src="../public/images/github.svg" alt="github" /></span></a>
          // <a href="#" class="btn btn--blueLight"><span>Se connecter avec</span> <span class="icon-img"><img src="../public/images/outlook.svg" alt="github" /></span></a>
          // <a href="#" class="btn btn--blueLight"><span>Se connecter avec</span> <span class="icon-img"><img src="../public/images/facebook.svg" alt="github" /></span></a>
                  +   '</div>'
                  +   '<footer class="signin__footer">'
                  +    '<p class="c-white"> <strong> @2018 By TOUBKAL. </strong> Tous droit reservés.'
                  +   '</footer>'
                  +  '</div>'
                  + '</section>'

              , attributes: { class: 'main-application' }
              , strategies: _.strategies
            }
          } )

          .$to_dom( $selector )

          .$query_selector( '.connect' )

          .flat_map( function( _ ) {
            var $ = _.$node;

            return _.strategies
              .map( function( strategy ) {
                return {
                    id: strategy.id
                  , tag: 'a'
                  , $node: $
                  , content: '<span>Se connecter avec</span> '
                      + '<span class="icon-img">'
                      +  '<img src="images/' + strategy.name + '.svg" alt="' + strategy.display_name + '" />'
                      + '</span>'
                  , attributes: { class: 'btn btn--blueLight', href: strategy.href, role: 'button' }
                  , order: strategy.order
                }
              } )
            ;
          } )

          .order( [ { id: 'order' } ] )

          .$to_dom()
        ;
    } ) // $signin()
  ;
} ); // module.export
