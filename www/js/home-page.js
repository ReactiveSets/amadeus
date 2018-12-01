/*
  home-page.js
  ------------

  Copyright (c) 2018, Reactane, all rights reserved.

*/

( this.undefine || require( 'undefine' )( module, require ) )()
( 'home-page', [ [ 'rs', 'toubkal' ] ], function( rs ) {
  "use strict";
  
  return rs
    
    /* ---------------------------------------------------------------------------------------------------------------------
      @pipelet $amadeus( $selector, options )
      
      @description:
      
      @source:
      
      @parameters
      - $selector (String/Pipelet):
      - options           (Object): optionnal object

    */
    .Compose( '$amadeus', function( source, $selector, options ) {
      var rs = source.namespace();
      
      // ----------------------------------------------------------
      // grid container
      var $container = rs
        .set( [
          {
              id: 'container'
            , tag: 'div'
            , attributes: { class: 'container' }
          }
        ] )
        
        .$to_dom( $selector )
        
        .alter( function( _ ) {
          _.id = 'form';
          _.tag = 'form';
          _.attributes = { class: 'sequencer', action: '#' };
        } )
        
        .$to_dom()
        
        .alter( function( _ ) {
          _.id = 'columns';
          _.tag = 'div';
          _.attributes = { class: 'columns is-mobile' };
        } )
        
        .$to_dom()
      ;
    } ) // $amadeus()
  ;
} ); // module.export
